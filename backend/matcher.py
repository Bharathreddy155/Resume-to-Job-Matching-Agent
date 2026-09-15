import re
from typing import Dict, List, Any, Set, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from skill_ontology import (
    SKILL_TAXONOMY,
    ALIAS_TO_CANONICAL,
    find_canonical_skill,
    get_related_skills,
    get_skill_category
)

def extract_skills_from_text(text: str) -> Dict[str, Dict[str, Any]]:
    """
    Extract skills from free-form text using ontology and regex boundaries.
    Returns dictionary of canonical_skill -> {canonical, display_name, category, occurrences}
    """
    text_lower = text.lower()
    extracted: Dict[str, Dict[str, Any]] = {}

    # Check each alias and canonical key
    for phrase, canonical in ALIAS_TO_CANONICAL.items():
        # Word boundary pattern; handling special characters like c++, c#, .js, /
        escaped_phrase = re.escape(phrase)
        pattern = r'(?:^|[\s,;:\(\{\[/])' + escaped_phrase + r'(?:$|[\s,;:\)\}\]./])'
        matches = list(re.finditer(pattern, text_lower))
        if matches:
            if canonical not in extracted:
                extracted[canonical] = {
                    "canonical": canonical,
                    "display_name": canonical.title() if len(canonical) > 3 else canonical.upper(),
                    "category": get_skill_category(canonical),
                    "count": len(matches)
                }
            else:
                extracted[canonical]["count"] += len(matches)

    # Clean display name exceptions
    name_overrides = {
        "fastapi": "FastAPI",
        "react": "React.js",
        "next.js": "Next.js",
        "node.js": "Node.js",
        "vue": "Vue.js",
        "aws": "AWS",
        "gcp": "Google Cloud (GCP)",
        "azure": "Azure",
        "ci/cd": "CI/CD",
        "sql": "SQL",
        "postgresql": "PostgreSQL",
        "mysql": "MySQL",
        "mongodb": "MongoDB",
        "graphql": "GraphQL",
        "rest apis": "RESTful APIs",
        "nlp": "NLP",
        "large language models": "LLMs / GenAI",
        "c++": "C++",
        "html/css": "HTML5 / CSS3",
        "system design": "System Design"
    }

    for k, v in extracted.items():
        if k in name_overrides:
            v["display_name"] = name_overrides[k]

    return extracted

def parse_job_requirements(jd_text: str) -> Dict[str, Any]:
    """Parse skills, requirements, and minimum experience from Job Description."""
    extracted_skills = extract_skills_from_text(jd_text)

    # Detect experience requirement (e.g. "3+ years", "minimum 5 years")
    req_exp = 2.0  # default reasonable baseline
    exp_matches = re.findall(r'(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp|relevant|software)', jd_text, re.IGNORECASE)
    if exp_matches:
        try:
            req_exp = float(exp_matches[0])
        except Exception:
            pass

    # Split into sections to classify critical (must have) vs secondary (nice to have)
    critical_skills = set()
    secondary_skills = set()

    must_have_section_patterns = [
        r'(?:requirements|qualifications|must have|what you will need|skills required|basic qualifications)(.*?)(?:preferred|nice to have|bonus|what we offer|benefits|$)'
    ]
    preferred_section_patterns = [
        r'(?:preferred|nice to have|bonus|plus|desirable qualifications)(.*?)(?:what we offer|benefits|about us|$)'
    ]

    must_text = ""
    for pat in must_have_section_patterns:
        m = re.search(pat, jd_text, re.IGNORECASE | re.DOTALL)
        if m:
            must_text += " " + m.group(1)

    pref_text = ""
    for pat in preferred_section_patterns:
        m = re.search(pat, jd_text, re.IGNORECASE | re.DOTALL)
        if m:
            pref_text += " " + m.group(1)

    if must_text:
        must_skills = extract_skills_from_text(must_text)
        critical_skills.update(must_skills.keys())
    if pref_text:
        pref_skills = extract_skills_from_text(pref_text)
        secondary_skills.update(pref_skills.keys())

    # Remaining skills in JD default to critical if not in preferred
    for s in extracted_skills.keys():
        if s not in secondary_skills:
            critical_skills.add(s)

    # Ensure secondary does not overlap critical
    secondary_skills = secondary_skills - critical_skills

    return {
        "all_skills": extracted_skills,
        "critical_skills": list(critical_skills),
        "secondary_skills": list(secondary_skills),
        "required_experience_years": req_exp
    }

