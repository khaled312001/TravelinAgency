#!/usr/bin/env node

import fs from 'fs';

console.log('🎯 FIXING NUXT.JS STATIC ASSETS');
console.log('================================\n');

// Create a comprehensive fix for Nuxt.js assets
const fixNuxtAssets = `#!/bin/bash
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
`;

fs.writeFileSync('fix-nuxt-assets.sh', fixNuxtAssets);
console.log('✅ Created: fix-nuxt-assets.sh');

console.log('\n📋 NUXT.JS ASSETS FIX:');
console.log('======================');
console.log('Run these commands on your GoDaddy server:');
console.log('');
console.log('# 1. Check for Nuxt.js build files');
console.log('ls -la output/public/');
console.log('ls -la public/');
console.log('ls -la .output/public/');
console.log('');
console.log('# 2. Look for _nuxt directory');
console.log('find . -name "_nuxt" -type d');
console.log('');
console.log('# 3. Fix .htaccess for Nuxt.js assets');
console.log('cat > .htaccess << "EOF"');
console.log('RewriteEngine On');
console.log('');
console.log('# Allow PHP files to execute');
console.log('<Files "*.php">');
console.log('    Order allow,deny');
console.log('    Allow from all');
console.log('</Files>');
console.log('');
console.log('# Handle API routes first');
console.log('RewriteCond %{REQUEST_URI} ^/api/');
console.log('RewriteRule ^(.*)$ /index.php [QSA,L]');
console.log('');
console.log('# Handle _nuxt assets (Nuxt.js static files)');
console.log('RewriteCond %{REQUEST_URI} ^/_nuxt/');
console.log('RewriteRule ^(.*)$ /index.php [QSA,L]');
console.log('');
console.log('# Handle static files (CSS, JS, images, etc.)');
console.log('RewriteCond %{REQUEST_FILENAME} -f');
console.log('RewriteRule ^(.*)$ - [L]');
console.log('');
console.log('# Handle everything else through index.php');
console.log('RewriteCond %{REQUEST_FILENAME} !-f');
console.log('RewriteCond %{REQUEST_FILENAME} !-d');
console.log('RewriteRule ^(.*)$ /index.php [QSA,L]');
console.log('EOF');
console.log('');
console.log('# 4. Test the website');
console.log('curl -k https://worldtripagency.com/');
console.log('');
console.log('🎯 This should fix the missing CSS/JS files!');
