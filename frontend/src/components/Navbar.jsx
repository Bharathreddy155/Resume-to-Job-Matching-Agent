import React from 'react';
import { Sparkles, Users, UserCheck, Key, Zap, CheckCircle2 } from 'lucide-react';

export default function Navbar({
  activeMode,
  setActiveMode,
  sampleJobs,
  selectedJobId,
  onSelectJob,
  onOpenKeyModal,
  hasApiKey
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
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
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#fff'
              }}>
                MatchPulse <span className="gradient-text">AI</span>
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Agentic v1.0
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Intelligent Resume-to-Job Matching Engine
            </div>
          </div>
        </div>

        {/* Persona Mode Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
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

        {/* Demo Roles & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Preset Demo Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} color="var(--accent-amber)" /> Demo Role:
            </span>
            <select
              value={selectedJobId}
              onChange={(e) => onSelectJob(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
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
