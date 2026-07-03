# 📖 Paano Gumagana ang INSTALL.bat

## 🎯 Overview

Ang `INSTALL.bat` ay isang **automatic installer** na gagawa ng lahat para sa principal. Isang double-click lang, tapos na!

---

## 🔍 Step-by-Step Explanation

### **STEP 0: Setup**

```batch
@echo off
title Western Scheduling System - One-Click Installer
color 0A
```

**Ano ginagawa:**
- `@echo off` - Hindi ipapakita ang commands, clean lang ang output
- `title` - Papalitan ang window title
- `color 0A` - Green text (para maganda tingnan)

**Result:** Magandang black window with green text ✅

---

### **STEP 1: Check Administrator Rights**

```batch
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please run as Administrator!
    pause
    exit
)
```

**Ano ginagawa:**
- `net session` - Command na kailangan ng admin rights
- Kung hindi admin, mag-error
- `>nul 2>&1` - Hide ang error message
- `%errorLevel%` - Check kung may error (0 = success, 1 = error)
- Kung may error = hindi admin = mag-exit

**Bakit kailangan:**
- Para makapag-create ng folders sa `C:\`
- Para makapag-copy ng files
- Para makapag-install ng services

**Result:** Sigurado na may admin rights ✅

---

### **STEP 2: Set Installation Directory**

```batch
set INSTALL_DIR=C:\WesternScheduling
echo Installation Directory: %INSTALL_DIR%
```

**Ano ginagawa:**
- Gumawa ng variable `INSTALL_DIR`
- Value: `C:\WesternScheduling`
- Lahat ng files dito i-install

**Result:** May designated folder na para sa app ✅

---

### **STEP 3: Create Installation Directory**

```batch
if not exist "%INSTALL_DIR%" (
    echo [1/6] Creating installation directory...
    mkdir "%INSTALL_DIR%"
    echo       Done!
)
```

**Ano ginagawa:**
- Check kung existing na ang folder
- Kung wala pa, gumawa ng folder
- `mkdir` = make directory

**Result:** May folder na `C:\WesternScheduling\` ✅

---

### **STEP 4: Copy Application Files**

```batch
echo [2/6] Copying application files...
xcopy /E /I /Y "api" "%INSTALL_DIR%\api\" >nul
xcopy /E /I /Y "assets" "%INSTALL_DIR%\assets\" >nul
copy /Y "index.html" "%INSTALL_DIR%\" >nul
copy /Y "favicon-32x32.png" "%INSTALL_DIR%\" >nul
```

**Ano ginagawa:**
- `xcopy` - Copy folders with all contents
  - `/E` - Include empty folders
  - `/I` - Assume destination is folder
  - `/Y` - Overwrite without asking
- `copy` - Copy single files
- `>nul` - Hide output messages

**Mga na-copy:**
```
C:\WesternScheduling\
├── api\              ← All PHP files
├── assets\           ← CSS, JS, images
├── index.html        ← Main page
└── favicon-32x32.png ← Icon
```

**Result:** Lahat ng app files nandun na sa installation folder ✅

---

### **STEP 5: Check XAMPP**

```batch
if not exist "%INSTALL_DIR%\xampp" (
    echo [3/6] XAMPP not found. Please download XAMPP Portable manually:
    echo       https://www.apachefriends.org/download.html
    echo       Extract to: %INSTALL_DIR%\xampp\
    pause
    exit
) else (
    echo [3/6] XAMPP found!
)
```

**Ano ginagawa:**
- Check kung may XAMPP na sa folder
- Kung wala, mag-pause at mag-exit
- Sasabihin sa user na mag-download muna
- Kung meron na, proceed

**Bakit ganito:**
- XAMPP is 150MB+, hindi kasya sa script
- User need to download manually
- After download, run installer ulit

**Result:** Sigurado na may XAMPP na ✅

---

### **STEP 6: Setup Database**

```batch
echo [4/6] Setting up database...
if exist "database_backup.sql" (
    echo       Importing database...
    "%INSTALL_DIR%\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS scheduling_db;"
    "%INSTALL_DIR%\xampp\mysql\bin\mysql.exe" -u root scheduling_db < "database_backup.sql"
    echo       Done!
)
```

**Ano ginagawa:**
1. Check kung may `database_backup.sql` file
2. Kung meron:
   - Run MySQL command to create database
   - Import ang SQL file sa database
3. Kung wala, skip lang (manual import later)

**MySQL Commands:**
- `mysql.exe -u root` - Login as root user (no password)
- `-e "CREATE DATABASE..."` - Execute SQL command
- `< database_backup.sql` - Import SQL file

**Result:** Database created and populated ✅

---

### **STEP 7: Create START.bat**

```batch
echo [5/6] Creating startup script...
(
echo @echo off
echo title Western Scheduling System
echo cls
echo [1/3] Starting Apache...
start "" "%INSTALL_DIR%\xampp\apache\bin\httpd.exe"
timeout /t 3 >nul
echo [2/3] Starting MySQL...
start "" "%INSTALL_DIR%\xampp\mysql\bin\mysqld.exe" --defaults-file="%INSTALL_DIR%\xampp\mysql\bin\my.ini"
timeout /t 3 >nul
echo [3/3] Opening browser...
start http://localhost/index.html
echo Press any key to STOP the system...
pause >nul
taskkill /F /IM httpd.exe >nul 2>&1
taskkill /F /IM mysqld.exe >nul 2>&1
) > "%INSTALL_DIR%\START.bat"
```

**Ano ginagawa:**
- Gumawa ng bagong file: `START.bat`
- Lahat ng nasa parentheses `( ... )` ay isusulat sa file
- `> "%INSTALL_DIR%\START.bat"` - Save to file

**Ang START.bat ay gagawin:**
1. Start Apache server
2. Wait 3 seconds
3. Start MySQL server
4. Wait 3 seconds
5. Open browser to `http://localhost/index.html`
6. Wait for user to press key
7. Stop Apache and MySQL

