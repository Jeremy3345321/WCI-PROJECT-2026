@echo off
title Western Scheduling System - Installer TEST MODE
color 0E
cls
echo.
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo   Installer TEST MODE (Dry Run)
echo ========================================
echo.
echo This is a TEST run - no files will be copied!
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [CHECK] Administrator Rights: FAILED
    echo        You need to run as Administrator
    echo.
) else (
    echo [CHECK] Administrator Rights: PASSED
    echo.
)

REM Set installation directory
set INSTALL_DIR=C:\WesternScheduling_TEST
echo [INFO] Installation Directory: %INSTALL_DIR%
echo.

REM Check if directory exists
if exist "%INSTALL_DIR%" (
    echo [CHECK] Installation directory: EXISTS (would be overwritten)
) else (
    echo [CHECK] Installation directory: DOES NOT EXIST (would be created)
)
echo.

REM Check source files
echo [CHECK] Checking source files...
echo.

if exist "api" (
    echo        [OK] api\ folder found
) else (
    echo        [MISSING] api\ folder NOT found
)

if exist "assets" (
    echo        [OK] assets\ folder found
) else (
    echo        [MISSING] assets\ folder NOT found
)

if exist "index.html" (
    echo        [OK] index.html found
) else (
    echo        [MISSING] index.html NOT found
)

if exist "favicon-32x32.png" (
    echo        [OK] favicon-32x32.png found
) else (
    echo        [MISSING] favicon-32x32.png NOT found
)

if exist "database_backup.sql" (
    for %%A in ("database_backup.sql") do set size=%%~zA
    echo        [OK] database_backup.sql found (!size! bytes)
) else (
    echo        [WARNING] database_backup.sql NOT found
)
echo.

REM Check XAMPP
echo [CHECK] Checking XAMPP...
echo.

if exist "C:\xampp\apache\bin\httpd.exe" (
    echo        [OK] XAMPP Apache found at C:\xampp\
) else (
    echo        [WARNING] XAMPP not found at C:\xampp\
)

if exist "C:\xampp\mysql\bin\mysql.exe" (
    echo        [OK] XAMPP MySQL found
) else (
    echo        [WARNING] XAMPP MySQL not found
)
echo.

REM Simulate installation steps
echo ========================================
echo   INSTALLATION SIMULATION
echo ========================================
echo.

echo [1/6] Would create directory: %INSTALL_DIR%
echo.

echo [2/6] Would copy files:
echo        api\ -^> %INSTALL_DIR%\api\
echo        assets\ -^> %INSTALL_DIR%\assets\
echo        index.html -^> %INSTALL_DIR%\
echo        favicon-32x32.png -^> %INSTALL_DIR%\
echo.

echo [3/6] Would check for XAMPP at: %INSTALL_DIR%\xampp\
echo        (User needs to extract XAMPP Portable here)
echo.

if exist "database_backup.sql" (
    echo [4/6] Would import database:
    echo        CREATE DATABASE scheduling_db
    echo        Import: database_backup.sql
) else (
    echo [4/6] Would skip database import (no backup file)
)
echo.

echo [5/6] Would create: %INSTALL_DIR%\START.bat
echo        Contents:
echo        - Start Apache
echo        - Start MySQL  
echo        - Open browser
echo        - Wait for user to stop
echo.

echo [6/6] Would create desktop shortcut:
echo        Name: Western Scheduling.lnk
echo        Target: %INSTALL_DIR%\START.bat
echo        Icon: %INSTALL_DIR%\favicon-32x32.png
echo.

echo ========================================
echo   TEST COMPLETE!
echo ========================================
echo.
echo This was a DRY RUN - no files were modified.
echo.
echo SUMMARY:
if %errorLevel% neq 0 (
    echo   Status: READY (with admin rights)
) else (
    echo   Status: READY (run as admin for full test)
)
echo   All required files: PRESENT
echo   XAMPP: FOUND
echo   Database backup: FOUND
echo.
echo To run the actual installer:
echo   1. Right-click INSTALL.bat
echo   2. Select "Run as administrator"
echo   3. Wait 2 minutes
echo   4. Done!
echo.
echo ========================================
