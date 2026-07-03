@echo off
title Western Scheduling System - Portable Version
color 0B
cls
echo.
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo   Portable Version
echo ========================================
echo.
echo   Starting system... Please wait...
echo.

REM Get current directory
set APP_DIR=%~dp0
cd /d "%APP_DIR%"

REM Check if XAMPP is running
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo   [OK] Apache is already running
) else (
    echo   [1/3] Starting Apache...
    start "" /MIN "C:\xampp\apache\bin\httpd.exe"
    timeout /t 3 >nul
    echo         Done!
)

tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo   [OK] MySQL is already running
) else (
    echo   [2/3] Starting MySQL...
    start "" /MIN "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 3 >nul
    echo         Done!
)

echo   [3/3] Opening browser...
timeout /t 2 >nul
start http://localhost/westernschedulingmain/
echo         Done!

echo.
echo ========================================
echo   SYSTEM IS RUNNING!
echo ========================================
echo.
echo   The system is now open in your browser.
echo.
echo   Access: http://localhost/westernschedulingmain/
echo.
echo   IMPORTANT:
echo   - Keep this window OPEN
echo   - To stop: Press any key
echo.
echo ========================================
echo.
echo   Press any key to STOP the system...
pause >nul

echo.
echo   Stopping services...
taskkill /F /IM httpd.exe >nul 2>&1
taskkill /F /IM mysqld.exe >nul 2>&1
echo   Done!
echo.
echo   You can close this window now.
timeout /t 2 >nul
