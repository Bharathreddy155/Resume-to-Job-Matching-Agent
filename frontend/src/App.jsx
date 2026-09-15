import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CandidateView from './components/CandidateView';
import RecruiterView from './components/RecruiterView';
import CustomRoleModal from './components/CustomRoleModal';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [activeMode, setActiveMode] = useState('candidate'); // 'candidate' | 'recruiter'
  const [sampleJobs, setSampleJobs] = useState([]);
  const [sampleResumes, setSampleResumes] = useState([]);
  const [customRoles, setCustomRoles] = useState(() => {
    try {
      const saved = localStorage.getItem('matchpulse_custom_roles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Candidate Match States
  const [matchLoading, setMatchLoading] = useState(false);
  const [candidateMatchResult, setCandidateMatchResult] = useState(null);

  // Recruiter Batch States
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  // Combined list of roles: custom roles first, then sample jobs
  const allRoles = [...customRoles, ...sampleJobs];

  // Initial load of sample data from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/sample-data`)
      .then(res => res.json())
      .then(data => {
        if (data.jobs && data.jobs.length > 0) {
          setSampleJobs(data.jobs);
          setSampleResumes(data.resumes || []);

          // If no role selected yet
          const initialJob = customRoles.length > 0 ? customRoles[0] : data.jobs[0];
          setSelectedJobId(initialJob.id);
          setJobDescription(initialJob.description);

          // Proactively run an initial match for Alex Chen
          if (data.resumes && data.resumes.length > 0) {
            handleMatchSingle({
              resume_text: data.resumes[0].text,
              job_description: initialJob.description,
              candidate_name: data.resumes[0].name
            });
          }
        }
      })
      .catch(err => console.error("Could not fetch sample data:", err));
  }, []);

  // When demo or custom role changes
  const handleSelectJob = (jobId) => {
    setSelectedJobId(jobId);
    const job = allRoles.find(j => j.id === jobId);
    if (job) {
      setJobDescription(job.description);
    }
  };

  // Add custom role
  const handleAddCustomRole = (newRole) => {
    const updated = [newRole, ...customRoles];
    setCustomRoles(updated);
    try {
      localStorage.setItem('matchpulse_custom_roles', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not persist custom roles to localStorage:", e);
    }
    setSelectedJobId(newRole.id);
    setJobDescription(newRole.description);
  };

  // Delete custom role
  const handleDeleteCustomRole = (roleId) => {
    const updated = customRoles.filter(r => r.id !== roleId);
    setCustomRoles(updated);
    try {
      localStorage.setItem('matchpulse_custom_roles', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not delete custom role from localStorage:", e);
    }
    if (selectedJobId === roleId) {
      const fallback = updated.length > 0 ? updated[0] : (sampleJobs[0] || null);
      if (fallback) {
        setSelectedJobId(fallback.id);
        setJobDescription(fallback.description);
      }
    }
  };

  // Run single match (Candidate View)
  const handleMatchSingle = async (payload) => {
    setMatchLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/match-single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setCandidateMatchResult(data);
      return data;
    } catch (err) {
      console.error('Match failed:', err);
    } finally {
      setMatchLoading(false);
    }
  };

  // Run batch match (Recruiter View)
  const handleMatchBatch = async (payload) => {
    setBatchLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/match-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setBatchResults(data);
      return data;
    } catch (err) {
      console.error('Batch match failed:', err);
    } finally {
      setBatchLoading(false);
    }
  };

  const targetJob = allRoles.find(j => j.id === selectedJobId) || allRoles[0] || {
    title: 'Software Engineer',
    company: 'Nexus Innovations',
    department: 'Engineering',
    description: jobDescription
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        roles={allRoles}
        selectedJobId={selectedJobId}
        onSelectJob={handleSelectJob}
        onOpenCustomRoleModal={() => setIsCustomModalOpen(true)}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {activeMode === 'candidate' ? (
          <CandidateView
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            sampleResumes={sampleResumes}
            targetJob={targetJob}
            onMatchSingle={handleMatchSingle}
            matchLoading={matchLoading}
            matchResult={candidateMatchResult}
          />
        ) : (
          <RecruiterView
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            sampleResumes={sampleResumes}
            targetJob={targetJob}
            onMatchBatch={handleMatchBatch}
            batchLoading={batchLoading}
            batchResults={batchResults}
          />
        )}
      </main>

      {/* Custom Role Creation & Management Modal */}
      <CustomRoleModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        customRoles={customRoles}
        onAddRole={handleAddCustomRole}
        onDeleteRole={handleDeleteCustomRole}
        onSelectRole={handleSelectJob}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: '#ffffff',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        boxShadow: '0 -1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            MatchPulse AI • Next-Generation Semantic Resume-to-Job Matching System
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>50% Skills</span>
            <span>•</span>
            <span>25% Experience</span>
            <span>•</span>
            <span>15% Domain</span>
            <span>•</span>
            <span>10% Education</span>
            <span>•</span>
            <button
              onClick={() => setIsCustomModalOpen(true)}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              + Add Custom Role
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
