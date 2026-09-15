"""
Semantic Skill Ontology & Taxonomy for Intelligent Resume Matching.
Groups canonical skills, aliases, and inter-skill semantic relationships.
"""

from typing import Dict, List, Set

# Skill clusters with canonical name, aliases/synonyms, and category
SKILL_TAXONOMY = {
    # Backend & Languages
    "python": {
        "category": "Languages & Core",
        "aliases": ["python3", "python 3", "py", "cpython"],
        "related": ["django", "fastapi", "flask", "numpy", "pandas", "scipy"]
    },
    "javascript": {
        "category": "Languages & Core",
        "aliases": ["js", "es6", "es2020", "vanilla js", "ecmascript"],
        "related": ["typescript", "react", "node.js", "next.js", "vue"]
    },
    "typescript": {
        "category": "Languages & Core",
        "aliases": ["ts"],
        "related": ["javascript", "angular", "react", "next.js", "node.js"]
    },
    "java": {
        "category": "Languages & Core",
        "aliases": ["core java", "j2ee", "java 8", "java 17", "java 21"],
        "related": ["spring boot", "spring framework", "hibernate", "jvm", "kotlin"]
    },
    "c++": {
        "category": "Languages & Core",
        "aliases": ["cpp", "c/c++", "c plus plus"],
        "related": ["c", "embedded systems", "low-level programming", "stl", "algorithms"]
    },
    "golang": {
        "category": "Languages & Core",
        "aliases": ["go", "go language", "golang dev"],
        "related": ["concurrency", "goroutines", "microservices", "docker", "kubernetes"]
    },
    "rust": {
        "category": "Languages & Core",
        "aliases": ["rustlang"],
        "related": ["systems programming", "memory safety", "concurrency", "c++"]
    },

    # Frameworks & Backend
    "fastapi": {
        "category": "Backend Frameworks",
        "aliases": ["fast-api", "fastapi framework"],
        "related": ["python", "rest apis", "pydantic", "starlette", "asyncio"]
    },
    "django": {
        "category": "Backend Frameworks",
        "aliases": ["django rest framework", "drf"],
        "related": ["python", "orm", "postgresql", "rest apis", "backend architecture"]
    },
    "node.js": {
        "category": "Backend Frameworks",
        "aliases": ["nodejs", "node", "express", "express.js", "nest.js", "nestjs"],
        "related": ["javascript", "typescript", "rest apis", "microservices", "asyncio"]
    },
    "spring boot": {
        "category": "Backend Frameworks",
        "aliases": ["springboot", "spring", "spring framework"],
        "related": ["java", "microservices", "hibernate", "jpa", "maven"]
    },
    "graphql": {
        "category": "APIs & Networking",
        "aliases": ["apollo graphql", "relay"],
        "related": ["rest apis", "api design", "backend architecture"]
    },
    "rest apis": {
        "category": "APIs & Networking",
        "aliases": ["restful apis", "rest", "web services", "api development", "api design"],
        "related": ["fastapi", "django", "node.js", "graphql", "microservices"]
    },

    # Frontend
    "react": {
        "category": "Frontend Frameworks",
        "aliases": ["react.js", "reactjs", "react native"],
        "related": ["frontend development", "javascript", "typescript", "next.js", "redux", "tailwind css", "html/css"]
    },
    "next.js": {
        "category": "Frontend Frameworks",
        "aliases": ["nextjs", "next"],
        "related": ["react", "typescript", "ssr", "frontend development"]
    },
    "vue": {
        "category": "Frontend Frameworks",
        "aliases": ["vue.js", "vuejs", "nuxt", "nuxt.js"],
        "related": ["javascript", "frontend development", "html/css"]
    },
    "angular": {
        "category": "Frontend Frameworks",
        "aliases": ["angular.js", "angularjs", "angular 2+"],
        "related": ["typescript", "frontend development", "rxjs"]
    },
    "html/css": {
        "category": "Frontend Frameworks",
        "aliases": ["html5", "css3", "vanilla css", "responsive design", "sass", "scss"],
        "related": ["frontend development", "javascript", "tailwind css"]
    },
    "tailwind css": {
        "category": "Frontend Frameworks",
        "aliases": ["tailwind", "tailwindcss"],
        "related": ["html/css", "react", "frontend development"]
    },
    "frontend development": {
        "category": "Frontend Frameworks",
        "aliases": ["frontend engineering", "ui development", "client-side development", "web ui"],
        "related": ["react", "javascript", "html/css", "next.js", "typescript"]
    },

    # Databases & Storage
    "postgresql": {
        "category": "Databases & Storage",
        "aliases": ["postgres", "pgsql", "psql"],
        "related": ["sql", "relational databases", "database design", "query optimization"]
    },
    "mysql": {
        "category": "Databases & Storage",
        "aliases": ["my sql", "mariadb"],
        "related": ["sql", "relational databases", "database indexing"]
    },
    "mongodb": {
        "category": "Databases & Storage",
        "aliases": ["mongo", "nosql", "document database"],
        "related": ["databases", "json", "backend architecture"]
    },
    "redis": {
        "category": "Databases & Storage",
        "aliases": ["redis cache", "in-memory cache", "caching"],
        "related": ["database optimization", "distributed systems", "system design"]
    },
    "sql": {
        "category": "Databases & Storage",
        "aliases": ["relational databases", "rdbms", "database queries", "complex sql"],
        "related": ["postgresql", "mysql", "data modeling", "query optimization"]
    },
    "vector databases": {
        "category": "Databases & Storage",
        "aliases": ["vector db", "chromadb", "pinecone", "qdrant", "weaviate", "faiss", "pgvector"],
        "related": ["embeddings", "rag", "generative ai", "llms"]
    },

    # Cloud & DevOps
    "docker": {
        "category": "Cloud & DevOps",
        "aliases": ["containerization", "containers", "dockerfile", "docker compose"],
        "related": ["kubernetes", "ci/cd", "devops", "cloud computing"]
    },
    "kubernetes": {
        "category": "Cloud & DevOps",
        "aliases": ["k8s", "container orchestration", "helm", "eks", "gke", "aks"],
        "related": ["docker", "devops", "cloud computing", "microservices"]
    },
    "aws": {
        "category": "Cloud & DevOps",
        "aliases": ["amazon web services", "ec2", "s3", "lambda", "rds", "cloud formation"],
        "related": ["cloud computing", "devops", "terraform", "serverless"]
    },
    "gcp": {
        "category": "Cloud & DevOps",
        "aliases": ["google cloud", "google cloud platform", "bigquery", "vertex ai"],
        "related": ["cloud computing", "devops", "kubernetes"]
    },
    "azure": {
        "category": "Cloud & DevOps",
        "aliases": ["microsoft azure", "azure devops", "azure cloud"],
        "related": ["cloud computing", "devops"]
    },
    "ci/cd": {
        "category": "Cloud & DevOps",
        "aliases": ["continuous integration", "continuous deployment", "github actions", "gitlab ci", "jenkins"],
        "related": ["devops", "docker", "testing automation"]
    },
    "terraform": {
        "category": "Cloud & DevOps",
        "aliases": ["infrastructure as code", "iac", "ansible"],
        "related": ["aws", "cloud computing", "devops"]
    },

    # AI, ML & Data Science
    "machine learning": {
        "category": "AI & Machine Learning",
        "aliases": ["ml", "predictive modeling", "statistical modeling", "supervised learning"],
        "related": ["python", "deep learning", "scikit-learn", "data science"]
    },
    "deep learning": {
        "category": "AI & Machine Learning",
        "aliases": ["neural networks", "dl", "ann", "cnn", "rnn", "transformers"],
        "related": ["pytorch", "tensorflow", "computer vision", "nlp", "machine learning"]
    },
    "pytorch": {
        "category": "AI & Machine Learning",
        "aliases": ["torch"],
        "related": ["deep learning", "machine learning", "python", "neural networks"]
    },
    "tensorflow": {
        "category": "AI & Machine Learning",
        "aliases": ["keras", "tf"],
        "related": ["deep learning", "machine learning", "python"]
    },
    "nlp": {
        "category": "AI & Machine Learning",
        "aliases": ["natural language processing", "text processing", "sentiment analysis", "spacy", "nltk"],
        "related": ["large language models", "deep learning", "transformers"]
    },
    "large language models": {
        "category": "AI & Machine Learning",
        "aliases": ["llms", "llm", "generative ai", "genai", "gpt", "gemini", "claude", "prompt engineering", "langchain", "llamaindex", "rag"],
        "related": ["nlp", "vector databases", "deep learning", "python"]
    },
    "data science": {
        "category": "AI & Machine Learning",
        "aliases": ["data analysis", "data analytics", "pandas", "numpy", "matplotlib", "seaborn"],
        "related": ["machine learning", "python", "sql", "statistics"]
    },

    # System Architecture & Engineering
    "microservices": {
        "category": "Architecture & Practices",
        "aliases": ["microservice architecture", "distributed systems", "service oriented architecture"],
        "related": ["docker", "kubernetes", "rest apis", "system design"]
    },
    "system design": {
        "category": "Architecture & Practices",
        "aliases": ["software architecture", "scalability", "high availability", "distributed architecture"],
        "related": ["microservices", "redis", "relational databases", "cloud computing"]
    },
    "agile / scrum": {
        "category": "Practices & Leadership",
        "aliases": ["agile", "scrum", "kanban", "sprint planning", "jira"],
        "related": ["team collaboration", "code review"]
    },
    "git": {
        "category": "Tools & Version Control",
        "aliases": ["github", "gitlab", "version control", "git workflow"],
        "related": ["ci/cd", "agile / scrum"]
    }
}

# Build reverse lookup map for fast extraction
ALIAS_TO_CANONICAL: Dict[str, str] = {}
for canonical, info in SKILL_TAXONOMY.items():
    ALIAS_TO_CANONICAL[canonical.lower()] = canonical
    for alias in info.get("aliases", []):
        ALIAS_TO_CANONICAL[alias.lower()] = canonical

def find_canonical_skill(skill_phrase: str) -> str:
    """Map a skill string to its canonical skill name if known."""
    s = skill_phrase.strip().lower()
    return ALIAS_TO_CANONICAL.get(s, s)

def get_related_skills(canonical_skill: str) -> List[str]:
    """Retrieve semantically related skills."""
    info = SKILL_TAXONOMY.get(canonical_skill.lower())
    if info:
        return info.get("related", [])
    return []

def get_skill_category(canonical_skill: str) -> str:
    """Retrieve skill category."""
    info = SKILL_TAXONOMY.get(canonical_skill.lower())
    if info:
        return info.get("category", "General Technical")
    return "Domain & Specialized"
