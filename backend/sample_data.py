"""
Preloaded sample datasets for instant 1-click hackathon demoing.
Includes 18 diverse technical roles across multiple modern engineering domains.
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
    },
    {
        "id": "job_frontend",
        "title": "Senior Frontend Architect",
        "company": "PixelPulse Technologies",
        "department": "Core Web Experience",
        "location": "Remote / Austin",
        "description": """About the Role:
Looking for a Senior Frontend Architect to elevate our design system and build responsive, lightning-fast web applications.

Responsibilities:
- Architect modular frontend architecture using React, Next.js, and TypeScript.
- Build accessible, reusable UI component libraries with Tailwind CSS and CSS modules.
- Optimize frontend web vitals, bundle sizes, and browser rendering pipelines.
- Write robust unit and end-to-end tests using Jest, Cypress, and React Testing Library.

Requirements:
- 5+ years of frontend software development experience.
- Expert knowledge of JavaScript (ES6+), TypeScript, HTML5, and CSS3.
- In-depth mastery of React, state management (Redux, Zustand, or Context API).
- Experience with Next.js SSR/SSG and REST / GraphQL API consumption.

Nice to Have:
- Micro-frontends and Webpack / Vite build optimization experience.
- Figma prototyping and design system engineering.
"""
    },
    {
        "id": "job_backend_go",
        "title": "Backend Systems Engineer (Go & Microservices)",
        "company": "Vertex Distributed Systems",
        "department": "Core Services",
        "location": "Remote / Seattle",
        "description": """About the Role:
Seeking a Backend Systems Engineer to build high-concurrency microservices processing millions of events per second.

Responsibilities:
- Develop ultra-low-latency distributed microservices in Golang (Go).
- Implement inter-service communication using gRPC, Protobuf, and Apache Kafka.
- Design high-throughput caching and storage layers using Redis and PostgreSQL.
- Maintain high availability and zero-downtime deployment strategies.

Requirements:
- 3+ years of backend development experience with Golang or C++.
- Strong background in microservices architecture, gRPC, and REST APIs.
- Experience with message queues (Kafka, RabbitMQ) and distributed caching (Redis).
- Proficiency with Docker, Linux environments, and Git.

Nice to Have:
- Experience with Kubernetes (k8s) and service meshes (Istio).
- Distributed tracing with OpenTelemetry and Jaeger.
"""
    },
    {
        "id": "job_data_engineer",
        "title": "Senior Data Engineer & Analytics Architect",
        "company": "DataSphere Analytics",
        "department": "Big Data Platforms",
        "location": "Remote / Boston",
        "description": """About the Role:
Join our Data Platform team to build reliable, high-volume batch and streaming data pipelines.

Responsibilities:
- Build and orchestrate ETL/ELT pipelines using Apache Airflow, dbt, and Apache Spark.
- Model enterprise data warehouses using Snowflake, BigQuery, or Redshift.
- Ingest streaming events using Apache Kafka and Python.
- Partner with BI analysts and machine learning teams to curate clean datasets.

Requirements:
- 4+ years of data engineering experience with strong Python and advanced SQL.
- Extensive experience with distributed computing frameworks (Apache Spark, PySpark).
- Hands-on experience with cloud data warehouses (Snowflake, BigQuery, Redshift).
- Familiarity with Airflow, dbt, and Docker.

Nice to Have:
- Cloud certifications (AWS Big Data, Databricks Certified).
- Experience with Delta Lake or Apache Iceberg.
"""
    },
    {
        "id": "job_mobile",
        "title": "Senior Mobile Application Engineer (React Native & Flutter)",
        "company": "AppWorks Interactive",
        "department": "Mobile Products",
        "location": "Hybrid / Los Angeles",
        "description": """About the Role:
Build cross-platform mobile apps that deliver smooth, native-like experiences to millions of iOS and Android users.

Responsibilities:
- Develop high-performance mobile applications using React Native or Flutter.
- Integrate native modules for iOS (Swift) and Android (Kotlin) when necessary.
- Consume secure RESTful and GraphQL backend APIs with offline caching.
- Manage App Store and Google Play publishing and CI/CD pipelines (Fastlane).

