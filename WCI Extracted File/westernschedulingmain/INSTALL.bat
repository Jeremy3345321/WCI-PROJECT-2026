@echo off
title Western Scheduling System - One-Click Installer
color 0A
echo.
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo   One-Click Installer
echo ========================================
echo.
echo Installing... Please wait...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please run as Administrator!
    echo Right-click this file and select "Run as administrator"
    echo.
    pause
    exit
)

REM Set installation directory
set INSTALL_DIR=C:\WesternScheduling
echo Installation Directory: %INSTALL_DIR%
echo.

REM Create installation directory
if not exist "%INSTALL_DIR%" (
    echo [1/6] Creating installation directory...
    mkdir "%INSTALL_DIR%"
    echo       Done!
) else (
    echo [1/6] Installation directory already exists
)
echo.

REM Copy application files
echo [2/6] Copying application files...
xcopy /E /I /Y "api" "%INSTALL_DIR%\api\" >nul
xcopy /E /I /Y "assets" "%INSTALL_DIR%\assets\" >nul
copy /Y "index.html" "%INSTALL_DIR%\" >nul
copy /Y "favicon-32x32.png" "%INSTALL_DIR%\" >nul
if exist "electron-main.js" copy /Y "electron-main.js" "%INSTALL_DIR%\" >nul
if exist "package.json" copy /Y "package.json" "%INSTALL_DIR%\" >nul
echo       Done!
echo.

REM Download and install XAMPP portable (if not exists)
if not exist "%INSTALL_DIR%\xampp" (
    echo [3/6] XAMPP not found. Please download XAMPP Portable manually:
    echo       https://www.apachefriends.org/download.html
    echo       Extract to: %INSTALL_DIR%\xampp\
    echo.
    echo       After extracting XAMPP, run this installer again.
    echo.
    pause
    exit
) else (
    echo [3/6] XAMPP found!
    echo       Done!
)
echo.

REM Setup database
echo [4/6] Setting up database...
if exist "database_backup.sql" (
    echo       Importing database...
    "%INSTALL_DIR%\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS scheduling_db;" 2>nul
    "%INSTALL_DIR%\xampp\mysql\bin\mysql.exe" -u root scheduling_db < "database_backup.sql" 2>nul
    echo       Done!
) else (
    echo       [WARNING] database_backup.sql not found
    echo       You'll need to import database manually
)
echo.

REM Create START.bat in installation directory
echo [5/6] Creating startup script...
(
echo @echo off
echo title Western Scheduling System
echo color 0B
echo cls
echo.
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo   Starting...
echo ========================================
echo.
echo.
echo [1/3] Starting Apache...
echo.
start "" "%INSTALL_DIR%\xampp\apache\bin\httpd.exe"
timeout /t 3 >nul
echo       Apache started!
echo.
echo [2/3] Starting MySQL...
echo.
start "" "%INSTALL_DIR%\xampp\mysql\bin\mysqld.exe" --defaults-file="%INSTALL_DIR%\xampp\mysql\bin\my.ini"
timeout /t 3 >nul
echo       MySQL started!
echo.
echo [3/3] Opening browser...
echo.
timeout /t 2 >nul
start http://localhost/index.html
echo       Browser opened!
echo.
echo ========================================
echo   SYSTEM IS RUNNING!
echo ========================================
echo.
echo   Access the system at:
echo   http://localhost/index.html
echo.
echo   Press any key to STOP the system...
echo ========================================
pause >nul
echo.
echo Stopping services...
taskkill /F /IM httpd.exe >nul 2>&1
taskkill /F /IM mysqld.exe >nul 2>&1
echo.
echo System stopped. You can close this window.
timeout /t 2 >nul
) > "%INSTALL_DIR%\START.bat"
echo       Done!
echo.

REM Create desktop shortcut
echo [6/6] Creating desktop shortcut...
set DESKTOP=%USERPROFILE%\Desktop
(
echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
echo sLinkFile = "%DESKTOP%\Western Scheduling.lnk"
echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
echo oLink.TargetPath = "%INSTALL_DIR%\START.bat"
echo oLink.WorkingDirectory = "%INSTALL_DIR%"
echo oLink.IconLocation = "%INSTALL_DIR%\favicon-32x32.png"
echo oLink.Description = "Western Scheduling System"
echo oLink.Save
) > "%TEMP%\CreateShortcut.vbs"
cscript //nologo "%TEMP%\CreateShortcut.vbs"
del "%TEMP%\CreateShortcut.vbs"
echo       Done!
echo.

echo ========================================
echo   INSTALLATION COMPLETE!
echo ========================================
echo.
echo Installation location: %INSTALL_DIR%
echo.
echo Desktop shortcut created: "Western Scheduling"
echo.
echo TO START THE SYSTEM:
echo   1. Double-click "Western Scheduling" on desktop
echo   OR
echo   2. Run: %INSTALL_DIR%\START.bat
echo.
echo ========================================
echo.
pause
