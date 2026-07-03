# Western Scheduling System - Electron Desktop App Setup

## 📋 Requirements

Before building the desktop app, make sure you have:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **PHP** (v7.4 or higher)
   - Must be in system PATH
   - Check: `php --version`

3. **MySQL/MariaDB** running
   - Database must be accessible
   - Update `api/config.php` with correct credentials

## 🚀 Quick Start

### Step 1: Install Dependencies

Open terminal/command prompt in project folder:

```bash
npm install
```

This will install:
- Electron (desktop framework)
- Electron Builder (packaging tool)

### Step 2: Test the App

Run in development mode:

```bash
npm start
```

This will:
- Start PHP built-in server on port 8080
- Open the app in Electron window
- You can test all features

**Note:** Make sure MySQL is running and database is configured!

### Step 3: Build Installer

#### For Windows (.exe installer):
```bash
npm run build-win
```

Output: `dist/Western Scheduling System Setup 1.0.0.exe`

#### For Mac (.dmg):
```bash
npm run build-mac
```

Output: `dist/Western Scheduling System-1.0.0.dmg`

#### For Linux (.AppImage):
```bash
npm run build-linux
```

Output: `dist/Western Scheduling System-1.0.0.AppImage`

#### Build for All Platforms:
```bash
npm run build-all
```

## 📦 Distribution

After building, you'll find installers in the `dist/` folder:

### Windows:
- `Western Scheduling System Setup 1.0.0.exe` - Installer
- Users can install like any Windows program
- Creates desktop shortcut
- Adds to Start Menu

### Mac:
- `Western Scheduling System-1.0.0.dmg` - Disk image
- Users drag to Applications folder

### Linux:
- `Western Scheduling System-1.0.0.AppImage` - Portable app
- Make executable: `chmod +x Western*.AppImage`
- Run directly: `./Western*.AppImage`

## ⚙️ Configuration

### Database Setup

The app uses PHP's built-in server, so you need:

1. **MySQL/MariaDB running** on localhost
2. **Database created** (e.g., `scheduling_db`)
3. **Config file updated**: `api/config.php`

```php
<?php
$host = 'localhost';
$dbname = 'scheduling_db';
$username = 'root';
$password = 'your_password';
?>
```

### Port Configuration

Default port: **8080**

To change, edit `electron-main.js`:
```javascript
const port = 8080; // Change this
```

## 🎯 Features

### Desktop Integration:
- ✅ Native window (not browser)
- ✅ System tray icon
- ✅ Desktop shortcut
- ✅ Start menu entry
- ✅ Auto-start PHP server
- ✅ Keyboard shortcuts
- ✅ Zoom in/out support

### Keyboard Shortcuts:
- `Ctrl+R` / `Cmd+R` - Reload
- `Ctrl+Shift+R` / `Cmd+Shift+R` - Force reload
- `Ctrl+Q` / `Cmd+Q` - Quit
- `Ctrl+Shift+I` / `Cmd+Shift+I` - Developer tools
- `Ctrl+0` / `Cmd+0` - Reset zoom
- `Ctrl++` / `Cmd++` - Zoom in
- `Ctrl+-` / `Cmd+-` - Zoom out

## 🔧 Troubleshooting

### "PHP not found" error:
**Solution:** Add PHP to system PATH
- Windows: Add PHP folder to Environment Variables
- Mac/Linux: Add to `.bashrc` or `.zshrc`

### "Cannot connect to database":
**Solution:** 
1. Check MySQL is running
2. Verify credentials in `api/config.php`
3. Test connection: `php -r "new PDO('mysql:host=localhost', 'root', 'password');"`

### Port 8080 already in use:
**Solution:** Change port in `electron-main.js` (line 12)

### Build fails:
**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Try build again

## 📱 Portable Version

Want a portable version without installation?

### Windows Portable:
```bash
npm run build-win -- --portable
```

Creates a folder you can copy to USB drive.

### Linux Portable:
The `.AppImage` file is already portable - just copy and run!

## 🎨 Customization

### Change App Icon:
Replace files in `favicon_io/` folder:
- `favicon.ico` (Windows)
- `favicon.icns` (Mac)
- `favicon.png` (Linux)

### Change App Name:
Edit `package.json`:
```json
{
  "name": "your-app-name",
  "productName": "Your App Display Name"
}
```

### Change Window Size:
Edit `electron-main.js`:
```javascript
mainWindow = new BrowserWindow({
    width: 1400,  // Change this
    height: 900,  // Change this
    // ...
});
```

## 📊 File Size

Expected installer sizes:
- Windows: ~150-200 MB
- Mac: ~180-220 MB
- Linux: ~150-180 MB

Includes:
- Electron runtime
- Chromium browser
- Node.js runtime
- Your application files

## 🚀 Deployment

### For School Network:
1. Build the installer
2. Copy to network share
3. Users run installer
4. Each user needs MySQL access

### For Single Computer:
1. Install MySQL locally
2. Import database
3. Run the app
4. Everything works offline!

## 💡 Tips

1. **Test before building**: Always run `npm start` first
2. **Database backup**: Backup database before distributing
3. **Version numbers**: Update version in `package.json`
4. **Clean builds**: Delete `dist/` folder before rebuilding
5. **Antivirus**: Some antivirus may flag the installer (false positive)

## 📞 Support

For issues or questions:
1. Check this guide first
2. Test with `npm start`
3. Check console for errors (Ctrl+Shift+I)
4. Verify PHP and MySQL are working

## 🎉 Success!

Once built, you have a professional desktop application that:
- ✅ Installs like any Windows/Mac/Linux app
- ✅ Works offline (with local database)
- ✅ No browser needed
- ✅ Professional appearance
- ✅ Easy to distribute

Enjoy your desktop scheduling system! 🚀
