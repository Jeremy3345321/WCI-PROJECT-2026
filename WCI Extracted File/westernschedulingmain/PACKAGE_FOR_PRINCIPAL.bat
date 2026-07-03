@echo off
title Create Package for Principal
color 0E
echo.
echo ========================================
echo   CREATE PACKAGE FOR PRINCIPAL
echo ========================================
echo.
echo This will create a complete package that
echo the principal can use with ONE CLICK!
echo.
pause
echo.

REM Create package directory
set PKG_DIR=WesternScheduling_Package
if exist "%PKG_DIR%" (
    echo Removing old package...
    rmdir /S /Q "%PKG_DIR%"
)
echo Creating package directory...
mkdir "%PKG_DIR%"
echo.

REM Copy application files
echo [1/5] Copying application files...
xcopy /E /I /Y "api" "%PKG_DIR%\westernschedulingmain\api\" >nul
xcopy /E /I /Y "assets" "%PKG_DIR%\westernschedulingmain\assets\" >nul
copy /Y "index.html" "%PKG_DIR%\westernschedulingmain\" >nul
copy /Y "favicon-32x32.png" "%PKG_DIR%\westernschedulingmain\" >nul
if exist "favicon_io" xcopy /E /I /Y "favicon_io" "%PKG_DIR%\westernschedulingmain\favicon_io\" >nul
echo       Done!
echo.

REM Export database
echo [2/5] Exporting database...
if exist "C:\xampp\mysql\bin\mysqldump.exe" (
    "C:\xampp\mysql\bin\mysqldump.exe" -u root scheduling_db > "%PKG_DIR%\database_backup.sql" 2>nul
    echo       Database exported!
) else (
    echo       [WARNING] mysqldump not found
    echo       Please export database manually
)
echo.

REM Create START.bat for principal
echo [3/5] Creating startup script...
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
echo [1/2] Starting XAMPP...
echo.
cd /d "%%~dp0"
start "" xampp-control.exe
echo       XAMPP Control Panel opened!
echo.
echo       IMPORTANT: Click START on:
echo       - Apache
echo       - MySQL
echo.
echo       Wait 10 seconds for services to start...
timeout /t 10 >nul
echo.
echo [2/2] Opening browser...
echo.
start http://localhost/westernschedulingmain/
echo       Browser opened!
echo.
echo ========================================
echo   SYSTEM IS READY!
echo ========================================
echo.
echo   Access the system at:
echo   http://localhost/westernschedulingmain/
echo.
echo   KEEP THIS WINDOW OPEN while using the system
echo.
echo   To stop: Close XAMPP Control Panel
echo.
echo ========================================
echo.
pause
) > "%PKG_DIR%\START.bat"
echo       Done!
echo.

REM Create README for principal
echo [4/5] Creating instructions...
(
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo   Installation Instructions
echo ========================================
echo.
echo PARA SA PRINCIPAL:
echo.
echo STEP 1: INSTALL XAMPP
echo   1. Download XAMPP from: https://www.apachefriends.org/download.html
echo   2. Install to: C:\xampp
echo   3. During installation, select: Apache, MySQL, PHP
echo.
echo STEP 2: COPY FILES
echo   1. Copy folder "westernschedulingmain" to: C:\xampp\htdocs\
echo   2. Final path should be: C:\xampp\htdocs\westernschedulingmain\
echo.
echo STEP 3: IMPORT DATABASE
echo   1. Open XAMPP Control Panel
echo   2. Start Apache and MySQL
echo   3. Click "Admin" button next to MySQL
echo   4. Create new database: "scheduling_db"
echo   5. Import file: database_backup.sql
echo.
echo STEP 4: RUN THE SYSTEM
echo   1. Double-click: START.bat
echo   2. Wait for browser to open
echo   3. System is ready!
echo.
echo ========================================
echo.
echo ALTERNATIVE: ONE-CLICK METHOD
echo.
echo If you want SUPER EASY installation:
echo   1. Copy this entire folder to USB drive
echo   2. Install XAMPP Portable instead
echo   3. Extract XAMPP to this folder
echo   4. Double-click START.bat
echo   5. Done!
echo.
echo ========================================
echo.
echo TROUBLESHOOTING:
echo.
echo Problem: Port 80 already in use
echo Solution: Stop Skype or other programs using port 80
echo.
echo Problem: MySQL won't start
echo Solution: Stop other MySQL services
echo.
echo Problem: Page not found
echo Solution: Check if files are in C:\xampp\htdocs\westernschedulingmain\
echo.
echo ========================================
echo.
echo For help, contact the developer.
echo.
) > "%PKG_DIR%\README.txt"
echo       Done!
echo.

