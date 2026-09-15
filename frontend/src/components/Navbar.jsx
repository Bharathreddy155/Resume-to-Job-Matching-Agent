import React from 'react';
import { Sparkles, Users, UserCheck, Key, Zap, CheckCircle2, Mic } from 'lucide-react';

export default function Navbar({
  activeMode,
  setActiveMode,
  sampleJobs,
  selectedJobId,
  onSelectJob,
  onOpenKeyModal,
  onOpenPitchModal,
  hasApiKey
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(8, 12, 21, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#fff'
              }}>
                MatchPulse <span className="gradient-text">AI</span>
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px', fontWeight: 700 }}>
                Agentic v1.0
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Intelligent Semantic Resume-to-Job Hiring Engine
            </div>
          </div>
        </div>

        {/* Persona Mode Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(14, 21, 38, 0.95)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          <button
            onClick={() => setActiveMode('candidate')}
            className={`tab-pill ${activeMode === 'candidate' ? 'active' : ''}`}
          >
            <UserCheck size={16} />
            <span>Candidate Match</span>
          </button>
          <button
            onClick={() => setActiveMode('recruiter')}
            className={`tab-pill ${activeMode === 'recruiter' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Recruiter Leaderboard</span>
          </button>
        </div>

        {/* Demo Roles, Key, & Pitch Assistant */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Preset Demo Job Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} color="var(--accent-amber)" /> Role:
            </span>
            <select
              value={selectedJobId}
              onChange={(e) => onSelectJob(e.target.value)}
              style={{
                background: 'rgba(14, 21, 38, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {sampleJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* 3-Minute Pitch Guide Button */}
          <button
            onClick={onOpenPitchModal}
            className="secondary-btn"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.5)',
              background: 'rgba(245, 158, 11, 0.1)',
              color: '#fde68a',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
            title="Open 3-minute hackathon pitch script & live cues"
          >
            <Mic size={14} color="#fbbf24" />
            <span>3-Min Pitch Guide</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenKeyModal}
            className="secondary-btn"
            style={{
              borderColor: hasApiKey ? 'var(--accent-emerald)' : 'var(--border-subtle)',
              fontSize: '0.8rem'
            }}
          >
            <Key size={14} color={hasApiKey ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
            <span>{hasApiKey ? 'Gemini AI Active' : 'Offline / API Key'}</span>
            {hasApiKey && <CheckCircle2 size={12} color="var(--accent-emerald)" />}
          </button>
        </div>
      </div>
    </header>
  );
}
