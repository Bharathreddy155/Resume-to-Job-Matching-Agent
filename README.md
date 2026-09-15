# ⚡ MatchPulse AI: Intelligent Resume-to-Job Matching Agent

> **Next-Generation Semantic Hiring Engine**: An intelligent agentic AI platform that analyzes candidate resumes against job specifications, bridges semantic skill equivalence, calculates multi-factor compatibility scores, pinpoints critical gaps, and provides transparent qualitative explanations.

---

## 🎯 The Problem

Traditional Applicant Tracking Systems (ATS) rely on brittle, exact-keyword matching. 
- A candidate skilled in **PostgreSQL** is wrongly penalized because the job post asked for **"Relational Databases"** or **"SQL"**.
- A developer who built production services with **FastAPI** is overlooked because the recruiter filtered for **"RESTful Microservices"**.
- Qualified talent is rejected, recruiters spend hours manually sifting through text, and candidates receive zero actionable feedback on how to improve.

## 💡 The Solution: MatchPulse AI

MatchPulse AI bridges this gap using an agentic, multi-layered matching engine:
1. **Multi-Format Ingestion**: Parses `.pdf`, `.docx`, and raw text resumes with automated entity extraction.
2. **Semantic Skill Ontology**: Maps synonyms, canonical clusters, and inter-technology relationships across Backend, Frontend, Cloud/DevOps, AI/ML, and Data Science.
3. **Multi-Factor Weighted Scoring Engine**:
   - 🎯 **Skill Alignment (50%)**: Direct matches + semantic bridges.
   - ⏳ **Experience Alignment (25%)**: Detected career trajectory vs. required seniority.
   - 🌐 **Domain / Semantic Context (15%)**: TF-IDF & document-level semantic cosine similarity.
   - 🎓 **Education & Credentials (10%)**: Degree hierarchy alignment.
4. **Skill Gap Analysis**: Categorizes missing skills into **High-Priority Critical Gaps** vs. **Secondary Nice-to-Haves**, with actionable advice on how candidates can upskill or tailor their resume.
5. **Dual Persona Dashboard**:
   - **Candidate View**: 1-on-1 match dial, radar score breakdown, and personalized resume tailoring tips.
   - **Recruiter View**: Batch candidate ingestion, ranked leaderboard with gold/silver/bronze badges, score filtering, and full candidate audit drawers.
6. **Hybrid AI Engine**: Google Gemini 2.5 Flash for deep narrative reasoning, with a deterministic offline semantic engine fallback so evaluations never fail.

---

## 🏗️ Architecture

```
                                  MatchPulse AI
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
        [ Candidate Mode ]                            [ Recruiter Mode ]
       1-on-1 Deep Analysis                         Batch Ranked Leaderboard
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        │  REST API
                                        ▼
    +-----------------------------------------------------------------------+
    |                            FastAPI Backend                            |
    |  • Document Parsers (pypdf, python-docx, regex entity extractor)     |
    |  • Semantic Skill Taxonomy (skill_ontology.py)                        |
    |  • Multi-Factor Matcher & Scoring (matcher.py)                        |
    |  • AI Reasoner & Explainer (Google Gemini LLM + Offline Fallback)     |
    +-----------------------------------------------------------------------+
```

---

## 🚀 Quickstart Guide

### One-Click Launch (Recommended)
Clone the repository and launch both backend and frontend with a single command:

```bash
git clone https://github.com/Bharathreddy155/Resume-to-Job-Matching-Agent.git
cd Resume-to-Job-Matching-Agent
chmod +x start.sh
./start.sh
```

- **Web Dashboard**: [http://localhost:5173](http://localhost:5173)
- **FastAPI API & Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Manual Setup

#### 1. Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Automated Testing

Run the test suite to verify skill extraction, semantic matching, and composite scoring:
```bash
cd backend
./venv/bin/python test_matcher.py
```

Expected output:
```
Testing Ontology... ✓ Ontology lookups working correctly.
Testing Skill Extraction... ✓ Extracted 5 skills accurately.
Testing Matching and Scoring...
Alex Chen Score: 84.7 (Exceptional Match)
Brenda Smith Score: 57.9 (Moderate Match)
✓ Explanation generated via Deterministic Semantic Rules Engine (Offline Active)
All Backend Unit Tests Passed Successfully! 🎉
```

---

## 👥 Hackathon 2-Person Division of Responsibilities

| Role | Member | Primary Focus | Key Files & Ownership |
| :--- | :--- | :--- | :--- |
| **Backend & AI Engine Lead** | **Member 1 (You)** | Document parsing (PDF/DOCX), skill ontology, multi-factor scoring, Gemini AI reasoning, and API endpoints | `backend/parsers.py`, `backend/matcher.py`, `backend/skill_ontology.py`, `backend/ai_explainer.py`, `backend/main.py`, `start.sh` |
| **Frontend UI/UX & Pitch Lead** | **Member 2 (Teammate)** | Ultra-modern React/Vite dashboard, Candidate & Recruiter views, animated score dials, gap matrix visualizer, and 3-min hackathon pitch | `frontend/src/components/CandidateView.jsx`, `frontend/src/components/RecruiterView.jsx`, `frontend/src/components/ScoreDial.jsx`, `frontend/src/index.css` |

---

## 🔑 Environment Variables (Optional)

The application works 100% out of the box with zero configuration using the built-in offline semantic rules engine. 

To enable live Google Gemini reasoning, create a `.env` file in the root or `backend/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
Or enter it directly in the UI via the **Offline / API Key** button in the top navigation bar.

---

## 📜 License
MIT License. Built for the Hackathon.
