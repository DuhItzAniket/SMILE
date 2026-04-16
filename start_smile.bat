@echo off
echo ============================================================
echo SMILE v2.0 - Starting Application
echo ============================================================
echo.

REM Start Backend in new window
echo [1/3] Starting Backend Server...
start "SMILE Backend" cmd /k "cd backend && python main.py"

REM Wait 5 seconds for backend to initialize
echo [2/3] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start Frontend in new window
echo [3/3] Starting Frontend Server...
start "SMILE Frontend" cmd /k "cd frontend && npm run dev"

REM Wait 8 seconds for frontend to build and start
echo Waiting for frontend to build...
timeout /t 8 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:5173

echo.
echo ============================================================
echo SMILE Application Started Successfully!
echo ============================================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to close this window (servers will keep running)
echo To stop servers, close the Backend and Frontend windows
echo ============================================================
pause >nul
