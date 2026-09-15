"""
Verification tests for matching engine, ontology, and scoring formulas.
"""

from skill_ontology import find_canonical_skill, get_related_skills, SKILL_TAXONOMY
from matcher import extract_skills_from_text, parse_job_requirements, compute_overall_compatibility
from ai_explainer import explain_match
from sample_data import SAMPLE_JOBS, SAMPLE_RESUMES

def test_ontology():
    print("Testing Ontology...")
    # Test canonical resolution
    assert find_canonical_skill("postgres") == "postgresql"
    assert find_canonical_skill("k8s") == "kubernetes"
    assert find_canonical_skill("js") == "javascript"
    assert find_canonical_skill("react.js") == "react"

    # Test related skills
    react_related = get_related_skills("react")
    assert "javascript" in react_related or "frontend development" in react_related
    print("✓ Ontology lookups working correctly.")

def test_skill_extraction():
    print("Testing Skill Extraction...")
    sample_text = "Experienced Senior Developer skilled in Python, React.js, PostgreSQL, Docker, and AWS."
    skills = extract_skills_from_text(sample_text)
    keys = list(skills.keys())
    assert "python" in keys
    assert "react" in keys
    assert "postgresql" in keys
    assert "docker" in keys
    assert "aws" in keys
    print(f"✓ Extracted {len(skills)} skills accurately: {list(skills.keys())}")

def test_matching_and_scoring():
    print("Testing Matching and Scoring...")
    job = SAMPLE_JOBS[0] # Senior Full Stack
    resume_alex = SAMPLE_RESUMES[0] # Alex Chen (Full stack)
    resume_brenda = SAMPLE_RESUMES[1] # Brenda (Frontend)

    jd_analysis = parse_job_requirements(job["description"])
    assert len(jd_analysis["all_skills"]) > 0

    alex_meta = {"name": alex_chen["name"] if "alex_chen" in dir() else "Alex Chen", "detected_experience_years": 5.0, "education": "Bachelor's"}
    alex_res = compute_overall_compatibility(resume_alex["text"], job["description"], alex_meta, jd_analysis)

    brenda_meta = {"name": "Brenda Smith", "detected_experience_years": 3.0, "education": "Bachelor's"}
    brenda_res = compute_overall_compatibility(resume_brenda["text"], job["description"], brenda_meta, jd_analysis)

    print(f"Alex Chen Score: {alex_res['overall_score']} ({alex_res['match_tier']})")
    print(f"Brenda Smith Score: {brenda_res['overall_score']} ({brenda_res['match_tier']})")

    # Alex should score higher than Brenda for Senior Full Stack (Python + React + Postgres)
    assert alex_res['overall_score'] > brenda_res['overall_score']
    assert len(alex_res['exact_matches']) > 0

    # Test explanation generator
    expl = explain_match(alex_res, "Alex Chen")
    assert "summary" in expl
    assert len(expl["key_strengths"]) > 0
    print(f"✓ Explanation generated via {expl.get('engine')}")
    print(f"Summary: {expl['summary'][:80]}...")

if __name__ == "__main__":
    test_ontology()
    test_skill_extraction()
    test_matching_and_scoring()
    print("\nAll Backend Unit Tests Passed Successfully! 🎉")
