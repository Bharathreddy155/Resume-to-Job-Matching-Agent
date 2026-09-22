"""
Intelligent Retrieval-Augmented Generation (RAG) Engine for Resume-to-Job Matching.

Provides:
1. Section-aware document chunking for candidate resumes and job descriptions.
2. High-performance semantic vector retrieval index with TF-IDF cosine similarity and skill boosting.
3. Dual-mode generation: Google Gemini 2.5 Flash LLM when API key is present,
   plus deterministic offline extractive synthesis with exact source citations.
"""

import os
import re
import json
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from skill_ontology import ALIAS_TO_CANONICAL, find_canonical_skill

def extract_skills_set(text: str):
    text_lower = text.lower()
    found = set()
    for phrase, canonical in ALIAS_TO_CANONICAL.items():
        if phrase in text_lower:
            found.add(canonical)
    return found

# Recognized section headings in standard technical resumes
SECTION_HEADERS = [
    r'(?:^|\n)(?:PROFESSIONAL\s+)?SUMMARY',
    r'(?:^|\n)(?:WORK\s+)?EXPERIENCE',
    r'(?:^|\n)(?:TECHNICAL\s+)?SKILLS',
    r'(?:^|\n)PROJECTS?',
    r'(?:^|\n)EDUCATION',
    r'(?:^|\n)CERTIFICATIONS?',
    r'(?:^|\n)AWARDS?\s+(?:&|AND)?\s+HONORS?',
    r'(?:^|\n)PUBLICATIONS?'
]

def clean_section_name(header_str: str) -> str:
    """Normalize raw matched header into a clean title."""
    clean = re.sub(r'[\r\n:#\*\-_]', '', header_str).strip()
    return clean.title() if clean else "General Background"

def chunk_resume(
    resume_text: str,
    candidate_id: str = "cand_default",
    candidate_name: str = "Candidate"
) -> List[Dict[str, Any]]:
    """
    Intelligently splits resume text into section-aware semantic chunks.
    Preserves context by keeping role paragraphs, skills matrices, and project blocks together.
    """
    if not resume_text or not resume_text.strip():
        return []

    lines = [line.rstrip() for line in resume_text.split('\n')]
    chunks: List[Dict[str, Any]] = []

    # Find section boundary positions
    pattern = '|'.join(f'({h})' for h in SECTION_HEADERS)
    matches = list(re.finditer(pattern, resume_text, re.IGNORECASE))

    if not matches:
        # Fallback: split by paragraph blocks of ~100-250 words
        paragraphs = [p.strip() for p in re.split(r'\n\s*\n', resume_text) if p.strip()]
        for idx, para in enumerate(paragraphs):
            chunks.append({
                "chunk_id": f"{candidate_id}_chunk_{idx}",
                "candidate_id": candidate_id,
                "candidate_name": candidate_name,
                "section": f"Profile Overview Part {idx + 1}",
                "text": para
            })
        return chunks

    # Add header/contact section before first formal heading if non-empty
    first_start = matches[0].start()
    if first_start > 20:
        intro_text = resume_text[:first_start].strip()
        if intro_text:
            chunks.append({
                "chunk_id": f"{candidate_id}_chunk_intro",
                "candidate_id": candidate_id,
                "candidate_name": candidate_name,
                "section": "Contact & Bio",
                "text": intro_text
            })

    # Process each section
    for i, match in enumerate(matches):
        sec_title = clean_section_name(match.group(0))
        sec_start = match.end()
        sec_end = matches[i + 1].start() if i + 1 < len(matches) else len(resume_text)
        sec_body = resume_text[sec_start:sec_end].strip()

        if not sec_body:
            continue

        # If it's an Experience section, split into individual job roles/paragraphs
        if any(w in sec_title.lower() for w in ['experience', 'employment', 'history']):
            # Split on job title boundaries (often separated by blank lines or bullet blocks)
            sub_roles = [r.strip() for r in re.split(r'\n\s*\n', sec_body) if len(r.strip()) > 30]
            if len(sub_roles) > 1:
                for r_idx, role_text in enumerate(sub_roles):
                    # Extract the first line as subtitle if possible
                    first_line = role_text.split('\n')[0].strip()[:60]
                    chunks.append({
                        "chunk_id": f"{candidate_id}_{sec_title.lower()}_{r_idx}",
                        "candidate_id": candidate_id,
                        "candidate_name": candidate_name,
                        "section": f"{sec_title}: {first_line}",
                        "text": role_text
                    })
                continue

        # For Skills, Projects, Education or shorter sections
        if len(sec_body) > 600:
            # Sub-chunk if excessively large
            sub_blocks = [b.strip() for b in re.split(r'\n\s*\n', sec_body) if b.strip()]
            for b_idx, block in enumerate(sub_blocks):
                chunks.append({
                    "chunk_id": f"{candidate_id}_{sec_title.lower()}_{b_idx}",
                    "candidate_id": candidate_id,
                    "candidate_name": candidate_name,
                    "section": f"{sec_title} (Part {b_idx + 1})",
                    "text": block
                })
        else:
            chunks.append({
                "chunk_id": f"{candidate_id}_{sec_title.lower()}",
                "candidate_id": candidate_id,
                "candidate_name": candidate_name,
                "section": sec_title,
                "text": sec_body
            })

    return chunks


