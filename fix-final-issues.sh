#!/bin/bash
echo "🎯 FIXING FINAL ISSUES"
echo "======================"

echo ""
echo "1. 🔍 Checking current API response..."
echo "-------------------------------------"
curl -k https://travelin-agency-nlcs.vercel.app/api/packages | head -5

echo ""
echo "2. 🔧 Testing destinations API..."
echo "--------------------------------"
curl -k https://travelin-agency-nlcs.vercel.app/api/destinations

echo ""
echo "3. 📁 Checking for image directories..."
echo "--------------------------------------"
ls -la public/images/ 2>/dev/null || echo "public/images/ not found"
ls -la output/public/images/ 2>/dev/null || echo "output/public/images/ not found"

echo ""
echo "4. 🧪 Testing image access..."
echo "----------------------------"
curl -I https://travelin-agency-nlcs.vercel.app/images/packages/imported/dubai-luxury.jpg 2>/dev/null | head -3

echo ""
echo "5. 🔧 Fixing .htaccess for better image handling..."
echo "--------------------------------------------------"
cat > .htaccess << 'EOF'
RewriteEngine On

# Allow PHP files to execute
<Files "*.php">
    Order allow,deny
    Allow from all
</Files>

# Handle API routes first
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle _nuxt assets (Nuxt.js static files)
RewriteCond %{REQUEST_URI} ^/_nuxt/
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle _ipx image optimization
RewriteCond %{REQUEST_URI} ^/_ipx/
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle static files (CSS, JS, images, etc.)
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^(.*)$ - [L]

# Handle everything else through index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.php [QSA,L]
EOF

echo ""
echo "6. 🧪 Testing the main website..."
echo "--------------------------------"
curl -k https://travelin-agency-nlcs.vercel.app/ | head -10

echo ""
echo "✅ Final fixes applied!"
echo "Check if the website loads properly now."
