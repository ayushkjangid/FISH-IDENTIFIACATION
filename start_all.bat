@echo off
echo ===================================================
echo Starting AAIDES Career Assessment / Fish Identifier
echo ===================================================

echo [1/3] Starting Python ML Service (Port 8000)...
start cmd /k "cd /d "%~dp0ML_Service" && call "..\fish_project_env_new\Scripts\activate.bat" && uvicorn main:app --reload --port 8000"

echo [2/3] Starting Node.js Backend (Port 5000)...
start cmd /k "cd /d "%~dp0Backend" && npm run dev"

echo [3/3] Starting React Frontend (Port 5173)...
start cmd /k "cd /d "%~dp0Frontend" && npm run dev"

echo.
echo All services have been started in separate windows!
echo ML Service: http://localhost:8000
echo Backend API: http://localhost:5000
echo Frontend UI: http://localhost:5173
echo.
pause
