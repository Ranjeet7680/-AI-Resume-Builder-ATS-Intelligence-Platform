from typing import Dict, Any, List, Set
from app.schemas.resume import ResumeBase
from app.utils.text_processing import (
    POWER_ACTION_VERBS,
    TECH_KEYWORDS_TAXONOMY,
    extract_skills_from_text,
    find_action_verbs,
    count_metrics_and_numbers,
)


class ATSService:
    @staticmethod
    def analyze_resume(
        resume: ResumeBase,
        target_role: str = None,
        job_description: str = None
    ) -> Dict[str, Any]:
        """
        Executes comprehensive ATS analysis evaluating Keywords, Skills,
        Experience Impact, Measurable Achievements, and ATS Formatting.
        """
        suggestions: List[str] = []
        strong_points: List[str] = []
        formatting_issues: List[str] = []

        # 1. Aggregate all resume text
        all_bullets: List[str] = []
        for exp in resume.experiences:
            all_bullets.extend(exp.bullets)
        for proj in resume.projects:
            all_bullets.extend(proj.bullets)

        resume_full_text = " ".join([
            resume.personal_info.summary or "",
            resume.personal_info.headline or "",
            " ".join(all_bullets),
            " ".join([item for cat in resume.skills for item in cat.items]),
            " ".join([f"{edu.degree} {edu.fieldOfStudy or ''}" for edu in resume.education]),
        ]).lower()

        # 2. Extract resume skills
        explicit_skills: Set[str] = set()
        for cat in resume.skills:
            for item in cat.items:
                explicit_skills.add(item.strip().lower())

        detected_skills = set(extract_skills_from_text(resume_full_text))
        all_candidate_skills = explicit_skills.union(detected_skills)

        # 3. Target keywords extraction (from job description or role defaults)
        target_keywords: Set[str] = set()
        if job_description:
            target_keywords = set(extract_skills_from_text(job_description))
        elif target_role:
            target_keywords = set(extract_skills_from_text(target_role))
            # Add standard foundational skills if role matched
            if "software" in target_role.lower() or "backend" in target_role.lower():
                target_keywords.update({"python", "sql", "git", "docker", "rest api", "ci/cd"})
            elif "frontend" in target_role.lower():
                target_keywords.update({"javascript", "typescript", "react", "html", "css", "next.js"})
            elif "data" in target_role.lower() or "ai" in target_role.lower():
                target_keywords.update({"python", "sql", "machine learning", "pytorch", "transformers"})

        if not target_keywords:
            target_keywords = {"python", "git", "rest api", "docker", "sql"}

        # Calculate Keyword & Skill Overlap
        matched_keywords = sorted(list(target_keywords.intersection(all_candidate_skills)))
        missing_keywords = sorted(list(target_keywords.difference(all_candidate_skills)))

        keyword_ratio = len(matched_keywords) / max(len(target_keywords), 1)
        keywords_score = min(int(keyword_ratio * 100), 100)
        skills_score = min(int(len(all_candidate_skills) / 8 * 100), 100)

        if missing_keywords:
            suggestions.append(f"Consider integrating missing target technologies: {', '.join(missing_keywords[:4])}.")
        else:
            strong_points.append("Outstanding keyword alignment with target engineering roles.")

        # 4. Action Verbs & Experience Scoring
        action_verb_count = 0
        for bullet in all_bullets:
            verbs = find_action_verbs(bullet)
            if verbs:
                action_verb_count += 1

        total_bullets = max(len(all_bullets), 1)
        action_verb_ratio = action_verb_count / total_bullets
        experience_score = min(int(action_verb_ratio * 100) + 20, 100)

        if action_verb_ratio < 0.6:
            suggestions.append("Begin more bullet points with high-impact action verbs (e.g., 'Architected', 'Spearheaded', 'Optimized').")
        else:
            strong_points.append(f"{action_verb_count} bullets feature strong, recruiter-preferred action verbs.")

        # 5. Achievements & Quantifiable Metrics Scoring
        metric_count = 0
        for bullet in all_bullets:
            count, _ = count_metrics_and_numbers(bullet)
            if count > 0:
                metric_count += 1

        metric_ratio = metric_count / total_bullets
        achievements_score = min(int(metric_ratio * 140) + 15, 100)

        if metric_ratio < 0.4:
            suggestions.append("Add quantifiable business metrics (e.g., '% latency reduced', 'X users supported', '$ saved').")
        else:
            strong_points.append(f"Strong quantification: {metric_count} bullets contain measurable data and performance metrics.")

        # 6. Formatting & Structural Compliance
        formatting_score = 100
        p = resume.personal_info

        if not p.email:
            formatting_issues.append("Missing primary email address.")
            formatting_score -= 20
        if not p.phone:
            formatting_issues.append("Missing contact phone number.")
            formatting_score -= 10
        if not p.linkedin and not p.github:
            formatting_issues.append("Add LinkedIn or GitHub profile link for technical recruiter verification.")
            formatting_score -= 10
        if not resume.experiences:
            formatting_issues.append("No work experience section found.")
            formatting_score -= 25
        if not resume.education:
            formatting_issues.append("No education entries listed.")
            formatting_score -= 15
        if not resume.skills:
            formatting_issues.append("Dedicated skills section is empty.")
            formatting_score -= 15

        formatting_score = max(formatting_score, 40)
        if not formatting_issues:
            strong_points.append("Clean, single-column ATS-parsable document structure with all primary headers.")

        # 7. Composite Overall ATS Score
        overall_score = int(
            (keywords_score * 0.30) +
            (skills_score * 0.20) +
            (experience_score * 0.20) +
            (achievements_score * 0.15) +
            (formatting_score * 0.15)
        )

        return {
            "overall_score": overall_score,
            "breakdown": {
                "overall": overall_score,
                "keywords": keywords_score,
                "skills": skills_score,
                "experience": experience_score,
                "formatting": formatting_score,
                "achievements": achievements_score,
            },
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords,
            "action_verb_count": action_verb_count,
            "metric_count": metric_count,
            "formatting_issues": formatting_issues,
            "strong_points": strong_points,
            "suggestions": suggestions or ["Resume is highly optimized for applicant tracking systems!"]
        }


ats_service = ATSService()