Requirements:
- 3+ years of professional mobile development experience.
- Deep expertise with React Native (TypeScript) or Flutter (Dart).
- Understanding of mobile UI/UX principles, push notifications, and device sensors.
- Experience with mobile state management (Redux, MobX, or Riverpod).

Nice to Have:
- Native iOS (Swift) or Android (Kotlin) development experience.
- Mobile automated testing using Appium or Detox.
"""
    },
    {
        "id": "job_cybersecurity",
        "title": "Cybersecurity & Security Operations Specialist",
        "company": "CyberShield Defense",
        "department": "SecOps & Threat Intelligence",
        "location": "Washington, DC / Remote",
        "description": """About the Role:
Protect our enterprise infrastructure, cloud workloads, and applications against sophisticated threat vectors.

Responsibilities:
- Monitor security events and investigate incidents using SIEM platforms (Splunk, Sentinel).
- Perform vulnerability assessments, penetration testing, and code audits.
- Automate threat detection and incident response workflows using Python and Bash.
- Enforce IAM policies and cloud security posture (CSPM) across AWS and Azure.

Requirements:
- 3+ years of experience in Cybersecurity, SOC operations, or Penetration Testing.
- Solid understanding of network security, firewalls, TLS, and OWASP Top 10 vulnerabilities.
- Scripting abilities in Python or Shell for security automation.
- Familiarity with security frameworks (NIST, ISO 27001, SOC 2).

Nice to Have:
- Industry certifications: CISSP, CEH, Security+, or AWS Certified Security Specialty.
"""
    },
    {
        "id": "job_cloud_arch",
        "title": "Enterprise Cloud Solutions Architect",
        "company": "Skyward Enterprise",
        "department": "Cloud Architecture",
        "location": "Remote / Chicago",
        "description": """About the Role:
Lead enterprise cloud migration and multi-cloud architectural strategy for mission-critical banking applications.

Responsibilities:
- Architect highly available, fault-tolerant, and secure cloud environments on AWS and Microsoft Azure.
- Champion Infrastructure as Code (IaC) using Terraform and CloudFormation.
- Define microservices architectures, API gateways, and serverless compute models.
- Optimize cloud spend and resource allocation (FinOps).

Requirements:
- 6+ years in cloud architecture and distributed system engineering.
- Deep expertise in AWS services (EC2, S3, RDS, Lambda, ECS/EKS) and/or Azure.
- Mastery of Terraform, Docker, and Kubernetes.
- Strong background in enterprise networking, VPCs, Direct Connect, and VPNs.

Nice to Have:
- AWS Certified Solutions Architect Professional or Azure Solutions Architect Expert.
"""
    },
    {
        "id": "job_data_scientist",
        "title": "Senior Data Scientist & Predictive Modeler",
        "company": "OmniData Insights",
        "department": "Data Science & Growth",
        "location": "Remote / Denver",
        "description": """About the Role:
Uncover hidden patterns in customer behavioral data and build production predictive models driving business revenue.

Responsibilities:
- Conduct exploratory data analysis, hypothesis testing, and statistical modeling.
- Build predictive machine learning models using Python, Scikit-learn, XGBoost, and LightGBM.
- Design and analyze A/B tests to optimize product funnel conversions.
- Create executive dashboards and reports using Tableau, Power BI, or Streamlit.

Requirements:
- 3+ years of experience in Data Science, Applied Statistics, or Quantitative Analytics.
- Advanced proficiency in Python (Pandas, NumPy, Scikit-learn) and SQL.
- Strong grasp of statistical inference, regression, classification, and clustering.
- Experience communicating complex analytical findings to non-technical stakeholders.

Nice to Have:
- Master's or Ph.D. in Statistics, Mathematics, or Computer Science.
- Experience with MLOps pipelines (MLflow, Weights & Biases).
"""
    },
    {
        "id": "job_nlp_cv",
        "title": "Computer Vision & Multimodal Deep Learning Engineer",
        "company": "Visionary AI Systems",
        "department": "Autonomous Perception",
        "location": "San Jose, CA / Hybrid",
        "description": """About the Role:
Develop real-time computer vision and multimodal perception systems for industrial robotics and edge devices.

