EXTENSION_TO_LANGUAGE = {
    ".py": "Python", ".js": "JavaScript", ".jsx": "JavaScript (React)",
    ".ts": "TypeScript", ".tsx": "TypeScript (React)", ".java": "Java",
    ".cpp": "C++", ".c": "C", ".cs": "C#", ".go": "Go", ".rs": "Rust",
    ".rb": "Ruby", ".php": "PHP", ".swift": "Swift", ".kt": "Kotlin",
    ".md": "Markdown", ".json": "JSON", ".yaml": "YAML", ".yml": "YAML",
    ".html": "HTML", ".css": "CSS", ".sql": "SQL", ".sh": "Shell",
}

def detect_language(filename: str) -> str:
    if filename.lower() == "dockerfile":
        return "Dockerfile"
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return EXTENSION_TO_LANGUAGE.get(ext, "Unknown")

def count_lines(code: str) -> int:
    return sum(1 for line in code.splitlines() if line.strip())

def truncate_code(code: str, max_chars: int = 15000) -> str:
    if len(code) <= max_chars:
        return code
    lines, result, total = code.splitlines(), [], 0
    for line in lines:
        total += len(line) + 1
        if total > max_chars:
            result.append("# ... (truncated)")
            break
        result.append(line)
    return "\n".join(result)
