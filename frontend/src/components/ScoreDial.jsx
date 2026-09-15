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
      stop1: '#34d399',
      stop2: '#059669',
      glow: 'rgba(16, 185, 129, 0.45)',
      text: '#34d399',
      halo: 'rgba(16, 185, 129, 0.15)'
    },
    cyan: {
      stop1: '#38bdf8',
      stop2: '#0284c7',
      glow: 'rgba(6, 182, 212, 0.45)',
      text: '#38bdf8',
      halo: 'rgba(6, 182, 212, 0.15)'
    },
    amber: {
      stop1: '#fbbf24',
      stop2: '#d97706',
      glow: 'rgba(245, 158, 11, 0.45)',
      text: '#fbbf24',
      halo: 'rgba(245, 158, 11, 0.15)'
    },
    rose: {
      stop1: '#fb7185',
      stop2: '#e11d48',
      glow: 'rgba(244, 63, 94, 0.45)',
      text: '#fb7185',
      halo: 'rgba(244, 63, 94, 0.15)'
    },
  };

  const theme = colorMap[color] || colorMap.cyan;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: size, height: size }}>
      {/* Ambient Pulsing Halo */}
      <div style={{
        position: 'absolute',
        inset: '10%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.halo} 0%, transparent 70%)`,
        filter: 'blur(12px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible', zIndex: 1 }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.stop1} />
            <stop offset="100%" stopColor={theme.stop2} />
          </linearGradient>
          <filter id={`glow_${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle guide ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth * 0.65}
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="transparent"
        />

        {/* Track background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
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
            filter: `drop-shadow(0 0 12px ${theme.glow})`
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
          color: '#ffffff',
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
          letterSpacing: '0.08em',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '2px 8px',
          borderRadius: '999px',
          border: `1px solid ${theme.glow}`
        }}>
          {tier || 'Score'}
        </div>
      </div>
    </div>
  );
}
