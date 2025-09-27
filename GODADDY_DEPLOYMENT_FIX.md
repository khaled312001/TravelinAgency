# GoDaddy Deployment Fix Guide

## Issues Fixed

### 1. Missing .env File
- ✅ Created `.env` file with correct database configuration
- ✅ Set proper environment variables for production

### 2. PHP Index File Issues
- ✅ Fixed `index.php` to properly serve Nuxt.js application
- ✅ Added better localhost URL replacement
- ✅ Improved static file handling

### 3. .htaccess Configuration
- ✅ Fixed rewrite rules for Nuxt.js routing
- ✅ Added proper static file handling
- ✅ Improved API route handling

### 4. Database Connection
- ✅ Verified database configuration in `api-handler.php`
- ✅ Added proper error handling for database connections

## Files Created/Modified

### Core Files
- `index.php` - Main entry point (modified)
- `api-handler.php` - API handler (verified)
- `.htaccess` - URL rewriting rules (modified)
- `.env` - Environment variables (created)
- `test.php` - Database connection test (created)

### Build Files
- `output/public/200.html` - Nuxt.js application (exists)
- `output/public/_nuxt/` - Static assets (exists)

## Deployment Steps

### 1. Upload Files to GoDaddy
Upload these files to your GoDaddy hosting root directory:
```
/
├── index.php
├── api-handler.php
├── .htaccess
├── .env
├── test.php
├── output/
│   └── public/
│       ├── 200.html
│       ├── _nuxt/
│       └── images/
└── public/
    └── images/
```

### 2. Set File Permissions
Set these permissions via GoDaddy File Manager or FTP:
- **Folders**: 755
- **Files**: 644
- **PHP files**: 644

### 3. Database Configuration
Your database is already configured with:
- **Host**: localhost
- **Database**: travel
- **Username**: travel
- **Password**: support@Passord123

### 4. Test Your Deployment

#### Test PHP and Database
Visit: `https://worldtripagency.com/test.php`
- Should show PHP version and database connection status

#### Test API
Visit: `https://worldtripagency.com/api/test`
- Should return: `{"status":"working","database":"connected"}`

#### Test Main Site
Visit: `https://worldtripagency.com/`
- Should load your Nuxt.js application

## Troubleshooting

### If you still get 500 errors:

1. **Check Error Logs**
   - Go to GoDaddy cPanel → Error Logs
   - Look for specific PHP errors

2. **Verify File Permissions**
   - Ensure all files have correct permissions
   - Check that .htaccess is readable

3. **Test Database Connection**
   - Use the test.php file to verify database access
   - Ensure MySQL service is running

4. **Check PHP Version**
   - GoDaddy should support PHP 7.4+ or 8.x
   - Verify in cPanel → PHP Selector

### Common Issues and Solutions

#### Issue: "API handler not found"
**Solution**: Ensure `api-handler.php` is in the root directory

#### Issue: "Database connection failed"
**Solution**: 
- Verify database credentials in `.env`
- Check if MySQL service is running
- Ensure database `travel` exists

#### Issue: "Nuxt.js files not found"
**Solution**: 
- Ensure `output/public/200.html` exists
- Check file permissions on output directory

#### Issue: "Static files not loading"
**Solution**: 
- Verify `.htaccess` is in root directory
- Check file permissions on public directories

## Environment Variables

Your `.env` file contains:
```env
PUBLIC_SITE_URL=https://worldtripagency.com/
NODE_ENV=production
DB_HOST=localhost
DB_NAME=travel
DB_USER=travel
DB_PASSWORD=support@Passord123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Security Notes

- Change the JWT_SECRET to a unique value
- Ensure .env file is not publicly accessible
- Consider updating database password
- Enable SSL/HTTPS (already configured in .htaccess)

## Support

If you continue to experience issues:
1. Check GoDaddy error logs
2. Test individual components using test.php
3. Verify all files are uploaded correctly
4. Contact GoDaddy support if server-side issues persist
