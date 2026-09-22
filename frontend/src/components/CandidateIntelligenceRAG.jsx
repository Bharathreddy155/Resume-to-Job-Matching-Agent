import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  MessageSquare,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ExternalLink,
  Bot,
  User,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function CandidateIntelligenceRAG({
  candidateId = null,
  candidateName = null,
  jobDescription = '',
  allowPoolSearch = true,
  title = "AI Candidate Intelligence (RAG Q&A)"
}) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchScope, setSearchScope] = useState(candidateId ? 'candidate' : 'all');
  const [result, setResult] = useState(null);
  const [citationsExpanded, setCitationsExpanded] = useState(true);
  const [suggestions, setSuggestions] = useState([
    candidateName ? `What are ${candidateName}'s standout technical achievements?` : "Which candidate has the strongest microservices background?",
    candidateName ? `Does ${candidateName} fulfill the required years of experience?` : "Which candidates have AWS and Docker production experience?",
    candidateName ? `What database technologies has ${candidateName} worked with?` : "Find candidates with PostgreSQL and SQL query optimization skills.",
    candidateName ? `What probing interview questions should we ask ${candidateName}?` : "Are there any candidates with machine learning and Python background?"
  ]);

  // Sync search scope if candidateId changes
  useEffect(() => {
    if (candidateId) {
      setSearchScope('candidate');
    }
  }, [candidateId]);

  // Fetch dynamic suggestions from backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const url = candidateId
          ? `${API_BASE}/api/rag/suggestions?candidate_id=${encodeURIComponent(candidateId)}`
          : `${API_BASE}/api/rag/suggestions`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions && data.suggestions.length > 0) {
            setSuggestions(data.suggestions);
          }
        }
      } catch (err) {
        // Fallback default suggestions remain active
      }
    };
    fetchSuggestions();
  }, [candidateId, candidateName]);

  const handleExecuteQuery = async (customQuery = null) => {
    const queryToRun = (customQuery || query).trim();
    if (!queryToRun) return;

    setLoading(true);
    try {
      const payload = {
        query: queryToRun,
        candidate_id: searchScope === 'candidate' ? candidateId : null,
        job_description: jobDescription || null,
        top_k: 3
      };

      const res = await fetch(`${API_BASE}/api/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`RAG query failed: ${res.statusText}`);
      }

      const data = await res.json();
      setResult({
        ...data,
        query: queryToRun
      });
      setCitationsExpanded(true);
    } catch (err) {
      console.error("RAG query error:", err);
      setResult({
        answer: "We were unable to complete the RAG query at this moment. Please ensure the backend server is running and try again.",
        citations: [],
        engine: "System Fallback",
        query: queryToRun
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecuteQuery();
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', position: 'relative' }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}>
            <Bot size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {title}
              </h3>
              <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '2px 8px', fontWeight: 700 }}>
                RAG Augmented
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {searchScope === 'candidate' && candidateName
                ? `Retrieving factual evidence strictly from ${candidateName}'s verified resume chunks`
                : 'Retrieving evidence across all candidate resumes in the applicant pool'}
            </p>
          </div>
        </div>

        {/* Scope Switcher if pool search allowed */}
        {allowPoolSearch && candidateId && (
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setSearchScope('candidate')}
              className="secondary-btn"
              style={{
                border: 'none',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: searchScope === 'candidate' ? 700 : 500,
                background: searchScope === 'candidate' ? '#ffffff' : 'transparent',
                color: searchScope === 'candidate' ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: searchScope === 'candidate' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              This Candidate
            </button>
            <button
              onClick={() => setSearchScope('all')}
              className="secondary-btn"
              style={{
                border: 'none',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: searchScope === 'all' ? 700 : 500,
                background: searchScope === 'all' ? '#ffffff' : 'transparent',
                color: searchScope === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: searchScope === 'all' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              All Applicants Pool
            </button>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Suggested Questions (1-Click RAG)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(s);
                handleExecuteQuery(s);
              }}
              className="secondary-btn"
              style={{
                fontSize: '0.76rem',
                padding: '5px 12px',
                borderRadius: '20px',
                background: '#f8fafc',
                borderColor: '#e2e8f0',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              ✨ {s}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '6px 8px 6px 14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        marginBottom: '20px'
      }}>
        <Search size={18} color="var(--accent-blue)" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            searchScope === 'candidate' && candidateName
              ? `Ask anything about ${candidateName}'s experience, frameworks, or projects...`
              : "Ask a question across all candidates (e.g. 'Who built high-traffic microservices?')..."
          }
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.88rem',
            color: 'var(--text-main)',
            background: 'transparent'
          }}
        />
        <button
          onClick={() => handleExecuteQuery()}
          disabled={loading || !query.trim()}
          className="gradient-btn"
          style={{
            padding: '8px 18px',
            fontSize: '0.84rem',
            borderRadius: '8px',
            opacity: loading || !query.trim() ? 0.6 : 1
          }}
        >
          {loading ? (
            <span>Retrieving...</span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Ask RAG
            </span>
          )}
        </button>
      </div>

      {/* RAG Answer Display */}
      {result && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          {/* Answer Card */}
          <div className="glass-panel" style={{
            padding: '20px',
            borderLeft: '4px solid var(--accent-blue)',
            background: '#f8fafc',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--accent-blue)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Grounded AI Answer
                </span>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                {result.engine || 'RAG Engine'}
              </span>
            </div>

            {/* Formatted Answer Body */}
            <div style={{
              fontSize: '0.92rem',
              color: 'var(--text-main)',
              lineHeight: 1.6,
              whiteSpace: 'pre-line'
            }}>
              {result.answer}
            </div>
          </div>

          {/* Evidence Citations Section */}
          {result.citations && result.citations.length > 0 && (
            <div style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#ffffff'
            }}>
              <button
                onClick={() => setCitationsExpanded(!citationsExpanded)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: 'none',
                  borderBottom: citationsExpanded ? '1px solid var(--border-subtle)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="var(--accent-blue)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Retrieved Evidence Citations ({result.citations.length})
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    (Document chunks directly retrieved for this query)
                  </span>
                </div>
                {citationsExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
              </button>

              {citationsExpanded && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.citations.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '2px 8px', fontWeight: 700 }}>
                            {c.candidate_name}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {c.section}
                          </span>
                        </div>
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          {c.relevance_score}% Relevance
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                        "{c.snippet}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Follow-up Prompts */}
          {result.suggested_followups && result.suggested_followups.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Explore further:
              </span>
              {result.suggested_followups.map((f, fIdx) => (
                <button
                  key={fIdx}
                  onClick={() => {
                    setQuery(f);
                    handleExecuteQuery(f);
                  }}
                  className="secondary-btn"
                  style={{
                    fontSize: '0.74rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: '#ffffff'
                  }}
                >
                  {f} <ArrowRight size={10} />
                </button>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
