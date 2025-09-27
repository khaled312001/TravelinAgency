#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 PHP EXECUTION TROUBLESHOOTING SCRIPT');
console.log('=====================================\n');

// Create comprehensive PHP test files
const phpTestFiles = {
  'test-basic.php': `<?php
// Basic PHP test
echo "PHP is working!";
echo "<br>PHP Version: " . phpversion();
echo "<br>Current time: " . date('Y-m-d H:i:s');
?>`,
  
  'test-info.php': `<?php
// PHP info test
phpinfo();
?>`,
  
  'test-errors.php': `<?php
// Error reporting test
error_reporting(E_ALL);
ini_set('display_errors', 1);
echo "Error reporting enabled";
echo "<br>Display errors: " . ini_get('display_errors');
echo "<br>Log errors: " . ini_get('log_errors');
echo "<br>Error log: " . ini_get('error_log');
?>`,
  
  'test-json.php': `<?php
// JSON test
header('Content-Type: application/json');
echo json_encode([
  'status' => 'success',
  'message' => 'PHP JSON is working',
  'timestamp' => date('c'),
  'php_version' => phpversion()
]);
?>`,
  
  'test-database.php': `<?php
// Database connection test
header('Content-Type: application/json');

try {
  // Try to connect to database
  $host = 'localhost';
  $dbname = 'u123456789_worldtrip';
  $username = 'u123456789_admin';
  $password = 'Admin123!';
  
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  echo json_encode([
    'status' => 'success',
    'message' => 'Database connection successful',
    'database' => $dbname
  ]);
} catch (Exception $e) {
  echo json_encode([
    'status' => 'error',
    'message' => 'Database connection failed',
    'error' => $e->getMessage()
  ]);
}
?>`
};

// Create a minimal .htaccess that should work
const minimalHtaccess = `# Minimal .htaccess for PHP execution
RewriteEngine On

# Allow PHP files to execute
<Files "*.php">
    Order allow,deny
    Allow from all
</Files>

# Basic URL rewriting for Nuxt.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.php [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Compression
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
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>`;

// Create troubleshooting directory
const troubleshootDir = 'php-troubleshoot';
if (!fs.existsSync(troubleshootDir)) {
  fs.mkdirSync(troubleshootDir);
}

// Write test files
Object.entries(phpTestFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(troubleshootDir, filename), content);
  console.log(`✅ Created: ${filename}`);
});

// Write minimal .htaccess
fs.writeFileSync(path.join(troubleshootDir, '.htaccess-minimal'), minimalHtaccess);
console.log(`✅ Created: .htaccess-minimal`);

// Create deployment script
const deployScript = `#!/bin/bash
echo "🔍 PHP TROUBLESHOOTING DEPLOYMENT"
echo "================================="

# Copy test files
cp test-basic.php .
cp test-info.php .
cp test-errors.php .
cp test-json.php .
cp test-database.php .

# Set permissions
chmod 644 test-*.php

echo "✅ Test files deployed"
echo ""
echo "🧪 TEST THESE URLs:"
echo "1. Basic PHP: https://travelin-agency-nlcs.vercel.app/test-basic.php"
echo "2. PHP Info: https://travelin-agency-nlcs.vercel.app/test-info.php"
echo "3. Error Reporting: https://travelin-agency-nlcs.vercel.app/test-errors.php"
echo "4. JSON API: https://travelin-agency-nlcs.vercel.app/test-json.php"
echo "5. Database: https://travelin-agency-nlcs.vercel.app/test-database.php"
echo ""
echo "🔧 TROUBLESHOOTING STEPS:"
echo "1. Test each URL above"
echo "2. Check which ones work vs fail"
echo "3. If all fail: Server PHP configuration issue"
echo "4. If some work: Specific PHP feature issue"
echo "5. Check error logs: tail -f error_log"
echo ""
echo "📋 NEXT STEPS:"
echo "- If basic PHP works: The issue is with specific code"
echo "- If basic PHP fails: Server configuration problem"
echo "- If JSON works but database fails: Database connection issue"
echo "- If all fail: Contact GoDaddy support about PHP execution"
`;

fs.writeFileSync(path.join(troubleshootDir, 'deploy-troubleshoot.sh'), deployScript);
console.log(`✅ Created: deploy-troubleshoot.sh`);

console.log('\n📋 DEPLOYMENT COMMANDS:');
console.log('======================');
console.log('Run these commands on your GoDaddy server:');
console.log('');
console.log('# 1. Copy troubleshooting files');
console.log('cp test-basic.php .');
console.log('cp test-info.php .');
console.log('cp test-errors.php .');
console.log('cp test-json.php .');
console.log('cp test-database.php .');
console.log('');
console.log('# 2. Set permissions');
console.log('chmod 644 test-*.php');
console.log('');
console.log('# 3. Test each URL');
console.log('curl -k https://travelin-agency-nlcs.vercel.app/test-basic.php');
console.log('curl -k https://travelin-agency-nlcs.vercel.app/test-json.php');
console.log('');
console.log('🧪 TEST URLs:');
console.log('=============');
console.log('1. Basic PHP: https://travelin-agency-nlcs.vercel.app/test-basic.php');
console.log('2. PHP Info: https://travelin-agency-nlcs.vercel.app/test-info.php');
console.log('3. Error Reporting: https://travelin-agency-nlcs.vercel.app/test-errors.php');
console.log('4. JSON API: https://travelin-agency-nlcs.vercel.app/test-json.php');
console.log('5. Database: https://travelin-agency-nlcs.vercel.app/test-database.php');
console.log('');
console.log('🔍 WHAT TO LOOK FOR:');
console.log('====================');
console.log('✅ If test-basic.php works: PHP execution is fine');
console.log('❌ If test-basic.php fails: Server PHP configuration issue');
console.log('✅ If test-json.php works: API functionality should work');
console.log('❌ If test-json.php fails: JSON/header issues');
console.log('✅ If test-database.php works: Database connection is fine');
console.log('❌ If test-database.php fails: Database configuration issue');
console.log('');
console.log('🚨 IF ALL TESTS FAIL:');
console.log('=====================');
console.log('1. Check GoDaddy cPanel PHP settings');
console.log('2. Verify PHP version is enabled');
console.log('3. Check file permissions (644 for files, 755 for folders)');
console.log('4. Contact GoDaddy support about PHP execution');
console.log('5. Check if mod_php is enabled');
console.log('');
console.log('📁 Files created in: php-troubleshoot/');
console.log('🎯 Focus: Identify which specific PHP features are failing');
