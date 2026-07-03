@echo off
title Western Scheduling System
color 0B
cls
echo.
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo ========================================
echo.
echo   Starting system...
echo.

REM Check if XAMPP is running
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo   Apache is already running!
) else (
    echo   Starting Apache...
    cd /d "%~dp0"
    start "" xampp-control.exe
    timeout /t 5 >nul
)

echo.
echo   Opening browser...
timeout /t 2 >nul
start http://localhost/westernschedulingmain/
echo.
echo ========================================
echo   SYSTEM IS READY!
echo ========================================
echo.
echo   The system is now running in your browser.
echo.
echo   IMPORTANT:
echo   - Keep this window open
echo   - Keep XAMPP Control Panel open
echo   - Make sure Apache and MySQL are running
echo.
echo   To stop: Close XAMPP Control Panel
echo.
echo ========================================
echo.
pause