class ResumeRAGRetriever:
    """
    High-performance semantic vector retriever for candidate resumes.
    Uses TF-IDF with character and word n-grams, cosine similarity, and skill ontology boosting.
    """
    def __init__(self, candidates: Optional[List[Dict[str, Any]]] = None):
        self.chunks: List[Dict[str, Any]] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.chunk_vectors = None
        if candidates:
            self.index_candidates(candidates)

    def index_candidates(self, candidates: List[Dict[str, Any]]) -> int:
        """Chunk and index all candidates into the vector space."""
        all_chunks = []
        for cand in candidates:
            c_id = cand.get("id", f"cand_{len(all_chunks)}")
            c_name = cand.get("name", "Candidate")
            c_text = cand.get("text", "")
            if c_text and c_text.strip():
                cand_chunks = chunk_resume(c_text, candidate_id=c_id, candidate_name=c_name)
                all_chunks.extend(cand_chunks)

        self.chunks = all_chunks
        if not self.chunks:
            self.vectorizer = None
            self.chunk_vectors = None
            return 0

        corpus = [f"{c['candidate_name']} {c['section']}: {c['text']}" for c in self.chunks]
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            stop_words='english',
            token_pattern=r'(?u)\b[\w\+\#\.\-]{2,}\b'
        )
        self.chunk_vectors = self.vectorizer.fit_transform(corpus)
        return len(self.chunks)

    def search(
        self,
        query: str,
        candidate_id: Optional[str] = None,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Search for the top-k most relevant evidence chunks.
        Supports filtering to a specific candidate or searching across all candidates.
        """
        if not self.chunks or self.vectorizer is None or self.chunk_vectors is None:
            return []

        query_clean = query.strip()
        if not query_clean:
            return []

        query_vec = self.vectorizer.transform([query_clean])
        sim_scores = cosine_similarity(query_vec, self.chunk_vectors)[0]

        # Extract technical skills in query to boost chunks containing them
        query_skills = extract_skills_set(query_clean)

        results = []
        for idx, chunk in enumerate(self.chunks):
            if candidate_id and chunk["candidate_id"] != candidate_id:
                continue

            base_score = float(sim_scores[idx])

            # Boost if chunk contains explicitly queried skills
            boost = 0.0
            chunk_lower = chunk["text"].lower()
            for s in query_skills:
                if s in chunk_lower:
                    boost += 0.15

            final_score = min(1.0, base_score + boost)

            results.append({
                "chunk_id": chunk["chunk_id"],
                "candidate_id": chunk["candidate_id"],
                "candidate_name": chunk["candidate_name"],
                "section": chunk["section"],
                "text": chunk["text"],
                "relevance_score": round(final_score * 100, 1),
                "raw_score": final_score
            })

        # Sort descending by relevance score
        results.sort(key=lambda x: x["raw_score"], reverse=True)
        return results[:top_k]


def generate_extractive_answer(
    query: str,
    chunks: List[Dict[str, Any]],
    candidate_name: Optional[str] = None,
    job_description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Deterministic extractive offline synthesis when no LLM API key is available.
    Generates structured, grounded insights citing the specific chunks and bullet points.
    """
    if not chunks:
        return {
            "answer": f"No relevant evidence found in the applicant profile matching '{query}'. Please try rephrasing or asking about a specific skill, tool, or accomplishment.",
            "citations": [],
            "suggested_followups": [
                "What are the candidate's core technical skills?",
                "What did the candidate accomplish in their most recent role?",
                "How many years of experience does this candidate have?"
            ],
            "engine": "Semantic Vector Retrieval (Offline Grounded)"
        }

    top_chunk = chunks[0]
    cand_label = candidate_name or top_chunk["candidate_name"]

    # Extract the most informative sentences from the top chunks
    query_words = set(re.findall(r'\b\w{3,}\b', query.lower()))
    highlighted_points = []

    for c in chunks:
        # Split chunk into sentences/bullet points
        sentences = [s.strip() for s in re.split(r'[\n\.]+', c["text"]) if len(s.strip()) > 15]
        for sent in sentences:
            sent_words = set(re.findall(r'\b\w{3,}\b', sent.lower()))
            overlap = len(query_words.intersection(sent_words))
            if overlap > 0:
                highlighted_points.append((overlap, c["section"], sent, c["candidate_name"]))

    highlighted_points.sort(key=lambda x: x[0], reverse=True)
    top_points = highlighted_points[:3]

    # Synthesize natural language answer
    answer_parts = []
    answer_parts.append(
        f"Based on **{cand_label}'s** verified credentials in **{top_chunk['section']}** (relevance: {top_chunk['relevance_score']}%):"
    )

    if top_points:
        bullet_text = "\n".join([f"• \"{p[2]}\" *[{p[3]} - {p[1]}]*" for p in top_points])
        answer_parts.append(f"\n{bullet_text}")
    else:
        # Provide excerpt from top chunk
        snippet = top_chunk["text"][:240].strip().replace('\n', ' ')
        answer_parts.append(f"\n• \"{snippet}...\" *[{top_chunk['section']}]*")

    # Add synthesis takeaway
    answer_parts.append(
        f"\n**Takeaway**: The candidate provides direct evidence answering your question regarding *{query}* within their *{top_chunk['section']}* documentation."
    )

    full_answer = "\n".join(answer_parts)

    citations = [
        {
            "chunk_id": c["chunk_id"],
            "candidate_name": c["candidate_name"],
            "section": c["section"],
            "snippet": c["text"][:280] + ("..." if len(c["text"]) > 280 else ""),
            "relevance_score": c["relevance_score"]
        }
        for c in chunks
    ]

    return {
        "answer": full_answer,
        "citations": citations,
        "suggested_followups": [
            f"What projects demonstrate {cand_label}'s problem-solving skills?",
            f"How does {cand_label}'s background align with the active role requirements?",
            f"What probing interview questions should we ask {cand_label}?"
        ],
        "engine": "Semantic Vector Retrieval (Offline Grounded)"
    }


def answer_rag_query(
    query: str,
    retriever: ResumeRAGRetriever,
    candidate_id: Optional[str] = None,
    candidate_name: Optional[str] = None,
    job_description: Optional[str] = None,
    top_k: int = 3,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Master RAG entrypoint:
    1. Retrieves top-k evidence chunks from vector space.
    2. Synthesizes an answer using Gemini 2.5 Flash if key is present,
       else uses deterministic semantic extractive engine.
    """
    retrieved_chunks = retriever.search(query, candidate_id=candidate_id, top_k=top_k)

    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key or not retrieved_chunks:
        return generate_extractive_answer(
            query,
            retrieved_chunks,
            candidate_name=candidate_name,
            job_description=job_description
        )

    try:
        from google import genai
        client = genai.Client(api_key=key)

        # Construct grounded context
        context_blocks = []
        for idx, c in enumerate(retrieved_chunks, start=1):
            context_blocks.append(
                f"[Evidence {idx}] Candidate: {c['candidate_name']} | Section: {c['section']}\n\"{c['text']}\""
            )
        context_str = "\n\n".join(context_blocks)

        prompt = f"""
You are MatchPulse AI, an intelligent technical recruiting agent.
Answer the user's question accurately and objectively using ONLY the retrieved resume evidence provided below.

CRITICAL GUIDELINES:
1. Base your answer strictly on the provided Evidence excerpts. Do not invent details not supported by the evidence.
2. Cite the specific evidence sources using [Evidence 1], [Evidence 2], etc.
3. Be concise, professional, and highlight specific technical skills, metrics, and achievements.
4. If the evidence does not contain sufficient details to answer, state clearly what is confirmed and what is missing.

Target Candidate Context: {candidate_name or 'Applicant Pool'}
Active Job Description Context: {job_description[:350] if job_description else 'Standard Technical Role'}

RETRIEVED RESUME EVIDENCE:
{context_str}

USER QUESTION:
{query}

Provide a structured, beautifully formatted markdown response with:
- Direct, clear answer highlighting verified credentials.
- Evidence citations citing [Evidence N].
- 1 concise summary takeaway.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        answer_text = response.text.strip()

        citations = [
            {
                "chunk_id": c["chunk_id"],
                "candidate_name": c["candidate_name"],
                "section": c["section"],
                "snippet": c["text"][:280] + ("..." if len(c["text"]) > 280 else ""),
                "relevance_score": c["relevance_score"]
            }
            for c in retrieved_chunks
        ]

        return {
            "answer": answer_text,
            "citations": citations,
            "suggested_followups": [
                f"What architectural challenges did the candidate tackle?",
                f"Verify system scale and traffic metrics in prior positions.",
                f"What are recommended technical interview questions for this background?"
            ],
            "engine": "Google Gemini 2.5 Flash (RAG Augmented)"
        }

    except Exception as e:
        print(f"Gemini RAG call encountered error, falling back to extractive: {e}")
        return generate_extractive_answer(
            query,
            retrieved_chunks,
            candidate_name=candidate_name,
            job_description=job_description
        )


def get_suggested_queries(
    candidate_name: Optional[str] = None,
    job_title: Optional[str] = None
) -> List[str]:
    """Provide dynamic, contextual RAG prompt chips for instant 1-click discovery."""
    cand = candidate_name or "this candidate"
    return [
        f"What are {cand}'s top technical accomplishments and impact?",
        f"Does {cand} have verified microservices & cloud infrastructure experience?",
        f"What database technologies and query optimizations has {cand} handled?",
        f"Are there any skill or experience gaps compared to the role requirements?",
        f"What are the best interview probing questions to ask {cand}?"
    ]