def compute_semantic_skill_matrix(
    resume_skills: Dict[str, Dict[str, Any]],
    jd_skills: Dict[str, Dict[str, Any]],
    critical_skill_keys: List[str],
    secondary_skill_keys: List[str]
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]], float]:
    """
    Computes exact, semantic/related, and missing skills.
    Returns:
    - exact_matches
    - semantic_matches
    - missing_critical
    - missing_secondary
    - skill_match_ratio (0.0 to 1.0)
    """
    resume_keys = set(resume_skills.keys())
    exact_matches = []
    semantic_matches = []
    missing_critical = []
    missing_secondary = []

    covered_jd_skills = set()
    total_weight = 0.0
    earned_weight = 0.0

    for jd_key, jd_info in jd_skills.items():
        is_critical = jd_key in critical_skill_keys
        weight = 2.0 if is_critical else 1.0
        total_weight += weight

        if jd_key in resume_keys:
            # Exact or alias match
            covered_jd_skills.add(jd_key)
            earned_weight += weight
            exact_matches.append({
                "skill": jd_info["display_name"],
                "canonical": jd_key,
                "category": jd_info["category"],
                "match_type": "Exact / Direct Match",
                "similarity_score": 1.0,
                "importance": "Critical" if is_critical else "Preferred",
                "explanation": f"Candidate explicitly demonstrates direct proficiency in {jd_info['display_name']}."
            })
        else:
            # Check semantic relationship in ontology
            related = get_related_skills(jd_key)
            found_related = [r for r in related if r in resume_keys]

            if found_related:
                covered_jd_skills.add(jd_key)
                # Partial semantic credit (75% of weight)
                earned_weight += weight * 0.75
                related_names = [resume_skills[r]["display_name"] for r in found_related]
                semantic_matches.append({
                    "skill": jd_info["display_name"],
                    "canonical": jd_key,
                    "category": jd_info["category"],
                    "match_type": "Semantic / Equivalent Match",
                    "similarity_score": 0.85,
                    "importance": "Critical" if is_critical else "Preferred",
                    "matched_via": ", ".join(related_names),
                    "explanation": f"Candidate possesses equivalent technology ({', '.join(related_names)}) which translates directly to {jd_info['display_name']}."
                })
            else:
                # Missing
                missing_item = {
                    "skill": jd_info["display_name"],
                    "canonical": jd_key,
                    "category": jd_info["category"],
                    "importance": "Critical" if is_critical else "Preferred",
                    "recommendation": f"Acquire practical projects or certification in {jd_info['display_name']}."
                }
                if is_critical:
                    missing_critical.append(missing_item)
                else:
                    missing_secondary.append(missing_item)

    skill_ratio = (earned_weight / total_weight) if total_weight > 0 else 0.0
    return exact_matches, semantic_matches, missing_critical, missing_secondary, skill_ratio

def compute_overall_compatibility(
    resume_text: str,
    jd_text: str,
    resume_metadata: Dict[str, Any],
    jd_analysis: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Calculate comprehensive, multi-factor compatibility score and detailed breakdown.
    Weights:
    - Skill Match: 50%
    - Experience Alignment: 25%
    - Domain / Content Semantic Similarity (TF-IDF Cosine Sim): 15%
    - Education / Credential Fit: 10%
    """
    resume_skills = extract_skills_from_text(resume_text)
    jd_skills = jd_analysis["all_skills"]
    critical_skills = jd_analysis["critical_skills"]
    secondary_skills = jd_analysis["secondary_skills"]
    req_exp = jd_analysis.get("required_experience_years", 2.0)
    candidate_exp = resume_metadata.get("detected_experience_years", 0.0)

    # 1. Semantic Skill Match
    exact_matches, semantic_matches, missing_critical, missing_secondary, skill_ratio = compute_semantic_skill_matrix(
        resume_skills, jd_skills, critical_skills, secondary_skills
    )
    skill_score = min(round(skill_ratio * 100, 1), 100.0)

    # 2. Experience Score
    if req_exp <= 0:
        exp_score = 90.0
    elif candidate_exp >= req_exp:
        # Full points plus bonus for senior experience up to 100
        surplus = min((candidate_exp - req_exp) * 3.0, 10.0)
        exp_score = min(90.0 + surplus, 100.0)
    else:
        # Proportion of required experience
        exp_score = max(round((candidate_exp / req_exp) * 80.0, 1), 20.0)

    # 3. Domain & Content Semantic Cosine Similarity (TF-IDF vectorizer on full document)
    try:
        vectorizer = TfidfVectorizer(stop_words='english', max_features=3000, ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        cos_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        domain_score = round(min(max(float(cos_sim) * 125.0, 20.0), 100.0), 1)
    except Exception:
        domain_score = 70.0

    # 4. Education Fit
    edu_text = resume_metadata.get("education", "").lower()
    if "phd" in edu_text:
        edu_score = 100.0
    elif "master" in edu_text:
        edu_score = 92.0
    elif "bachelor" in edu_text or "undergraduate" in edu_text:
        edu_score = 85.0
    else:
        edu_score = 75.0

    # Weighted composite score
    overall_score = round(
        (skill_score * 0.50) +
        (exp_score * 0.25) +
        (domain_score * 0.15) +
        (edu_score * 0.10),
        1
    )

    # Label classification
    if overall_score >= 82:
        match_tier = "Exceptional Match"
        tier_color = "emerald"
    elif overall_score >= 70:
        match_tier = "Strong Match"
        tier_color = "cyan"
    elif overall_score >= 52:
        match_tier = "Moderate Match"
        tier_color = "amber"
    else:
        match_tier = "Low Compatibility"
        tier_color = "rose"

    return {
        "overall_score": overall_score,
        "match_tier": match_tier,
        "tier_color": tier_color,
        "breakdown": {
            "skill_match": skill_score,
            "experience_alignment": exp_score,
            "domain_context": domain_score,
            "education_credentials": edu_score
        },
        "stats": {
            "total_jd_skills": len(jd_skills),
            "matched_exact_count": len(exact_matches),
            "matched_semantic_count": len(semantic_matches),
            "missing_critical_count": len(missing_critical),
            "missing_secondary_count": len(missing_secondary),
            "candidate_exp_years": candidate_exp,
            "required_exp_years": req_exp
        },
        "exact_matches": exact_matches,
        "semantic_matches": semantic_matches,
        "missing_critical": missing_critical,
        "missing_secondary": missing_secondary,
        "all_candidate_skills": list(resume_skills.values())
    }
