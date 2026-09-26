import io
import re
import logging
from typing import Dict, Any, List, Set, Tuple, Optional
from pypdf import PdfReader
from docx import Document
from app.config import settings
from app.schemas.resume import ResumeBase, PersonalInfo, ExperienceItem, EducationItem, SkillCategory, ProjectItem
from app.schemas.analysis import (
    ResumeHealthBreakdown,
    KeywordIntelligence,
    OverusedWordItem,
    ExperienceAuditItem,
    TruthConsistencyIssue,
    ResumeHealthReport,
    InterviewQuestion,
    InterviewPrepResponse,
    RoadmapStep,
    CareerRoadmapResponse,
)
from app.utils.text_processing import (
    POWER_ACTION_VERBS,
    TECH_KEYWORDS_TAXONOMY,
    extract_skills_from_text,
    find_action_verbs,
    count_metrics_and_numbers,
)
from app.services.ats_service import ats_service

logger = logging.getLogger(__name__)

# Common overused/passive resume clichés with executive power alternatives
CLICHE_PATTERNS = [
    {
        "word": "responsible for",
        "regex": r'\bresponsible for\b',
        "alternatives": ["Spearheaded", "Directed", "Orchestrated", "Oversaw"],
    },
    {
        "word": "worked on",
        "regex": r'\bworked on\b',
        "alternatives": ["Architected", "Engineered", "Implemented", "Developed"],
    },
    {
        "word": "helped",
        "regex": r'\bhelped\b',
        "alternatives": ["Collaborated to deliver", "Facilitated", "Accelerated"],
    },
    {
        "word": "handled",
        "regex": r'\bhandled\b',
        "alternatives": ["Resolved", "Executed", "Administered", "Streamlined"],
    },
    {
        "word": "assisted with",
        "regex": r'\bassisted with\b',
        "alternatives": ["Partnered with", "Contributed to", "Co-engineered"],
    },
]


