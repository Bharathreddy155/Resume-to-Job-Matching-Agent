import React from 'react';

export default function ScoreDial({ score, tier, color = "cyan", size = 160 }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Score is 0-100
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const colorMap = {
    emerald: { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', text: '#34d399' },
    cyan: { stroke: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', text: '#38bdf8' },
    amber: { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' },
    rose: { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', text: '#fb7185' },
  };

  const theme = colorMap[color] || colorMap.cyan;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated fill circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: `drop-shadow(0 0 10px ${theme.glow})`
          }}
        />
      </svg>
      {/* Center Label */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: size > 130 ? '2.4rem' : '1.8rem',
          fontWeight: 800,
          lineHeight: 1,
          color: '#fff'
        }}>
          {score}
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>%</span>
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: theme.text,
          fontWeight: 600,
          marginTop: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {tier || 'Score'}
        </div>
      </div>
    </div>
  );
}
