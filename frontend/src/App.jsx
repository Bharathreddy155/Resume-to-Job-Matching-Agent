import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CandidateView from './components/CandidateView';
import RecruiterView from './components/RecruiterView';
import ApiKeyModal from './components/ApiKeyModal';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [activeMode, setActiveMode] = useState('candidate'); // 'candidate' | 'recruiter'
  const [sampleJobs, setSampleJobs] = useState([]);
  const [sampleResumes, setSampleResumes] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('matchpulse_gemini_key') || '');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Candidate Match States
  const [matchLoading, setMatchLoading] = useState(false);
  const [candidateMatchResult, setCandidateMatchResult] = useState(null);

  // Recruiter Batch States
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  // Initial load of sample data from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/sample-data`)
      .then(res => res.json())
      .then(data => {
        if (data.jobs && data.jobs.length > 0) {
          setSampleJobs(data.jobs);
          setSampleResumes(data.resumes || []);
          setSelectedJobId(data.jobs[0].id);
          setJobDescription(data.jobs[0].description);
        }
      })
      .catch(err => console.error("Could not fetch sample data:", err));
  }, []);

  // When demo role changes
  const handleSelectJob = (jobId) => {
    setSelectedJobId(jobId);
    const job = sampleJobs.find(j => j.id === jobId);
    if (job) {
      setJobDescription(job.description);
    }
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('matchpulse_gemini_key', newKey);
    } else {
      localStorage.removeItem('matchpulse_gemini_key');
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
      alert('Match failed. Ensure FastAPI server is running on port 8000.');
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
      alert('Batch match failed. Ensure FastAPI server is running on port 8000.');
    } finally {
      setBatchLoading(false);
    }
  };

  const targetJob = sampleJobs.find(j => j.id === selectedJobId) || sampleJobs[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        sampleJobs={sampleJobs}
        selectedJobId={selectedJobId}
        onSelectJob={handleSelectJob}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        hasApiKey={!!apiKey}
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
            apiKey={apiKey}
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
            apiKey={apiKey}
          />
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(9, 13, 22, 0.9)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            MatchPulse AI • Intelligent Resume-to-Job Matching System • Hackathon Project
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Multi-Factor Scoring</span>
            <span>•</span>
            <span>Semantic Ontology Mapping</span>
            <span>•</span>
            <span>Gemini AI Reasoner</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
