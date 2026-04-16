@echo off
echo ============================================================
echo SMILE v2.0 - Installation Script
echo ============================================================
echo This will install all required dependencies for SMILE
echo Please ensure you have Python 3.11+ and Node.js 18+ installed
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.11 or higher from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

echo [STEP 1/4] Installing Backend Dependencies...
echo ============================================================
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Backend installation failed
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed
echo.
cd ..

echo [STEP 2/4] Installing ML Dependencies...
echo ============================================================
cd ml
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] ML installation failed
    pause
    exit /b 1
)
echo [SUCCESS] ML dependencies installed
echo.
cd ..

echo [STEP 3/4] Installing Frontend Dependencies...
echo ============================================================
cd frontend
call npm install
if errorlevel 1 (
    echo [ERROR] Frontend installation failed
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed
echo.
cd ..

echo [STEP 4/4] Training ML Model...
echo ============================================================
cd ml
python train_model.py
if errorlevel 1 (
    echo [WARNING] ML model training failed
    echo You can train it manually later by running: cd ml && python train_model.py
) else (
    echo [SUCCESS] ML model trained successfully
)
cd ..

echo.
echo ============================================================
echo INSTALLATION COMPLETE!
echo ============================================================
echo.
echo All dependencies have been installed successfully.
echo.
echo Next Steps:
echo 1. Run 'start_smile.bat' to start the application
echo 2. Access the application at http://localhost:5173
echo 3. Default login: admin / admin123
echo.
echo ============================================================
echo Press any key to exit...
pause >nul
