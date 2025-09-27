#!/bin/bash
echo "🎯 FIXING NUXT.JS STATIC ASSETS"
echo "================================"

echo ""
echo "1. 📁 Checking for Nuxt.js build files..."
echo "----------------------------------------"
ls -la output/public/ 2>/dev/null || echo "output/public/ not found"
ls -la public/ 2>/dev/null || echo "public/ not found"
ls -la .output/public/ 2>/dev/null || echo ".output/public/ not found"

echo ""
echo "2. 🔍 Looking for _nuxt directory..."
echo "-----------------------------------"
find . -name "_nuxt" -type d 2>/dev/null || echo "_nuxt directory not found"

echo ""
echo "3. 🧪 Testing static file serving..."
echo "-----------------------------------"
curl -k https://worldtripagency.com/test.php

echo ""
echo "4. 🔧 Checking .htaccess for static file handling..."
echo "---------------------------------------------------"
cat .htaccess

echo ""
echo "5. 📋 Creating proper .htaccess for Nuxt.js..."
echo "---------------------------------------------"
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
curl -k https://worldtripagency.com/ | head -20

echo ""
echo "✅ Nuxt.js assets fix complete!"
echo "Check if the website loads properly now."
