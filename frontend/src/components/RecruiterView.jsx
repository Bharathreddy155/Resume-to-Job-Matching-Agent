import React, { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  Filter,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  Eye,
  FileSpreadsheet,
  UploadCloud,
  FileText,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Copy,
  Check,
  X,
  ArrowRight,
  Trash2
} from 'lucide-react';
import ScoreDial from './ScoreDial';
import CandidateIntelligenceRAG from './CandidateIntelligenceRAG';

export default function RecruiterView({
  jobDescription,
  setJobDescription,
  resumes = [],
  targetJob,
  onMatchBatch,
  onUploadResume,
  onDeleteResume,
  batchLoading,
  batchResults
}) {
  const [candidateList, setCandidateList] = useState(
    resumes.map(r => ({ id: r.id, name: r.name, text: r.text, filename: r.filename || r.name + '.pdf', is_sample: r.is_sample }))
  );
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'high' | 'mod' | 'low'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('rank'); // 'rank' | 'score' | 'exp'
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedCandidateModal, setSelectedCandidateModal] = useState(null);
  const [multiUploadLoading, setMultiUploadLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Sync candidateList whenever database resumes update
  useEffect(() => {
    if (resumes && resumes.length > 0) {
      setCandidateList(
        resumes.map(r => ({ id: r.id, name: r.name, text: r.text, filename: r.filename || r.name + '.pdf', is_sample: r.is_sample }))
      );
    }
  }, [resumes]);

  // Automatically execute batch evaluation when candidateList or jobDescription is ready
  useEffect(() => {
    if (!batchResults && !batchLoading && candidateList.length > 0 && jobDescription && jobDescription.trim()) {
      handleRunBatch();
    }
  }, [candidateList, jobDescription]);

  // Handle multi-file parsing & persistence into SQLite database
  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
    setMultiUploadLoading(true);

    for (const file of files) {
      try {
        if (onUploadResume) {
          await onUploadResume(file);
        }
      } catch (err) {
        console.error('Error saving uploaded file to database:', file.name, err);
      }
    }

    setMultiUploadLoading(false);
  };

  const handleMultiFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const handleResetToSamples = () => {
    const samples = (resumes || []).filter(r => r.is_sample);
    const pool = samples.length > 0 ? samples : (resumes || []);
    setCandidateList(
      pool.map(r => ({
        id: r.id,
        name: r.name,
        text: r.text,
        filename: r.filename || r.name + '.pdf',
        is_sample: r.is_sample
      }))
    );
  };

  const handleRunBatch = () => {
    if (!candidateList || candidateList.length === 0 || !jobDescription) return;
    onMatchBatch({
      job_description: jobDescription,
      candidates: candidateList
    });
  };

  // Sorting & Filtering logic
  const filteredCandidates = (batchResults?.candidates || []).filter(c => {
    if (!c) return false;
    const score = typeof c.overall_score === 'number' ? c.overall_score : 0;
    const matchesMinScore = score >= minScoreFilter;
    let matchesTier = true;
    if (tierFilter === 'high') matchesTier = score >= 80;
    if (tierFilter === 'mod') matchesTier = score >= 60 && score < 80;
    if (tierFilter === 'low') matchesTier = score < 60;

    const queryLower = (searchQuery || '').trim().toLowerCase();
    const exactMatches = Array.isArray(c.exact_matches) ? c.exact_matches : [];
    const semanticMatches = Array.isArray(c.semantic_matches) ? c.semantic_matches : [];
    const candName = (c.name || '').toLowerCase();

    const matchesQuery = !queryLower || 
      candName.includes(queryLower) ||
      exactMatches.some(m => (m?.skill || '').toLowerCase().includes(queryLower)) ||
      semanticMatches.some(m => (m?.skill || '').toLowerCase().includes(queryLower) || (m?.matched_via || '').toLowerCase().includes(queryLower));

    return matchesMinScore && matchesTier && matchesQuery;
  }).sort((a, b) => {
    let diff = 0;
    if (sortField === 'rank') diff = (a?.rank ?? 0) - (b?.rank ?? 0);
    if (sortField === 'score') diff = (b?.overall_score ?? 0) - (a?.overall_score ?? 0);
    if (sortField === 'exp') {
      const expA = a?.stats?.candidate_exp_years ?? a?.metadata?.detected_experience_years ?? 0;
      const expB = b?.stats?.candidate_exp_years ?? b?.metadata?.detected_experience_years ?? 0;
      diff = expB - expA;
    }
    return sortAsc ? diff : -diff;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportJson = () => {
    const exportData = filteredCandidates.map(c => ({
      rank: c.rank,
      name: c.name,
      overall_score: c.overall_score,
      tier: c.match_tier,
      experience_years: c.stats?.candidate_exp_years ?? c.metadata?.detected_experience_years ?? 0,
      exact_matches: (c.exact_matches || []).map(m => m?.skill || m),
      semantic_matches: (c.semantic_matches || []).map(m => `${m?.matched_via || ''} -> ${m?.skill || ''}`),
      missing_critical: (c.missing_critical || []).map(m => m?.skill || m),
      summary: c.explanation?.summary || ''
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matchpulse_leaderboard_${Date.now()}.json`;
    a.click();
  };

  const copyProbingQuestion = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Controls: JD and Batch Candidate Drag-and-Drop Ingestion */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left: Job Spec */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={18} color="var(--accent-cyan)" />
              </div>
              <h2 style={{ fontSize: '1.15rem' }}>Recruiting Job Spec</h2>
            </div>
            <span className="badge badge-cyan" style={{ fontWeight: 600 }}>{targetJob?.title || 'Open Role'}</span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Edit requirements, competencies, or role qualifications..."
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '14px',
              color: 'var(--text-main)',
              fontSize: '0.86rem',
              lineHeight: 1.5,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <span>Target Role: <strong style={{ color: 'var(--text-muted)' }}>{targetJob?.department || 'Engineering'}</strong></span>
            <span>{(jobDescription || '').length.toLocaleString()} chars</span>
          </div>
        </div>

        {/* Right: Candidate Pool Manager & Multi-Resume Drag-and-Drop */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={18} color="var(--accent-blue)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem' }}>Candidate Pool</h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{candidateList.length} applicant profiles queued</span>
                </div>
              </div>

              <button onClick={handleResetToSamples} className="secondary-btn" style={{ fontSize: '0.76rem', padding: '4px 10px' }}>
                Load Sample Pool
              </button>
            </div>

            {/* Interactive Drag & Drop Area for Multi-Files */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragOver ? '2px dashed var(--accent-blue)' : '1px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isDragOver ? '#eff6ff' : '#f8fafc',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UploadCloud size={22} color="var(--accent-blue)" />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {multiUploadLoading ? 'Parsing Resumes...' : 'Drag & Drop Multiple Resumes'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Drop `.pdf` or `.docx` files to batch ingest into evaluation pool
                  </div>
                </div>
              </div>

              <label className="secondary-btn" style={{ cursor: 'pointer', margin: 0, padding: '5px 10px', fontSize: '0.78rem' }}>
                <span>{multiUploadLoading ? 'Parsing...' : 'Browse'}</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={handleMultiFileUpload}
                  style={{ display: 'none' }}
                  disabled={multiUploadLoading}
                />
              </label>
            </div>

            {/* Candidate chips in queue */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '100px', overflowY: 'auto', marginBottom: '12px' }}>
              {candidateList.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="glass-panel"
                  style={{
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{c.name}</span>
                  <button
                    onClick={() => setCandidateList(candidateList.filter((_, i) => i !== idx))}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}
                    title="Remove candidate"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', paddingTop: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Ready to evaluate against ontology
            </span>
            <button
              onClick={handleRunBatch}
              disabled={batchLoading || candidateList.length === 0}
              className="gradient-btn"
              style={{ padding: '10px 22px' }}
            >
              <Sparkles size={18} />
              <span>{batchLoading ? 'Executing Multi-Factor Ranking...' : `Rank ${candidateList.length} Candidates`}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Loading State Banner */}
      {batchLoading && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#eff6ff',
            color: 'var(--accent-blue)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Sparkles size={24} color="var(--accent-blue)" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
            Evaluating Multi-Factor Candidate Rankings...
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Comparing {candidateList.length} candidate profiles across semantic skill ontology, experience, and domain context.
          </p>
        </div>
      )}

      {/* Ready to Rank Prompt if no results yet */}
      {!batchLoading && !batchResults && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fffbeb',
            color: '#d97706',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Trophy size={24} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
            Leaderboard Ready to Generate
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Ready to rank {candidateList.length} candidates against the active job description.
          </p>
          <button onClick={handleRunBatch} className="primary-btn" style={{ margin: '0 auto' }}>
            <Sparkles size={16} /> Rank Candidates Now
          </button>
        </div>
      )}

      {/* Leaderboard Table & Filtering Bar */}
      {batchResults && Array.isArray(batchResults.candidates) && (
        <div className="glass-card" style={{ padding: '28px' }}>
          
          {/* Header & Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }}>
                <Trophy size={24} color="#fbbf24" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>Ranked Candidate Leaderboard</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Evaluated {batchResults.total_candidates ?? batchResults.candidates.length} candidates across {batchResults.required_skills_count ?? 0} target competencies
                </p>
              </div>
            </div>

            {/* Quick Filter Buttons & Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              
              {/* Tier Filters */}
              <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setTierFilter('all')}
                  className="secondary-btn"
                  style={{
                    border: 'none',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: tierFilter === 'all' ? 700 : 500,
                    background: tierFilter === 'all' ? '#ffffff' : 'transparent',
                    color: tierFilter === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
                    boxShadow: tierFilter === 'all' ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  All ({batchResults.candidates?.length || 0})
                </button>
                <button
                  onClick={() => setTierFilter('high')}
                  className="secondary-btn"
                  style={{
                    border: 'none',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: tierFilter === 'high' ? 700 : 500,
                    background: tierFilter === 'high' ? '#ffffff' : 'transparent',
                    color: tierFilter === 'high' ? '#047857' : 'var(--text-muted)',
                    boxShadow: tierFilter === 'high' ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  Top Fits (≥80%)
                </button>
                <button
                  onClick={() => setTierFilter('mod')}
                  className="secondary-btn"
                  style={{
                    border: 'none',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: tierFilter === 'mod' ? 700 : 500,
                    background: tierFilter === 'mod' ? '#ffffff' : 'transparent',
                    color: tierFilter === 'mod' ? '#b45309' : 'var(--text-muted)',
                    boxShadow: tierFilter === 'mod' ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  60-79%
                </button>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px' }} />
                <input
                  type="text"
                  placeholder="Search candidate or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '6px 12px 6px 30px',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    width: '180px'
                  }}
                />
              </div>

              {/* Export Shortlist Button */}
              <button onClick={handleExportJson} className="secondary-btn" style={{ fontSize: '0.78rem' }}>
                <Download size={14} /> Export Shortlist
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => toggleSort('rank')}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Rank <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th style={{ padding: '12px 14px' }}>Candidate & Credentials</th>
                  <th style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => toggleSort('score')}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Compatibility <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => toggleSort('exp')}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Experience <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th style={{ padding: '12px 14px' }}>Verified Skills (Exact + Bridges)</th>
                  <th style={{ padding: '12px 14px' }}>Critical Gaps</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Audit</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((cand) => {
                  let rankClass = '';
                  let rankIcon = null;
                  if (cand.rank === 1) {
                    rankClass = 'rank-gold';
                    rankIcon = '🥇';
                  } else if (cand.rank === 2) {
                    rankClass = 'rank-silver';
                    rankIcon = '🥈';
                  } else if (cand.rank === 3) {
                    rankClass = 'rank-bronze';
                    rankIcon = '🥉';
                  }

                  return (
                    <tr
                      key={cand.id || `cand_${cand.rank}`}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Rank Badge */}
                      <td style={{ padding: '14px 14px' }}>
                        <span
                          className={rankClass}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px',
                            minWidth: '36px',
                            height: '32px',
                            padding: '0 8px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            background: rankClass ? undefined : '#f1f5f9',
                            color: rankClass ? undefined : 'var(--text-muted)'
                          }}
                        >
                          {rankIcon} #{cand.rank}
                        </span>
                      </td>

                      {/* Candidate Name & Education */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.96rem' }}>{cand.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {cand.metadata?.education || 'Not specified'}
                        </div>
                      </td>

                      {/* Overall Match & Pill */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: `var(--accent-${cand.tier_color || 'blue'})`
                          }}>
                            {cand.overall_score}%
                          </span>
                          <span className={`badge badge-${cand.tier_color || 'blue'}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            {cand.match_tier}
                          </span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {cand.stats?.candidate_exp_years ?? cand.metadata?.detected_experience_years ?? 0} yrs
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          Req: {cand.stats?.required_exp_years ?? 0} yrs
                        </div>
                      </td>

                      {/* Verified Skills (Exact + Semantic Bridges) */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '260px' }}>
                          {(cand.exact_matches || []).slice(0, 3).map((m, i) => (
                            <span key={i} className="badge badge-emerald" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                              {m?.skill || m}
                            </span>
                          ))}
                          {(cand.semantic_matches || []).slice(0, 2).map((m, i) => (
                            <span key={`sem_${i}`} className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                              ⚡ {m?.skill || m}
                            </span>
                          ))}
                          {((cand.exact_matches || []).length + (cand.semantic_matches || []).length) > 5 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', alignSelf: 'center' }}>
                              +{((cand.exact_matches || []).length + (cand.semantic_matches || []).length) - 5} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Critical Gaps */}
                      <td style={{ padding: '14px 14px' }}>
                        {(cand.missing_critical || []).length === 0 ? (
                          <span className="badge badge-emerald" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            ✓ None
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '180px' }}>
                            {(cand.missing_critical || []).slice(0, 2).map((g, i) => (
                              <span key={i} className="badge badge-rose" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                                {g?.skill || g}
                              </span>
                            ))}
                            {(cand.missing_critical || []).length > 2 && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                                +{(cand.missing_critical || []).length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Full Audit Action Button */}
                      <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedCandidateModal(cand)}
                          className="secondary-btn"
                          style={{
                            fontSize: '0.78rem',
                            padding: '6px 12px',
                            borderColor: 'rgba(99, 102, 241, 0.4)'
                          }}
                        >
                          <Eye size={14} color="var(--accent-cyan)" /> Full Audit
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

      {/* Pool-Wide Candidate Intelligence RAG */}
      <CandidateIntelligenceRAG
        candidateId={null}
        candidateName={null}
        jobDescription={jobDescription}
        allowPoolSearch={false}
        title="Applicant Pool Intelligence (RAG Search)"
      />

      {/* Candidate Deep-Dive Audit Modal */}
      {selectedCandidateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '900px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <ScoreDial
                  score={selectedCandidateModal.overall_score}
                  tier={selectedCandidateModal.match_tier}
                  color={selectedCandidateModal.tier_color}
                  size={110}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedCandidateModal.name}</h3>
                    <span className={`badge badge-${selectedCandidateModal.tier_color}`}>
                      Rank #{selectedCandidateModal.rank} Leaderboard Fit
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Experience: {selectedCandidateModal.stats?.candidate_exp_years ?? selectedCandidateModal.metadata?.detected_experience_years ?? 0} yrs • Degree: {selectedCandidateModal.metadata?.education || 'Not specified'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidateModal(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* AI Executive Summary */}
            <div className="glass-panel" style={{ padding: '18px', marginBottom: '20px', borderLeft: `4px solid var(--accent-${selectedCandidateModal.tier_color || 'blue'})`, background: '#f8fafc' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Executive Evaluation Narrative
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {selectedCandidateModal.explanation?.summary}
              </p>
            </div>

            {/* Factor Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div className="glass-panel" style={{ padding: '12px', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Skills (50%)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {selectedCandidateModal.breakdown?.skill_match ?? 0}%
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '12px', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Experience (25%)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                  {selectedCandidateModal.breakdown?.experience_alignment ?? 0}%
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '12px', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Domain (15%)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0284c7' }}>
                  {selectedCandidateModal.breakdown?.domain_context ?? 0}%
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '12px', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Degree (10%)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {selectedCandidateModal.breakdown?.education_credentials ?? 0}%
                </div>
              </div>
            </div>

            {/* Skill Matrix: Direct Matches vs Semantic Bridges vs Critical Gaps */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '22px' }}>
              
              {/* Direct Matches */}
              <div className="glass-panel" style={{ padding: '16px', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Direct Matches ({(selectedCandidateModal.exact_matches || []).length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(selectedCandidateModal.exact_matches || []).map((m, idx) => (
                    <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                      {m?.skill || m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Semantic Bridges */}
              <div className="glass-panel" style={{ padding: '16px', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} /> Semantic Bridges ({(selectedCandidateModal.semantic_matches || []).length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(selectedCandidateModal.semantic_matches || []).length === 0 ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No semantic bridges applied</span>
                  ) : (
                    (selectedCandidateModal.semantic_matches || []).map((m, idx) => (
                      <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{m?.matched_via || ''}</span>
                        <ArrowRight size={12} color="var(--accent-blue)" />
                        <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{m?.skill || ''}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Critical Missing Skills */}
              <div className="glass-panel" style={{ padding: '16px', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> Critical Gaps ({(selectedCandidateModal.missing_critical || []).length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(selectedCandidateModal.missing_critical || []).length === 0 ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>Zero critical gaps</span>
                  ) : (
                    (selectedCandidateModal.missing_critical || []).map((m, idx) => (
                      <span key={idx} className="badge badge-rose" style={{ fontSize: '0.74rem' }}>
                        {m?.skill || m}
                      </span>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Recruiter Probing Questions */}
            <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid var(--accent-blue)', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '10px' }}>
                Recommended Interview Probing Script
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedCandidateModal.explanation?.recruiter_interview_questions?.map((q, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <span>• {q}</span>
                    <button
                      onClick={() => copyProbingQuestion(q, `probe_modal_${idx}`)}
                      className="secondary-btn"
                      style={{ padding: '2px 6px', fontSize: '0.7rem', flexShrink: 0 }}
                      title="Copy question"
                    >
                      {copiedId === `probe_modal_${idx}` ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Deep-Dive RAG Q&A */}
            <div style={{ marginTop: '20px' }}>
              <CandidateIntelligenceRAG
                candidateId={selectedCandidateModal.id}
                candidateName={selectedCandidateModal.name}
                jobDescription={jobDescription}
                allowPoolSearch={false}
                title={`Ask RAG about ${selectedCandidateModal.name}`}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
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
