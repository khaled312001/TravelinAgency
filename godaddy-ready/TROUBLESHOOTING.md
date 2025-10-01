# GoDaddy Troubleshooting Guide

## 500 Internal Server Error - How to Fix

### Step 1: Test PHP
Visit: `http://your-domain.com/test.php`

If you see "PHP is working!", move to Step 2.
If you get an error, PHP might be disabled or there's a server issue.

### Step 2: Check Error Logs
In GoDaddy cPanel:
1. Go to **Metrics** → **Errors**
2. Look for the latest error messages
3. Common errors:
   - `.htaccess` syntax error
   - PHP module not enabled
   - File permissions issue

### Step 3: Simplify .htaccess
If the error persists, try this minimal `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]
```

### Step 4: Check File Permissions
All files should have permissions:
- Directories: 755
- Files: 644

On GoDaddy SSH:
```bash
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

### Step 5: Database Connection
If the site loads but API fails:

1. Open `api-handler.php`
2. Update database credentials from cPanel:
   - Go to cPanel → MySQL Databases
   - Get database name, username, and password
   - Update lines 14-16 in `api-handler.php`

### Common Issues:

#### Issue: "Options not allowed here"
**Solution:** Remove the `Options -Indexes` line from `.htaccess`

#### Issue: "Invalid command 'Header'"
**Solution:** Remove the `<IfModule mod_headers.c>` section

#### Issue: Still getting 500 error
**Solution:** Delete `.htaccess` entirely and test if the site loads

### Quick Fix - Static Only (No Database)
If you just want the static site to work:

1. Delete or rename `.htaccess`:
   ```bash
   mv .htaccess .htaccess.backup
   ```

2. Create new simple `.htaccess`:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^(.*)$ index.html [L]
   ```

3. The site should now work (without API/database features)

### Contact Support
If none of this works, contact GoDaddy support and ask them to:
1. Enable `mod_rewrite`
2. Check error logs for your domain
3. Confirm PHP version (should be 7.4 or higher)