**Result:** May START.bat na para sa principal ✅

---

### **STEP 8: Create Desktop Shortcut**

```batch
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
```

**Ano ginagawa:**
1. Get desktop path: `%USERPROFILE%\Desktop`
2. Create VBScript file (temporary)
3. VBScript creates shortcut (.lnk file)
4. Run VBScript using `cscript`
5. Delete temporary VBScript

**VBScript Explanation:**
- `WScript.Shell` - Windows scripting object
- `CreateShortcut` - Create .lnk file
- `TargetPath` - What to run (START.bat)
- `IconLocation` - Icon to use
- `Save` - Save the shortcut

**Result:** Desktop shortcut created ✅

---

## 🎯 Complete Flow Diagram

```
User double-clicks INSTALL.bat
         ↓
[1] Check admin rights
    ├─ Yes → Continue
    └─ No  → Exit with error
         ↓
[2] Create C:\WesternScheduling\
         ↓
[3] Copy all app files
    ├─ api\
    ├─ assets\
    └─ index.html
         ↓
[4] Check if XAMPP exists
    ├─ Yes → Continue
    └─ No  → Exit (ask user to download)
         ↓
[5] Import database
    ├─ database_backup.sql exists → Import
    └─ Not found → Skip
         ↓
[6] Create START.bat
    (Script to start Apache + MySQL + Browser)
         ↓
[7] Create desktop shortcut
    (Points to START.bat)
         ↓
[8] Done! Show success message
```

---

## 📁 Final File Structure

After running INSTALL.bat:

```
C:\WesternScheduling\
├── api\
│   ├── config.php
│   ├── schedule.php
│   ├── teachers.php
│   └── ... (all API files)
├── assets\
│   ├── css\
│   │   └── style.css
│   ├── js\
│   │   ├── app.js
│   │   └── data.js
│   └── img\
│       └── ... (images)
├── xampp\                    ← User adds this manually
│   ├── apache\
│   ├── mysql\
│   └── php\
├── index.html
├── favicon-32x32.png
└── START.bat                 ← Created by installer

Desktop\
└── Western Scheduling.lnk    ← Shortcut created
```

---

## 🔄 How START.bat Works

When principal double-clicks the desktop shortcut:

```
Desktop Shortcut clicked
         ↓
Runs: C:\WesternScheduling\START.bat
         ↓
START.bat executes:
         ↓
[1] Start Apache
    → xampp\apache\bin\httpd.exe
    → Wait 3 seconds
         ↓
[2] Start MySQL
    → xampp\mysql\bin\mysqld.exe
    → Wait 3 seconds
         ↓
[3] Open Browser
    → http://localhost/index.html
         ↓
[4] Wait for user
    → "Press any key to stop..."
         ↓
[5] User presses key
         ↓
[6] Stop Apache (taskkill httpd.exe)
         ↓
[7] Stop MySQL (taskkill mysqld.exe)
         ↓
[8] Done!
```

---

## ⚙️ Technical Details

### Why `>nul 2>&1`?

```batch
command >nul 2>&1
```

**Explanation:**
- `>nul` - Redirect output to nowhere (hide it)
- `2>&1` - Redirect errors (2) to output (1)
- Result: Hide both output and errors

**Example:**
```batch
# Without >nul 2>&1
xcopy api C:\WesternScheduling\api\
→ Shows: "5 files copied"

# With >nul 2>&1
xcopy api C:\WesternScheduling\api\ >nul
→ Shows: (nothing, clean output)
```

### Why `%INSTALL_DIR%`?

```batch
set INSTALL_DIR=C:\WesternScheduling
echo %INSTALL_DIR%
```

**Explanation:**
- Variable para hindi paulit-ulit ang path
- Easy to change kung gusto ibang location
- Consistent sa buong script

