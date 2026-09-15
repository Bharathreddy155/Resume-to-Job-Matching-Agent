import os
import json
from typing import Dict, Any, Optional

def generate_local_explanation(match_data: Dict[str, Any], candidate_name: str) -> Dict[str, Any]:
    """Fallback deterministic explanation generator when no API key is set."""
    overall = match_data.get("overall_score", 0)
    tier = match_data.get("match_tier", "Evaluation")
    exact = match_data.get("exact_matches", [])
    semantic = match_data.get("semantic_matches", [])
    missing_crit = match_data.get("missing_critical", [])
    missing_sec = match_data.get("missing_secondary", [])
    breakdown = match_data.get("breakdown", {})
    stats = match_data.get("stats", {})

    top_skills = [m["skill"] for m in exact[:4]]
    semantic_bridges = [f"{s['skill']} (leveraging {s.get('matched_via', 'adjacent skills')})" for s in semantic[:3]]
    critical_gaps = [g["skill"] for g in missing_crit[:3]]

    # Strengths
    strengths = []
    if top_skills:
        strengths.append(f"Demonstrates solid direct mastery of key requirements: {', '.join(top_skills)}.")
    if semantic_bridges:
        strengths.append(f"Strong semantic adaptability: successfully maps background to {', '.join(semantic_bridges)}.")
    if stats.get("candidate_exp_years", 0) >= stats.get("required_exp_years", 0):
        strengths.append(f"Experience criteria fully met with {stats.get('candidate_exp_years', 0)} years compared to {stats.get('required_exp_years', 0)} years required.")
    else:
        strengths.append("Foundational technical competencies aligned with core workflow.")

    # Gaps & Weaknesses
    gaps = []
    if critical_gaps:
        gaps.append(f"Missing direct evidence for core requirements: {', '.join(critical_gaps)}.")
    if stats.get("candidate_exp_years", 0) < stats.get("required_exp_years", 0):
        gaps.append(f"Experience gap: Candidate has ~{stats.get('candidate_exp_years', 0)} yrs vs {stats.get('required_exp_years', 0)} yrs requested.")
    if not gaps:
        gaps.append("Minor secondary skill omissions that can be easily trained on the job.")

    # Tailoring tips for Candidate
    tailoring_tips = []
    if critical_gaps:
        tailoring_tips.append(f"Explicitly highlight projects or coursework involving {critical_gaps[0]} in your bullet points.")
    if semantic:
        tailoring_tips.append(f"Reframe your experience in {semantic[0].get('matched_via')} to explicitly mention the target JD terminology ({semantic[0]['skill']}).")
    tailoring_tips.append("Quantify project accomplishments using measurable metrics (e.g. latency reduction, user growth).")

    # Recruiter interview questions
    interview_questions = []
    if semantic:
        interview_questions.append(f"Ask how their experience with {semantic[0].get('matched_via')} transfers to {semantic[0]['skill']} in a production environment.")
    if critical_gaps:
        interview_questions.append(f"Inquire about their familiarity and learning curve regarding {critical_gaps[0]}.")
    interview_questions.append("Can you describe the most architecturally challenging project you delivered and how you resolved system trade-offs?")

    summary = (
        f"{candidate_name} achieves a {tier} rating ({overall}/100). "
        f"The candidate secures a {breakdown.get('skill_match', 0)}% skill alignment score, "
        f"matching {len(exact)} direct skills and bridging {len(semantic)} skills semantically. "
        + (f"However, addressing {len(missing_crit)} critical gap(s) would significantly bolster alignment." if missing_crit else "The technical profile exhibits high synergy with the position.")
    )

    return {
        "summary": summary,
        "score_reasoning": f"Composite weighted formula applied: Skills (50% weight) = {breakdown.get('skill_match')}%, Experience (25% weight) = {breakdown.get('experience_alignment')}%, Domain Semantic Context (15% weight) = {breakdown.get('domain_context')}%, Education (10% weight) = {breakdown.get('education_credentials')}%.",
        "key_strengths": strengths,
        "critical_gaps": gaps,
        "tailoring_recommendations": tailoring_tips,
        "recruiter_interview_questions": interview_questions,
        "engine": "Deterministic Semantic Rules Engine (Offline Active)"
    }

def explain_match(match_data: Dict[str, Any], candidate_name: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    """Generate comprehensive explanation using Gemini API if key is available, else fallback."""
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        return generate_local_explanation(match_data, candidate_name)

    try:
        from google import genai
        client = genai.Client(api_key=key)

        prompt = f"""
You are an expert technical recruiting AI and resume evaluation specialist.
Analyze this resume-to-job matching result and generate a structured JSON explanation.

Candidate Name: {candidate_name}
Overall Compatibility Score: {match_data.get('overall_score')}/100 ({match_data.get('match_tier')})
Detailed Breakdown: {json.dumps(match_data.get('breakdown'))}
Exact Skill Matches: {json.dumps([s['skill'] for s in match_data.get('exact_matches', [])])}
Semantic Skill Matches: {json.dumps([f"{s['skill']} matched via {s.get('matched_via')}" for s in match_data.get('semantic_matches', [])])}
Missing Critical Skills: {json.dumps([s['skill'] for s in match_data.get('missing_critical', [])])}
Missing Secondary Skills: {json.dumps([s['skill'] for s in match_data.get('missing_secondary', [])])}
Candidate Experience: {match_data.get('stats', {}).get('candidate_exp_years')} years
Required Experience: {match_data.get('stats', {}).get('required_exp_years')} years

Return ONLY valid JSON with this exact schema:
{{
    "summary": "2-3 concise sentences providing executive evaluation",
    "score_reasoning": "Clear explanation of how the score was calculated from skills, experience, and domain context",
    "key_strengths": ["strength 1", "strength 2", "strength 3"],
    "critical_gaps": ["gap 1", "gap 2"],
    "tailoring_recommendations": ["advice 1 for candidate to optimize resume", "advice 2"],
    "recruiter_interview_questions": ["question 1 to probe weak areas", "question 2 to probe semantic equivalents"]
}}
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        cleaned_text = response.text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        result = json.loads(cleaned_text.strip())
        result["engine"] = "Google Gemini 2.5 Flash LLM"
        return result
    except Exception as e:
        # Graceful fallback to deterministic generator on error
        local_res = generate_local_explanation(match_data, candidate_name)
        local_res["engine"] = f"Local Fallback ({str(e)[:40]}...)"
        return local_res