Responsibilities:
- Design and train deep neural networks for object detection, segmentation, and tracking (YOLO, ResNet).
- Process video feeds and image streams using OpenCV and PyTorch.
- Optimize deep learning inference models for edge deployment using TensorRT and ONNX.
- Curate and augment high-resolution training datasets.

Requirements:
- 3+ years of experience in Computer Vision, Image Processing, and Deep Learning.
- Strong Python and C++ programming skills.
- Mastery of PyTorch and OpenCV.
- Experience deploying models to GPU or edge hardware (NVIDIA Jetson).

Nice to Have:
- Publications in CVPR, ICCV, or ECCV.
- Experience with 3D point clouds and LiDAR data processing.
"""
    },
    {
        "id": "job_sre",
        "title": "Site Reliability Engineer (SRE & Observability)",
        "company": "UpTime Global",
        "department": "Platform Operations",
        "location": "Remote / Atlanta",
        "description": """About the Role:
Ensure our globally distributed banking applications maintain 99.999% availability and rapid disaster recovery.

Responsibilities:
- Define and track Service Level Indicators (SLIs), SLOs, and Error Budgets.
- Build observability stacks with Prometheus, Grafana, Datadog, and OpenTelemetry.
- Conduct blameless postmortems and drive systemic resilience improvements.
- Automate operational runbooks using Python, Go, and Terraform.

Requirements:
- 4+ years of SRE, DevOps, or Systems Administration experience.
- Deep Linux system internals, networking (TCP/IP, DNS, BGP), and troubleshooting expertise.
- Hands-on experience with Kubernetes, Docker, and AWS.
- Strong scripting skills in Python, Bash, or Go.

Nice to Have:
- Experience managing Kafka clusters or distributed databases under high write loads.
- Chaos engineering experience (Gremlin, Chaos Mesh).
"""
    },
    {
        "id": "job_qa_sdet",
        "title": "Staff Software Development Engineer in Test (SDET)",
        "company": "QualityEdge Labs",
        "department": "Quality Assurance & Automation",
        "location": "Remote / Dallas",
        "description": """About the Role:
Build test automation frameworks that validate mission-critical web, mobile, and API services at scale.

Responsibilities:
- Architect scalable end-to-end test automation frameworks using Playwright, Cypress, or Selenium.
- Implement API contract and regression test suites using Python (pytest) or TypeScript.
- Integrate automated tests into GitHub Actions and GitLab CI/CD pipelines.
- Conduct load and stress testing using k6 or Locust.

Requirements:
- 4+ years of test automation and software engineering experience.
- Strong programming skills in TypeScript, JavaScript, or Python.
- Proven experience with Playwright, Cypress, Selenium, or Appium.
- Good understanding of REST APIs, SQL, and CI/CD tools.

Nice to Have:
- Performance and security testing experience (OWASP ZAP, JMeter).
- Testing microservices in containerized Docker environments.
"""
    },
    {
        "id": "job_blockchain",
        "title": "Web3 & Smart Contract Developer",
        "company": "DecentralCore Protocol",
        "department": "Blockchain Engineering",
        "location": "Remote / Miami",
        "description": """About the Role:
Build decentralized finance (DeFi) protocols and audited smart contracts handling millions in transaction volume.

Responsibilities:
- Write, test, and deploy secure Solidity smart contracts for Ethereum and EVM-compatible networks.
- Integrate frontends with smart contracts using Web3.js, Ethers.js, and Wagmi.
- Conduct thorough smart contract testing and security audits using Hardhat and Foundry.
- Implement tokenomics, staking pools, and governance contracts.

Requirements:
- 2+ years of professional Solidity and Web3 development experience.
- Strong understanding of EVM architecture, gas optimization, and cryptography basics.
- Proficiency in JavaScript/TypeScript and React for dApp frontend integration.
- Familiarity with smart contract vulnerabilities (reentrancy, frontrunning, oracle manipulation).

Nice to Have:
- Experience with Rust and Solana or Cosmos SDK.
- Formal verification of smart contracts.
"""
    },
    {
        "id": "job_product_ai",
        "title": "Technical AI Product Manager",
        "company": "Nova Ventures",
        "department": "Product Innovation",
        "location": "New York / Hybrid",
        "description": """About the Role:
Drive the product vision, strategy, and roadmap for our flagship enterprise AI assistant.

