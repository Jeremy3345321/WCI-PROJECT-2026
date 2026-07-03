# How to Share Western Scheduling System to Other Laptops

## 🎯 Overview

May 3 ways para i-share ang scheduling system sa ibang laptops:

1. **Installer Method** - Professional, recommended
2. **Portable Method** - No installation needed
3. **Network Method** - Central server, multiple clients

---

## 📦 Method 1: INSTALLER (Recommended)

### Step 1: Build the Installer

Sa development laptop (kung saan mo ginawa):

```bash
# Install dependencies (one time only)
npm install

# Build Windows installer
npm run build-win
```

Wait 5-10 minutes. Makikita mo sa `dist/` folder:
- `Western Scheduling System Setup 1.0.0.exe` (~150-200 MB)

### Step 2: Copy Installer

**Option A: USB Drive**
1. Copy ang `.exe` file sa USB
2. Plug sa target laptop
3. Copy from USB to Desktop

**Option B: Network Share**
1. Put `.exe` file sa shared folder
2. Access from other laptops
3. Copy to their Desktop

**Option C: Cloud Storage**
1. Upload to Google Drive / OneDrive
2. Share link to users
3. Download on target laptop

### Step 3: Install on Target Laptop

**Requirements on Target Laptop:**
- Windows 10/11
- PHP installed (with PATH configured)
- MySQL/MariaDB installed
- Database imported

**Installation Steps:**
1. Double-click `Western Scheduling System Setup 1.0.0.exe`
2. Click "Next" through wizard
3. Choose installation folder
4. Click "Install"
5. Wait 1-2 minutes
6. Click "Finish"

**Desktop shortcut created automatically!**

### Step 4: Configure Database

On target laptop, edit `api/config.php`:

```php
<?php
$host = 'localhost';  // or IP of database server
$dbname = 'scheduling_db';
$username = 'root';
$password = 'your_password';
?>
```

**Two scenarios:**

**A. Local Database (Standalone)**
- Install MySQL on each laptop
- Import database on each laptop
- Set `$host = 'localhost'`
- Each laptop works independently

**B. Network Database (Shared)**
- One central MySQL server
- All laptops connect to it
- Set `$host = '192.168.1.100'` (server IP)
- All share same data

### Step 5: Run the App

1. Double-click desktop shortcut
2. Or: Start Menu → Western Scheduling System
3. App opens automatically!

---

## 💼 Method 2: PORTABLE (No Installation)

Perfect for USB drive or temporary use.

### Step 1: Create Portable Package

```bash
# Build portable version
npm run build-win -- --portable
```

Creates folder: `dist/win-unpacked/`

### Step 2: Package Everything

Create a folder with:
```
Western-Scheduling-Portable/
├── Western Scheduling System.exe
├── resources/
├── api/
├── assets/
├── index.html
├── php.exe (copy from PHP installation)
├── php.ini
└── START.bat
```

### Step 3: Create START.bat

Create `START.bat` file:

```batch
@echo off
echo Starting Western Scheduling System...
echo.

REM Start PHP server
start /B php.exe -S localhost:8080 -t .

REM Wait for server to start
timeout /t 2 /nobreak > nul

REM Start Electron app
start "" "Western Scheduling System.exe"

echo.
echo System started!
echo Close this window to stop the server.
pause
```

### Step 4: Share the Folder

**Option A: USB Drive**
- Copy entire folder to USB
- Plug into any laptop
- Run `START.bat`
- Works without installation!

**Option B: Network Share**
- Put folder on network drive
- Users access from network
- Run `START.bat` from network

**Option C: Zip File**
- Compress folder to `.zip`
- Share via email/cloud
- Extract and run

### Advantages:
- ✅ No installation needed
- ✅ Works from USB
- ✅ No admin rights required
- ✅ Easy to update (replace files)

### Disadvantages:
- ❌ Larger file size (~300 MB)
- ❌ No desktop shortcut
- ❌ Must run START.bat each time

---

## 🌐 Method 3: NETWORK SERVER (Multi-User)

Best for school with many users.

### Architecture:

```
[Central Server]
├── MySQL Database
├── PHP Files
└── Web Server (Apache/Nginx)

[Client Laptops]
└── Just web browser!
```

### Step 1: Setup Central Server

**On server computer:**

1. Install XAMPP or WAMP
2. Copy project to `htdocs/scheduling/`
3. Import database
4. Configure `api/config.php`
5. Start Apache and MySQL

### Step 2: Configure Network Access

**Edit Apache config** (`httpd.conf`):

```apache
# Allow network access
<Directory "C:/xampp/htdocs/scheduling">
    Require all granted
</Directory>
```

**Get server IP:**
```bash
ipconfig
# Look for IPv4 Address: 192.168.1.100
```

### Step 3: Access from Other Laptops

**On client laptops:**

1. Open web browser
2. Go to: `http://192.168.1.100/scheduling/`
3. Bookmark the page
4. Use like normal!

**No installation needed on client laptops!**

### Advantages:
- ✅ No installation on clients
- ✅ Easy updates (update server only)
- ✅ Centralized data
- ✅ Works on any device (PC, Mac, tablet)

### Disadvantages:
- ❌ Requires network connection
- ❌ Server must always be on
- ❌ Slower if network is slow

---

## 📋 Complete Setup Checklist

### For Each Target Laptop:

**Software Requirements:**
- [ ] Windows 10/11 (64-bit)
- [ ] PHP 7.4+ installed
- [ ] PHP in system PATH
- [ ] MySQL/MariaDB installed (if local DB)
- [ ] 500 MB free disk space

