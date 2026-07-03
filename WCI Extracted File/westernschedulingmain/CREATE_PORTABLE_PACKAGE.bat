@echo off
title Create Portable Package for Principal
color 0E
cls
echo.
echo ========================================
echo   CREATE PORTABLE PACKAGE
echo   For Principal - No Installation Needed!
echo ========================================
echo.

set PKG=WesternScheduling_Portable
if exist "%PKG%" (
    echo Removing old package...
    rmdir /S /Q "%PKG%"
)

echo Creating portable package...
echo.

echo [1/4] Creating folder structure...
mkdir "%PKG%"
mkdir "%PKG%\app"
echo       Done!

echo [2/4] Copying application files...
xcopy /E /I /Y /Q "api" "%PKG%\app\api\"
xcopy /E /I /Y /Q "assets" "%PKG%\app\assets\"
copy /Y "index.html" "%PKG%\app\"
copy /Y "favicon-32x32.png" "%PKG%\app\"
echo       Done!

echo [3/4] Exporting database...
if exist "C:\xampp\mysql\bin\mysqldump.exe" (
    "C:\xampp\mysql\bin\mysqldump.exe" -u root scheduling_db > "%PKG%\database_backup.sql" 2>nul
    echo       Database exported!
) else (
    echo       [WARNING] mysqldump not found
)

echo [4/4] Creating START script...
(
echo @echo off
echo title Western Scheduling System
echo color 0B
echo cls
echo.
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo ========================================
echo.
echo   Starting... Please wait...
echo.
echo.
REM Check Apache
echo tasklist /FI "IMAGENAME eq httpd.exe" 2^>NUL ^| find /I /N "httpd.exe"^>NUL
echo if "%%ERRORLEVEL%%"=="0" ^(
echo     echo   [OK] Apache already running
echo ^) else ^(
echo     echo   [1/3] Starting Apache...
echo     start "" /MIN "C:\xampp\apache\bin\httpd.exe"
echo     timeout /t 3 ^>nul
echo     echo         Done!
echo ^)
echo.
REM Check MySQL
echo tasklist /FI "IMAGENAME eq mysqld.exe" 2^>NUL ^| find /I /N "mysqld.exe"^>NUL
echo if "%%ERRORLEVEL%%"=="0" ^(
echo     echo   [OK] MySQL already running
echo ^) else ^(
echo     echo   [2/3] Starting MySQL...
echo     start "" /MIN "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
echo     timeout /t 3 ^>nul
echo     echo         Done!
echo ^)
echo.
echo echo   [3/3] Opening browser...
echo timeout /t 2 ^>nul
echo start http://localhost/westernschedulingmain/
echo echo         Done!
echo.
echo echo.
echo echo ========================================
echo echo   SYSTEM IS RUNNING!
echo echo ========================================
echo echo.
echo echo   Access: http://localhost/westernschedulingmain/
echo echo.
echo echo   Keep this window OPEN
echo echo   Press any key to STOP...
echo echo.
echo echo ========================================
echo pause ^>nul
echo.
echo echo.
echo echo   Stopping services...
echo taskkill /F /IM httpd.exe ^>nul 2^>^&1
echo taskkill /F /IM mysqld.exe ^>nul 2^>^&1
echo echo   Done!
echo timeout /t 2 ^>nul
) > "%PKG%\START.bat"
echo       Done!

echo.
echo Creating README...
(
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo   Portable Package
echo ========================================
echo.
echo PARA SA PRINCIPAL:
echo.
echo REQUIREMENTS:
echo   - XAMPP must be installed at C:\xampp
echo   - App files must be in C:\xampp\htdocs\westernschedulingmain\
echo.
echo PAANO GAMITIN:
echo.
echo STEP 1: SETUP ^(One-time^)
echo   1. Install XAMPP sa C:\xampp
echo   2. Copy folder "app" to: C:\xampp\htdocs\westernschedulingmain\
echo   3. Import database_backup.sql via phpMyAdmin
echo.
echo STEP 2: GAMITIN ^(Every time^)
echo   1. Double-click: START.bat
echo   2. Wait 10 seconds
echo   3. Browser opens automatically
echo   4. Use the system!
echo   5. Press any key to stop
echo.
echo ========================================
echo.
echo ALTERNATIVE: Copy entire app folder to C:\xampp\htdocs\
echo Then access: http://localhost/westernschedulingmain/
echo.
echo ========================================
) > "%PKG%\README.txt"

echo.
echo ========================================
echo   PACKAGE CREATED!
echo ========================================
echo.
echo Location: %PKG%\
echo.
echo Contents:
echo   - app\              ^(application files^)
echo   - database_backup.sql
echo   - START.bat
echo   - README.txt
echo.
echo NEXT STEPS:
echo   1. Copy "%PKG%" folder to USB
echo   2. Give to principal
echo   3. Principal follows README.txt
echo.
echo ========================================
echo.
pause
