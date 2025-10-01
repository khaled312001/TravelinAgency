# 🔧 Fix GoDaddy API Connection

## Current Problem
- Database is uploaded ✅
- But API endpoints return 404 ❌
- Website can't load data from database

---

## 🎯 Solution: 3 Simple Steps

### **Step 1: Test Database Connection**

1. **Upload** `godaddy-ready/test-connection.php` to your GoDaddy server
2. **Visit:** `http://worldtripagency.com/test-connection.php`
3. **Check:** You should see green checkmarks ✅

**If connection fails:**
- Check database credentials in cPanel
- Make sure database user has ALL PRIVILEGES
- Verify database name is correct

---

### **Step 2: Replace API Handler**

**Current file:** `api-handler.php` (incomplete - only has 2 endpoints)
**New file:** `api-handler-complete.php` (complete - has all endpoints)

**Do this:**
1. **Rename/Delete** old `api-handler.php` on server
2. **Upload** `godaddy-ready/api-handler-complete.php`
3. **Rename it to** `api-handler.php`

**Or manually update credentials:**
Open `api-handler-complete.php` and update lines 13-16:
```php
$host = 'localhost';
$dbname = 'travel';        // Your database name
$username = 'travel';      // Your database username
$password = 'support@Passord123';  // Your database password
```

---

### **Step 3: Test API Endpoints**

Visit these URLs to test:

1. **Navigation:**
   ```
   http://worldtripagency.com/api/public/navigation
   ```
   Should return: JSON with navigation menu

2. **Site Settings:**
   ```
   http://worldtripagency.com/api/cms/site-settings?public_only=true
   ```
   Should return: JSON with site settings

3. **Packages:**
   ```
   http://worldtripagency.com/api/packages
   ```
   Should return: JSON with packages list

**If you see JSON data** = ✅ Success!
**If you see 404** = ❌ Check .htaccess file

---

## 🔍 Troubleshooting

### Problem: Still getting 404 on API endpoints

**Check .htaccess file:**
Make sure you have this line:
```apache
RewriteRule ^api/(.*)$ api-handler.php?path=$1 [QSA,L]
```

Your `.htaccess` should look like this:
```apache
RewriteEngine On

# Serve static files directly
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# API Routes - Forward to api-handler.php
RewriteRule ^api/(.*)$ api-handler.php?path=$1 [QSA,L]

# Handle Nuxt routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]

Options -Indexes
AddDefaultCharset UTF-8
```

---

### Problem: Database connection fails

1. **Check cPanel → MySQL Databases**
   - Database name: `travel`
   - Database user: `travel`
   - Password: `support@Passord123`

2. **Make sure user has privileges:**
   - In cPanel, add user to database
   - Grant ALL PRIVILEGES

3. **Test with:**
   ```
   http://worldtripagency.com/test-connection.php
   ```

---

## 📋 Files You Need

From `godaddy-ready/` folder:

1. ✅ `test-connection.php` - Test database (delete after testing)
2. ✅ `api-handler-complete.php` - Complete API handler (rename to `api-handler.php`)
3. ✅ `.htaccess` - Routing rules
4. ✅ All files from `.output/public/` - Your Nuxt build

---

## 🎉 When Everything Works

You should see:
- ✅ Website loads without errors
- ✅ Navigation menu shows correctly
- ✅ Packages load from database
- ✅ Images display
- ✅ No 404 errors in console

**Then delete:**
- `test-connection.php` (security)
- `test-db-connection.php` (security)

---

## 🆘 Still Not Working?

Check browser console (F12) and look for:
1. **404 errors** = .htaccess or api-handler issue
2. **500 errors** = Database connection issue
3. **CORS errors** = Add headers to api-handler.php

Share the exact error message and I'll help! 🚀

