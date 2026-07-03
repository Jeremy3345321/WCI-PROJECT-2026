# 🔧 Troubleshooting SQL Problems

## ❌ Problem: "Ayaw mag-open ng SQL sa XAMPP"

### Common Causes:

1. **MySQL is NOT running** ⚠️
2. **Database doesn't exist** ⚠️
3. **SQL file is corrupted** ⚠️
4. **Port 3306 is blocked** ⚠️

---

## ✅ Solution 1: Start MySQL First

### Problem:
```
ERROR 2002 (HY000): Can't connect to MySQL server on 'localhost' (10061)
```

### Solution:

**Method A: Use XAMPP Control Panel**
```
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait for green "Running" status
4. Try again
```

**Method B: Use Command Line**
```batch
# Start MySQL
C:\xampp\mysql\bin\mysqld.exe --defaults-file=C:\xampp\mysql\bin\my.ini --standalone

# Wait 10 seconds
# Then try importing
```

**Method C: Use Our Script**
```batch
# Double-click:
FIX_DATABASE_EXPORT.bat
```

---

## ✅ Solution 2: Check if Database Exists

### Problem:
```
Unknown database 'scheduling_db'
```

### Solution:

**Step 1: Check databases**
```sql
SHOW DATABASES;
```

**Step 2: Create database if missing**
```sql
CREATE DATABASE scheduling_db;
```

**Step 3: Import SQL file**
```batch
mysql -u root scheduling_db < database_backup.sql
```

**Or use our script:**
```batch
IMPORT_DATABASE.bat
```

---

## ✅ Solution 3: Fix Corrupted SQL File

### Problem:
Your `database_backup.sql` shows:
```
mysqldump.exe: Got error: 1049: "Unknown database 'scheduling_db'"
```

This means the export failed because MySQL wasn't running!

### Solution:

**Step 1: Start MySQL**
```batch
# Open XAMPP Control Panel
# Start MySQL
```

**Step 2: Verify database exists**
```batch
mysql -u root -e "SHOW DATABASES;"
```

**Step 3: Export again**
```batch
mysqldump -u root scheduling_db > database_backup_new.sql
```

**Or use our script:**
```batch
FIX_DATABASE_EXPORT.bat
```

---

## ✅ Solution 4: Complete Fix (Step-by-Step)

### For You (Developer):

**Step 1: Start MySQL**
```
1. Open XAMPP Control Panel
2. Click "Start" on MySQL
3. Wait for green status
```

**Step 2: Check if database exists**
```
1. Click "Admin" next to MySQL
2. Browser opens phpMyAdmin
3. Look for "scheduling_db" in left sidebar
```

**Step 3A: If database EXISTS**
```batch
# Export it properly
FIX_DATABASE_EXPORT.bat
```

**Step 3B: If database DOESN'T EXIST**
```
1. You need to create it first
2. Or import from backup
3. Or recreate tables manually
```

---

## 🎯 Quick Fix Commands

### Check MySQL Status:
```batch
tasklist | findstr mysqld
```

### Start MySQL:
```batch
start C:\xampp\mysql\bin\mysqld.exe --defaults-file=C:\xampp\mysql\bin\my.ini --standalone
```

### Check Databases:
```batch
C:\xampp\mysql\bin\mysql.exe -u root -e "SHOW DATABASES;"
```

### Create Database:
```batch
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE scheduling_db;"
```

### Export Database:
```batch
C:\xampp\mysql\bin\mysqldump.exe -u root scheduling_db > database_backup.sql
```

### Import Database:
```batch
C:\xampp\mysql\bin\mysql.exe -u root scheduling_db < database_backup.sql
```

---

## 🔍 Diagnostic Steps

### Step 1: Check MySQL Process
```batch
tasklist | findstr mysqld
```

**Expected output:**
```
mysqld.exe    1234 Console    1    123,456 K
```

**If empty:** MySQL is NOT running!

---

### Step 2: Check MySQL Port
```batch
netstat -ano | findstr :3306
```

