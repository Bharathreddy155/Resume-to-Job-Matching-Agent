import re
import io
from typing import Dict, Any, Optional, List
from pypdf import PdfReader
from docx import Document

# Industry standard certifications for enhanced candidate scoring
KNOWN_CERTIFICATIONS = [
    {"name": "AWS Certified Solutions Architect", "patterns": [r"aws\s+certified\s+solutions\s+architect", r"aws\s+csa"]},
    {"name": "AWS Certified Developer", "patterns": [r"aws\s+certified\s+developer"]},
    {"name": "CKA (Certified Kubernetes Administrator)", "patterns": [r"certified\s+kubernetes\s+administrator", r"\bcka\b"]},
    {"name": "CKAD (Certified Kubernetes Application Developer)", "patterns": [r"certified\s+kubernetes\s+application\s+developer", r"\bckad\b"]},
    {"name": "Google Cloud Professional Cloud Architect", "patterns": [r"google\s+cloud\s+(?:professional\s+)?cloud\s+architect", r"gcp\s+architect"]},
    {"name": "Microsoft Azure Solutions Architect", "patterns": [r"azure\s+solutions\s+architect", r"az-305", r"az-104"]},
    {"name": "CISSP (Certified Information Systems Security Professional)", "patterns": [r"\bcissp\b", r"certified\s+information\s+systems\s+security\s+professional"]},
    {"name": "PMP (Project Management Professional)", "patterns": [r"\bpmp\b", r"project\s+management\s+professional"]},
    {"name": "TensorFlow Developer Certificate", "patterns": [r"tensorflow\s+developer\s+certificate"]},
    {"name": "HashiCorp Certified Terraform Associate", "patterns": [r"terraform\s+associate", r"hashicorp\s+certified"]}
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract clean text from PDF bytes using pdfplumber with pypdf fallback."""
    text_parts = []

    # 1. Primary: pdfplumber (best for modern resumes, multi-columns, tables)
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                t = page.extract_text(layout=True) or page.extract_text()
                if t and t.strip():
                    text_parts.append(t.strip())
        extracted = "\n".join(text_parts).strip()
        if len(extracted) > 20:
            return extracted
    except Exception:
        pass

    # 2. Secondary fallback: pypdf
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception:
                pass
        pypdf_parts = []
        for page in reader.pages:
            try:
                page_text = page.extract_text(extraction_mode="layout") or page.extract_text()
            except Exception:
                page_text = page.extract_text()
            if page_text and page_text.strip():
                pypdf_parts.append(page_text.strip())
        extracted = "\n".join(pypdf_parts).strip()
        if len(extracted) > 20:
            return extracted
    except Exception:
        pass

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

def extract_certifications(text: str) -> List[str]:
    """Detect accredited certifications from resume text."""
    found = []
    text_lower = text.lower()
    for cert in KNOWN_CERTIFICATIONS:
        for pat in cert["patterns"]:
            if re.search(pat, text_lower):
                found.append(cert["name"])
                break
    return found

def extract_candidate_metadata(text: str, filename: Optional[str] = None) -> Dict[str, Any]:
    """Extract candidate name, email, phone, links, experience years, education, and certifications."""
    # Email detection
    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    email = email_match.group(0) if email_match else None

    # Phone detection
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else None

    # Social links (LinkedIn, GitHub)
    linkedin_match = re.search(r'(linkedin\.com/in/[a-zA-Z0-9_-]+)', text, re.IGNORECASE)
    github_match = re.search(r'(github\.com/[a-zA-Z0-9_-]+)', text, re.IGNORECASE)

    # Candidate Name estimation
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    candidate_name = "Candidate"
    if lines:
        first_line = lines[0]
        if len(first_line.split()) in [2, 3, 4] and not re.search(r'resume|curriculum|cv|summary|contact', first_line, re.IGNORECASE):
            candidate_name = first_line
        elif filename:
            clean_fn = re.sub(r'(_resume|_cv|\.pdf|\.docx)$', '', filename, flags=re.IGNORECASE)
            clean_fn = clean_fn.replace("_", " ").replace("-", " ").title()
            if clean_fn.strip():
                candidate_name = clean_fn.strip()

    # Experience detection
    exp_years = 0.0
    exp_matches = re.findall(r'(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)', text, re.IGNORECASE)
    if exp_matches:
        try:
            exp_years = max([float(m) for m in exp_matches])
        except Exception:
            exp_years = 0.0
    else:
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

    # Certifications
    certs = extract_certifications(text)

    return {
        "name": candidate_name,
        "email": email or "Not detected",
        "phone": phone or "Not detected",
        "linkedin": linkedin_match.group(1) if linkedin_match else None,
        "github": github_match.group(1) if github_match else None,
        "detected_experience_years": round(exp_years, 1),
        "education": education_levels[0] if education_levels else "Undergraduate / Degree Not Specified",
        "certifications": certs,
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
        text = file_bytes.decode("utf-8", errors="ignore")

    metadata = extract_candidate_metadata(text, filename)
    return {
        "filename": filename,
        "text": text,
        "metadata": metadata
    }
