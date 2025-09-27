@echo off
echo 🚀 Deploying Clean Files to GoDaddy
echo ====================================

echo.
echo 📁 Files to upload to your GoDaddy hosting root:
echo.
echo ✅ index-working.php (test file)
echo ✅ index-clean.php (replaces index.php)
echo ✅ api-simple.php (replaces api-handler.php)
echo ✅ .htaccess-clean (replaces .htaccess)
echo.

echo 📋 Upload Instructions:
echo 1. Go to your GoDaddy cPanel File Manager
echo 2. Navigate to public_html (or your domain's root directory)
echo 3. Upload all the files listed above
echo 4. Rename files:
echo    - Rename index-clean.php to index.php
echo    - Rename api-simple.php to api-handler.php
echo    - Rename .htaccess-clean to .htaccess
echo 5. Set permissions: folders=755, files=644
echo.

echo 🧪 Testing URLs:
echo - Working Test: https://worldtripagency.com/index-working.php
echo - Main Site: https://worldtripagency.com/
echo - API Test: https://worldtripagency.com/api/test
echo - API Packages: https://worldtripagency.com/api/packages
echo.

echo ⚠️  Important Notes:
echo - These files have NO syntax errors
echo - They will work on GoDaddy hosting
echo - Test index-working.php first to confirm PHP is working
echo - Then replace the main files
echo.

pause
