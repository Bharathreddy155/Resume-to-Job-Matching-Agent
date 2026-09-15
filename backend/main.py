import os
import io
import csv
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from parsers import parse_document, extract_candidate_metadata
from matcher import parse_job_requirements, compute_overall_compatibility
from skill_ontology import SKILL_TAXONOMY
from ai_explainer import explain_match
from sample_data import SAMPLE_JOBS, SAMPLE_RESUMES

load_dotenv()

app = FastAPI(
    title="Intelligent Resume-to-Job Matching Agent",
    description="Production-grade semantic matching and scoring engine for candidate resumes and job descriptions.",
    version="1.1.0"
)

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchSingleRequest(BaseModel):
    resume_text: str
    job_description: str
    candidate_name: Optional[str] = None
    candidate_metadata: Optional[Dict[str, Any]] = None
    api_key: Optional[str] = None

class CandidateInput(BaseModel):
    id: Optional[str] = None
    name: str
    text: str
    metadata: Optional[Dict[str, Any]] = None

class MatchBatchRequest(BaseModel):
    job_description: str
    candidates: List[CandidateInput]
    api_key: Optional[str] = None

class ExportCsvRequest(BaseModel):
    job_title: Optional[str] = "Target Role"
    candidates: List[Dict[str, Any]]

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Resume-to-Job Matching Engine",
        "version": "1.1.0",
        "total_ontology_skills": len(SKILL_TAXONOMY)
    }

@app.get("/api/sample-data")
def get_sample_data():
    """Provides sample jobs and resumes for 1-click hackathon evaluation."""
    return {
        "jobs": SAMPLE_JOBS,
        "resumes": SAMPLE_RESUMES
    }

@app.get("/api/skills-catalog")
def get_skills_catalog():
    """Return categorized skill ontology for UI auto-complete or explorer."""
    catalog: Dict[str, List[str]] = {}
    for skill, info in SKILL_TAXONOMY.items():
        cat = info.get("category", "General")
        if cat not in catalog:
            catalog[cat] = []
        catalog[cat].append(skill.title() if len(skill) > 3 else skill.upper())
    return catalog

@app.post("/api/parse-resume")
async def parse_resume_file(file: UploadFile = File(...)):
    """Parse an uploaded PDF, DOCX, or text file."""
    try:
        content = await file.read()
        parsed = parse_document(content, file.filename)
        return {
            "success": True,
            "filename": file.filename,
            "text": parsed["text"],
            "metadata": parsed["metadata"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse resume: {str(e)}")

@app.post("/api/match-single")
def match_single_resume(payload: MatchSingleRequest):
    """
    Candidate View: Match a single resume against a job description.
    Returns score dial breakdown, semantic skill matrix, gap analysis, and AI explanation.
    """
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    metadata = payload.candidate_metadata or extract_candidate_metadata(payload.resume_text)
    candidate_name = payload.candidate_name or metadata.get("name", "Candidate")

    jd_analysis = parse_job_requirements(payload.job_description)

    match_result = compute_overall_compatibility(
        payload.resume_text,
        payload.job_description,
        metadata,
        jd_analysis
    )

    explanation = explain_match(match_result, candidate_name, payload.api_key)

    return {
        "candidate_name": candidate_name,
        "metadata": metadata,
        "match_result": match_result,
        "explanation": explanation
    }

@app.post("/api/match-batch")
def match_batch_resumes(payload: MatchBatchRequest):
    """
    Recruiter View: Match a batch of candidate resumes against 1 job description.
    Returns ranked leaderboard with comparative score breakdowns.
    """
    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
    if not payload.candidates:
        raise HTTPException(status_code=400, detail="At least one candidate resume is required.")

    jd_analysis = parse_job_requirements(payload.job_description)
    ranked_candidates = []

    for idx, c in enumerate(payload.candidates):
        metadata = c.metadata or extract_candidate_metadata(c.text)
        cand_name = c.name or metadata.get("name", f"Candidate #{idx + 1}")

        match_res = compute_overall_compatibility(
            c.text,
            payload.job_description,
            metadata,
            jd_analysis
        )

        explanation = explain_match(match_res, cand_name, payload.api_key)

        ranked_candidates.append({
            "id": c.id or f"cand_{idx+1}",
            "name": cand_name,
            "metadata": metadata,
            "overall_score": match_res["overall_score"],
            "match_tier": match_res["match_tier"],
            "tier_color": match_res["tier_color"],
            "breakdown": match_res["breakdown"],
            "stats": match_res["stats"],
            "exact_matches": match_res["exact_matches"],
            "semantic_matches": match_res["semantic_matches"],
            "missing_critical": match_res["missing_critical"],
            "missing_secondary": match_res["missing_secondary"],
            "all_candidate_skills": match_res["all_candidate_skills"],
            "explanation": explanation
        })

    # Sort descending by overall score
    ranked_candidates.sort(key=lambda x: x["overall_score"], reverse=True)

    for rank_idx, cand in enumerate(ranked_candidates, start=1):
        cand["rank"] = rank_idx

    return {
        "job_title": "Target Role",
        "total_candidates": len(ranked_candidates),
        "required_skills_count": len(jd_analysis["all_skills"]),
        "candidates": ranked_candidates
    }

@app.post("/api/export-shortlist-csv")
def export_shortlist_csv(payload: ExportCsvRequest):
    """Generate and stream a professional CSV export of ranked candidates for recruiters."""
    output = io.StringIO()
    # Write UTF-8 BOM so Microsoft Excel renders accented characters and symbols properly
    output.write('\ufeff')
    writer = csv.writer(output)

    writer.writerow([
        "Rank",
        "Candidate Name",
        "Overall Compatibility Score (%)",
        "Match Tier",
        "Experience (Years)",
        "Education",
        "Direct Matched Skills",
        "Semantic Equivalent Matches",
        "Critical Missing Skills",
        "Executive AI Evaluation"
    ])

    for c in payload.candidates:
        exact_str = ", ".join([m.get("skill", "") for m in c.get("exact_matches", [])])
        semantic_str = ", ".join([f"{m.get('skill', '')} (via {m.get('matched_via', '')})" for m in c.get("semantic_matches", [])])
        gaps_str = ", ".join([g.get("skill", "") for g in c.get("missing_critical", [])])

        writer.writerow([
            c.get("rank", ""),
            c.get("name", ""),
            c.get("overall_score", ""),
            c.get("match_tier", ""),
            c.get("stats", {}).get("candidate_exp_years", ""),
            c.get("metadata", {}).get("education", ""),
            exact_str,
            semantic_str,
            gaps_str,
            c.get("explanation", {}).get("summary", "")
        ])

    output.seek(0)
    filename = f"MatchPulse_Candidate_Rankings_{payload.job_title.replace(' ', '_')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
