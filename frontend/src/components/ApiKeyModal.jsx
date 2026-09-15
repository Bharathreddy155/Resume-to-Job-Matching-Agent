import React, { useState } from 'react';
import { Key, ShieldCheck, X, Sparkles } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveKey }) {
  const [inputVal, setInputVal] = useState(apiKey || '');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputVal.trim());
    onClose();
  };

  const handleClear = () => {
    setInputVal('');
    onSaveKey('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '28px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>LLM Provider Settings</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure reasoning & explanation engines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>
            Google Gemini API Key (Optional)
          </label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px', lineHeight: 1.4 }}>
            Leave blank to use the built-in <strong>Deterministic Offline Semantic Engine</strong>. If provided, Gemini 2.5 Flash will power live qualitative recruitment commentary and tailored interview queries.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '14px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <ShieldCheck size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: '#fff' }}>100% Privacy & Resilience:</strong> Your keys and resume contents are processed securely in memory and never shared or logged.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {apiKey && (
            <button onClick={handleClear} className="secondary-btn" style={{ color: 'var(--accent-rose)' }}>
              Clear Key
            </button>
          )}
          <button onClick={onClose} className="secondary-btn">
            Cancel
          </button>
          <button onClick={handleSave} className="gradient-btn">
            <Sparkles size={16} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
