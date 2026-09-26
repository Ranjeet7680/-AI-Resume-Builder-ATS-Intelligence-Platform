import re
from typing import List, Set, Tuple

# Comprehensive list of strong ATS action verbs
POWER_ACTION_VERBS: Set[str] = {
    # Engineering & Building
    "architected", "built", "constructed", "created", "designed", "developed", 
    "engineered", "implemented", "launched", "migrated", "refactored", "spearheaded",
    # Optimization & Performance
    "accelerated", "boosted", "consolidated", "decreased", "doubled", "enhanced",
    "expedited", "improved", "increased", "maximized", "minimized", "optimized",
    "reduced", "scaled", "streamlined", "transformed", "upgraded",
    # Leadership & Delivery
    "championed", "collaborated", "coordinated", "delivered", "directed", 
    "established", "guided", "led", "managed", "mentored", "orchestrated",
    # Analytical & Problem Solving
    "analyzed", "audited", "automated", "benchmarked", "diagnosed", "evaluated",
    "formulated", "identified", "investigated", "quantified", "resolved", "solved"
}

# Regex for detecting quantifiable metrics (percentages, money, numbers with multipliers)
METRIC_REGEX = re.compile(
    r'(\b\d+(\.\d+)?%\b|\$\d+([,\.]\d+)?\s*(k|m|b|million|billion)?|\b\d+[xX]\b|\b\d+\+?\s*(users|requests|ms|seconds|minutes|hours|qps|rps|tb|gb|days|team members|engineers)\b)',
    re.IGNORECASE
)

# Common Technical Skills & Taxonomy for NER/Extraction
TECH_KEYWORDS_TAXONOMY: Set[str] = {
    # Languages
    "python", "javascript", "typescript", "golang", "go", "java", "c++", "c#", "rust", "ruby", "php", "sql", "html", "css",
    # Frameworks & Libraries
    "react", "next.js", "vue", "angular", "node.js", "express", "fastapi", "django", "flask", "spring boot", "rails", "tailwind",
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "k8s", "terraform", "ci/cd", "github actions", "gitlab", "ansible", "helm",
    # Databases & Storage
    "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch", "dynamodb", "sqlite", "pgvector", "cassandra",
    # AI & ML
    "machine learning", "deep learning", "nlp", "llm", "transformers", "pytorch", "tensorflow", "langchain", "scikit-learn", "openai",
    # Architecture & Practices
    "microservices", "rest api", "graphql", "grpc", "system design", "agile", "scrum", "tdd", "event-driven", "kafka", "rabbitmq"
}


def extract_skills_from_text(text: str) -> List[str]:
    """Extracts technical skills found in text matching the taxonomy."""
    text_lower = text.lower()
    matched = []
    for skill in TECH_KEYWORDS_TAXONOMY:
        # Match as whole word/phrase
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            matched.append(skill)
    return sorted(list(set(matched)))


def find_action_verbs(text: str) -> List[str]:
    """Identifies power action verbs in the text."""
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    found = [w for w in words if w in POWER_ACTION_VERBS]
    return list(set(found))


def count_metrics_and_numbers(text: str) -> Tuple[int, List[str]]:
    """Detects numbers, metrics, and quantifiable results in text."""
    matches = METRIC_REGEX.findall(text)
    metric_strings = [m[0] for m in matches if m[0]]
    # Also find standalone numbers > 1
    standalone_numbers = re.findall(r'\b\d{2,}\b', text)
    combined = list(set(metric_strings + standalone_numbers))
    return len(combined), combined