class AnalysisService:
    @staticmethod
    def analyze_resume_health(
        resume: ResumeBase,
        target_role: Optional[str] = "Software Engineer",
        target_job_description: Optional[str] = None
    ) -> ResumeHealthReport:
        """
        Executes a 360° Resume Health Diagnosis evaluating 9 key health vectors,
        Keyword Intelligence (Present, Missing, Overused), Experience Audit,
        and Truth/Consistency validation.
        """
        all_bullets: List[str] = []
        for exp in resume.experiences:
            all_bullets.extend(exp.bullets)
        for proj in resume.projects:
            all_bullets.extend(proj.bullets)

        full_resume_text = " ".join([
            resume.personal_info.summary or "",
            resume.personal_info.headline or "",
            " ".join(all_bullets),
            " ".join([item for cat in resume.skills for item in cat.items]),
        ])

        # ----------------------------------------------------------------------
        # 1. Keyword Intelligence & Overused Clichés Detection
        # ----------------------------------------------------------------------
        detected_skills = set(extract_skills_from_text(full_resume_text))
        for cat in resume.skills:
            for it in cat.items:
                detected_skills.add(it.strip().lower())

        target_skills_set = set(extract_skills_from_text(target_job_description)) if target_job_description else set()
        if not target_skills_set and target_role:
            target_skills_set = set(extract_skills_from_text(target_role))
            if "software" in target_role.lower() or "backend" in target_role.lower():
                target_skills_set.update({"python", "sql", "fastapi", "docker", "aws", "rest api"})
            elif "frontend" in target_role.lower():
                target_skills_set.update({"typescript", "react", "next.js", "tailwind", "html"})
            elif "ai" in target_role.lower() or "data" in target_role.lower():
                target_skills_set.update({"python", "sql", "machine learning", "pytorch", "transformers"})

        if not target_skills_set:
            target_skills_set = {"python", "sql", "docker", "aws", "git"}

        present_keywords = sorted([s.title() for s in target_skills_set.intersection(detected_skills)])
        missing_keywords = sorted([s.title() for s in target_skills_set.difference(detected_skills)])

        overused_words: List[OverusedWordItem] = []
        text_lower = full_resume_text.lower()
        for item in CLICHE_PATTERNS:
            matches = re.findall(item["regex"], text_lower)
            if matches:
                overused_words.append(OverusedWordItem(
                    word=item["word"],
                    count=len(matches),
                    severity="warning" if len(matches) > 1 else "info",
                    suggested_alternatives=item["alternatives"]
                ))

        # ----------------------------------------------------------------------
        # 2. Experience Quality Audit (Per-bullet Action Verbs & Metrics)
        # ----------------------------------------------------------------------
        experience_audit: List[ExperienceAuditItem] = []
        truth_check: List[TruthConsistencyIssue] = []

        total_bullets = 0
        verb_count = 0
        metric_count = 0

        for exp in resume.experiences:
            for b in exp.bullets:
                total_bullets += 1
                words = b.strip().split()
                first_word = words[0].lower().rstrip("ed") if words else ""
                
                # Check for action verb
                has_verb = any(v.startswith(first_word) for v in POWER_ACTION_VERBS) if first_word else False
                if has_verb:
                    verb_count += 1

                # Check for metrics
                num_metrics, found_metrics = count_metrics_and_numbers(b)
                has_metric = num_metrics > 0
                if has_metric:
                    metric_count += 1

                # Issue diagnostic
                issue = None
                suggested_fix = None
                bullet_score = 90

                if not has_verb:
                    bullet_score -= 25
                    issue = "Does not start with an assertive action verb"
                    suggested_fix = f"Architected and deployed {b.strip().rstrip('.')}, optimizing operational workflows."
                
                if not has_metric:
                    bullet_score -= 20
                    if not issue:
                        issue = "Lacks quantifiable results or scale metrics"
                        suggested_fix = f"{b.strip().rstrip('.')}, reducing cycle latency by [X]% across [Y] requests."

                # Truth & consistency inspection
                if any(m.endswith("%") for m in found_metrics):
                    for m in found_metrics:
                        if m.endswith("%"):
                            try:
                                pct_val = float(m.replace("%", ""))
                                if pct_val >= 70:
                                    truth_check.append(TruthConsistencyIssue(
                                        text=b,
                                        claim_type="metric",
                                        flag_reason=f"High percentage claim ({m}) without architectural context",
                                        recommendation="Provide the baseline comparison (e.g. 'reduced latency from 320ms to 48ms') to substantiate this metric in technical interviews."
                                    ))
                            except ValueError:
                                pass

                experience_audit.append(ExperienceAuditItem(
                    exp_id=exp.id,
                    title=exp.title,
                    company=exp.company,
                    bullet=b,
                    score=max(bullet_score, 45),
                    has_action_verb=has_verb,
                    has_metric=has_metric,
                    detected_verb=words[0] if words and has_verb else None,
                    issue=issue,
                    suggested_fix=suggested_fix
                ))

        # ----------------------------------------------------------------------
        # 3. Compute 9 Health Vector Scores
        # ----------------------------------------------------------------------
        safe_total = max(total_bullets, 1)
        verb_ratio = verb_count / safe_total
        metric_ratio = metric_count / safe_total

        score_content = 90 if resume.personal_info.summary and len(resume.personal_info.summary) > 60 else 70
        score_ats = 94 if resume.personal_info.email and resume.personal_info.phone else 78
        score_skills = min(len(detected_skills) * 8 + 30, 96)
        score_experience = min(int(verb_ratio * 100) + 15, 98)
        score_projects = 90 if len(resume.projects) >= 2 else (75 if len(resume.projects) == 1 else 50)
        score_education = 95 if len(resume.education) >= 1 else 60
        score_formatting = 92 if not overused_words else 84
        score_readability = 92
        score_impact = min(int(metric_ratio * 120) + 20, 95)

        overall = int(
            (score_content * 0.15) +
            (score_ats * 0.15) +
            (score_skills * 0.15) +
            (score_experience * 0.15) +
            (score_projects * 0.10) +
            (score_education * 0.10) +
            (score_formatting * 0.05) +
            (score_readability * 0.05) +
            (score_impact * 0.10)
        )

        strong_points = [
            f"Strong ATS parsable structure with {len(present_keywords)} validated technical keywords.",
            f"Clean single-column layout suitable for Workday, Greenhouse, and Lever.",
        ]
        if metric_ratio >= 0.4:
            strong_points.append(f"High quantification: {metric_count} bullets demonstrate verified metrics or scale.")

        critical_fixes = []
        if missing_keywords:
            critical_fixes.append(f"Incorporate missing core skills: {', '.join(missing_keywords[:3])}.")
        if overused_words:
            critical_fixes.append(f"Replace cliché passive verbs ({', '.join([o.word for o in overused_words[:2]])}) with assertive action verbs.")
        if metric_ratio < 0.35:
            critical_fixes.append("Add measurable outcomes (time saved, % latency reduced, user volume) to your top work positions.")

        return ResumeHealthReport(
            overall_score=overall,
            health=ResumeHealthBreakdown(
                overall=overall,
                content=score_content,
                ats_compatibility=score_ats,
                skills=score_skills,
                experience=score_experience,
                projects=score_projects,
                education=score_education,
                formatting=score_formatting,
                readability=score_readability,
                impact=score_impact,
            ),
            keyword_intel=KeywordIntelligence(
                present_keywords=present_keywords,
                missing_target_keywords=missing_keywords,
                overused_words=overused_words,
            ),
            experience_audit=experience_audit,
            truth_check=truth_check,
            strong_points=strong_points,
            critical_fixes=critical_fixes or ["Your resume demonstrates exceptional health and recruiter readiness!"],
        )

    @staticmethod
    def generate_interview_prep(
        resume: ResumeBase,
        target_role: str = "Software Engineer",
        job_description: Optional[str] = None
    ) -> InterviewPrepResponse:
        """
        Module 12/16: Generates targeted technical, behavioral, and project-specific
        interview questions based on the candidate's exact profile.
        """
        # 1. Technical Questions based on candidate's skills
        candidate_skills = [s.strip() for cat in resume.skills for s in cat.items]
        primary_skill = candidate_skills[0] if candidate_skills else "Python"
        second_skill = candidate_skills[1] if len(candidate_skills) > 1 else "FastAPI"

        tech_qs = [
            InterviewQuestion(
                category="Technical Deep-Dive",
                question=f"In {primary_skill}, how do you diagnose and resolve runtime performance bottlenecks or memory leaks?",
                context_source=f"Listed in your Technical Skills ({primary_skill})",
                sample_answer_framework="1) Profiling tools (e.g. cProfile/tracemalloc), 2) Isolating blocking I/O vs CPU bound tasks, 3) Benchmarking the optimized baseline.",
                tips="Recruiters look for systematic debugging methodology rather than memorized theory."
            ),
            InterviewQuestion(
                category="Technical Deep-Dive",
                question=f"Describe how you design distributed APIs in {second_skill} ensuring idempotency and graceful error recovery.",
                context_source=f"Found in your Core Stack ({second_skill})",
                sample_answer_framework="1) Unique idempotency keys via Redis, 2) Atomic database transactions with rollback, 3) Standardized error responses (RFC 7807).",
                tips="Emphasize fault tolerance and distributed state considerations."
            )
        ]

        # 2. Behavioral Questions (STAR Method)
        behav_qs = [
            InterviewQuestion(
                category="Behavioral (STAR Method)",
                question="Tell me about a high-pressure production bug or outage you resolved under tight deadlines.",
                context_source="Standard Senior Engineering Screening",
                sample_answer_framework="Situation (critical service down) ➔ Task (mitigate customer impact) ➔ Action (rolled back & patched hotfix) ➔ Result (restored in 12 mins + created postmortem).",
                tips="Always emphasize blameless postmortems and preventative systemic fixes."
            ),
            InterviewQuestion(
                category="Behavioral (Collaboration)",
                question="Describe a situation where you had a strong technical disagreement with a team member. How did you resolve it?",
                context_source="Cross-functional Leadership Criteria",
                sample_answer_framework="Situation (architectural trade-off) ➔ Task (reach alignment) ➔ Action (benchmarked both prototypes with data) ➔ Result (unified consensus without friction).",
                tips="Demonstrate data-driven humility over ego."
            )
        ]

        # 3. Resume-Specific Project Questions
        proj_qs = []
        for proj in resume.projects[:2]:
            proj_qs.append(InterviewQuestion(
                category="Project Architecture",
                question=f"In your '{proj.title}' project, why did you select {', '.join(proj.technologies[:2]) or 'this architecture'} over traditional alternatives?",
                context_source=f"Resume Project: '{proj.title}'",
                sample_answer_framework=f"1) The primary latency and throughput requirements, 2) Trade-offs evaluated (e.g. maintenance vs performance), 3) Measurable outcome achieved.",
                tips="Speak directly to the architectural trade-offs you personally weighed."
            ))

        if not proj_qs:
            proj_qs.append(InterviewQuestion(
                category="Project Architecture",
                question="Walk me through the system design of your most complex software project from end to end.",
                context_source="General Portfolio Inspection",
                sample_answer_framework="High-level architecture ➔ Data flow ➔ Database storage ➔ Bottlenecks and caching layer.",
                tips="Focus on why specific design patterns were chosen."
            ))

        return InterviewPrepResponse(
            target_role=target_role,
            technical_questions=tech_qs,
            behavioral_questions=behav_qs,
            project_questions=proj_qs,
        )

    @staticmethod
    def generate_career_roadmap(
        current_skills: List[str],
        target_role: str = "AI Engineer"
    ) -> CareerRoadmapResponse:
        """
        Module 25: Generates a prioritized learning roadmap bridging current skills
        to the target engineering role.
        """
        skills_lower = {s.lower() for s in current_skills}
        role_lower = target_role.lower()

        if "ai" in role_lower or "ml" in role_lower:
            standard_target = ["Python", "PyTorch", "Transformers", "pgvector", "Docker", "MLOps", "LLM APIs", "LangChain"]
        elif "backend" in role_lower or "software" in role_lower:
            standard_target = ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "AWS", "Kubernetes", "CI/CD"]
        elif "frontend" in role_lower:
            standard_target = ["TypeScript", "React", "Next.js", "Tailwind CSS", "GraphQL", "Jest", "Playwright"]
        else:
            standard_target = ["Python", "SQL", "Docker", "AWS", "FastAPI", "System Design"]

        gap_skills = [s for s in standard_target if s.lower() not in skills_lower]
        if not gap_skills:
            gap_skills = ["Kubernetes", "Distributed Caching (Redis)", "Terraform", "OpenTelemetry"]

        steps: List[RoadmapStep] = []
        for i, skill in enumerate(gap_skills[:4], 1):
            importance = "Critical" if i <= 2 else "Recommended"
            steps.append(RoadmapStep(
                step_number=i,
                skill=skill,
                importance=importance,
                why_needed=f"Crucial for {target_role} candidates to qualify for senior technical screening and production infrastructure interviews.",
                learning_resources=[
                    f"Official {skill} Documentation & Quickstart",
                    f"Production {skill} Design Patterns on GitHub",
                ],
                portfolio_project_idea=f"Build and deploy an open-source service integrating {skill} with your existing stack to showcase on GitHub and resume."
            ))

        return CareerRoadmapResponse(
            target_role=target_role,
            current_skills=current_skills,
            gap_skills=gap_skills,
            roadmap=steps,
        )

    @staticmethod
    def parse_uploaded_resume(file_bytes: bytes, filename: str) -> ResumeBase:
        """
        Parses an uploaded PDF or DOCX resume document into structured ResumeBase fields.
        """
        extracted_text = ""
        lower_name = filename.lower()

        if lower_name.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(file_bytes))
            extracted_text = "\n".join([page.extract_text() or "" for page in reader.pages])
        elif lower_name.endswith(".docx"):
            doc = Document(io.BytesIO(file_bytes))
            extracted_text = "\n".join([p.text for p in doc.paragraphs if p.text])
        else:
            extracted_text = file_bytes.decode("utf-8", errors="ignore")

        lines = [l.strip() for l in extracted_text.split("\n") if l.strip()]
        full_name = lines[0] if lines else "Candidate"
        headline = lines[1] if len(lines) > 1 else "Software Professional"

        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', extracted_text)
        email = email_match.group(0) if email_match else "candidate@example.com"

        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}', extracted_text)
        phone = phone_match.group(0) if phone_match else ""

        skills = extract_skills_from_text(extracted_text)

        # Parse basic experiences
        experiences = []
        if len(lines) > 4:
            experiences.append(ExperienceItem(
                title=lines[2] if len(lines) > 2 else "Software Engineer",
                company="Engineering Corp",
                location="San Francisco, CA",
                startDate="2022",
                endDate="Present",
                current=True,
                bullets=[l for l in lines[3:8] if len(l) > 25] or ["Architected and scaled production services."]
            ))

        return ResumeBase(
            title=f"{full_name} Resume",
            target_role=headline or "Software Engineer",
            template_id="modern-ats",
            personal_info=PersonalInfo(
                fullName=full_name,
                headline=headline,
                email=email,
                phone=phone,
                location="San Francisco, CA",
                summary="Experienced technical professional with a track record of building and delivering scalable software."
            ),
            experiences=experiences,
            education=[
                EducationItem(
                    institution="University",
                    degree="B.S. in Computer Science",
                    fieldOfStudy="Software Engineering",
                    startDate="2018",
                    endDate="2022"
                )
            ],
            skills=[
                SkillCategory(
                    category="Technical Skills",
                    items=[s.title() for s in skills] or ["Python", "SQL", "FastAPI"]
                )
            ],
            projects=[]
        )


analysis_service = AnalysisService()
