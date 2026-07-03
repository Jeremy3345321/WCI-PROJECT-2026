# 🚀 Quick Start - Share to Other Laptops

## Simpleng Paraan (3 Steps Lang!)

### Step 1: Build the Installer

Sa laptop mo (development):

```bash
# Double-click this file:
BUILD_AND_PACKAGE.bat
```

Wait 10 minutes. Tapos na!

### Step 2: Get the Files

Makikita mo sa `DISTRIBUTION/` folder:
- `Western Scheduling System Setup.exe` ← Ito ang installer!
- `README.txt` ← Instructions
- Setup guides

### Step 3: Share to Other Laptops

**Pinakamadali: USB Drive**
1. Copy `DISTRIBUTION` folder to USB
2. Plug sa target laptop
3. Copy to Desktop
4. Double-click ang `.exe` file
5. Follow installation wizard
6. Tapos!

---

## 📋 Kailangan sa Target Laptop

Bago mag-install, siguruhing meron:

1. **PHP** - Download: https://windows.php.net/download/
   - Extract to `C:\php`
   - Add to PATH (see guide below)

2. **MySQL** - Download: https://dev.mysql.com/downloads/installer/
   - Install with default settings
   - Remember root password!

3. **Database** - Import ang database:
   ```bash
   mysql -u root -p scheduling_db < backup.sql
   ```

---

## ⚡ Super Quick Method (No Installation)

Ayaw mag-install? Use portable version!

### Create Portable Package:

1. Copy these folders to USB:
   ```
   USB Drive/
   ├── api/
   ├── assets/
   ├── favicon_io/
   ├── index.html
   └── (all PHP files)
   ```

2. Install XAMPP on target laptop

3. Copy files to `C:\xampp\htdocs\scheduling\`

4. Start XAMPP (Apache + MySQL)

5. Open browser: `http://localhost/scheduling/`

**Done! No Electron needed!**

---

## 🌐 Network Method (Best for School)

One server, many users!

### On Server Computer:

1. Install XAMPP
2. Copy project to `htdocs/scheduling/`
3. Start Apache + MySQL
4. Get server IP: `ipconfig`
   - Example: `192.168.1.100`

### On Client Laptops:

1. Open browser
2. Go to: `http://192.168.1.100/scheduling/`
3. Bookmark it
4. Use normally!

**No installation on client laptops!**

---

## 🎯 Which Method to Use?

### Use INSTALLER if:
- ✅ Want professional desktop app
- ✅ Each laptop works independently
- ✅ Okay with installation

### Use PORTABLE if:
- ✅ No admin rights
- ✅ USB drive usage
- ✅ Temporary setup

### Use NETWORK if:
- ✅ Many users (10+)
- ✅ Shared data needed
- ✅ Have server computer

---

## 🔧 Add PHP to PATH (Windows)

If "PHP not found" error:

1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path"
5. Click "Edit"
6. Click "New"
7. Add: `C:\php` (or your PHP location)
8. Click "OK" on all windows
9. **Restart computer**
10. Test: Open CMD, type `php --version`

---

## 📦 File Sizes

- **Installer**: ~150-200 MB
- **Portable**: ~300 MB (with PHP)
- **Network**: 0 MB (clients use browser)

---

## ✅ Installation Checklist

On each target laptop:

- [ ] PHP installed and in PATH
- [ ] MySQL installed and running
- [ ] Database imported
- [ ] Config file updated (`api/config.php`)
- [ ] Installer run successfully
- [ ] Desktop shortcut created
- [ ] App opens without errors
- [ ] Can view dashboard
- [ ] Can edit schedules

---

## 🆘 Common Issues

### "PHP not found"
→ Add PHP to PATH (see guide above)

### "Cannot connect to database"
→ Check MySQL is running
→ Verify credentials in `api/config.php`

### "Port 8080 in use"
→ Close other apps using port 8080
→ Or change port in `electron-main.js`

### "App won't start"
→ Right-click app → Run as Administrator
→ Check Windows Defender didn't block it

---

## 📞 Need Help?

1. Read `ELECTRON_SETUP.md` - Detailed setup guide
2. Read `DEPLOYMENT_GUIDE.md` - All deployment options
3. Check error logs (Ctrl+Shift+I in app)
4. Test on another computer

---

## 🎉 Success!

App is working when you can:
- ✅ Open from desktop shortcut
- ✅ See dashboard with data
- ✅ View teachers and sections
- ✅ Edit schedules
- ✅ Print schedules

**Congratulations! You're done!** 🚀

---

## 💡 Pro Tips

1. **Backup first** - Export database before distributing
2. **Test locally** - Run `npm start` before building
3. **Version control** - Update version in `package.json`
4. **Clean builds** - Delete `dist/` before rebuilding
5. **Document changes** - Keep changelog for updates

---

## 📱 Mobile Access?

Want to access from phones/tablets?

Use **Network Method**:
- Setup server with XAMPP
- Access via browser on any device
- Works on Android, iOS, tablets!

URL: `http://192.168.1.100/scheduling/`

---

## 🔄 How to Update

When you make changes:

1. Build new installer: `npm run build-win`
2. Increment version in `package.json`
3. Distribute new installer
4. Users uninstall old version
5. Install new version
6. Database stays intact!

---

## 📊 Distribution Summary

| Method | Setup Time | File Size | Best For |
|--------|------------|-----------|----------|
| Installer | 5 min | 150 MB | Professional use |
| Portable | 1 min | 300 MB | USB/Temporary |
| Network | 30 min | 0 MB | Multiple users |

Choose what works best for your situation!

---

**Ready to share?** Just run `BUILD_AND_PACKAGE.bat`! 🎉