**Expected output:**
```
TCP    0.0.0.0:3306    0.0.0.0:0    LISTENING    1234
```

**If empty:** MySQL is NOT listening!

---

### Step 3: Check Database
```batch
C:\xampp\mysql\bin\mysql.exe -u root -e "SHOW DATABASES;"
```

**Expected output:**
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| scheduling_db      |  ← Should be here!
| test               |
+--------------------+
```

**If scheduling_db missing:** Database doesn't exist!

---

### Step 4: Check Tables
```batch
C:\xampp\mysql\bin\mysql.exe -u root -e "USE scheduling_db; SHOW TABLES;"
```

**Expected output:**
```
+-------------------------+
| Tables_in_scheduling_db |
+-------------------------+
| teachers                |
| sections                |
| schedule                |
| subjects                |
| strands                 |
| electives               |
+-------------------------+
```

**If empty:** Database has no tables!

---

## 🛠️ Automated Fix Scripts

### Script 1: FIX_DATABASE_EXPORT.bat
**What it does:**
1. Checks if MySQL is running
2. Starts MySQL if needed
3. Checks if database exists
4. Exports database to SQL file
5. Shows file size

**How to use:**
```batch
Double-click: FIX_DATABASE_EXPORT.bat
```

---

### Script 2: IMPORT_DATABASE.bat
**What it does:**
1. Checks if MySQL is running
2. Starts MySQL if needed
3. Creates database if missing
4. Imports SQL file
5. Verifies import

**How to use:**
```batch
Double-click: IMPORT_DATABASE.bat
```

---

## 📊 Common Error Messages

### Error 1:
```
ERROR 2002 (HY000): Can't connect to MySQL server
```
**Meaning:** MySQL is not running  
**Fix:** Start MySQL in XAMPP Control Panel

---

### Error 2:
```
Unknown database 'scheduling_db'
```
**Meaning:** Database doesn't exist  
**Fix:** Create database first

---

### Error 3:
```
mysqldump: Got error: 1049
```
**Meaning:** Can't export because database doesn't exist  
**Fix:** Create database, then export

---

### Error 4:
```
Access denied for user 'root'@'localhost'
```
**Meaning:** Wrong username/password  
**Fix:** XAMPP default is user=root, password=(empty)

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] MySQL is running (green in XAMPP)
- [ ] Port 3306 is listening
- [ ] Database 'scheduling_db' exists
- [ ] Database has tables (6+ tables)
- [ ] SQL file is not empty (>1KB)
- [ ] Can connect via phpMyAdmin
- [ ] Can import SQL file successfully

---

## 🎯 Final Solution

**The EASIEST way:**

1. **Open XAMPP Control Panel**
2. **Start MySQL** (click Start button)
3. **Wait for green status**
4. **Run: FIX_DATABASE_EXPORT.bat**
5. **Done!** ✅

**For principal:**

1. **Open XAMPP Control Panel**
2. **Start MySQL**
3. **Run: IMPORT_DATABASE.bat**
4. **Done!** ✅

---

## 📞 Still Not Working?

### Check these:

1. **XAMPP installed?**
   - Should be at: C:\xampp

2. **MySQL folder exists?**
   - Should be at: C:\xampp\mysql

3. **Port 3306 free?**
   - Close other MySQL instances
   - Check Task Manager

4. **Firewall blocking?**
   - Allow MySQL in Windows Firewall

5. **Antivirus blocking?**
   - Add XAMPP to exceptions

---

## 💡 Pro Tips

### Tip 1: Always Start MySQL First
Before any database operation, make sure MySQL is running!

### Tip 2: Use XAMPP Control Panel
Easiest way to start/stop MySQL

### Tip 3: Check phpMyAdmin
Visual way to verify database exists

### Tip 4: Use Our Scripts
Automated fix for common problems

### Tip 5: Keep Backups
Always have a working SQL backup

---

**Problem solved!** ✅  
**MySQL ready!** 🚀  
**Database working!** 🎉
