import React from 'react';
import { Sparkles, Users, UserCheck, Zap, Plus } from 'lucide-react';

export default function Navbar({
  activeMode,
  setActiveMode,
  roles = [],
  selectedJobId,
  onSelectJob,
  onOpenCustomRoleModal
}) {
  const handleDropdownChange = (e) => {
    const val = e.target.value;
    if (val === '__custom_new__') {
      onOpenCustomRoleModal();
    } else {
      onSelectJob(val);
    }
  };

  const standardRoles = roles.filter(r => !r.isCustom);
  const customRoles = roles.filter(r => r.isCustom);

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
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
        {/* Brand with Pure Blue App Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: 'var(--text-main)'
              }}>
                MatchPulse <span className="gradient-text">AI</span>
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px', fontWeight: 700 }}>
                Agentic v1.0
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Intelligent Semantic Resume-to-Job Matching System
            </div>
          </div>
        </div>

        {/* Persona Mode Switcher */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
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

        {/* Role Selector & Custom Role Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <Zap size={14} color="var(--accent-amber)" /> Target Role:
          </span>

          <select
            value={selectedJobId}
            onChange={handleDropdownChange}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              maxWidth: '300px'
            }}
          >
            {customRoles.length > 0 && (
              <optgroup label="🌟 Custom User Roles">
                {customRoles.map((j) => (
                  <option key={j.id} value={j.id}>
                    ★ {j.title} ({j.company})
                  </option>
                ))}
              </optgroup>
            )}

            <optgroup label="💼 Pre-loaded Engineering Roles (18)">
              {standardRoles.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </optgroup>

            <option value="__custom_new__" style={{ fontWeight: 700, color: '#2563eb' }}>
              ➕ + Add Custom Role...
            </option>
          </select>

          {/* Dedicated + Custom Role Button in Blue */}
          <button
            type="button"
            onClick={onOpenCustomRoleModal}
            className="secondary-btn"
            style={{
              padding: '7px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderColor: '#bfdbfe',
              background: '#eff6ff',
              color: '#1d4ed8'
            }}
            title="Create your own custom job role and requirements"
          >
            <Plus size={14} />
            <span>Custom Role</span>
          </button>
        </div>
      </div>
    </header>
  );
}