**Example:**
```batch
# Without variable
mkdir C:\WesternScheduling
xcopy api C:\WesternScheduling\api\
copy index.html C:\WesternScheduling\

# With variable
set INSTALL_DIR=C:\WesternScheduling
mkdir %INSTALL_DIR%
xcopy api %INSTALL_DIR%\api\
copy index.html %INSTALL_DIR%\
```

### Why `if exist` checks?

```batch
if exist "database_backup.sql" (
    # Import database
)
```

**Explanation:**
- Para hindi mag-error kung wala ang file
- Graceful handling ng missing files
- Script continues kahit may missing files

---

## 🎓 Key Concepts

### 1. **Batch File Variables**

```batch
set VAR=value          # Set variable
echo %VAR%             # Use variable
set /A NUM=5+3         # Math operations
```

### 2. **Conditional Statements**

```batch
if exist "file.txt" (
    echo File exists
) else (
    echo File not found
)

if %errorLevel% neq 0 (
    echo Error occurred
)
```

### 3. **File Operations**

```batch
mkdir folder           # Create folder
copy file.txt dest\    # Copy file
xcopy /E src\ dest\    # Copy folder
del file.txt           # Delete file
```

### 4. **Process Control**

```batch
start program.exe      # Start program
timeout /t 5           # Wait 5 seconds
pause                  # Wait for keypress
taskkill /F /IM app.exe # Kill process
```

---

## 🚀 Usage Example

### For Principal:

**Step 1: Prepare Files**
```
USB Drive\
├── INSTALL.bat
├── api\
├── assets\
├── index.html
├── database_backup.sql
└── xampp\              ← Download and extract here
```

**Step 2: Run Installer**
1. Right-click `INSTALL.bat`
2. Select "Run as administrator"
3. Wait 2 minutes
4. Done!

**Step 3: Use System**
1. Double-click desktop shortcut "Western Scheduling"
2. Wait 10 seconds
3. Browser opens automatically
4. Use the system!

---

## 🐛 Error Handling

### Error 1: Not Administrator

```batch
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please run as Administrator!
    pause
    exit
)
```

**What happens:**
- Script checks admin rights
- If not admin, shows error
- Exits immediately
- User must run as admin

### Error 2: XAMPP Not Found

```batch
if not exist "%INSTALL_DIR%\xampp" (
    echo XAMPP not found!
    echo Download from: https://...
    pause
    exit
)
```

**What happens:**
- Script checks for XAMPP folder
- If not found, shows download link
- Exits and waits for user
- User downloads XAMPP, runs installer again

### Error 3: Database File Missing

```batch
if exist "database_backup.sql" (
    # Import
) else (
    echo [WARNING] database_backup.sql not found
    echo You'll need to import manually
)
```

**What happens:**
- Script checks for SQL file
- If not found, shows warning
- Continues installation (doesn't exit)
- User can import database later manually

---

## 💡 Pro Tips

### Tip 1: Customize Installation Path

Change this line:
```batch
set INSTALL_DIR=C:\WesternScheduling
```

To:
```batch
set INSTALL_DIR=D:\MyApps\Scheduling
```

### Tip 2: Add More Files

Add more copy commands:
```batch
copy /Y "README.txt" "%INSTALL_DIR%\" >nul
copy /Y "LICENSE.txt" "%INSTALL_DIR%\" >nul
```

### Tip 3: Silent Installation

Remove all `echo` and `pause` commands for silent install:
```batch
@echo off
# ... installation commands ...
exit
```

---

## 🎯 Summary

**INSTALL.bat does:**
1. ✅ Check admin rights
2. ✅ Create installation folder
3. ✅ Copy all app files
4. ✅ Check XAMPP exists
5. ✅ Import database
6. ✅ Create START.bat
7. ✅ Create desktop shortcut
8. ✅ Show success message

**Principal gets:**
- ✅ Complete installation in `C:\WesternScheduling\`
- ✅ Desktop shortcut for easy access
- ✅ One-click start with START.bat
- ✅ Automatic Apache + MySQL + Browser
- ✅ Zero technical knowledge needed!

**Perfect for non-technical users!** 🎉

---

## 📞 Questions?

**Q: Bakit kailangan ng admin rights?**
A: Para makapag-create ng folders sa `C:\` drive

**Q: Bakit hindi kasama ang XAMPP sa installer?**
A: XAMPP is 150MB+, too big for script. User downloads separately.

**Q: Paano kung may error sa database import?**
A: Script shows warning, continues installation. Import manually later.

**Q: Pwede ba sa ibang drive (D:\, E:\)?**
A: Yes! Change `set INSTALL_DIR=C:\WesternScheduling` to desired path.

**Q: Paano i-uninstall?**
A: Delete `C:\WesternScheduling\` folder and desktop shortcut.

---

**Ready to use!** 🚀
