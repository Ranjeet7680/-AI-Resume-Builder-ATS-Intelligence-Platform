# 🚀 AI Resume Builder & ATS Intelligence Platform

A production-grade **AI Resume Builder & ATS Optimization Platform** with **LinkedIn Authentication**, **Google XYZ Formula Bullet Rewriting**, **Hybrid ATS Scoring**, and **Job Description Semantic Matching**.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │        LinkedIn         │
                    │   OAuth 2.0 / OIDC      │
                    └────────────┬────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                          FRONTEND                           │
│                Next.js 14 + React + TypeScript              │
│                                                             │
│  Landing  │  Login / OAuth  │  Dashboard  │  Resume Builder │
│  Templates│  AI Enhancer    │  ATS Score  │  Job Matcher    │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                          BACKEND                            │
│                      FastAPI + Python                       │
│                                                             │
│   Auth API   │ Resume API │ ATS Engine │ AI Engine │ Export │
└───────┬──────────────────────┬──────────────────────┬───────┘
        │                      │                      │
        ▼                      ▼                      ▼
   PostgreSQL             AI/ML Engine              Redis
   + pgvector           ┌──────────────┐            Cache &
   User / Resume Data   │ XYZ Rewriter │            Rate Limiting
                        │ ATS Scorer   │
                        │ Job Matcher  │
                        └──────────────┘
```

---

## 🌟 Key Features

1. **LinkedIn Authentication & Hybrid Import**:
   - Frictionless sign-in via LinkedIn OpenID Connect (`openid profile email`).
   - Built-in **LinkedIn Profile PDF Parser** (`More -> Save to PDF`) to solve public API scope limitations and automatically populate work history, education, and skills.
2. **Google XYZ Formula AI Enhancer**:
   - Transforms passive bullets (*"I made a website with React"*) into quantified achievements (*"Developed a responsive React web app, optimizing component reusability and reducing load times by 30%"*).
   - Strict hallucination guardrails to preserve factual veracity.
3. **Hybrid ATS Scoring Engine**:
   - Calculates a deterministic 0–100 ATS readiness score:
     - Keywords match (30%)
     - Technical skills coverage (20%)
     - Strong action verbs ratio (20%)
     - Measurable metrics & numbers (15%)
     - ATS formatting compliance (15%)
4. **Job Description ↔ Resume Semantic Matcher**:
   - Paste any target job description to get instant technical match %, experience fit, missing skills gap audit, and tailoring suggestions.
5. **Multi-Format Export**:
   - Single-column ATS-friendly print CSS (instant PDF).
   - Microsoft Word (`.docx`) export.
   - Standard JSON Resume data interchange format.

---

## 📂 Project Structure

```text
wise-fermi/
├── docker-compose.yml              # Complete containerized stack
├── .env.example                     # Environment configuration
├── README.md
├── backend/                         # FastAPI Python Backend
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py                  # App entrypoint & CORS
│       ├── config.py                # Pydantic Settings
│       ├── database.py              # Async SQLAlchemy + pgvector
│       ├── models/                  # User, Resume, ATSReport, JobMatch
│       ├── schemas/                 # Pydantic v2 schemas
│       ├── api/                     # REST API routers
│       ├── services/                # LinkedIn OIDC, AI Engine, ATS Scorer, Export
│       └── utils/                   # Action verbs, regex, security
└── frontend/                        # Next.js 14 App Router Frontend
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.ts
    └── src/
        ├── app/                     # Landing, Login, Dashboard, Builder, ATS, Matcher
        ├── components/              # Live Preview, ATS Gauge, AI Enhancer Modal
        ├── store/                   # Zustand real-time editor state
        └── lib/                     # API client & helpers
```

---

## ⚡ Quickstart

### Option 1: Run with Docker Compose (Recommended)

1. Clone and navigate to the directory:
   ```bash
   cd wise-fermi
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Launch all containers:
   ```bash
   docker compose up --build
   ```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2: Run Locally Without Docker

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🔑 LinkedIn Developer Portal Setup

1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
2. Create an App and associate it with your company/page.
3. Under the **Products** tab, add:
   - **Sign In with LinkedIn using OpenID Connect**
4. Under the **Auth** tab:
   - Add your Authorized Redirect URL: `http://localhost:3000/auth/callback`
   - Copy your **Client ID** and **Client Secret** into `.env`.

> **Note on LinkedIn API Scopes:** Standard LinkedIn OIDC provides verified identity, email, and picture. For importing full experience bullets, users can upload their exported profile PDF via the 1-click **"Upload LinkedIn Profile PDF"** tool built directly into the app.

---

## 🧪 Testing Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/auth/linkedin/url` | Generates LinkedIn OAuth login URL |
| `POST` | `/api/v1/auth/demo` | Sandbox 1-click instant login |
| `POST` | `/api/v1/auth/import-linkedin-pdf` | Parses LinkedIn profile PDF |
| `GET` | `/api/v1/resume` | Lists user's resumes |
| `POST` | `/api/v1/resume` | Creates a new resume |
| `POST` | `/api/v1/ai/improve-bullet` | Rewrites draft into XYZ achievement |
| `POST` | `/api/v1/ats/analyze` | Generates ATS score & keyword gap audit |
| `POST` | `/api/v1/jobs/match` | Matches resume against job description |
| `GET` | `/api/v1/export/{id}/docx` | Downloads Microsoft Word document |
| `GET` | `/api/v1/export/{id}/html` | Print-ready ATS HTML template |
