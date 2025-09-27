@echo off
echo 🚀 GoDaddy Upload Script
echo ========================

echo.
echo This script will help you prepare files for GoDaddy upload.
echo.

echo 📁 Files to upload to your GoDaddy hosting root:
echo.
echo ✅ index.php
echo ✅ api-handler.php  
echo ✅ .htaccess
echo ✅ .env
echo ✅ test.php
echo ✅ output/ (entire folder)
echo ✅ public/ (entire folder)
echo.

echo 📋 Upload Instructions:
echo 1. Go to your GoDaddy cPanel File Manager
echo 2. Navigate to public_html (or your domain's root directory)
echo 3. Upload all the files listed above
echo 4. Set permissions: folders=755, files=644
echo.

echo 🧪 Testing URLs:
echo - PHP Test: https://travelin-agency-nlcs.vercel.app/test.php
echo - API Test: https://travelin-agency-nlcs.vercel.app/api/test
echo - Main Site: https://travelin-agency-nlcs.vercel.app/
echo.

echo ⚠️  Important Notes:
echo - Make sure to upload the ENTIRE output/ folder
echo - Make sure to upload the ENTIRE public/ folder
echo - Check that .htaccess file is uploaded
echo - Verify file permissions after upload
echo.

pause
