import uuid
from typing import List, Dict, Any, Optional
from app.schemas.template import (
    TemplateMetadata,
    TemplateRecommendationRequest,
    TemplateRecommendationItem,
    TemplateRecommendationResponse,
    Create5VersionsRequest,
    CreatedVersionItem,
    Create5VersionsResponse,
)
from app.schemas.resume import ResumeBase

TEMPLATES_CATALOG: List[TemplateMetadata] = [
    # 1. ATS-Friendly Category
    TemplateMetadata(
        id="ats-minimal",
        name="ATS Minimal",
        category="ats",
        description="Clean, single-column, zero graphic clutter, 100% parseable by Taleo, Workday, and Greenhouse.",
        ats_score=99,
        is_ats_guaranteed=True,
        preview_tag="High Parse Rate",
        recommended_for=["All Industries", "Enterprise Application Portals", "Conservative Recruiters"],
        layout_default="single"
    ),
    TemplateMetadata(
        id="ats-classic",
        name="ATS Classic",
        category="ats",
        description="Traditional serif typography (Georgia) with formal horizontal dividers and linear chronology.",
        ats_score=98,
        is_ats_guaranteed=True,
        preview_tag="Traditional",
        recommended_for=["Finance", "Consulting", "Government", "Law"],
        layout_default="single"
    ),
    TemplateMetadata(
        id="ats-modern",
        name="ATS Modern",
        category="ats",
        description="Modern sans-serif typography, subtle structural weighting, and optimized line spacing.",
        ats_score=97,
        is_ats_guaranteed=True,
        preview_tag="Balanced",
        recommended_for=["Tech", "Startups", "Operations", "General Business"],
        layout_default="single"
    ),
    TemplateMetadata(
        id="ats-one-page",
        name="ATS One-Page",
        category="ats",
        description="Engineered with space-compression heuristics to fit 3-5 years of career achievements onto exactly one page.",
        ats_score=96,
        is_ats_guaranteed=True,
        preview_tag="One-Page Compact",
        recommended_for=["Early Career", "Career Fairs", "Quick Executive Screening"],
        layout_default="compact"
    ),

    # 2. Modern Professional Category
    TemplateMetadata(
        id="modern-blue",
        name="Modern Blue",
        category="modern",
        description="Executive navy accent headings with contemporary typographic rhythm and clear section boundaries.",
        ats_score=95,
        is_ats_guaranteed=True,
        preview_tag="Executive Choice",
        recommended_for=["Product Managers", "Senior Engineers", "Engineering Managers"],
        layout_default="single"
    ),
    TemplateMetadata(
        id="modern-split",
        name="Modern Split (Two-Column)",
        category="modern",
        description="Asymmetric two-column format with an anchor sidebar for contact, skills, and education.",
        ats_score=90,
        is_ats_guaranteed=False,
        preview_tag="Two-Column",
        recommended_for=["Direct Recruiter Outreach", "Networking", "Referral Submissions"],
        layout_default="two-column"
    ),
    TemplateMetadata(
        id="clean-executive",
        name="Clean Executive",
        category="modern",
        description="Refined slate styling with prominent executive summary narrative and quantifiable leadership KPIs.",
        ats_score=94,
        is_ats_guaranteed=True,
        preview_tag="Leadership",
        recommended_for=["Directors", "Staff / Principal Engineers", "VP Candidates"],
        layout_default="single"
    ),

    # 3. Tech & Software Engineering
    TemplateMetadata(
        id="software-engineer",
        name="Software Engineer",
        category="tech",
        description="Technical stack front-and-center, clickable GitHub repository links, and architecture-centric bullets.",
        ats_score=97,
        is_ats_guaranteed=True,
        preview_tag="Tech Standard",
        recommended_for=["Software Engineers", "Backend Developers", "Distributed Systems"],
        layout_default="single"
    ),
    TemplateMetadata(
        id="fullstack-developer",
        name="Full-Stack Developer",
        category="tech",
        description="Balanced presentation of Frontend (React/Next.js), Backend (APIs/Databases), and Cloud deployment skills.",
        ats_score=96,
        is_ats_guaranteed=True,
        preview_tag="Full Stack",
        recommended_for=["Full-Stack Engineers", "Application Developers"],
        layout_default="single"
    ),
    TemplateMetadata(
        id="devops-cloud",
        name="DevOps & Cloud Engineer",
        category="tech",
        description="Prominent CI/CD, Kubernetes, Terraform, and cloud infrastructure reliability sections.",
        ats_score=95,
        is_ats_guaranteed=True,
        preview_tag="Cloud & Infra",
        recommended_for=["DevOps Engineers", "SREs", "Cloud Architects"],
        layout_default="single"
    ),

    # 4. Data & AI Category
    TemplateMetadata(
        id="ai-ml-engineer",
        name="AI / ML Engineer",
        category="data_ai",
        description="Highlights PyTorch, model latency metrics, vector databases, and production LLM orchestration pipelines.",
        ats_score=96,
        is_ats_guaranteed=True,
        preview_tag="AI Focus",
        recommended_for=["AI Engineers", "Machine Learning Engineers", "NLP Specialists"],
        layout_default="single"
    ),
    TemplateMetadata(
        id="data-scientist",
        name="Data Scientist",
        category="data_ai",
        description="Emphasizes predictive modeling, statistical rigor, Python/SQL analytical stacks, and business impact.",
        ats_score=96,
        is_ats_guaranteed=True,
        preview_tag="Analytics",
        recommended_for=["Data Scientists", "ML Researchers", "BI Engineers"],
        layout_default="single"
    ),

    # 5. Student & Fresher Category
    TemplateMetadata(
        id="fresher-classic",
        name="Fresher Classic",
        category="student_fresher",
        description="Education, coursework, and capstone projects placed first to maximize impact for recent graduates.",
        ats_score=97,
        is_ats_guaranteed=True,
        preview_tag="Entry-Level",
        recommended_for=["Recent Graduates", "B.Tech Students", "Entry-Level Roles"],
        layout_default="single"
    ),
    TemplateMetadata(
        id="internship-resume",
        name="Internship Target",
        category="student_fresher",
        description="Tailored specifically for summer/fall internships with focus on academic honors, hackathons, and personal projects.",
        ats_score=96,
        is_ats_guaranteed=True,
        preview_tag="Internship",
        recommended_for=["College Students", "Internship Applicants"],
        layout_default="single"
    ),

    # 6. Executive & Leadership Category
    TemplateMetadata(
        id="executive-classic",
        name="Executive Classic",
        category="executive",
        description="Expansive leadership achievements, organizational scale, budget oversight, and strategic board impact.",
        ats_score=95,
        is_ats_guaranteed=True,
        preview_tag="C-Suite / VP",
        recommended_for=["CTOs", "VP of Engineering", "General Managers"],
        layout_default="single"
    ),

    # 7. Creative & Startup Category
    TemplateMetadata(
        id="creative-modern",
        name="Creative Modern",
        category="creative",
        description="Distinctive modern visual flair with subtle badge accents and portfolio showcase links.",
        ats_score=88,
        is_ats_guaranteed=False,
        preview_tag="Visual Impact",
        recommended_for=["UI/UX Designers", "Creative Tech", "Startup Founders"],
        layout_default="two-column"
    ),
    TemplateMetadata(
        id="startup-impact",
        name="Startup Impact",
        category="creative",
        description="Fast-paced, metric-dense design highlighting 0-to-1 build velocity and rapid revenue/growth milestones.",
        ats_score=94,
        is_ats_guaranteed=True,
        preview_tag="High Growth",
        recommended_for=["Early Stage Hires", "Founding Engineers", "Growth Specialists"],
        layout_default="single"
    ),
]


