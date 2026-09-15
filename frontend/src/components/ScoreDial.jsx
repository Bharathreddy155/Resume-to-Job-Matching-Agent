import React from 'react';

export default function ScoreDial({ score, tier, color = "cyan", size = 160 }) {
  const strokeWidth = Math.max(size * 0.08, 10);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Score is 0-100
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Gradient ID unique to size and color
  const gradId = `scoreGrad_${color}_${size}`;

  const colorMap = {
    emerald: {
      stop1: '#10b981',
      stop2: '#059669',
      glow: 'rgba(5, 150, 105, 0.25)',
      text: '#047857',
      bg: '#ecfdf5',
      border: '#a7f3d0'
    },
    cyan: {
      stop1: '#0284c7',
      stop2: '#0369a1',
      glow: 'rgba(2, 132, 199, 0.25)',
      text: '#0369a1',
      bg: '#f0fdfa',
      border: '#99f6e4'
    },
    amber: {
      stop1: '#f59e0b',
      stop2: '#d97706',
      glow: 'rgba(217, 119, 6, 0.25)',
      text: '#b45309',
      bg: '#fffbeb',
      border: '#fde68a'
    },
    rose: {
      stop1: '#f43f5e',
      stop2: '#e11d48',
      glow: 'rgba(225, 29, 72, 0.25)',
      text: '#be123c',
      bg: '#fff1f2',
      border: '#fecdd3'
    },
  };

  const theme = colorMap[color] || colorMap.cyan;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible', zIndex: 1 }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.stop1} />
            <stop offset="100%" stopColor={theme.stop2} />
          </linearGradient>
        </defs>

        {/* Outer subtle guide ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth * 0.65}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="transparent"
        />

        {/* Track background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated fill arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: `drop-shadow(0 2px 6px ${theme.glow})`
          }}
        />
      </svg>

      {/* Center Display */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: size > 130 ? '2.5rem' : '1.75rem',
          fontWeight: 900,
          lineHeight: 1,
          color: 'var(--text-main)',
          letterSpacing: '-0.03em'
        }}>
          {score}
          <span style={{ fontSize: size > 130 ? '1.1rem' : '0.85rem', color: theme.text, fontWeight: 700, marginLeft: '1px' }}>%</span>
        </div>
        <div style={{
          fontSize: size > 130 ? '0.74rem' : '0.62rem',
          color: theme.text,
          fontWeight: 700,
          marginTop: '3px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          background: theme.bg,
          padding: '2px 8px',
          borderRadius: '999px',
          border: `1px solid ${theme.border}`
        }}>
          {tier || 'Score'}
        </div>
      </div>
    </div>
  );
}