Responsibilities:
- Define product requirements, user stories, and acceptance criteria in Agile sprints (JIRA).
- Partner with machine learning engineers and UX researchers to ship AI features.
- Analyze product engagement metrics and conduct customer discovery interviews.
- Establish AI safety, evaluation benchmarks, and ethical guidelines.

Requirements:
- 3+ years of technical product management experience in SaaS or AI software.
- Strong technical fluency: ability to discuss APIs, ML models, and system architecture with engineers.
- Data-driven mindset with proficiency in SQL and product analytics (Mixpanel, Amplitude).
- Exceptional written and verbal communication skills.

Nice to Have:
- Prior software development background or Computer Science degree.
- Experience with Generative AI product design and prompt optimization.
"""
    },
    {
        "id": "job_dba",
        "title": "Senior Database Administrator & Tuning Specialist",
        "company": "DataVault Enterprise",
        "department": "Infrastructure Services",
        "location": "Remote / Salt Lake City",
        "description": """About the Role:
Maintain high availability, backups, and peak query performance for mission-critical PostgreSQL and MySQL databases.

Responsibilities:
- Optimize slow queries, analyze execution plans (EXPLAIN ANALYZE), and design efficient indexes.
- Manage database clustering, streaming replication, failover, and disaster recovery.
- Automate database provisioning, migrations, and patch management with Ansible and Terraform.
- Monitor database health, lock contention, and buffer pool usage.

Requirements:
- 5+ years of dedicated DBA experience with PostgreSQL and/or MySQL.
- Deep understanding of database internals, MVCC, write-ahead logging (WAL), and connection pooling (PgBouncer).
- Experience managing database instances on AWS RDS, Aurora, or bare-metal Linux.
- Shell scripting and Python proficiency for automation.

Nice to Have:
- Experience with NoSQL datastores (MongoDB, Cassandra, Redis).
- Experience with database sharding (Citus, Vitess).
"""
    },
    {
        "id": "job_embedded",
        "title": "Embedded Systems & Firmware Engineer",
        "company": "RoboDynamics",
        "department": "Hardware & Firmware",
        "location": "San Diego, CA / On-site",
        "description": """About the Role:
Develop low-level firmware and device drivers powering next-generation autonomous drones and robotics.

Responsibilities:
- Write clean, robust C and C++ firmware for ARM Cortex-M microcontrollers and RTOS (FreeRTOS).
- Implement hardware communication protocols: SPI, I2C, UART, CAN, and Bluetooth Low Energy (BLE).
- Debug hardware and firmware integration using oscilloscopes, logic analyzers, and JTAG/SWD.
- Optimize code for minimal memory footprint and battery power efficiency.

Requirements:
- 3+ years of firmware development experience in C/C++.
- Hands-on experience with RTOS (FreeRTOS, Zephyr) and bare-metal programming.
- Understanding of low-level hardware schematics, timers, interrupts, and DMA.
- Familiarity with Git version control and CI/CD for embedded systems.

Nice to Have:
- Experience with Embedded Linux and Yocto Project.
- Knowledge of wireless protocols (BLE, Zigbee, LoRa).
"""
    },
    {
        "id": "job_ui_ux",
        "title": "Lead UI/UX Product Designer & Design Systems",
        "company": "DesignCraft Studio",
        "department": "Product Design",
        "location": "Remote / San Francisco",
        "description": """About the Role:
Shape the user experience and visual language of our consumer-facing applications, creating elegant, intuitive workflows.

Responsibilities:
- Create high-fidelity UI designs, interactive prototypes, and wireframes in Figma.
- Maintain and expand our multi-brand design system components and tokens.
- Conduct user research, usability testing, and translate user feedback into iterative designs.
- Collaborate closely with frontend engineers to ensure design fidelity in code.

Requirements:
- 4+ years of UI/UX design experience for web and mobile software.
- Mastery of Figma (auto-layout, components, variants, variables) and prototyping tools.
- Deep understanding of interaction design, accessibility standards (WCAG 2.1 AA), and typography.
- Strong portfolio showcasing end-to-end product design case studies.

Nice to Have:
- Working knowledge of HTML5, CSS3, and React component concepts.
- Motion design skills using After Effects or Lottie.
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
