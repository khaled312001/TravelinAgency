# 🚀 Complete GoDaddy Setup Guide

## ✅ Current Status
- ✅ Website files uploaded
- ✅ Website is loading
- ❌ Database not connected
- ❌ Images missing

---

## 📋 Step-by-Step Fix

### **1. Update Database Credentials**

#### Get credentials from GoDaddy cPanel:
1. Login to GoDaddy cPanel
2. Go to **Databases** → **MySQL Databases**
3. If no database exists:
   - Create a new database (e.g., `worldtrip_db`)
   - Create a new user with a strong password
   - Add the user to the database with **ALL PRIVILEGES**
4. Note down:
   - Database name
   - Database username  
   - Database password

#### Update api-handler.php:
Open `godaddy-ready/api-handler.php` on your local computer and update:

```php
$host = 'localhost';
$dbname = 'your_cpanel_database_name';  // Example: worldtrip_db
$username = 'your_cpanel_database_user';  // Example: worldtrip_user
$password = 'your_strong_password';  // Your actual password
```

**Save the file!**

---

### **2. Import Database Schema**

1. In GoDaddy cPanel, open **phpMyAdmin**
2. Select your database from the left sidebar
3. Click the **Import** tab
4. Click **Choose File** and select: `mysql/schema.sql` from your local project
5. Scroll down and click **Go**
6. Wait for "Import has been successfully finished"

---

### **3. Upload Updated Files**

Upload these files to your GoDaddy server (replace existing files):

**Files to upload:**
- `godaddy-ready/api-handler.php` (with your database credentials)
- `godaddy-ready/test-db-connection.php` (for testing)

**How to upload:**
- **Option A:** Use GoDaddy File Manager (cPanel → File Manager)
- **Option B:** Use FTP client (FileZilla, etc.)

---

### **4. Test Database Connection**

Visit: `http://worldtripagency.com/test-db-connection.php`

You should see:
- ✅ Connected to database successfully
- ✅ All required tables exist

If you see errors, the page will tell you what's wrong.

---

### **5. Upload Images Folder**

The images are stored locally in `public/images/`. You need to upload this entire folder to GoDaddy.

#### Using GoDaddy File Manager:
1. In cPanel, open **File Manager**
2. Navigate to `public_html/` (where your website files are)
3. Click **Upload** (top right)
4. Drag and drop the **entire `images` folder** from your local `public/images/` folder
5. Wait for upload to complete (this may take a while - lots of images!)

#### Using FTP (Recommended for large uploads):
1. Download FileZilla (free FTP client)
2. Get your FTP credentials from GoDaddy cPanel
3. Connect to your server
4. Navigate to `public_html/`
5. Drag the `images` folder from local to server
6. Wait for upload to complete

**Note:** The images folder contains ~150 files and may take 5-10 minutes to upload depending on your internet speed.

---

### **6. Test Everything**

After all steps are complete:

1. **Test Homepage:** `http://worldtripagency.com/`
   - Should show images
   - Should show navigation menu

2. **Test API:** `http://worldtripagency.com/api/public/navigation`
   - Should return JSON with navigation items

3. **Test Packages:** `http://worldtripagency.com/packages/`
   - Should show packages from database

---

## 🔧 Troubleshooting

### Database Connection Failed
- Check credentials in `api-handler.php` are correct
- Make sure user has ALL PRIVILEGES on the database
- Try visiting `test-db-connection.php` for detailed error

### Images Still Not Loading
- Check the images folder is in the correct location: `public_html/images/`
- Check folder permissions (should be 755)
- Clear your browser cache (Ctrl+Shift+R)

### Navigation Not Showing
- Make sure database schema is imported
- Check `cms_navigation` table has data
- Visit API endpoint directly to test: `/api/public/navigation`

---

## 📝 Quick Checklist

- [ ] Updated `api-handler.php` with database credentials
- [ ] Imported `mysql/schema.sql` to database
- [ ] Uploaded updated `api-handler.php` to server
- [ ] Tested connection with `test-db-connection.php`
- [ ] Uploaded `images` folder to server
- [ ] Tested website - images loading
- [ ] Tested website - navigation working
- [ ] Tested website - packages loading
- [ ] Deleted `test-db-connection.php` from server (security)

---

## 🎉 When Everything Works

Once everything is working:
1. Delete `test-db-connection.php` from your server (security)
2. Test all pages to make sure everything loads correctly
3. Enjoy your live website! 🌍✈️

