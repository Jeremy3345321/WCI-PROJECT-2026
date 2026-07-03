@echo off
title Western Scheduling System
color 0B
cls

========================================
  WESTERN SCHEDULING SYSTEM
========================================

  Starting... Please wait...


tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo   [OK] Apache already running
) else (
    echo   [1/3] Starting Apache...
    start "" /MIN "C:\xampp\apache\bin\httpd.exe"
    timeout /t 3 >nul
    echo         Done!
)

tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo   [OK] MySQL already running
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
echo   Access: http://localhost/westernschedulingmain/
echo.
echo   Keep this window OPEN
echo   Press any key to STOP...
echo.
echo ========================================
pause >nul

echo.
echo   Stopping services...
taskkill /F /IM httpd.exe >nul 2>&1
taskkill /F /IM mysqld.exe >nul 2>&1
echo   Done!
timeout /t 2 >nul
