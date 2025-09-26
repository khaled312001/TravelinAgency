# GoDaddy Hosting Deployment Guide

## Quick Fix for 403 Forbidden Error

Your website is showing a 403 Forbidden error because GoDaddy hosting requires specific configuration files for Nuxt.js applications.

## Files Created for GoDaddy Hosting

I've created the following files to fix your hosting issue:

1. **`.htaccess`** - Apache server configuration for routing
2. **`index.php`** - Entry point for your application
3. **`server.js`** - Alternative Node.js server (if needed)
4. **Updated `nuxt.config.ts`** - Changed from Cloudflare Pages to Node.js preset

## Deployment Steps

### Step 1: Build Your Application
```bash
npm run build
```

### Step 2: Upload Files to GoDaddy
Upload these files to your GoDaddy hosting root directory:

**Required Files:**
- `.htaccess` (in root directory)
- `index.php` (in root directory)
- `public/` folder (entire folder with all contents)
- `server/` folder (if you have API routes)
- `package.json`
- `package-lock.json`

**Optional Files:**
- `server.js` (if using Node.js hosting)
- `.env` (update with your production values)

### Step 3: Update Environment Variables
Create/update your `.env` file on the server with:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=travel
DB_PASSWORD=support@Passord123
DB_NAME=travel

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Site Configuration
PUBLIC_SITE_URL=https://worldtripagency.com/
NODE_ENV=production
```

### Step 4: Database Setup
1. Create your MySQL database in GoDaddy cPanel
2. Import your database schema
3. Update database credentials in `.env`

### Step 5: File Permissions
Set proper file permissions:
- Folders: 755
- Files: 644
- `.htaccess`: 644

## Alternative: Node.js Hosting

If GoDaddy supports Node.js hosting:

1. Upload all files including `node_modules`
2. Run: `npm install --production`
3. Start server: `node server.js`

## Troubleshooting

### Still Getting 403 Error?
1. Check if `.htaccess` file is uploaded correctly
2. Verify file permissions
3. Ensure `index.php` is in the root directory
4. Check GoDaddy hosting plan supports PHP

### Database Connection Issues?
1. Verify database credentials in `.env`
2. Check if MySQL is enabled in your hosting plan
3. Ensure database exists and has proper permissions

### Static Files Not Loading?
1. Check if `public/` folder is uploaded
2. Verify `.htaccess` rewrite rules
3. Check file permissions on static assets

## GoDaddy Specific Notes

- GoDaddy shared hosting uses Apache servers
- PHP is usually enabled by default
- Node.js support varies by hosting plan
- File upload via cPanel File Manager or FTP

## Support

If you continue to have issues:
1. Check GoDaddy hosting plan features
2. Contact GoDaddy support for PHP/Node.js configuration
3. Verify your domain DNS settings

## Quick Test

After deployment, test these URLs:
- `https://worldtripagency.com/` (main page)
- `https://worldtripagency.com/api/` (API endpoints)
- `https://worldtripagency.com/images/` (static files)
