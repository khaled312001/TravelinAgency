#!/usr/bin/env node

import fs from 'fs';

console.log('🚨 FIXING SERVER CONFIGURATION ISSUE');
console.log('====================================\n');

// Create a proper .htaccess file
const properHtaccess = `RewriteEngine On

# Allow PHP files to execute
<Files "*.php">
    Order allow,deny
    Allow from all
</Files>

# Handle API routes first
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle static files
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^(.*)$ - [L]

# Handle everything else through index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.php [QSA,L]`;

// Create an absolute minimal test file
const minimalTest = `<?php
echo 'PHP working';
?>`;

// Create a minimal API handler
const minimalApi = `<?php
header('Content-Type: application/json');
echo json_encode(['status' => 'working']);
?>`;

// Write the files
fs.writeFileSync('.htaccess-fixed', properHtaccess);
fs.writeFileSync('test-minimal.php', minimalTest);
fs.writeFileSync('api-minimal.php', minimalApi);

console.log('✅ Created: .htaccess-fixed');
console.log('✅ Created: test-minimal.php');
console.log('✅ Created: api-minimal.php');

console.log('\n📋 SERVER CONFIGURATION FIX:');
console.log('============================');
console.log('Run these commands on your GoDaddy server:');
console.log('');
console.log('# 1. Fix the .htaccess file');
console.log('cp .htaccess-fixed .htaccess');
console.log('chmod 644 .htaccess');
console.log('');
console.log('# 2. Test minimal PHP file');
console.log('cp test-minimal.php test.php');
console.log('chmod 644 test.php');
console.log('curl -k https://worldtripagency.com/test.php');
console.log('');
console.log('# 3. Test minimal API handler');
console.log('cp api-minimal.php api-handler.php');
console.log('chmod 644 api-handler.php');
console.log('curl -k https://worldtripagency.com/api/test');
console.log('');
console.log('# 4. If still failing, try without .htaccess');
console.log('mv .htaccess .htaccess.disabled');
console.log('curl -k https://worldtripagency.com/test.php');
console.log('');
console.log('# 5. Check PHP configuration');
console.log('php -i | grep -i error');
console.log('');
console.log('🔍 TROUBLESHOOTING:');
console.log('==================');
console.log('1. If test.php works: .htaccess was the issue');
console.log('2. If test.php fails: PHP execution is disabled');
console.log('3. If API works: Routing was the issue');
console.log('4. If all fail: Contact GoDaddy support');
console.log('');
console.log('🎯 This should fix the server configuration issue!');
