@echo off
echo ========================================
echo Western Scheduling System - Builder
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking Node.js version...
node --version
echo.

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo [2/4] Installing dependencies...
    echo This will take 2-3 minutes...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo [2/4] Dependencies already installed
)
echo.

echo [3/4] Building Windows installer...
echo This will take 5-10 minutes...
echo Please wait...
call npm run build-win
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [4/4] Creating distribution package...
if not exist "DISTRIBUTION\" mkdir DISTRIBUTION

REM Copy installer
copy "dist\Western Scheduling System Setup*.exe" "DISTRIBUTION\" >nul 2>nul

REM Copy documentation
copy "ELECTRON_SETUP.md" "DISTRIBUTION\SETUP_GUIDE.md" >nul 2>nul
copy "DEPLOYMENT_GUIDE.md" "DISTRIBUTION\DEPLOYMENT_GUIDE.md" >nul 2>nul

REM Create installation instructions
echo WESTERN SCHEDULING SYSTEM - INSTALLATION > "DISTRIBUTION\README.txt"
echo. >> "DISTRIBUTION\README.txt"
echo 1. REQUIREMENTS: >> "DISTRIBUTION\README.txt"
echo    - Windows 10/11 >> "DISTRIBUTION\README.txt"
echo    - PHP installed (check: php --version) >> "DISTRIBUTION\README.txt"
echo    - MySQL installed >> "DISTRIBUTION\README.txt"
echo. >> "DISTRIBUTION\README.txt"
echo 2. INSTALLATION: >> "DISTRIBUTION\README.txt"
echo    - Double-click the .exe file >> "DISTRIBUTION\README.txt"
echo    - Follow the installation wizard >> "DISTRIBUTION\README.txt"
echo    - Click Finish >> "DISTRIBUTION\README.txt"
echo. >> "DISTRIBUTION\README.txt"
echo 3. CONFIGURATION: >> "DISTRIBUTION\README.txt"
echo    - Edit api/config.php in installation folder >> "DISTRIBUTION\README.txt"
echo    - Set your database credentials >> "DISTRIBUTION\README.txt"
echo. >> "DISTRIBUTION\README.txt"
echo 4. RUN: >> "DISTRIBUTION\README.txt"
echo    - Double-click desktop shortcut >> "DISTRIBUTION\README.txt"
echo    - Or find in Start Menu >> "DISTRIBUTION\README.txt"
echo. >> "DISTRIBUTION\README.txt"
echo For detailed instructions, see SETUP_GUIDE.md >> "DISTRIBUTION\README.txt"
echo For deployment options, see DEPLOYMENT_GUIDE.md >> "DISTRIBUTION\README.txt"

echo.
echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Files created in DISTRIBUTION folder:
echo - Western Scheduling System Setup.exe (installer)
echo - README.txt (quick start)
echo - SETUP_GUIDE.md (detailed setup)
echo - DEPLOYMENT_GUIDE.md (deployment options)
echo.
echo You can now:
echo 1. Copy DISTRIBUTION folder to USB drive
echo 2. Share via network
echo 3. Upload to cloud storage
echo.
echo Total size: ~150-200 MB
echo.
pause
