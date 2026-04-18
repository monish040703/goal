@echo off
echo Starting GoalFlow App...
echo.
echo [1/2] Starting Backend (FastAPI)...
start "GoalFlow Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --port 8000"
timeout /t 2 /nobreak >nul
echo [2/2] Starting Frontend (Next.js)...
start "GoalFlow Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo GoalFlow is starting!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
pause
