@echo off
title Import Database
color 0A
cls
echo.
echo ========================================
echo   IMPORT DATABASE
echo ========================================
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL status...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo       [OK] MySQL is running
) else (
    echo       [WARNING] MySQL is NOT running
    echo       Starting MySQL...
    start "" /MIN "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    echo       Waiting 10 seconds...
    timeout /t 10 >nul
)
echo.

REM Check if SQL file exists
echo [2/4] Checking SQL file...
if not exist "database_backup.sql" (
    echo       [ERROR] database_backup.sql not found!
    echo.
    echo       Please make sure the SQL file is in this folder.
    echo.
    pause
    exit /b 1
)
echo       [OK] database_backup.sql found
for %%A in ("database_backup.sql") do echo       File size: %%~zA bytes
echo.

REM Create database
echo [3/4] Creating database...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS scheduling_db;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo       [OK] Database created/exists
) else (
    echo       [ERROR] Failed to create database
    echo       Make sure MySQL is running!
    pause
    exit /b 1
)
echo.

REM Import SQL file
echo [4/4] Importing data...
echo       This may take a few seconds...
"C:\xampp\mysql\bin\mysql.exe" -u root scheduling_db < database_backup.sql 2>nul
if %ERRORLEVEL% EQU 0 (
    echo       [OK] Data imported successfully!
) else (
    echo       [ERROR] Import failed!
    echo       Check if SQL file is valid.
)
echo.

REM Verify import
echo Verifying import...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "SELECT COUNT(*) as 'Tables' FROM information_schema.tables WHERE table_schema = 'scheduling_db';" 2>nul
echo.

echo ========================================
echo   IMPORT COMPLETE!
echo ========================================
echo.
echo Database: scheduling_db
echo Status: Ready to use
echo.
echo You can now use the scheduling system!
echo.
pause
