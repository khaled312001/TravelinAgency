# GoDaddy Deployment Instructions

## Files Ready for Upload

All files in this 'godaddy-deploy' folder are ready to be uploaded to your GoDaddy hosting.

## Upload Steps:

1. **Upload all files** from this folder to your GoDaddy hosting root directory (public_html)

2. **Set up environment variables:**
   - Rename .env.example to .env
   - Update the database credentials in .env file
   - Make sure NODE_ENV=production

3. **Set file permissions:**
   - Folders: 755
   - Files: 644
   - .htaccess: 644

4. **Create your MySQL database** in GoDaddy cPanel

5. **Import your database schema** if you have one

## Important Files:
- .htaccess (Apache configuration for routing)
- index.php (Application entry point)
- public/ (Static files and assets)
- server/ (API routes)
- output/ (Nuxt.js build output)

## Test Your Website:
- Main site: https://travelin-agency-nlcs.vercel.app/
- PHP test: https://travelin-agency-nlcs.vercel.app/test.php
- API test: https://travelin-agency-nlcs.vercel.app/api/

## Troubleshooting:
- If you get 500 errors, check the .htaccess file
- If static files don't load, check the public/ directory
- If API doesn't work, check the server/ directory

Your website should now work at: https://travelin-agency-nlcs.vercel.app/
