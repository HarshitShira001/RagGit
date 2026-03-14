const BASE_URL = "http://localhost:8000/api";

async function post(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Request failed: ${response.status}`);
  }
  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) throw new Error("Backend offline");
  return response.json();
}

export async function analyzeCode({ code, filename, language }) {
  return post("/analyze", { code, filename, language });
}

export async function chatWithCode({ question, code, filename, language, chatHistory = [] }) {
  return post("/chat", { question, code, filename, language, chat_history: chatHistory });
}
