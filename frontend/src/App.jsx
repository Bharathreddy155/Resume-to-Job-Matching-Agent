import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CandidateView from './components/CandidateView';
import RecruiterView from './components/RecruiterView';
import CustomRoleModal from './components/CustomRoleModal';

const API_BASE = 'http://localhost:8000';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("MatchPulse ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '640px', margin: '60px auto', padding: '36px', textAlign: 'center' }} className="glass-card">
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            fontSize: '1.5rem',
            fontWeight: 800
          }}>
            !
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            Encountered Display Issue
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px', lineHeight: 1.5 }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering the view.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="primary-btn"
            style={{ margin: '0 auto' }}
          >
            Refresh & Recover
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeMode, setActiveMode] = useState('candidate'); // 'candidate' | 'recruiter'
  const [sampleJobs, setSampleJobs] = useState([]);
  const [allResumes, setAllResumes] = useState([]);
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

  // Initial load of sample data and database resumes from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/sample-data`)
      .then(res => res.json())
      .then(data => {
        if (data.jobs && data.jobs.length > 0) {
          setSampleJobs(data.jobs);
          const initialJob = customRoles.length > 0 ? customRoles[0] : data.jobs[0];
          setSelectedJobId(initialJob.id);
          setJobDescription(initialJob.description);

          const resumes = data.resumes || [];
          setAllResumes(resumes);

          // Proactively run initial matches for both Candidate View and Recruiter Leaderboard
          if (resumes.length > 0) {
            handleMatchSingle({
              resume_text: resumes[0].text,
              job_description: initialJob.description,
              candidate_name: resumes[0].name
            });

            handleMatchBatch({
              job_description: initialJob.description,
              candidates: resumes
            });
          }
        }
      })
      .catch(err => console.error("Could not fetch initial data from backend:", err));
  }, []);

  // When demo or custom role changes
  const handleSelectJob = (jobId) => {
    setSelectedJobId(jobId);
    const job = allRoles.find(j => j.id === jobId);
    if (job) {
      setJobDescription(job.description);
      // Re-run batch match for new target role
      if (allResumes.length > 0) {
        handleMatchBatch({
          job_description: job.description,
          candidates: allResumes
        });
      }
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

    if (allResumes.length > 0) {
      handleMatchBatch({
        job_description: newRole.description,
        candidates: allResumes
      });
    }
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

  // Upload and persist resume into SQLite database
  const handleUploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/api/upload-resume`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to parse resume');
    }

    if (data.resume && data.resume.text && data.resume.text.trim()) {
      const updatedList = [data.resume, ...allResumes.filter(r => r.id !== data.resume.id)];
      setAllResumes(updatedList);
      
      // Auto-trigger single match with current job description
      handleMatchSingle({
        resume_text: data.resume.text,
        job_description: jobDescription,
        candidate_name: data.resume.name
      });

      // Auto-trigger batch match with updated candidates pool!
      handleMatchBatch({
        job_description: jobDescription,
        candidates: updatedList
      });
    }

    return data;
  };

  // Delete resume from database
  const handleDeleteResume = async (resumeId) => {
    try {
      await fetch(`${API_BASE}/api/resumes/${resumeId}`, {
        method: 'DELETE'
      });
      setAllResumes(prev => prev.filter(r => r.id !== resumeId));
    } catch (err) {
      console.error("Could not delete resume:", err);
    }
  };

  // Run single match (Candidate View) with robust error checks
  const handleMatchSingle = async (payload) => {
    if (!payload?.resume_text || !payload.resume_text.trim()) {
      console.warn("Skipping match: empty resume text");
      return null;
    }
    setMatchLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/match-single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.match_result) {
        console.error('Match failed:', data);
        return null;
      }
      setCandidateMatchResult(data);
      return data;
    } catch (err) {
      console.error('Match failed:', err);
      return null;
    } finally {
      setMatchLoading(false);
    }
  };

  // Run batch match (Recruiter View)
  const handleMatchBatch = async (payload) => {
    if (!payload?.candidates || payload.candidates.length === 0 || !payload.job_description) {
      return null;
    }
    setBatchLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/match-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data || !Array.isArray(data.candidates)) {
        console.error('Batch match failed:', data);
        setBatchResults(null);
        return null;
      }
      setBatchResults(data);
      return data;
    } catch (err) {
      console.error('Batch match network failed:', err);
      setBatchResults(null);
      return null;
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
        <ErrorBoundary>
          {activeMode === 'candidate' ? (
            <CandidateView
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              resumes={allResumes}
              targetJob={targetJob}
              onMatchSingle={handleMatchSingle}
              onUploadResume={handleUploadResume}
              onDeleteResume={handleDeleteResume}
              matchLoading={matchLoading}
              matchResult={candidateMatchResult}
            />
          ) : (
            <RecruiterView
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              resumes={allResumes}
              targetJob={targetJob}
              onMatchBatch={handleMatchBatch}
              onUploadResume={handleUploadResume}
              onDeleteResume={handleDeleteResume}
              batchLoading={batchLoading}
              batchResults={batchResults}
            />
          )}
        </ErrorBoundary>
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
            MatchPulse AI • Next-Generation Semantic Resume-to-Job Matching System • SQLite Persistent Database
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
