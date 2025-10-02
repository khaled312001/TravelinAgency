# 🚀 Proper GoDaddy Deployment Instructions

## ⚠️ IMPORTANT: Build LOCALLY, Upload to GoDaddy

The build process **MUST** run on your Windows computer, NOT on GoDaddy server.

---

## Step 1: Build Locally (On Your Windows Computer)

### Open PowerShell in Project Folder
```powershell
cd F:\TravelinAgency
```

### Run Build Script
```powershell
.\build-for-godaddy.ps1
```

This will:
- ✅ Install dependencies
- ✅ Build the Nuxt project
- ✅ Copy all files including **150+ images**
- ✅ Create `godaddy-ready/` folder with everything

### Verify Build
```powershell
# Check that images were copied
Get-ChildItem -Path "godaddy-ready\images" -Recurse -File | Measure-Object | Select-Object Count

# Should show ~150+ files
```

---

## Step 2: Clean Up GoDaddy Server (Remove Source Code)

You currently have the entire GitHub repo on GoDaddy, which is causing conflicts.

### Connect to GoDaddy via SSH
```bash
ssh t3w5k5yx5yrp@sg2plzcpnl508590.prod.sin2.secureserver.net
```

### Run This Cleanup Script
```bash
cd ~/public_html

# Backup current directory
mv public_html public_html_backup_$(date +%Y%m%d_%H%M%S)

# Create fresh public_html
mkdir public_html

# Now you have a clean slate ready for upload
```

---

## Step 3: Upload Built Files to GoDaddy

### Option A: Using FileZilla (Recommended)
1. Open FileZilla
2. Host: `sftp://sg2plzcpnl508590.prod.sin2.secureserver.net`
3. Username: `t3w5k5yx5yrp`
4. Port: `22`
5. Connect

6. Navigate to: `/home/t3w5k5yx5yrp/public_html/`
7. Upload **ALL** contents from your local `F:\TravelinAgency\godaddy-ready\` folder

**IMPORTANT:** Make sure to upload:
- ✅ All `.html` files
- ✅ `_nuxt/` folder (JavaScript/CSS)
- ✅ `images/` folder (**150+ images** - this will take time!)
- ✅ `.htaccess` file
- ✅ `api-handler.php`
- ✅ `page-statuses.json`

### Option B: Using cPanel File Manager
1. Go to: https://sg2plzcpnl508590.prod.sin2.secureserver.net:2083
2. Login with your credentials
3. Open "File Manager"
4. Navigate to `public_html/`
5. Click "Upload"
6. Drag and drop all files from `F:\TravelinAgency\godaddy-ready\`
7. **Wait** for the upload to complete (especially images!)

---

## Step 4: Update Database Credentials

### Edit `api-handler.php` on GoDaddy
1. In cPanel File Manager or via FTP
2. Open `public_html/api-handler.php`
3. Update these lines (around line 10-14):
```php
$host = 'localhost';
$dbname = 'travel';      // ⚠️ Update from cPanel
$username = 'travel';    // ⚠️ Update from cPanel
$password = 'support@Passord123';  // ⚠️ Update from cPanel
```

4. Save the file

---

## Step 5: Test the Website

### Test Images
```
https://worldtripagency.com/images/home/logo/WonderlandLogo.svg
https://worldtripagency.com/images/packages/imported/package-5.jpeg
```
Should load without 404 errors

### Test API
```
https://worldtripagency.com/api/packages
https://worldtripagency.com/api/cms/site-settings?public_only=true
```
Should return JSON data

### Test Pages
```
https://worldtripagency.com/
https://worldtripagency.com/packages/
https://worldtripagency.com/custom-package/
https://worldtripagency.com/about/
```
All should work with images

---

## ❌ Common Mistakes

### DON'T do this:
```bash
# ❌ Don't run on GoDaddy server
cd ~/public_html
git clone https://github.com/khaled312001/TravelinAgency.git
npm run generate  # ❌ No Node.js on GoDaddy
```

### ✅ DO this instead:
```powershell
# ✅ Run on YOUR Windows computer
cd F:\TravelinAgency
.\build-for-godaddy.ps1

# Then upload godaddy-ready/ folder contents to GoDaddy
```

---

## 📊 Expected File Structure on GoDaddy

After upload, your `public_html/` should look like:
```
public_html/
├── .htaccess
├── index.html
├── 200.html
├── 404.html
├── api-handler.php
├── page-statuses.json
├── _nuxt/
│   ├── *.js
│   └── *.css
├── images/
│   ├── home/
│   ├── destinations/
│   └── packages/
├── packages/
│   └── index.html
├── custom-package/
│   └── index.html
└── about/
    └── index.html
```

**NO source code files:** No `.vue`, `.ts`, `nuxt.config.ts`, `package.json`, etc.

---

## 🆘 Troubleshooting

### Images Still 404
- Check if `images/` folder was uploaded completely
- Verify file permissions (755 for folders, 644 for files)
- Check `.htaccess` is present

### API Returns 500
- Check database credentials in `api-handler.php`
- Run `test-connection.php` to verify database
- Check PHP error logs in cPanel

### Pages Show 404
- Verify `.htaccess` is uploaded
- Check that `index.html` exists in root

---

## ✅ Final Checklist

- [ ] Built project locally with `.\build-for-godaddy.ps1`
- [ ] Verified `godaddy-ready/images/` has 150+ files
- [ ] Cleaned up GoDaddy `public_html/`
- [ ] Uploaded all files from `godaddy-ready/` to `public_html/`
- [ ] Waited for complete upload (especially images)
- [ ] Updated database credentials in `api-handler.php`
- [ ] Tested image URLs directly
- [ ] Tested API endpoints
- [ ] Tested all 4 main pages

---

## 📞 Need Help?

If images still don't show after following all steps, check:
1. Was the build successful? Check for errors in PowerShell
2. Were images copied to `godaddy-ready/images/`?
3. Were images uploaded to GoDaddy `public_html/images/`?
4. Are file permissions correct? (755/644)
