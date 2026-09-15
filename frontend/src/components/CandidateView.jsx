import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import ScoreDial from './ScoreDial';
import confetti from 'canvas-confetti';

export default function CandidateView({
  jobDescription,
  setJobDescription,
  sampleResumes,
  targetJob,
  onMatchSingle,
  matchLoading,
  matchResult,
  apiKey
}) {
  const [resumeText, setResumeText] = useState(sampleResumes[0]?.text || '');
  const [candidateName, setCandidateName] = useState(sampleResumes[0]?.name || 'Alex Chen');
  const [fileName, setFileName] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const processFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/parse-resume', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.text) {
        setResumeText(data.text);
        if (data.metadata?.name && data.metadata.name !== 'Candidate') {
          setCandidateName(data.metadata.name);
        }
      }
    } catch (err) {
      console.error('File parsing failed:', err);
      alert('Error parsing document. Please check backend server.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
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
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleSelectSample = (sample) => {
    setResumeText(sample.text);
    setCandidateName(sample.name);
    setFileName('');
  };

  const handleRunMatch = async () => {
    const res = await onMatchSingle({
      resume_text: resumeText,
      job_description: jobDescription,
      candidate_name: candidateName,
      api_key: apiKey
    });

    if (res?.match_result?.overall_score >= 80) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Input Row: Job Description & Candidate Resume */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Target Job Description */}
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
              <h2 style={{ fontSize: '1.15rem' }}>Target Job Description</h2>
            </div>
            <span className="badge badge-cyan" style={{ fontWeight: 600 }}>
              {targetJob?.title || 'Active Role'}
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={13}
            placeholder="Paste or edit the target job specifications, required stack, and experience..."
            style={{
              width: '100%',
              background: 'rgba(11, 17, 32, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '14px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <span>🏢 Company: <strong style={{ color: 'var(--text-muted)' }}>{targetJob?.company || 'Nexus Innovations'}</strong></span>
            <span>{jobDescription.length.toLocaleString()} characters</span>
          </div>
        </div>

        {/* Right Column: Candidate Resume & Ingestion */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UploadCloud size={18} color="var(--accent-indigo)" />
              </div>
              <h2 style={{ fontSize: '1.15rem' }}>Candidate Resume</h2>
            </div>
            
            {/* Quick Demo Candidates Switcher */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {sampleResumes.map((s) => {
                const isSelected = candidateName === s.name;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    className="secondary-btn"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.76rem',
                      fontWeight: isSelected ? 600 : 400,
                      background: isSelected ? 'rgba(99, 102, 241, 0.28)' : 'rgba(30, 41, 59, 0.5)',
                      borderColor: isSelected ? 'var(--accent-indigo)' : 'var(--border-subtle)',
                      color: isSelected ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    {s.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`glass-panel ${isDragOver ? 'dropzone-active' : ''}`}
            style={{
              border: isDragOver ? '2px dashed var(--accent-cyan)' : '1px dashed rgba(148, 163, 184, 0.25)',
              padding: '12px 16px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={22} color={isDragOver ? 'var(--accent-cyan)' : 'var(--accent-indigo)'} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  {fileName ? fileName : 'Drag & Drop PDF / DOCX or Browse'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Auto-extracts candidate identity, career tenure, and skills
                </div>
              </div>
            </div>
            <label className="secondary-btn" style={{ cursor: 'pointer', margin: 0, padding: '6px 12px', fontSize: '0.8rem' }}>
              <span>{uploadLoading ? 'Parsing...' : 'Browse File'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={uploadLoading}
              />
            </label>
          </div>

          {/* Resume Raw Textarea */}
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={9}
            placeholder="Or paste candidate resume markdown or text directly..."
            style={{
              width: '100%',
              background: 'rgba(11, 17, 32, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '14px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-indigo)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Evaluating Profile: <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{candidateName}</strong>
            </div>
            <button
              onClick={handleRunMatch}
              disabled={matchLoading || !resumeText.trim()}
              className="gradient-btn"
              style={{ padding: '11px 24px', fontSize: '0.95rem' }}
            >
              <Sparkles size={18} />
              <span>{matchLoading ? 'Evaluating Semantic Graph...' : 'Calculate Fit & Explain'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          
          {/* Executive Overview Banner */}
          <div
            className="glass-card"
            style={{
              padding: '28px',
              borderLeft: `6px solid var(--accent-${matchResult.match_result.tier_color})`,
              background: 'linear-gradient(135deg, rgba(14, 21, 38, 0.85) 0%, rgba(20, 31, 54, 0.8) 100%)'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '28px' }}>
              
              {/* Dial + Verdict Narrative */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: '1 1 450px' }}>
                <ScoreDial
                  score={matchResult.match_result.overall_score}
                  tier={matchResult.match_result.match_tier}
                  color={matchResult.match_result.tier_color}
                  size={155}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                      {matchResult.candidate_name}
                    </h2>
                    <span className={`badge badge-${matchResult.match_result.tier_color}`} style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                      {matchResult.match_result.match_tier}
                    </span>
                  </div>
                  
                  <p style={{ color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '620px', lineHeight: 1.6 }}>
                    {matchResult.explanation?.summary}
                  </p>

                  <div style={{ display: 'flex', gap: '14px', marginTop: '14px', fontSize: '0.82rem', color: 'var(--text-dim)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="glass-panel" style={{ padding: '3px 10px', borderRadius: '6px' }}>
                      Tenure: <strong style={{ color: '#fff' }}>{matchResult.match_result.stats.candidate_exp_years} yrs</strong>
                    </span>
                    <span className="glass-panel" style={{ padding: '3px 10px', borderRadius: '6px' }}>
                      Education: <strong style={{ color: '#fff' }}>{matchResult.metadata.education}</strong>
                    </span>
                    <span className="glass-panel" style={{ padding: '3px 10px', borderRadius: '6px', borderColor: 'rgba(6,182,212,0.3)' }}>
                      Engine: <strong style={{ color: 'var(--accent-cyan)' }}>{matchResult.explanation?.engine || 'Semantic Agent'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Score Multi-Factor Gauges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', minWidth: '320px', flex: '1 1 320px' }}>
                
                {/* Skill Match (50%) */}
                <div className="glass-panel" style={{ padding: '14px', borderTop: '2px solid var(--accent-cyan)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 600 }}>Skill Match</span>
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>50% Wt</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {matchResult.match_result.breakdown.skill_match}%
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.match_result.breakdown.skill_match}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #38bdf8)', borderRadius: '3px' }} />
                  </div>
                </div>

                {/* Experience Alignment (25%) */}
                <div className="glass-panel" style={{ padding: '14px', borderTop: '2px solid var(--accent-indigo)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 600 }}>Experience</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>25% Wt</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>
                    {matchResult.match_result.breakdown.experience_alignment}%
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.match_result.breakdown.experience_alignment}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #818cf8)', borderRadius: '3px' }} />
                  </div>
                </div>

                {/* Domain Context (15%) */}
                <div className="glass-panel" style={{ padding: '14px', borderTop: '2px solid var(--accent-purple)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 600 }}>Domain Fit</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>15% Wt</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                    {matchResult.match_result.breakdown.domain_context}%
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.match_result.breakdown.domain_context}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #c084fc)', borderRadius: '3px' }} />
                  </div>
                </div>

                {/* Education & Credentials (10%) */}
                <div className="glass-panel" style={{ padding: '14px', borderTop: '2px solid var(--accent-emerald)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 600 }}>Credentials</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>10% Wt</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {matchResult.match_result.breakdown.education_credentials}%
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.match_result.breakdown.education_credentials}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '3px' }} />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Side-by-Side Competency Alignment Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
            
            {/* Left Card: Verified Direct Matches & Semantic Bridges */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={18} color="var(--accent-emerald)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>Matched Skills & Semantic Bridges</h3>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Verified competencies fulfilling job requirements</p>
                  </div>
                </div>
                <span className="badge badge-emerald">
                  {matchResult.match_result.exact_matches.length + matchResult.match_result.semantic_matches.length} Total Verified
                </span>
              </div>

              {/* Exact Direct Matches */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <CheckCircle2 size={13} color="var(--accent-emerald)" /> Exact Keyword Matches ({matchResult.match_result.exact_matches.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {matchResult.match_result.exact_matches.map((item, idx) => (
                    <span key={idx} className="badge badge-emerald" title={item.explanation} style={{ padding: '6px 12px' }}>
                      <CheckCircle2 size={13} />
                      <strong style={{ color: '#fff' }}>{item.skill}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Semantic Equivalence Bridges (The Core Hackathon Differentiator) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-purple)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Sparkles size={14} color="var(--accent-purple)" /> Semantic Equivalents & Bridges ({matchResult.match_result.semantic_matches.length})
                </div>
                
                {matchResult.match_result.semantic_matches.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    All matched skills were direct exact matches.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {matchResult.match_result.semantic_matches.map((item, idx) => (
                      <div key={idx} className="semantic-bridge-chip">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                              {item.matched_via}
                            </span>
                            <ArrowRight size={14} color="var(--accent-cyan)" />
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                              {item.skill}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.explanation || `Candidate skill '${item.matched_via}' satisfies job requirement '${item.skill}'`}
                          </div>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                          85% Bridge
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Card: Critical Gaps & Secondary Requirements */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(244, 63, 94, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AlertTriangle size={18} color="var(--accent-rose)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>Skill Gap Analysis</h3>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Missing prerequisites and upskilling roadmap</p>
                  </div>
                </div>
                <span className="badge badge-rose">
                  {matchResult.match_result.missing_critical.length} Critical Gap{matchResult.match_result.missing_critical.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Critical Missing Skills */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <AlertTriangle size={13} color="var(--accent-rose)" /> High-Priority Critical Gaps
                </div>
                
                {matchResult.match_result.missing_critical.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '12px 16px', color: 'var(--accent-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} /> Zero critical skill gaps detected. Candidate fulfills all core technical requirements.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {matchResult.match_result.missing_critical.map((item, idx) => (
                      <div
                        key={idx}
                        className="glass-panel"
                        style={{
                          padding: '12px 14px',
                          borderLeft: '4px solid var(--accent-rose)',
                          background: 'rgba(244, 63, 94, 0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
                            {item.skill}
                          </span>
                          <span className="badge badge-rose" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                            Critical Gap
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.4 }}>
                          💡 <strong style={{ color: 'var(--accent-amber)' }}>Action Plan:</strong> {item.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Secondary Missing Skills */}
              {matchResult.match_result.missing_secondary.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Secondary / Nice-to-Have Requirements ({matchResult.match_result.missing_secondary.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {matchResult.match_result.missing_secondary.map((item, idx) => (
                      <span key={idx} className="badge badge-amber" style={{ padding: '5px 10px', fontSize: '0.75rem' }}>
                        {item.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* AI Action Plan & Strategic Insights */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lightbulb size={20} color="var(--accent-amber)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>AI Action Plan & Strategic Insights</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Actionable intelligence for candidate resume tailoring and recruiter screening
                  </p>
                </div>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                Powered by {matchResult.explanation?.engine || 'Semantic Reasoner'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* Key Strengths */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '14px' }}>
                  <TrendingUp size={18} /> Candidate Core Strengths
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.86rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {matchResult.explanation?.key_strengths?.map((str, idx) => (
                    <li key={idx} style={{ lineHeight: 1.5 }}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Resume Optimization Tips */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '14px' }}>
                  <BookOpen size={18} /> Resume Tailoring Tips
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {matchResult.explanation?.tailoring_recommendations?.map((tip, idx) => (
                    <div key={idx} style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <span>• {tip}</span>
                      <button
                        onClick={() => copyToClipboard(tip, `tip_${idx}`)}
                        className="secondary-btn"
                        style={{ padding: '2px 6px', fontSize: '0.7rem', flexShrink: 0 }}
                        title="Copy tip to clipboard"
                      >
                        {copiedIndex === `tip_${idx}` ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Probing Questions */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '14px' }}>
                  <HelpCircle size={18} /> Recruiter Interview Probing
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {matchResult.explanation?.recruiter_interview_questions?.map((q, idx) => (
                    <div key={idx} style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <span>• {q}</span>
                      <button
                        onClick={() => copyToClipboard(q, `probe_${idx}`)}
                        className="secondary-btn"
                        style={{ padding: '2px 6px', fontSize: '0.7rem', flexShrink: 0 }}
                        title="Copy question for interview script"
                      >
                        {copiedIndex === `probe_${idx}` ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
