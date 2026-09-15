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
  BookOpen
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Input Row: Job Description & Candidate Resume */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Job Description */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.1rem' }}>Target Job Description</h2>
            </div>
            <span className="badge badge-cyan">
              {targetJob?.title || 'Active Role'}
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={14}
            placeholder="Paste or edit the job description requirements..."
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px',
              color: '#fff',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'var(--font-body)'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <span>Company: {targetJob?.company || 'Nexus Innovations'}</span>
            <span>{jobDescription.length} characters</span>
          </div>
        </div>

        {/* Right Column: Candidate Resume */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={18} color="var(--accent-indigo)" />
              <h2 style={{ fontSize: '1.1rem' }}>Candidate Resume</h2>
            </div>
            
            {/* Quick Demo Resumes */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {sampleResumes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSample(s)}
                  className="secondary-btn"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    background: candidateName === s.name ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                    borderColor: candidateName === s.name ? 'var(--accent-indigo)' : 'var(--border-subtle)'
                  }}
                >
                  {s.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Document Upload Area */}
          <div style={{
            border: '2px dashed var(--border-subtle)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  {fileName ? fileName : 'Upload PDF or DOCX Resume'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Auto-extracts text, skills, and metadata
                </div>
              </div>
            </div>
            <label className="secondary-btn" style={{ cursor: 'pointer', margin: 0 }}>
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

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={10}
            placeholder="Or paste resume text directly here..."
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px',
              color: '#fff',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'var(--font-body)'
            }}
          />

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Candidate: <strong style={{ color: '#fff' }}>{candidateName}</strong>
            </div>
            <button
              onClick={handleRunMatch}
              disabled={matchLoading}
              className="gradient-btn"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <Sparkles size={18} />
              <span>{matchLoading ? 'Evaluating Semantic Vectors...' : 'Calculate Fit & Explain'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Executive Overview Banner */}
          <div className="glass-card" style={{ padding: '28px', borderLeft: `6px solid var(--accent-${matchResult.match_result.tier_color})` }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              
              {/* Dial + Verdict */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <ScoreDial
                  score={matchResult.match_result.overall_score}
                  tier={matchResult.match_result.match_tier}
                  color={matchResult.match_result.tier_color}
                  size={150}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{matchResult.candidate_name}</h2>
                    <span className={`badge badge-${matchResult.match_result.tier_color}`}>
                      {matchResult.match_result.match_tier}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.6 }}>
                    {matchResult.explanation?.summary}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    <span>Experience: <strong style={{ color: '#fff' }}>{matchResult.match_result.stats.candidate_exp_years} yrs</strong></span>
                    <span>•</span>
                    <span>Education: <strong style={{ color: '#fff' }}>{matchResult.metadata.education}</strong></span>
                    <span>•</span>
                    <span>Engine: <strong style={{ color: 'var(--accent-cyan)' }}>{matchResult.explanation?.engine || 'Semantic Agent'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Sub-Score Multi-Factor Gauges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', minWidth: '320px' }}>
                <div className="glass-panel" style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Skill Match (50%)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {matchResult.match_result.breakdown.skill_match}%
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.match_result.breakdown.skill_match}%`, height: '100%', background: 'var(--accent-cyan)' }} />
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Experience (25%)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                    {matchResult.match_result.breakdown.experience_alignment}%
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.match_result.breakdown.experience_alignment}%`, height: '100%', background: 'var(--accent-indigo)' }} />
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Domain Fit (15%)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                    {matchResult.match_result.breakdown.domain_context}%
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.match_result.breakdown.domain_context}%`, height: '100%', background: 'var(--accent-purple)' }} />
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Credentials (10%)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {matchResult.match_result.breakdown.education_credentials}%
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.match_result.breakdown.education_credentials}%`, height: '100%', background: 'var(--accent-emerald)' }} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Semantic Skill Analysis & Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            {/* Direct & Semantic Matches */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CheckCircle2 size={20} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.15rem' }}>Matched Skills & Semantic Bridges</h3>
                <span className="badge badge-emerald">
                  {matchResult.match_result.exact_matches.length + matchResult.match_result.semantic_matches.length} Verified
                </span>
              </div>

              {/* Exact Matches */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Direct / Exact Matches ({matchResult.match_result.exact_matches.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {matchResult.match_result.exact_matches.map((item, idx) => (
                    <span key={idx} className="badge badge-emerald" title={item.explanation}>
                      <CheckCircle2 size={12} />
                      {item.skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Semantic / Equivalent Matches */}
              {matchResult.match_result.semantic_matches.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Semantic Equivalents ({matchResult.match_result.semantic_matches.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {matchResult.match_result.semantic_matches.map((item, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{item.skill}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                            via candidate's {item.matched_via}
                          </span>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                          85% Semantic Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gap Analysis: Missing Critical & Secondary */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <AlertTriangle size={20} color="var(--accent-rose)" />
                <h3 style={{ fontSize: '1.15rem' }}>Skill Gap Analysis</h3>
                <span className="badge badge-rose">
                  {matchResult.match_result.missing_critical.length} Critical Gaps
                </span>
              </div>

              {/* Critical Gaps */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Critical Missing Requirements
                </div>
                {matchResult.match_result.missing_critical.length === 0 ? (
                  <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
                    No critical skill gaps detected! Excellent alignment.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {matchResult.match_result.missing_critical.map((item, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: '10px 14px', borderLeft: '3px solid var(--accent-rose)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{item.skill}</strong>
                          <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>High Priority</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {item.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Secondary Gaps */}
              {matchResult.match_result.missing_secondary.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Secondary / Nice-to-Have Gaps ({matchResult.match_result.missing_secondary.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {matchResult.match_result.missing_secondary.map((item, idx) => (
                      <span key={idx} className="badge badge-amber">
                        {item.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Deep Qualitative AI Insights & Recommendations */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Lightbulb size={22} color="var(--accent-amber)" />
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>AI Action Plan & Strategic Insights</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Actionable intelligence for candidate resume tailoring and recruiter screening</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* Strengths */}
              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>
                  <TrendingUp size={16} /> Key Strengths
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {matchResult.explanation?.key_strengths?.map((str, idx) => (
                    <li key={idx} style={{ lineHeight: 1.5 }}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Resume Tailoring Tips */}
              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>
                  <BookOpen size={16} /> Candidate Optimization Tips
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {matchResult.explanation?.tailoring_recommendations?.map((tip, idx) => (
                    <li key={idx} style={{ lineHeight: 1.5 }}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Recruiter Probing Questions */}
              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>
                  <HelpCircle size={16} /> Recruiter Interview Probing
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {matchResult.explanation?.recruiter_interview_questions?.map((q, idx) => (
                    <li key={idx} style={{ lineHeight: 1.5 }}>{q}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
