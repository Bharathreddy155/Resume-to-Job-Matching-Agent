"""
Preloaded sample datasets for instant 1-click hackathon demoing.
"""

SAMPLE_JOBS = [
    {
        "id": "job_fullstack",
        "title": "Senior Full-Stack Engineer",
        "company": "Nexus Innovations",
        "department": "Platform Engineering",
        "location": "Remote / San Francisco",
        "description": """About the Role:
We are looking for a Senior Full-Stack Engineer to lead the architecture and development of our cloud-native workflow platform. You will collaborate closely with product managers and infrastructure engineers to build scalable, high-performance web applications.

Responsibilities:
- Design, build, and maintain modular web applications using React and modern JavaScript / TypeScript.
- Architect high-throughput RESTful APIs and microservices using Python (FastAPI or Django).
- Model relational data schemas in PostgreSQL and optimize query performance.
- Containerize services with Docker and deploy resilient services to AWS cloud infrastructure.
- Implement robust automated testing and CI/CD deployment pipelines.

Requirements & Qualifications (Must Have):
- 4+ years of professional software engineering experience.
- Strong proficiency in Python and modern JavaScript/TypeScript.
- Hands-on experience developing web frontends with React.
- Solid experience building backend services with FastAPI, Django, or Node.js.
- Strong understanding of SQL, PostgreSQL, and database schema design.
- Practical experience with Docker containerization and Git workflows.

Nice to Have / Preferred:
- Experience with Kubernetes (K8s) and Terraform infrastructure as code.
- Familiarity with Redis caching and distributed systems design.
- Exposure to Large Language Models (LLMs) or AI application integration.
"""
    },
    {
        "id": "job_ai_ml",
        "title": "Lead Machine Learning & AI Engineer",
        "company": "Cognitive Frontiers",
        "department": "Applied AI Research",
        "location": "Hybrid / New York",
        "description": """About the Role:
Join our Applied AI team to develop state-of-the-art Generative AI applications and production RAG pipelines.

Responsibilities:
- Train, fine-tune, and evaluate deep learning models using PyTorch and Hugging Face.
- Build production-grade Retrieval-Augmented Generation (RAG) architectures with Vector Databases (ChromaDB, Pinecone, or FAISS).
- Design and deploy scalable inference microservices using FastAPI and Docker on GCP or AWS.
- Collaborate with data scientists to optimize model latency and inference throughput.

Requirements:
- 3+ years of experience in Machine Learning and Natural Language Processing (NLP).
- Expert Python programming and deep learning framework mastery (PyTorch or TensorFlow).
- Hands-on experience with Large Language Models (LLMs), prompt engineering, and LangChain/LlamaIndex.
- Strong foundation in data structures, algorithms, and vector embeddings.

Preferred Qualifications:
- Experience with Kubernetes model serving (Triton, vLLM, or Ray).
- Knowledge of relational databases (PostgreSQL) and NoSQL storage.
"""
    },
    {
        "id": "job_devops",
        "title": "DevOps & Cloud Infrastructure Engineer",
        "company": "CloudScale Systems",
        "department": "Site Reliability Engineering",
        "location": "Remote",
        "description": """About the Role:
Seeking an experienced DevOps Engineer to automate and harden our multi-cloud deployment ecosystem.

Requirements:
- 3+ years of experience managing production cloud infrastructure on AWS or GCP.
- Deep expertise in Kubernetes container orchestration, Helm charts, and Docker.
- Proven experience with Infrastructure as Code using Terraform.
- Advanced scripting skills in Python or Golang.
- Solid understanding of CI/CD pipelines (GitHub Actions, GitLab CI).

Nice to Have:
- Monitoring and telemetry setup with Prometheus and Grafana.
- System security and compliance best practices.
"""
    }
]