REM Create quick guide in Tagalog
echo [5/5] Creating Tagalog guide...
(
echo ========================================
echo   WESTERN SCHEDULING SYSTEM
echo   Gabay sa Pag-install
echo ========================================
echo.
echo PARA SA PRINCIPAL - MADALING PARAAN:
echo.
echo STEP 1: I-INSTALL ANG XAMPP
echo   1. Download dito: https://www.apachefriends.org/download.html
echo   2. I-install sa: C:\xampp
echo   3. Piliin: Apache, MySQL, PHP
echo   4. Tapos na! ^(5 minutes^)
echo.
echo STEP 2: I-COPY ANG FILES
echo   1. Buksan: C:\xampp\htdocs\
echo   2. I-copy dito ang folder "westernschedulingmain"
echo   3. Dapat ganito: C:\xampp\htdocs\westernschedulingmain\
echo.
echo STEP 3: I-IMPORT ANG DATABASE
echo   1. Buksan ang XAMPP Control Panel
echo   2. I-click ang START sa Apache
echo   3. I-click ang START sa MySQL
echo   4. I-click ang ADMIN sa MySQL
echo   5. Gumawa ng database: "scheduling_db"
echo   6. I-import ang file: database_backup.sql
echo.
echo STEP 4: GAMITIN NA!
echo   1. Double-click: START.bat
echo   2. Hintayin ang browser
echo   3. Tapos na! Pwede na gamitin!
echo.
echo ========================================
echo.
echo PINAKAMADALING PARAAN:
echo.
echo Kung gusto mo ONE-CLICK lang:
echo.
echo   1. I-download ang XAMPP PORTABLE
echo      ^(hindi yung regular XAMPP^)
echo.
echo   2. I-extract sa folder na ito
echo      ^(dapat may "xampp" folder dito^)
echo.
echo   3. Double-click: START.bat
echo.
echo   4. TAPOS! Automatic na lahat!
echo.
echo ========================================
echo.
echo TIPS:
echo.
echo - Dapat naka-ON ang Apache at MySQL
echo - Huwag isara ang XAMPP Control Panel
echo - Bookmark: http://localhost/westernschedulingmain/
echo.
echo ========================================
echo.
) > "%PKG_DIR%\GABAY_TAGALOG.txt"
echo       Done!
echo.

echo ========================================
echo   PACKAGE CREATED!
echo ========================================
echo.
echo Package location: %PKG_DIR%\
echo.
echo Contents:
echo   - westernschedulingmain\  ^(application files^)
echo   - database_backup.sql     ^(database^)
echo   - START.bat               ^(one-click start^)
echo   - README.txt              ^(English guide^)
echo   - GABAY_TAGALOG.txt       ^(Tagalog guide^)
echo.
echo NEXT STEPS:
echo.
echo   1. Copy entire "%PKG_DIR%" folder to USB drive
echo   2. Give USB to principal
echo   3. Principal follows README.txt or GABAY_TAGALOG.txt
echo.
echo OR for EASIEST method:
echo.
echo   1. Download XAMPP Portable
echo   2. Extract to "%PKG_DIR%\xampp\"
echo   3. Give USB to principal
echo   4. Principal just double-clicks START.bat!
echo.
echo ========================================
echo.
pause
