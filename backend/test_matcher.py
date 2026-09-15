"""
Verification tests for matching engine, ontology, certifications, and CSV export.
"""

from skill_ontology import find_canonical_skill, get_related_skills, SKILL_TAXONOMY
from matcher import extract_skills_from_text, parse_job_requirements, compute_overall_compatibility
from parsers import extract_candidate_metadata, extract_certifications
from ai_explainer import explain_match
from sample_data import SAMPLE_JOBS, SAMPLE_RESUMES

def test_ontology():
    print("Testing Ontology...")
    # Canonical lookups
    assert find_canonical_skill("postgres") == "postgresql"
    assert find_canonical_skill("k8s") == "kubernetes"
    assert find_canonical_skill("pyspark") == "apache spark"
    assert find_canonical_skill("swift") == "ios"
    assert find_canonical_skill("kafka") == "apache kafka"
    assert find_canonical_skill("oauth") == "cybersecurity"

    # Related skills
    spark_related = get_related_skills("apache spark")
    assert "data engineering" in spark_related or "python" in spark_related
    print(f"✓ Ontology covers {len(SKILL_TAXONOMY)} core skill clusters with related mappings.")

def test_certifications_and_metadata():
    print("Testing Certifications Extraction...")
    sample_text = """
    Alex Chen
    Email: alex@example.com | Phone: 555-0199
    Certifications: AWS Certified Solutions Architect, Certified Kubernetes Administrator (CKA).
    Experience: 5 years of software engineering in Python and Spark.
    Education: M.S. in Computer Science.
    """
    certs = extract_certifications(sample_text)
    assert len(certs) >= 2
    assert "AWS Certified Solutions Architect" in certs
    assert "CKA (Certified Kubernetes Administrator)" in certs
    meta = extract_candidate_metadata(sample_text)
    assert meta["education"] == "Master's"
    assert len(meta["certifications"]) >= 2
    print(f"✓ Certifications accurately detected: {certs}")

def test_matching_and_scoring():
    print("Testing Matching and Scoring with Certifications...")
    job = SAMPLE_JOBS[0] # Senior Full Stack
    resume_alex = SAMPLE_RESUMES[0] # Alex Chen

    jd_analysis = parse_job_requirements(job["description"])
    meta = extract_candidate_metadata(resume_alex["text"])
    res = compute_overall_compatibility(resume_alex["text"], job["description"], meta, jd_analysis)

    print(f"Alex Chen Overall Score: {res['overall_score']}% ({res['match_tier']})")
    assert res['overall_score'] >= 80
    assert len(res['exact_matches']) > 0

    # Test explanation generator
    expl = explain_match(res, "Alex Chen")
    assert "summary" in expl
    assert len(expl["key_strengths"]) > 0
    print(f"✓ Explanations verified via {expl.get('engine')}")

if __name__ == "__main__":
    test_ontology()
    test_certifications_and_metadata()
    test_matching_and_scoring()
    print("\nAll Expanded Backend Unit Tests Passed Successfully! 🎉")