**Installation Steps:**
- [ ] Copy installer/portable files
- [ ] Install/extract files
- [ ] Configure database connection
- [ ] Test database connection
- [ ] Import database (if local)
- [ ] Run the application
- [ ] Test all features
- [ ] Create desktop shortcut (if portable)

---

## 🔧 Database Setup Options

### Option A: Local Database (Each Laptop)

**Pros:**
- Works offline
- Fast performance
- No network dependency

**Cons:**
- Data not shared
- Must sync manually
- More setup per laptop

**Setup:**
```sql
-- On each laptop:
1. Install MySQL
2. Create database:
   CREATE DATABASE scheduling_db;
3. Import SQL file:
   mysql -u root -p scheduling_db < backup.sql
4. Configure api/config.php with localhost
```

### Option B: Network Database (Shared)

**Pros:**
- Shared data
- Real-time updates
- Single source of truth

**Cons:**
- Requires network
- Slower if network slow
- Single point of failure

**Setup:**
```sql
-- On server:
1. Install MySQL
2. Create database
3. Create user with network access:
   CREATE USER 'scheduler'@'%' IDENTIFIED BY 'password';
   GRANT ALL ON scheduling_db.* TO 'scheduler'@'%';
   FLUSH PRIVILEGES;

-- On clients:
Configure api/config.php with server IP
```

---

## 🚀 Quick Start Scripts

### For Installer Distribution:

Create `INSTALL_INSTRUCTIONS.txt`:

```
WESTERN SCHEDULING SYSTEM - INSTALLATION

1. REQUIREMENTS:
   - Windows 10/11
   - PHP installed (check: php --version)
   - MySQL installed

2. INSTALLATION:
   - Double-click "Western Scheduling System Setup.exe"
   - Follow the wizard
   - Click "Finish"

3. CONFIGURATION:
   - Open installation folder
   - Edit api/config.php
   - Set database credentials
   - Save file

4. RUN:
   - Double-click desktop shortcut
   - Or: Start Menu → Western Scheduling System

5. SUPPORT:
   - Check ELECTRON_SETUP.md for troubleshooting
   - Contact IT support if issues

Enjoy!
```

### For Portable Distribution:

Create `README.txt`:

```
WESTERN SCHEDULING SYSTEM - PORTABLE

1. EXTRACT:
   - Extract ZIP to any folder
   - Example: C:\Western-Scheduling\

2. CONFIGURE:
   - Edit api/config.php
   - Set database credentials

3. RUN:
   - Double-click START.bat
   - Wait for app to open
   - Close command window to stop

4. USB DRIVE:
   - Copy entire folder to USB
   - Run from USB on any computer
   - No installation needed!

Note: PHP must be installed on target computer.
```

---

## 📊 Distribution Comparison

| Feature | Installer | Portable | Network |
|---------|-----------|----------|---------|
| Installation | Required | Not needed | Not needed |
| File Size | 150 MB | 300 MB | 0 MB |
| Admin Rights | Required | Not needed | Not needed |
| Offline Work | Yes | Yes | No |
| Auto Updates | No | Easy | Automatic |
| Multi-User | No | No | Yes |
| Performance | Fast | Fast | Network speed |
| Setup Time | 5 min | 1 min | 30 min |

---

## 💡 Best Practices

### For Small School (1-5 users):
**Use: Installer Method**
- Install on each laptop
- Local database per laptop
- Export/import for sync

### For Medium School (5-20 users):
**Use: Network Database**
- Install app on each laptop
- Central MySQL server
- Shared data

### For Large School (20+ users):
**Use: Network Server**
- Central web server
- Clients use browser
- No installation needed

### For Demo/Testing:
**Use: Portable Method**
- USB drive
- No installation
- Easy to update

---

## 🔒 Security Considerations

### Network Database:
```sql
-- Create limited user (not root)
CREATE USER 'scheduler'@'192.168.1.%' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON scheduling_db.* TO 'scheduler'@'192.168.1.%';
```

### Firewall:
```
Allow MySQL port 3306 only from school network:
- Windows Firewall → New Rule
- Port 3306
- Allow from 192.168.1.0/24
```

### Backup:
```bash
# Daily backup script
mysqldump -u root -p scheduling_db > backup_$(date +%Y%m%d).sql
```

---

## 🆘 Troubleshooting

### "PHP not found"
**Solution:**
```bash
# Add PHP to PATH
1. Control Panel → System → Advanced
2. Environment Variables
3. Path → Edit → New
4. Add: C:\php
5. Restart computer
```

### "Cannot connect to database"
**Solution:**
```bash
# Test connection
php -r "new PDO('mysql:host=localhost', 'root', 'password');"

# If fails, check:
1. MySQL is running
2. Credentials are correct
3. Database exists
4. User has permissions
```

### "Port 8080 in use"
**Solution:**
Edit `electron-main.js`:
```javascript
const port = 8081; // Change port
```

### "App won't start"
**Solution:**
```bash
# Check logs
1. Open app
2. Press Ctrl+Shift+I
3. Check Console tab
4. Look for errors
```

---

## 📞 Support Checklist

Before asking for help:
- [ ] PHP installed and in PATH?
- [ ] MySQL running?
- [ ] Database imported?
- [ ] Config file correct?
- [ ] Firewall allowing connections?
- [ ] Checked error logs?
- [ ] Tried on another computer?

---

## 🎉 Success Indicators

App is working correctly when:
- ✅ Desktop shortcut opens app
- ✅ Dashboard loads with data
- ✅ Can view teachers
- ✅ Can view sections
- ✅ Can edit schedules
- ✅ Can print schedules
- ✅ No error messages

Congratulations! Your scheduling system is now deployed! 🚀
