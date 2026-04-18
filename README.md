# GoalFlow 🚀

AI-powered productivity and business goal tracking platform.

## Features
- ✅ **Daily Task Tracking** — Create task groups with subtasks, track completion %
- 🏢 **Business Goals** — Manage startup/business milestones with action items  
- 🤖 **AI Weekly Summary** — LangGraph agent generates personalized insights
- 🎨 **AI Theme Designer** — Tell the AI your vibe, it picks your perfect theme
- 🔐 **Auth** — Secure JWT-based login/register

## Tech Stack
- **Frontend**: Next.js 14 + Framer Motion + TailwindCSS + Zustand
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **AI**: LangGraph + LangChain + Google Gemini

## Quick Start

### Option 1: Double-click `start.bat`

### Option 2: Manual

**Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Optional: AI Features (Google Gemini)
Edit `backend/.env` and add your Google API key:
```
GOOGLE_API_KEY=your_key_here
```
Get a free key at: https://aistudio.google.com/app/apikey

> The app works fully without an API key — AI features use smart fallback logic.
