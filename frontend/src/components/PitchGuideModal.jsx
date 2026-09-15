import React, { useState } from 'react';
import {
  Mic,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Zap,
  Target
} from 'lucide-react';

export default function PitchGuideModal({
  isOpen,
  onClose,
  onSelectCandidateMode,
  onSelectRecruiterMode,
  onTriggerCandidateDemo,
  onTriggerRecruiterDemo
}) {
  const [activeSegment, setActiveSegment] = useState(0);

  if (!isOpen) return null;

  const pitchSegments = [
    {
      time: '0:00 – 0:30',
      title: 'The Hook: Traditional ATS Fails',
      tag: 'Problem',
      tagColor: 'rose',
      talkingPoints: [
        '“Traditional Applicant Tracking Systems (ATS) rely on brittle, exact-keyword matching.”',
        '“If a job asks for ‘Relational Databases (SQL)’ and a rockstar developer writes ‘PostgreSQL’, traditional software gives them a 0 score and silently filters them out.”',
        '“Qualified talent is unfairly rejected, and recruiters spend 30+ hours a week sifting through resumes manually.”'
      ],
      demoCue: 'Keep the app on Candidate Mode. Point out the title and explain how keyword-based ATS creates false negatives.'
    },
    {
      time: '0:30 – 1:15',
      title: 'The Solution: Semantic Graph & Multi-Factor Scoring',
      tag: 'Architecture',
      tagColor: 'cyan',
      talkingPoints: [
        '“Meet MatchPulse AI: an intelligent semantic hiring agent that understands tech relationships rather than just keyword counting.”',
        '“Our engine evaluates candidates across 4 distinct dimensions: 50% Skill Fit with semantic bridging, 25% Career Experience tenure, 15% Domain context, and 10% Credentials.”',
        '“Best of all: it is explainable. It highlights exact matches, verified semantic bridges, and gives actionable upskilling roadmaps for critical gaps.”'
      ],
      demoCue: 'Highlight the multi-factor scoring formula (50% Skills / 25% Exp / 15% Domain / 10% Edu) and hybrid AI fallback.'
    },
    {
      time: '1:15 – 2:30',
      title: 'Live Demo: Candidate Dial & Recruiter Leaderboard',
      tag: 'Live Demo',
      tagColor: 'emerald',
      talkingPoints: [
        '“Watch this in action: In Candidate View, Alex Chen has PostgreSQL and FastAPI. Watch how MatchPulse bridges them into Relational Databases and RESTful Microservices with an 85% equivalence score!”',
        '“Notice the glowing score dial: 88% Strong Fit, zero critical gaps, plus customized resume tailoring recommendations.”',
        '“Now switch to Recruiter Mode: recruiters can drag-and-drop 50+ resumes at once. Within seconds, it produces a ranked leaderboard with gold, silver, and bronze badges.”',
        '“Clicking ‘Full Audit’ opens a deep audit drawer with auditable reasoning and custom interview probing questions ready for the hiring manager.”'
      ],
      demoCue: 'Run Candidate Match for Alex Chen, then switch to Recruiter Mode and open the Full Audit modal for the #1 ranked candidate.'
    },
    {
      time: '2:30 – 3:00',
      title: 'The Impact: 70% Time Saved & Zero Bias',
      tag: 'Impact & Close',
      tagColor: 'amber',
      talkingPoints: [
        '“MatchPulse AI saves over 70% of recruiter manual screening time while expanding the talent pipeline by 40%.”',
        '“It eliminates keyword gaming and unconscious bias by providing auditable, deterministic criteria alongside Gemini 2.5 Flash qualitative explanations.”',
        '“Thank you! We’re ready for questions.”'
      ],
      demoCue: 'End with the ranked leaderboard view visible, showing the gold medal candidate and export shortlist button.'
    }
  ];

  const current = pitchSegments[activeSegment];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '820px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '30px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-indigo)'
            }}>
              <Mic size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>3-Minute Hackathon Demo & Pitch Teleprompter</h3>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Member 2 Ownership</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Step-by-step speaker script, timestamps, and live click cues
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Timeline Navigator */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
          {pitchSegments.map((seg, idx) => {
            const isActive = activeSegment === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveSegment(idx)}
                className="glass-panel"
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                  background: isActive ? '#eef2ff' : '#f8fafc',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: isActive ? 'var(--accent-indigo)' : 'var(--text-dim)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {seg.time}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isActive ? 'var(--accent-indigo)' : 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {seg.title.split(':')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Segment Detail Card */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '22px', borderLeft: `4px solid var(--accent-${current.tagColor})`, background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className={`badge badge-${current.tagColor}`} style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                {current.time} • {current.tag}
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-main)' }}>{current.title}</h4>
            </div>
          </div>

          {/* Talking Points */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              🎙️ Exact Script & Talking Points:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {current.talkingPoints.map((pt, i) => (
                <div key={i} style={{ padding: '12px 14px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '3px solid var(--accent-indigo)', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, boxShadow: 'var(--shadow-sm)' }}>
                  {pt}
                </div>
              ))}
            </div>
          </div>

          {/* Screen Cue */}
          <div style={{ padding: '12px 16px', background: '#f5f3ff', borderRadius: '8px', border: '1px dashed #c7d2fe', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            🎬 <strong style={{ color: 'var(--accent-indigo)' }}>Live Screen Action:</strong> {current.demoCue}
          </div>
        </div>

        {/* Demo Fast-Switch Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                onSelectCandidateMode();
                onClose();
              }}
              className="secondary-btn"
              style={{ fontSize: '0.8rem' }}
            >
              Go to Candidate Mode
            </button>
            <button
              onClick={() => {
                onSelectRecruiterMode();
                onClose();
              }}
              className="secondary-btn"
              style={{ fontSize: '0.8rem' }}
            >
              Go to Recruiter Mode
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {activeSegment > 0 && (
              <button onClick={() => setActiveSegment(activeSegment - 1)} className="secondary-btn" style={{ fontSize: '0.8rem' }}>
                Previous Segment
              </button>
            )}
            {activeSegment < pitchSegments.length - 1 ? (
              <button onClick={() => setActiveSegment(activeSegment + 1)} className="gradient-btn" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                Next ({pitchSegments[activeSegment + 1].time})
              </button>
            ) : (
              <button onClick={onClose} className="gradient-btn" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                Ready to Win! 🚀
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
