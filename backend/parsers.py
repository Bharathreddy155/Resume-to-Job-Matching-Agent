import re
import io
from typing import Dict, Any, Optional
from pypdf import PdfReader
from docx import Document

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract clean text from PDF bytes."""
    reader = PdfReader(io.BytesIO(file_bytes))
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)
    return "\n".join(text_parts).strip()

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract clean text from DOCX bytes."""
    doc = Document(io.BytesIO(file_bytes))
    text_parts = []
    for para in doc.paragraphs:
        if para.text.strip():
            text_parts.append(para.text.strip())
    for table in doc.tables:
        for row in table.rows:
            row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_text:
                text_parts.append(" | ".join(row_text))
    return "\n".join(text_parts).strip()

def extract_candidate_metadata(text: str, filename: Optional[str] = None) -> Dict[str, Any]:
    """Extract candidate name, email, phone, and estimated years of experience from text."""
    # Email detection
    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    email = email_match.group(0) if email_match else None

    # Phone detection (international/US/India formats)
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else None

    # Candidate Name estimation
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    candidate_name = "Candidate"
    if lines:
        first_line = lines[0]
        # Check if first line resembles a name (2 to 4 words, alphabetic)
        if len(first_line.split()) in [2, 3, 4] and not re.search(r'resume|curriculum|cv|summary|contact', first_line, re.IGNORECASE):
            candidate_name = first_line
        elif filename:
            # Fallback to filename (e.g. John_Doe_Resume.pdf -> John Doe)
            clean_fn = re.sub(r'(_resume|_cv|\.pdf|\.docx)$', '', filename, flags=re.IGNORECASE)
            clean_fn = clean_fn.replace("_", " ").replace("-", " ").title()
            if clean_fn.strip():
                candidate_name = clean_fn.strip()

    # Experience detection (e.g., "5+ years of experience", "2019 - Present", etc.)
    exp_years = 0.0
    exp_matches = re.findall(r'(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)', text, re.IGNORECASE)
    if exp_matches:
        try:
            exp_years = max([float(m) for m in exp_matches])
        except Exception:
            exp_years = 0.0
    else:
        # Check date spans (e.g., 2018 - 2023)
        year_ranges = re.findall(r'(20\d\d|19\d\d)\s*[-–—to]+\s*(20\d\d|present|current)', text, re.IGNORECASE)
        total_span = 0
        current_year = 2026
        for start_yr, end_yr in year_ranges:
            try:
                s = int(start_yr)
                e = current_year if end_yr.lower() in ['present', 'current'] else int(end_yr)
                if e >= s:
                    total_span += (e - s)
            except Exception:
                pass
        if total_span > 0:
            exp_years = min(total_span, 25)

    # Education detection
    education_levels = []
    if re.search(r'\b(ph\.?d|doctorate)\b', text, re.IGNORECASE):
        education_levels.append("PhD")
    if re.search(r'\b(master|m\.?s|m\.?tech|m\.?sc|mba)\b', text, re.IGNORECASE):
        education_levels.append("Master's")
    if re.search(r'\b(bachelor|b\.?s|b\.?tech|b\.?e|b\.?sc)\b', text, re.IGNORECASE):
        education_levels.append("Bachelor's")

    return {
        "name": candidate_name,
        "email": email or "Not detected",
        "phone": phone or "Not detected",
        "detected_experience_years": round(exp_years, 1),
        "education": education_levels[0] if education_levels else "Undergraduate / Degree Not Specified",
        "raw_text_length": len(text)
    }

def parse_document(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """Parse document based on filename extension."""
    fn_lower = filename.lower()
    if fn_lower.endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    elif fn_lower.endswith(".docx"):
        text = extract_text_from_docx(file_bytes)
    else:
        # Plain text
        text = file_bytes.decode("utf-8", errors="ignore")

    metadata = extract_candidate_metadata(text, filename)
    return {
        "filename": filename,
        "text": text,
        "metadata": metadata
    }
