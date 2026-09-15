import sqlite3
from pathlib import Path
from typing import List, Dict, Any, Optional
from sample_data import SAMPLE_RESUMES

DB_PATH = Path(__file__).parent / "data" / "resumes.db"

def get_db_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create tables and seed initial sample resumes if empty."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS resumes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                headline TEXT,
                target_job_id TEXT,
                text TEXT NOT NULL,
                filename TEXT,
                is_sample INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

        # Check if database is empty; if so, seed sample resumes
        cursor.execute("SELECT COUNT(*) FROM resumes")
        count = cursor.fetchone()[0]
        if count == 0:
            for r in SAMPLE_RESUMES:
                cursor.execute("""
                    INSERT INTO resumes (id, name, headline, target_job_id, text, filename, is_sample)
                    VALUES (?, ?, ?, ?, ?, ?, 1)
                """, (
                    r.get("id"),
                    r.get("name"),
                    r.get("headline", ""),
                    r.get("target_job_id", ""),
                    r.get("text"),
                    r.get("name") + ".pdf"
                ))
            conn.commit()

def get_all_resumes() -> List[Dict[str, Any]]:
    """Retrieve all resumes, prioritizing user uploads first, then preloaded samples."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, headline, target_job_id, text, filename, is_sample, created_at
            FROM resumes
            ORDER BY is_sample ASC, created_at DESC
        """)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def save_resume(
    resume_id: str,
    name: str,
    text: str,
    filename: Optional[str] = None,
    headline: str = "",
    target_job_id: str = "",
    is_sample: bool = False
) -> Dict[str, Any]:
    """Insert or update a resume into SQLite database."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO resumes (id, name, headline, target_job_id, text, filename, is_sample)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            resume_id,
            name,
            headline,
            target_job_id,
            text,
            filename or (name + ".pdf"),
            1 if is_sample else 0
        ))
        conn.commit()

    return {
        "id": resume_id,
        "name": name,
        "headline": headline,
        "target_job_id": target_job_id,
        "text": text,
        "filename": filename or (name + ".pdf"),
        "is_sample": 1 if is_sample else 0
    }

def delete_resume(resume_id: str) -> bool:
    """Delete a resume by ID."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM resumes WHERE id = ?", (resume_id,))
        conn.commit()
        return cursor.rowcount > 0
