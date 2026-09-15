import React, { useState } from 'react';
import { X, Plus, Sparkles, Trash2, Briefcase, FileText, Check } from 'lucide-react';

const SAMPLE_TEMPLATE = `About the Role:
We are seeking a talented and proactive engineer to join our high-impact team. You will design, build, and maintain mission-critical systems and collaborate across cross-functional teams.

Responsibilities:
- Architect and develop scalable, robust software solutions.
- Collaborate with product managers and designers to translate requirements into technical reality.
- Write clean, maintainable, and well-tested code.
- Participate in code reviews, architectural discussions, and agile planning.

Requirements & Qualifications (Must Have):
- 3+ years of professional software engineering experience.
- Proficiency in modern programming languages (e.g., Python, TypeScript, Go, or Java).
- Hands-on experience with modern web frameworks or backend architectures.
- Experience with relational or NoSQL databases (e.g., PostgreSQL, MongoDB, Redis).
- Familiarity with containerization (Docker) and version control (Git).

Nice to Have / Preferred:
- Experience with cloud providers (AWS, GCP, or Azure).
- Familiarity with CI/CD automation pipelines.
- Understanding of microservices and distributed systems.`;

export default function CustomRoleModal({
  isOpen,
  onClose,
  customRoles,
  onAddRole,
  onDeleteRole,
  onSelectRole
}) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('Remote');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFillTemplate = () => {
    if (!title.trim()) {
      setTitle('Custom AI Systems Engineer');
    }
    if (!company.trim()) {
      setCompany('Innovate Tech Labs');
    }
    if (!department.trim()) {
      setDepartment('Core Engineering');
    }
    setDescription(SAMPLE_TEMPLATE);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a Role Title');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a Job Description');
      return;
    }

    const newRole = {
      id: `custom_role_${Date.now()}`,
      title: title.trim(),
      company: company.trim() || 'Custom Enterprise',
      department: department.trim() || 'Engineering',
      location: location.trim() || 'Remote',
      description: description.trim(),
      isCustom: true
    };

    onAddRole(newRole);
    // Reset form
    setTitle('');
    setCompany('');
    setDepartment('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#e0e7ff',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Briefcase size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Add Custom Job Role
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Create your own target role to match candidates and test any job requirement.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Existing Custom Roles List (if any) */}
        {customRoles && customRoles.length > 0 && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '12px 16px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Custom Roles ({customRoles.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {customRoles.map(cr => (
                <div key={cr.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{cr.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cr.company} • {cr.department}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => { onSelectRole(cr.id); onClose(); }}
                      className="secondary-btn"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                    >
                      Use Role
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteRole(cr.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-rose)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Delete role"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                Role Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Rust Systems Architect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#ffffff',
                  color: 'var(--text-main)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Horizon Robotics"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#ffffff',
                  color: 'var(--text-main)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                Department
              </label>
              <input
                type="text"
                placeholder="e.g. Core Infrastructure"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#ffffff',
                  color: 'var(--text-main)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Remote / Seattle"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#ffffff',
                  color: 'var(--text-main)'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Job Description & Skill Requirements *
              </label>
              <button
                type="button"
                onClick={handleFillTemplate}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={13} />
                Load Sample Template
              </button>
            </div>
            <textarea
              rows={9}
              placeholder="Paste full job description with Responsibilities, Must Have Skills, and Requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.84rem',
                lineHeight: '1.5',
                outline: 'none',
                fontFamily: 'monospace',
                background: '#ffffff',
                color: 'var(--text-main)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              className="secondary-btn"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Check size={16} />
              Save & Apply Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
