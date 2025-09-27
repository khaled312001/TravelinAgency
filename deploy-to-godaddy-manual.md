# Manual GoDaddy Deployment Instructions

## The Problem
Even the test.php file is giving a 500 error, which means the files weren't properly uploaded to GoDaddy or there are permission issues.

## Solution: Manual Upload via cPanel File Manager

### Step 1: Access cPanel File Manager
1. Log into your GoDaddy account
2. Go to cPanel
3. Open **File Manager**
4. Navigate to `public_html` folder

### Step 2: Upload Files Manually
You need to upload these files from your local `godaddy-fixed` folder to the `public_html` directory:

#### Essential Files to Upload:
1. **index.php** (from godaddy-fixed/index.php)
2. **.htaccess** (from godaddy-fixed/.htaccess) 
3. **simple-test.php** (the new simple test file)
4. **output/** folder (entire folder from godaddy-fixed/output/)

### Step 3: Set File Permissions
In cPanel File Manager, right-click each file/folder and set permissions:

**Files:**
- index.php: 644
- .htaccess: 644
- simple-test.php: 644

**Folders:**
- output: 755
- output/public: 755
- All subfolders in output: 755

### Step 4: Test
1. Visit: https://worldtripagency.com/simple-test.php
2. If this works, then visit: https://worldtripagency.com/
3. If this works, then visit: https://worldtripagency.com/test.php

### Step 5: If Still Getting 500 Error

#### Check Error Logs:
1. In cPanel, go to **Error Logs**
2. Look for recent errors
3. Check what specific error is occurring

#### Common Issues:
1. **File not uploaded properly** - Re-upload files
2. **Wrong permissions** - Set correct permissions
3. **PHP version** - Check if GoDaddy supports your PHP version
4. **.htaccess syntax** - Try removing .htaccess temporarily to test

#### Alternative: Remove .htaccess Temporarily
1. Rename `.htaccess` to `.htaccess.backup`
2. Test the website
3. If it works, the issue is with .htaccess syntax

### Step 6: Create .env File
1. In cPanel File Manager, create a new file called `.env`
2. Copy contents from `.env.example`
3. Update with your actual database credentials

## Quick Test Commands (if you have SSH access):
```bash
# Check if files exist
ls -la public_html/

# Check permissions
ls -la public_html/index.php
ls -la public_html/.htaccess

# Test PHP
php public_html/simple-test.php
```

## Expected File Structure in public_html:
```
public_html/
├── index.php
├── .htaccess
├── simple-test.php
├── test.php
├── .env
└── output/
    └── public/
        ├── 200.html
        ├── _nuxt/
        └── images/
```

## If Nothing Works:
1. Contact GoDaddy support
2. Ask them to check:
   - PHP version compatibility
   - File permissions
   - Error logs
   - .htaccess support
