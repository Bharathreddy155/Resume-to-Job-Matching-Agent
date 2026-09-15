import React, { useState } from 'react';
import {
  Users,
  Trophy,
  Filter,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  FileUp,
  X
} from 'lucide-react';
import ScoreDial from './ScoreDial';

export default function RecruiterView({
  jobDescription,
  setJobDescription,
  sampleResumes,
  targetJob,
  onMatchBatch,
  batchLoading,
  batchResults,
  apiKey
}) {
  const [candidateList, setCandidateList] = useState(
    sampleResumes.map(r => ({ id: r.id, name: r.name, text: r.text, filename: r.name + '.pdf' }))
  );
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidateModal, setSelectedCandidateModal] = useState(null);
  const [multiUploadLoading, setMultiUploadLoading] = useState(false);

  // Handle multi-file PDF/DOCX upload
  const handleMultiFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setMultiUploadLoading(true);
    const newCandidates = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('http://localhost:8000/api/parse-resume', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.text) {
          newCandidates.push({
            id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: data.metadata?.name !== 'Candidate' ? data.metadata.name : file.name.replace(/\.[^/.]+$/, ''),
            text: data.text,
            filename: file.name
          });
        }
      } catch (err) {
        console.error('Error parsing file:', file.name, err);
      }
    }

    setCandidateList(prev => [...prev, ...newCandidates]);
    setMultiUploadLoading(false);
  };

  const handleResetToSamples = () => {
    setCandidateList(
      sampleResumes.map(r => ({ id: r.id, name: r.name, text: r.text, filename: r.name + '.pdf' }))
    );
  };

  const handleRunBatch = () => {
    onMatchBatch({
      job_description: jobDescription,
      candidates: candidateList,
      api_key: apiKey
    });
  };

  // Filter candidates
  const filteredCandidates = (batchResults?.candidates || []).filter(c => {
    const matchesScore = c.overall_score >= minScoreFilter;
    const matchesQuery = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.exact_matches.some(m => m.skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesScore && matchesQuery;
  });

  const handleExportJson = () => {
    const exportData = filteredCandidates.map(c => ({
      rank: c.rank,
      name: c.name,
      overall_score: c.overall_score,
      tier: c.match_tier,
      experience_years: c.stats.candidate_exp_years,
      exact_matches: c.exact_matches.map(m => m.skill),
      missing_critical: c.missing_critical.map(m => m.skill)
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidate_rankings_${Date.now()}.json`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Controls: JD and Batch Candidates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left: Job Description */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.1rem' }}>Recruiting Job Spec</h2>
            </div>
            <span className="badge badge-cyan">{targetJob?.title || 'Open Role'}</span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Edit requirements or role specifications..."
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '12px',
              color: '#fff',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'var(--font-body)'
            }}
          />
        </div>

        {/* Right: Candidate Pool Manager */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--accent-indigo)" />
                <h2 style={{ fontSize: '1.1rem' }}>Candidate Pool ({candidateList.length})</h2>
              </div>
              <button onClick={handleResetToSamples} className="secondary-btn" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                Load Sample Pool
              </button>
            </div>

            {/* Candidate chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto', marginBottom: '16px' }}>
              {candidateList.map((c, idx) => (
                <div key={c.id || idx} className="glass-panel" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{c.name}</span>
                  <button
                    onClick={() => setCandidateList(candidateList.filter((_, i) => i !== idx))}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <label className="secondary-btn" style={{ cursor: 'pointer', margin: 0 }}>
              <FileUp size={16} />
              <span>{multiUploadLoading ? 'Parsing Resumes...' : 'Add PDF/DOCX Resumes'}</span>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleMultiFileUpload}
                style={{ display: 'none' }}
                disabled={multiUploadLoading}
              />
            </label>

            <button
              onClick={handleRunBatch}
              disabled={batchLoading || candidateList.length === 0}
              className="gradient-btn"
              style={{ padding: '10px 20px' }}
            >
              <Sparkles size={18} />
              <span>{batchLoading ? 'Ranking Candidates...' : 'Rank Candidates'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Leaderboard Table & Filters */}
      {batchResults && (
        <div className="glass-card" style={{ padding: '28px' }}>
          
          {/* Header & Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Trophy size={24} color="var(--accent-amber)" />
              <div>
                <h3 style={{ fontSize: '1.3rem' }}>Ranked Candidate Leaderboard</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Evaluated {batchResults.total_candidates} candidates against {batchResults.required_skills_count} role competencies
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min Score: {minScoreFilter}%</span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={minScoreFilter}
                  onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                  style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer', width: '100px' }}
                />
              </div>

              <input
                type="text"
                placeholder="Search candidate or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />

              <button onClick={handleExportJson} className="secondary-btn" style={{ fontSize: '0.8rem' }}>
                <Download size={14} /> Export Shortlist
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Rank</th>
                  <th style={{ padding: '12px 16px' }}>Candidate</th>
                  <th style={{ padding: '12px 16px' }}>Overall Match</th>
                  <th style={{ padding: '12px 16px' }}>Experience</th>
                  <th style={{ padding: '12px 16px' }}>Verified Skills</th>
                  <th style={{ padding: '12px 16px' }}>Critical Gaps</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((cand) => {
                  const rankColors = {
                    1: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
                    2: { bg: 'rgba(148, 163, 184, 0.2)', text: '#cbd5e1', border: 'rgba(148, 163, 184, 0.4)' },
                    3: { bg: 'rgba(217, 119, 6, 0.2)', text: '#f59e0b', border: 'rgba(217, 119, 6, 0.4)' }
                  };
                  const rankBadge = rankColors[cand.rank] || { bg: 'rgba(255,255,255,0.05)', text: '#94a3b8', border: 'transparent' };

                  return (
                    <tr
                      key={cand.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Rank */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: rankBadge.bg,
                          color: rankBadge.text,
                          border: `1px solid ${rankBadge.border}`,
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}>
                          #{cand.rank}
                        </span>
                      </td>

                      {/* Candidate Name & Education */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{cand.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cand.metadata.education}</div>
                      </td>

                      {/* Overall Match */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: `var(--accent-${cand.tier_color})` }}>
                            {cand.overall_score}%
                          </span>
                          <span className={`badge badge-${cand.tier_color}`} style={{ fontSize: '0.7rem' }}>
                            {cand.match_tier}
                          </span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '0.88rem', color: '#fff' }}>
                          {cand.stats.candidate_exp_years} yrs
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          Req: {cand.stats.required_exp_years} yrs
                        </div>
                      </td>

                      {/* Verified Skills */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                          {cand.exact_matches.slice(0, 3).map((m, i) => (
                            <span key={i} className="badge badge-emerald" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                              {m.skill}
                            </span>
                          ))}
                          {cand.exact_matches.length > 3 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                              +{cand.exact_matches.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Critical Gaps */}
                      <td style={{ padding: '14px 16px' }}>
                        {cand.missing_critical.length === 0 ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>None</span>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '180px' }}>
                            {cand.missing_critical.slice(0, 2).map((g, i) => (
                              <span key={i} className="badge badge-rose" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                                {g.skill}
                              </span>
                            ))}
                            {cand.missing_critical.length > 2 && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                                +{cand.missing_critical.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedCandidateModal(cand)}
                          className="secondary-btn"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        >
                          <Eye size={14} /> Full Audit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Deep-Dive Modal */}
      {selectedCandidateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '850px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ScoreDial
                  score={selectedCandidateModal.overall_score}
                  tier={selectedCandidateModal.match_tier}
                  color={selectedCandidateModal.tier_color}
                  size={100}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.4rem' }}>{selectedCandidateModal.name}</h3>
                    <span className={`badge badge-${selectedCandidateModal.tier_color}`}>
                      Rank #{selectedCandidateModal.rank}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Experience: {selectedCandidateModal.stats.candidate_exp_years} yrs • {selectedCandidateModal.metadata.education}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidateModal(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* AI Summary */}
            <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Executive Evaluation
              </div>
              <p style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.6 }}>
                {selectedCandidateModal.explanation?.summary}
              </p>
            </div>

            {/* Skill Matrix Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '8px' }}>
                  Direct Matches ({selectedCandidateModal.exact_matches.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedCandidateModal.exact_matches.map((m, idx) => (
                    <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                      {m.skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-rose)', marginBottom: '8px' }}>
                  Critical Missing Requirements ({selectedCandidateModal.missing_critical.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedCandidateModal.missing_critical.length === 0 ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No critical gaps</span>
                  ) : (
                    selectedCandidateModal.missing_critical.map((m, idx) => (
                      <span key={idx} className="badge badge-rose" style={{ fontSize: '0.75rem' }}>
                        {m.skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Interview Probing Questions */}
            <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-purple)', marginBottom: '10px' }}>
                Recommended Interview Probing Questions
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedCandidateModal.explanation?.recruiter_interview_questions?.map((q, idx) => (
                  <li key={idx} style={{ lineHeight: 1.5 }}>{q}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setSelectedCandidateModal(null)} className="secondary-btn">
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