SAMPLE_RESUMES = [
    {
        "id": "res_alex_chen",
        "name": "Alex Chen",
        "target_job_id": "job_fullstack",
        "headline": "Senior Full-Stack Developer | Python & React Specialist",
        "text": """Alex Chen
Email: alex.chen@example.com | Phone: (415) 555-0182 | San Francisco, CA
LinkedIn: linkedin.com/in/alexchen-dev | GitHub: github.com/alexchen

PROFESSIONAL SUMMARY
Dynamic Full-Stack Software Engineer with 5+ years of experience designing and shipping high-scale distributed applications. Proven track record architecting RESTful microservices with FastAPI and Python, and responsive user interfaces with React, TypeScript, and Tailwind CSS. Experienced in cloud deployments on AWS and containerized environments with Docker.

EXPERIENCE
Senior Software Engineer | CloudVibe Technologies | 2022 - Present (4 years)
- Spearheaded redesign of core customer portal using React, Next.js, and TypeScript, resulting in a 45% improvement in page load speeds.
- Architected REST APIs using FastAPI and Python 3, serving 30,000+ daily active users with sub-50ms p99 latency.
- Managed and optimized relational databases in PostgreSQL, tuning complex SQL queries and indexes to cut query execution time by 60%.
- Containerized development and staging environments with Docker and Docker Compose, streamlining team onboarding.
- Built automated continuous integration pipelines via GitHub Actions (CI/CD) for automated linting, test suites, and AWS ECS deployment.

Full-Stack Developer | InnovateX Labs | 2019 - 2022 (3 years)
- Built interactive web dashboards using React, Redux, and modern JavaScript (ES6+).
- Developed backend endpoints with Node.js and Express, interfacing with PostgreSQL and Redis cache.
- Collaborated in Agile/Scrum sprints with cross-functional product and design teams.

SKILLS
Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3
Frameworks & Libraries: FastAPI, React, Next.js, Node.js, Tailwind CSS
Databases & Cloud: PostgreSQL, MySQL, Redis, AWS (S3, EC2), Docker, Git
Practices: REST APIs, Microservices, CI/CD, Agile/Scrum, System Design

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2019)
"""
    },
    {
        "id": "res_brenda_smith",
        "name": "Brenda Smith",
        "target_job_id": "job_fullstack",
        "headline": "Frontend Engineer | Vue.js & Node.js Developer",
        "text": """Brenda Smith
Email: brenda.smith@example.com | Phone: (206) 555-7391 | Seattle, WA
Portfolio: brendasmith.dev

PROFESSIONAL SUMMARY
Frontend-focused Software Engineer with 3+ years of experience crafting interactive web applications. Proficient in Vue.js, JavaScript, and Node.js with a keen eye for UI/UX accessibility.

EXPERIENCE
Frontend Developer | PixelCraft Studios | 2022 - Present (3 years)
- Developed customer-facing single page applications using Vue.js, Vuex, and Tailwind CSS.
- Integrated GraphQL and REST endpoints built on Node.js and Express.
- Worked with MongoDB NoSQL databases to store user preferences and assets.
- Implemented unit and end-to-end tests using Jest and Cypress.

Junior Web Developer | Apex Media | 2020 - 2022 (2 years)
- Created responsive landing pages using HTML, CSS, JavaScript, and Bootstrap.
- Collaborated with marketing team using Git version control and Jira.

SKILLS
Languages: JavaScript, HTML/CSS, TypeScript
Frameworks: Vue, Vue.js, Node.js, Express, Tailwind CSS
Databases & Tools: MongoDB, GraphQL, Git, REST APIs

EDUCATION
Bachelor of Science in Web Design & Interactive Media | University of Washington (2020)
"""
    },
    {
        "id": "res_carlos_rodriguez",
        "name": "Carlos Rodriguez",
        "target_job_id": "job_fullstack",
        "headline": "Staff Backend & Systems Architect | Python, Django, Cloud",
        "text": """Carlos Rodriguez
Email: carlos.r@example.com | Phone: (512) 555-9012 | Austin, TX

PROFESSIONAL SUMMARY
Seasoned Backend Engineer with 8+ years of expertise in large-scale distributed systems, Python, Django, and cloud infrastructure. Strong advocate for automated reliability and clean architecture.

EXPERIENCE
Staff Backend Engineer | DataCore Systems | 2020 - Present (5 years)
- Led backend engineering team of 8 developing multi-tenant distributed microservices using Python and Django Rest Framework.
- Scaled PostgreSQL and Redis infrastructure handling over 100M queries daily with 99.99% uptime.
- Orchestrated container workloads using Kubernetes (K8s) and Docker across AWS infrastructure.
- Defined Infrastructure as Code using Terraform and automated deployment pipelines via CI/CD.

Senior Software Engineer | FinTech Matrix | 2017 - 2020 (3 years)
- Developed secure financial transaction processing pipelines using Java and Python.
- Designed relational database schemas in PostgreSQL and MySQL.
- Mentored junior engineers and conducted rigorous code reviews.

SKILLS
Languages: Python, Java, SQL, Go (Golang)
Frameworks & Backend: Django, Django Rest Framework, REST APIs, Microservices, System Design
Databases: PostgreSQL, MySQL, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, Terraform, CI/CD, Git

EDUCATION
M.S. in Computer Science | University of Texas at Austin (2017)
B.S. in Computer Engineering | Texas A&M (2015)
"""
    },
    {
        "id": "res_priya_sharma",
        "name": "Dr. Priya Sharma",
        "target_job_id": "job_ai_ml",
        "headline": "Lead AI / ML Research Engineer | Generative AI & NLP",
        "text": """Dr. Priya Sharma
Email: priya.sharma@example.com | Phone: (617) 555-4921 | Boston, MA

PROFESSIONAL SUMMARY
AI Research Scientist and Machine Learning Engineer with 4+ years post-PhD experience building deep learning systems, NLP pipelines, and LLM applications. Specialized in PyTorch, transformers, and Retrieval-Augmented Generation (RAG).

EXPERIENCE
Lead AI Engineer | Synapse Intelligence | 2023 - Present (3 years)
- Architected enterprise RAG system processing 500k documents using LangChain, ChromaDB Vector Databases, and PyTorch.
- Fine-tuned transformer models (Llama, BERT) for domain-specific information extraction, improving F1 score by 18%.
- Deployed real-time inference services via FastAPI and Docker on GCP Vertex AI.

Machine Learning Engineer | BioText AI | 2021 - 2023 (2 years)
- Developed NLP models for clinical document summarization using PyTorch and Hugging Face.
- Designed data pipelines with Python, pandas, and scikit-learn.

SKILLS
AI & ML: Machine Learning, Deep Learning, PyTorch, NLP, Large Language Models (LLMs), LangChain, Vector Databases, Data Science
Programming: Python, SQL
Deployment: FastAPI, Docker, GCP, Git

EDUCATION
Ph.D. in Computer Science (Artificial Intelligence) | MIT (2021)
"""
    }
]
