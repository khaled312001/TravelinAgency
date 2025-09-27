#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 CREATING WORKING .HTACCESS FOR PHP + NUXT.JS');
console.log('===============================================\n');

// Create a working .htaccess that allows PHP execution
const workingHtaccess = `# Working .htaccess for PHP + Nuxt.js on GoDaddy
RewriteEngine On

# Allow PHP files to execute properly
<Files "*.php">
    Order allow,deny
    Allow from all
    # Ensure PHP files are processed by PHP engine
    SetHandler application/x-httpd-php
</Files>

# Handle API routes first (before Nuxt.js routing)
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle static files (images, CSS, JS, etc.)
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^(.*)$ - [L]

# Handle IPX image optimization redirects
RewriteCond %{REQUEST_URI} ^/_ipx/
RewriteRule ^_ipx/(.*)$ /$1 [R=301,L]

# Handle Nuxt.js routing (everything else goes to index.php)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.php [QSA,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression for better performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Cache control for static assets
<IfModule mod_expires.c>
    ExpiresActive On
    
    # CSS and JS files
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/x-javascript "access plus 1 year"
    
    # Images
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    
    # Fonts
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    
    # HTML files (shorter cache for dynamic content)
    ExpiresByType text/html "access plus 1 hour"
    
    # API responses (no cache)
    ExpiresByType application/json "access plus 0 seconds"
</IfModule>

# Prevent access to sensitive files
<FilesMatch "\\.(htaccess|htpasswd|ini|log|sh|inc|bak|backup|sql|conf)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Prevent access to hidden files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

# Allow access to specific hidden files needed by Nuxt.js
<FilesMatch "^\\.nuxt">
    Order allow,deny
    Allow from all
</FilesMatch>

# MIME types for modern web standards
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    AddType image/svg+xml .svg
    AddType application/font-woff .woff
    AddType application/font-woff2 .woff2
    AddType application/json .json
</IfModule>

# Error pages (optional)
ErrorDocument 404 /index.php
ErrorDocument 500 /index.php`;

// Write the working .htaccess
fs.writeFileSync('.htaccess-working', workingHtaccess);
console.log('✅ Created: .htaccess-working');

// Create deployment instructions
const deploymentInstructions = `# DEPLOYMENT INSTRUCTIONS FOR WORKING .HTACCESS
# ===========================================

# 1. Backup current .htaccess
cp .htaccess .htaccess.backup-$(date +%Y%m%d)

# 2. Deploy the working .htaccess
cp .htaccess-working .htaccess

# 3. Set correct permissions
chmod 644 .htaccess

# 4. Test PHP execution
curl -k https://worldtripagency.com/test-basic.php

# 5. Test API endpoints
curl -k https://worldtripagency.com/api/test

# 6. Test main website
curl -k https://worldtripagency.com/

# 7. If issues persist, restore backup
# cp .htaccess.backup-* .htaccess

# KEY FEATURES OF THIS .HTACCESS:
# ✅ Explicitly allows PHP file execution
# ✅ Sets proper PHP handler
# ✅ Handles API routes before Nuxt.js routing
# ✅ Serves static files directly
# ✅ Redirects IPX optimization URLs
# ✅ Includes security headers
# ✅ Enables compression
# ✅ Sets proper cache headers
# ✅ Prevents access to sensitive files
# ✅ Handles MIME types correctly

# TROUBLESHOOTING:
# - If PHP still fails: Check GoDaddy PHP settings in cPanel
# - If static files fail: Check file permissions (644 for files, 755 for folders)
# - If API fails: Check api-handler.php exists and has correct permissions
# - If Nuxt.js fails: Check 200.html exists in output/public/ or public/
`;

fs.writeFileSync('deploy-htaccess-instructions.txt', deploymentInstructions);
console.log('✅ Created: deploy-htaccess-instructions.txt');

console.log('\n📋 DEPLOYMENT STEPS:');
console.log('===================');
console.log('1. Copy the working .htaccess:');
console.log('   cp .htaccess-working .htaccess');
console.log('');
console.log('2. Set permissions:');
console.log('   chmod 644 .htaccess');
console.log('');
console.log('3. Test PHP execution:');
console.log('   curl -k https://worldtripagency.com/test-basic.php');
console.log('');
console.log('4. Test API:');
console.log('   curl -k https://worldtripagency.com/api/test');
console.log('');
console.log('5. Test main website:');
console.log('   curl -k https://worldtripagency.com/');
console.log('');
console.log('🔧 KEY IMPROVEMENTS:');
console.log('===================');
console.log('✅ Explicit PHP file handling');
console.log('✅ Proper PHP handler directive');
console.log('✅ API routes handled first');
console.log('✅ Static file optimization');
console.log('✅ Security headers');
console.log('✅ Compression enabled');
console.log('✅ Cache control');
console.log('✅ MIME type handling');
console.log('');
console.log('🎯 This should resolve the PHP execution issues!');
