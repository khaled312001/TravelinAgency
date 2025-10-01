# 🚀 Proper GoDaddy Deployment Instructions

## Current Situation
- ✅ Images folder exists on server
- ❌ Entire source repository is in public_html/ (wrong!)
- ✅ Logo is accessible

## What You Need to Do

### Step 1: Build Locally (Windows Computer)

```powershell
# Make sure you're in the project directory
cd F:\TravelinAgency

# Build the project
npm run generate

# Prepare deployment folder
.\build-for-godaddy.ps1
```

This creates `godaddy-ready/` folder with only the necessary files.

---

### Step 2: Upload to GoDaddy

#### Option A: Using File Manager (Easiest)

1. **Login to GoDaddy cPanel**
2. **Go to File Manager**
3. **Navigate to public_html/**
4. **Create a backup folder first:**
   - Create folder: `backup_old`
   - Move everything to `backup_old/` (just in case)
5. **Delete old files from public_html/** (or move to backup)
6. **Upload ALL files from `godaddy-ready/` folder**
7. **Wait for upload to complete**

#### Option B: Using SSH/Terminal (Current Method)

On GoDaddy terminal:

```bash
# Go to parent directory
cd ~

# Backup current public_html
mv public_html public_html_backup_$(date +%Y%m%d)

# Create new public_html
mkdir public_html

# Now you need to upload files from your local godaddy-ready/ folder
# Use SCP or SFTP from your Windows computer
```

Then on your **Windows computer** (use Git Bash or PowerShell with OpenSSH):

```bash
# Upload files via SCP
scp -r godaddy-ready/* username@yourserver.com:~/public_html/
```

Replace:
- `username` with your GoDaddy SSH username
- `yourserver.com` with your server hostname

---

### Step 3: Verify Deployment

Test these URLs:

1. **Homepage:** https://worldtripagency.com/
2. **Logo:** https://worldtripagency.com/images/home/logo/WonderlandLogo.svg
3. **Package Image:** https://worldtripagency.com/images/packages/imported/package-5.jpeg
4. **Packages Page:** https://worldtripagency.com/packages/

All should work without 404 errors!

---

## Quick Test First

Before doing all this, **test if your website is already working:**

1. Visit: https://worldtripagency.com/
2. Check if images show on the homepage
3. Visit: https://worldtripagency.com/packages/
4. Check if package images show

**If everything works** → No need to redeploy!
**If images don't show** → Follow the deployment steps above.

---

## Important Notes

- ✅ Built files go to `public_html/` (from `godaddy-ready/`)
- ❌ Don't clone the Git repository to `public_html/`
- ✅ Only upload contents of `.output/public/` + API files
- ❌ Don't upload `node_modules/`, `components/`, `pages/`, etc.

---

## What Should Be in public_html/

Correct structure:
```
public_html/
├── .htaccess
├── api-handler.php
├── images/
│   ├── home/
│   ├── packages/
│   └── destinations/
├── _nuxt/
├── index.html
├── about/
├── packages/
├── custom-package/
└── ... (other built files)
```

Wrong structure (what you have now):
```
public_html/
├── node_modules/     ❌
├── components/       ❌
├── pages/            ❌
├── .nuxt/            ❌
├── app.vue           ❌
├── nuxt.config.ts    ❌
└── ... (source files) ❌
```

---

## TL;DR

1. Test if website works: https://worldtripagency.com/
2. If images show → You're done!
3. If images don't show:
   - Build locally: `npm run generate && .\build-for-godaddy.ps1`
   - Upload `godaddy-ready/` to GoDaddy
   - Replace everything in `public_html/`

