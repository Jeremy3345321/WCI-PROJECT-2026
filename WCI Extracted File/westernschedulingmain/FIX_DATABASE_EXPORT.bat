@echo off
title Fix Database Export
color 0E
cls
echo.
echo ========================================
echo   FIX DATABASE EXPORT
echo ========================================
echo.
echo Checking MySQL status...
echo.

REM Check if MySQL is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is already running
    goto :export
) else (
    echo [WARNING] MySQL is NOT running
    echo.
    echo Starting MySQL...
    start "" /MIN "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    echo Waiting 10 seconds for MySQL to start...
    timeout /t 10 >nul
    echo.
)

:export
echo Checking if database exists...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "SHOW DATABASES LIKE 'scheduling_db';" 2>nul | find "scheduling_db" >nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Database 'scheduling_db' does not exist!
    echo.
    echo Please create the database first:
    echo   1. Open XAMPP Control Panel
    echo   2. Start Apache and MySQL
    echo   3. Click "Admin" next to MySQL
    echo   4. Create database: scheduling_db
    echo   5. Import your SQL file
    echo.
    pause
    exit /b 1
)

echo [OK] Database 'scheduling_db' found
echo.

echo Exporting database...
"C:\xampp\mysql\bin\mysqldump.exe" -u root scheduling_db > database_backup.sql 2>&1

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Database exported to: database_backup.sql
    for %%A in ("database_backup.sql") do echo File size: %%~zA bytes
    echo.
) else (
    echo.
    echo ========================================
    echo   EXPORT FAILED!
    echo ========================================
    echo.
    echo Please check:
    echo   1. MySQL is running
    echo   2. Database 'scheduling_db' exists
    echo   3. Database has tables
    echo.
)

echo.
pause
