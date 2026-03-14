# Rag Git 🔍

> Chat with any GitHub code file using AI — open a file, click the extension, ask anything.

![Python](https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=flat-square&logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-0.3-orange?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b-purple?style=flat-square)

---

## What Is It?

**Rag Git** is a Chrome Extension + FastAPI backend. It reads any GitHub code file, indexes it with AI embeddings, and lets you chat about it using Groq's LLM.

**How it works:**
```
GitHub File → content.js reads DOM → React popup UI
    → POST /api/analyze  → Groq LLM → AI Summary
    → POST /api/chat     → FAISS vector search + Groq → Answer
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Chrome Extension | React 18 + Vite |
| Backend | Python + FastAPI |
| AI Pipeline | LangChain 0.3 (LCEL) + FAISS |
| LLM | Groq `llama-3.3-70b-versatile` |
| Embeddings | HuggingFace `all-MiniLM-L6-v2` (local) |

---

## Setup

### Requirements
- Python 3.11+, Node.js 18+
- [Groq API key](https://console.groq.com/) (free)

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Create `.env`:
```env
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
ALLOWED_ORIGINS=*
MAX_TOKENS=2000
CHUNK_SIZE=500
CHUNK_OVERLAP=50
```

Run:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Chrome Extension

```bash
cd chrome-extension
npm install
npm run build
```

Load in Chrome:
1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked** → select `chrome-extension/dist/`

---

## Usage

1. Start the backend on port 8000
2. Open any GitHub file (URL must contain `/blob/`)
3. Click the **Rag Git** icon in the Chrome toolbar
4. Click **Scan Current File**
5. Read the AI summary, then click **Chat →** to ask questions

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status check |
| `POST` | `/api/analyze` | Generate AI summary of a code file |
| `POST` | `/api/chat` | Ask a question about the code |

Full interactive docs: `http://localhost:8000/docs`

---

## Project Structure

```
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── requirements.txt
│   ├── .env                     # API keys (create this)
│   └── app/
│       ├── api/routes.py        # API endpoints
│       ├── core/config.py       # Settings from .env
│       ├── models/schemas.py    # Request/Response models
│       ├── services/rag_service.py  # RAG pipeline (FAISS + Groq)
│       └── utils/code_utils.py  # Language detection, helpers
│
└── chrome-extension/
    ├── public/manifest.json     # Chrome Extension config
    └── src/
        ├── content.js           # Reads code from GitHub DOM
        ├── background.js        # Service worker
        ├── App.jsx              # Main UI state machine
        ├── components/          # Header, Chat, Summary UI
        ├── hooks/               # useChat, useGitHubCode
        └── services/api.service.js  # Backend API calls
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| "Backend offline" in extension | Run `uvicorn main:app --reload --port 8000` |
| "Could not extract code" | Make sure URL contains `/blob/` and refresh the page |
| First startup is slow | HuggingFace model downloads once (~90MB), cached after |
| Manifest error in Chrome | Load the `dist/` folder, not `src/` |
| `pip install` fails | Try `pip install -r requirements.txt --timeout 120` |

---

## Author

**Harshit Shira** — Built to demonstrate RAG pipelines, LangChain, FastAPI, and Chrome Extension development.

> ⭐ Star this repo if you found it useful!