class TemplateService:
    def list_templates(self, category: Optional[str] = None) -> List[TemplateMetadata]:
        if category:
            return [t for t in TEMPLATES_CATALOG if t.category.lower() == category.lower()]
        return TEMPLATES_CATALOG

    def get_template(self, template_id: str) -> Optional[TemplateMetadata]:
        for t in TEMPLATES_CATALOG:
            if t.id == template_id:
                return t
        return TEMPLATES_CATALOG[0]  # Fallback to ATS Minimal

    def recommend_templates(self, req: TemplateRecommendationRequest) -> TemplateRecommendationResponse:
        """
        AI Recommendation Algorithm:
        Analyzes Candidate Role, Seniority, Project Density, and Job Description keywords
        to recommend top 3 optimal template designs.
        """
        role_lower = (req.target_role or "").lower()
        level_lower = (req.experience_level or "experienced").lower()
        jd_lower = (req.job_description or "").lower()

        is_ai_role = any(k in role_lower or k in jd_lower for k in ["ai", "machine learning", "ml", "nlp", "llm", "deep learning"])
        is_data_role = any(k in role_lower or k in jd_lower for k in ["data", "analytics", "bi", "sql"])
        is_fresher = level_lower in ["fresher", "student", "intern", "entry-level"] or any(k in role_lower for k in ["intern", "graduate", "fresher"])
        is_executive = level_lower in ["executive", "senior", "director", "lead"] or any(k in role_lower for k in ["director", "vp", "chief", "head", "manager"])
        is_cloud_devops = any(k in role_lower or k in jd_lower for k in ["devops", "cloud", "sre", "kubernetes", "aws", "infrastructure"])

        recommendations: List[TemplateRecommendationItem] = []

        if is_fresher:
            recommendations.append(TemplateRecommendationItem(
                template_id="fresher-classic",
                template_name="Fresher Classic",
                category="student_fresher",
                match_score=98,
                is_primary_recommendation=True,
                rationale="Prioritizes academic credentials and technical coursework above professional history.",
                key_advantages=["Education placed first", "Highlight hackathons & projects", "High ATS readability"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="ats-minimal",
                template_name="ATS Minimal",
                category="ats",
                match_score=94,
                is_primary_recommendation=False,
                rationale="Eliminates formatting pitfalls on automated campus placement and university portals.",
                key_advantages=["100% parseable", "Zero table formatting errors", "Clean structure"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="internship-resume",
                template_name="Internship Target",
                category="student_fresher",
                match_score=91,
                is_primary_recommendation=False,
                rationale="Optimized layout for competitive college internships and campus screenings.",
                key_advantages=["Emphasizes project depth", "Coursework tags", "Modern typography"]
            ))
            advice = "Because you are applying for an entry-level or student opportunity, your education, certifications, and technical projects should be prominently positioned before professional employment history."

        elif is_ai_role:
            recommendations.append(TemplateRecommendationItem(
                template_id="ai-ml-engineer",
                template_name="AI / ML Engineer",
                category="data_ai",
                match_score=99,
                is_primary_recommendation=True,
                rationale="Tailored specifically for machine learning, deep learning frameworks, and vector search systems.",
                key_advantages=["Dedicated ML framework matrix", "Prominent model scale metrics", "GitHub links"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="ats-modern",
                template_name="ATS Modern",
                category="ats",
                match_score=95,
                is_primary_recommendation=False,
                rationale="Clean contemporary aesthetic that parses seamlessly across enterprise HR filters.",
                key_advantages=["High keyword density", "Single-column safety", "Crisp typography"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="software-engineer",
                template_name="Software Engineer",
                category="tech",
                match_score=92,
                is_primary_recommendation=False,
                rationale="Highlights software engineering rigor alongside AI models, proving production coding ability.",
                key_advantages=["Tech stack front-and-center", "Systems architecture focus", "Code repo links"]
            ))
            advice = "For an AI / ML role, recruiters prioritize quantifiable performance metrics (latency, throughput, model recall) and verifiable open-source code repositories."

        elif is_data_role:
            recommendations.append(TemplateRecommendationItem(
                template_id="data-scientist",
                template_name="Data Scientist",
                category="data_ai",
                match_score=98,
                is_primary_recommendation=True,
                rationale="Positions statistical analysis, Python/SQL tooling, and measurable business intelligence outcomes prominently.",
                key_advantages=["Quantitative impact emphasis", "Analytical stack breakdown", "Project showcase"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="modern-blue",
                template_name="Modern Blue",
                category="modern",
                match_score=93,
                is_primary_recommendation=False,
                rationale="Authoritative executive navy styling that appeals to corporate analytics hiring managers.",
                key_advantages=["Executive visual hierarchy", "Clean readability", "Professional headers"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="ats-minimal",
                template_name="ATS Minimal",
                category="ats",
                match_score=91,
                is_primary_recommendation=False,
                rationale="Maximum parseability for enterprise business intelligence and financial services roles.",
                key_advantages=["Zero parsing ambiguity", "Clean typography", "Universal compatibility"]
            ))
            advice = "Data roles demand proven analytical competence. The recommended layouts emphasize data pipelining, statistical experimentation, and business revenue metrics."

        elif is_executive:
            recommendations.append(TemplateRecommendationItem(
                template_id="clean-executive",
                template_name="Clean Executive",
                category="modern",
                match_score=98,
                is_primary_recommendation=True,
                rationale="Presents an executive career trajectory with emphasis on leadership scope and strategic delivery.",
                key_advantages=["Prominent executive summary", "Leadership metrics focus", "Polished typography"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="modern-blue",
                template_name="Modern Blue",
                category="modern",
                match_score=94,
                is_primary_recommendation=False,
                rationale="Balanced executive styling favored by corporate recruiters and executive search firms.",
                key_advantages=["Contemporary visual authority", "Structured achievements", "Clean dividers"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="executive-classic",
                template_name="Executive Classic",
                category="executive",
                match_score=92,
                is_primary_recommendation=False,
                rationale="Traditional layout for formal board, VP, and Director level candidacy reviews.",
                key_advantages=["Conservative design", "Full career depth", "High prestige tone"]
            ))
            advice = "Executive screening is focused on strategic milestones, organizational scaling, and team mentorship. These designs give your summary and leadership outcomes immediate visual prominence."

        else:
            # Standard Software / Full-Stack
            recommendations.append(TemplateRecommendationItem(
                template_id="software-engineer",
                template_name="Software Engineer",
                category="tech",
                match_score=98,
                is_primary_recommendation=True,
                rationale="The benchmark template for technical software engineers, balancing tech stack with production achievements.",
                key_advantages=["Prominent technical skills", "Project & GitHub visibility", "Google XYZ bullet friendly"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="ats-minimal",
                template_name="ATS Minimal",
                category="ats",
                match_score=95,
                is_primary_recommendation=False,
                rationale="Guaranteed 100% compliance across automated applicant tracking systems.",
                key_advantages=["Zero ATS parsing errors", "Universal standard", "Fast recruiter scan"]
            ))
            recommendations.append(TemplateRecommendationItem(
                template_id="fullstack-developer",
                template_name="Full-Stack Developer",
                category="tech",
                match_score=93,
                is_primary_recommendation=False,
                rationale="Multi-tier technical skill categorization showing frontend, backend, and deployment fluency.",
                key_advantages=["Categorized tech stacks", "Full-lifecycle delivery", "Modern layout"]
            ))
            advice = "For engineering roles, recruiters look for your core programming stack within the first 6 seconds. These templates put your technical competencies directly below your contact information."

        return TemplateRecommendationResponse(
            target_role=req.target_role or "Software Engineer",
            experience_level=level_lower,
            recommended_templates=recommendations,
            advice_summary=advice
        )

    def generate_plain_text(self, resume: Any) -> str:
        """Generates clean, standardized ASCII Plain-Text (TXT) for copy-pasting into ATS portals."""
        def g(obj, key, default=""):
            if isinstance(obj, dict):
                return obj.get(key, default)
            return getattr(obj, key, default) or default

        lines = []
        p = g(resume, "personal_info", {})
        full_name = g(p, "fullName", "Candidate")
        lines.append(full_name.upper())

        headline = g(p, "headline", "")
        if headline:
            lines.append(headline)

        contact_parts = [part for part in [g(p, "email"), g(p, "phone"), g(p, "location"), g(p, "linkedin"), g(p, "github")] if part]
        if contact_parts:
            lines.append(" | ".join(contact_parts))
        lines.append("=" * 60)
        lines.append("")

        summary = g(p, "summary", "")
        if summary:
            lines.append("PROFESSIONAL SUMMARY")
            lines.append("-" * 60)
            lines.append(summary)
            lines.append("")

        skills = g(resume, "skills", [])
        if skills:
            lines.append("TECHNICAL SKILLS")
            lines.append("-" * 60)
            for cat in skills:
                cat_name = g(cat, "category", "Skills")
                items = g(cat, "items", [])
                lines.append(f"{cat_name}: {', '.join(items)}")
            lines.append("")

        experiences = g(resume, "experiences", [])
        if experiences:
            lines.append("PROFESSIONAL EXPERIENCE")
            lines.append("-" * 60)
            for exp in experiences:
                title = g(exp, "title", "Role")
                company = g(exp, "company", "Company")
                loc = g(exp, "location", "")
                loc_str = f" ({loc})" if loc else ""
                start = g(exp, "startDate", "")
                end = g(exp, "endDate", "")
                curr = g(exp, "current", False)
                end_str = "Present" if curr else end
                date_range = f"{start} - {end_str}".strip(" -")

                lines.append(f"{title} | {company}{loc_str}")
                if date_range:
                    lines.append(f"Duration: {date_range}")
                for b in g(exp, "bullets", []):
                    lines.append(f"  * {b}")
                lines.append("")

        projects = g(resume, "projects", [])
        if projects:
            lines.append("PROJECTS")
            lines.append("-" * 60)
            for proj in projects:
                title = g(proj, "title", "Project")
                techs = g(proj, "technologies", [])
                tech_str = f" [{', '.join(techs)}]" if techs else ""
                lines.append(f"{title}{tech_str}")
                desc = g(proj, "description", "")
                if desc:
                    lines.append(f"  {desc}")
                for b in g(proj, "bullets", []):
                    lines.append(f"  * {b}")
                lines.append("")

        education = g(resume, "education", [])
        if education:
            lines.append("EDUCATION")
            lines.append("-" * 60)
            for edu in education:
                degree = g(edu, "degree", "")
                fos = g(edu, "fieldOfStudy", "")
                inst = g(edu, "institution", "")
                grad = g(edu, "graduationYear", "") or g(edu, "endDate", "")
                lines.append(f"{degree} in {fos}".strip(" in"))
                lines.append(f"{inst} ({grad})".strip(" ()"))
                gpa = g(edu, "gpa", "")
                if gpa:
                    lines.append(f"GPA: {gpa}")
                lines.append("")

        return "\n".join(lines)


template_service = TemplateService()

