"""
Unit tests for Resume RAG Engine
"""

from sample_data import SAMPLE_RESUMES
from rag_engine import chunk_resume, ResumeRAGRetriever, generate_extractive_answer, get_suggested_queries

def test_rag_chunking():
    alex = SAMPLE_RESUMES[0]
    chunks = chunk_resume(alex["text"], candidate_id=alex["id"], candidate_name=alex["name"])
    print(f"✓ Chunked {alex['name']}'s resume into {len(chunks)} chunks.")
    assert len(chunks) >= 3, "Expected at least 3 section chunks"
    sections = [c["section"] for c in chunks]
    print(f"  Detected sections: {sections}")

def test_rag_retrieval():
    retriever = ResumeRAGRetriever(SAMPLE_RESUMES)
    print(f"✓ Indexed {len(retriever.chunks)} total chunks across {len(SAMPLE_RESUMES)} candidates.")

    # Search for FastAPI microservices
    results = retriever.search("FastAPI microservices and sub-50ms latency", top_k=2)
    assert len(results) > 0, "Expected search results"
    print(f"✓ Top result for 'FastAPI microservices': {results[0]['candidate_name']} ({results[0]['relevance_score']}%) in {results[0]['section']}")
    assert "Alex Chen" in results[0]["candidate_name"], "Alex Chen should be top result for FastAPI"

    # Search for database tuning EXPLAIN ANALYZE
    results_db = retriever.search("database query tuning execution plans EXPLAIN ANALYZE", top_k=2)
    print(f"✓ Top result for DB tuning: {results_db[0]['candidate_name']} ({results_db[0]['relevance_score']}%) in {results_db[0]['section']}")

def test_rag_generation():
    retriever = ResumeRAGRetriever(SAMPLE_RESUMES)
    alex = SAMPLE_RESUMES[0]
    chunks = retriever.search("What web framework did Alex Chen use for REST APIs?", candidate_id=alex["id"], top_k=2)
    response = generate_extractive_answer("What web framework did Alex Chen use for REST APIs?", chunks, candidate_name=alex["name"])

    print(f"✓ Generated answer (engine: {response['engine']}):")
    print(response["answer"][:200] + "...")
    assert len(response["citations"]) > 0, "Expected citations in response"
    print(f"✓ Citations count: {len(response['citations'])}")

    suggestions = get_suggested_queries(candidate_name=alex["name"])
    print(f"✓ Generated {len(suggestions)} suggested queries.")

if __name__ == "__main__":
    print("Running RAG Engine Tests...")
    test_rag_chunking()
    test_rag_retrieval()
    test_rag_generation()
    print("All RAG Engine Tests Passed Successfully! 🎉")
