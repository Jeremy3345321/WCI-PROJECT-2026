@echo off
title Start MySQL via XAMPP
color 0B
cls
echo.
echo ========================================
echo   STARTING MYSQL VIA XAMPP
echo ========================================
echo.

echo Opening XAMPP Control Panel...
start "" "C:\xampp\xampp-control.exe"
echo.
echo ========================================
echo   INSTRUCTIONS:
echo ========================================
echo.
echo 1. XAMPP Control Panel should open
echo 2. Find "MySQL" row
echo 3. Click "Start" button
echo 4. Wait for status to turn GREEN
echo 5. Status should say "Running"
echo.
echo After MySQL is running:
echo   - Run: FIX_DATABASE_EXPORT.bat
echo   - This will export your database
echo.
echo ========================================
echo.
pause
