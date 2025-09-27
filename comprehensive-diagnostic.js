#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 COMPREHENSIVE API DIAGNOSTIC');
console.log('===============================\n');

// Create a comprehensive diagnostic script
const diagnosticScript = `#!/bin/bash
echo "🔍 COMPREHENSIVE API DIAGNOSTIC"
echo "==============================="

echo ""
echo "1. 📋 Latest error logs..."
echo "-------------------------"
tail -10 error_log

echo ""
echo "2. 🧪 Test ultra-simple PHP file..."
echo "----------------------------------"
echo "<?php echo 'PHP working'; ?>" > test-ultra-simple.php
chmod 644 test-ultra-simple.php
curl -k https://travelin-agency-nlcs.vercel.app/test-ultra-simple.php

echo ""
echo "3. 🔧 Test ultra-simple API handler..."
echo "-------------------------------------"
echo "<?php header('Content-Type: application/json'); echo json_encode(['test' => 'working']); ?>" > api-ultra-simple.php
chmod 644 api-ultra-simple.php
cp api-ultra-simple.php api-handler.php
curl -k https://travelin-agency-nlcs.vercel.app/api/test

echo ""
echo "4. 📁 Check file permissions..."
echo "------------------------------"
ls -la api-handler.php
ls -la index.php

echo ""
echo "5. 🔍 Check .htaccess content..."
echo "-------------------------------"
head -10 .htaccess

echo ""
echo "6. 🧪 Test with working API handler..."
echo "-------------------------------------"
cp api-handler-working.php api-handler.php
chmod 644 api-handler.php
curl -k https://travelin-agency-nlcs.vercel.app/api/test

echo ""
echo "7. 📋 Check for any output before headers..."
echo "-------------------------------------------"
php -r "echo 'Testing PHP output'; header('Content-Type: text/plain'); echo 'Headers after output';"

echo ""
echo "8. 🔧 Test PHP configuration..."
echo "------------------------------"
php -i | grep -i error

echo ""
echo "✅ Diagnostic complete!"
echo "Check the results above to identify the issue."
`;

fs.writeFileSync('comprehensive-diagnostic.sh', diagnosticScript);
console.log('✅ Created: comprehensive-diagnostic.sh');

console.log('\n📋 COMPREHENSIVE DIAGNOSTIC COMMANDS:');
console.log('=====================================');
console.log('Run these commands on your GoDaddy server:');
console.log('');
console.log('# Make diagnostic script executable and run it');
console.log('chmod +x comprehensive-diagnostic.sh');
console.log('./comprehensive-diagnostic.sh');
console.log('');
console.log('# Or run individual diagnostic steps:');
console.log('');
console.log('# 1. Check latest error logs');
console.log('tail -10 error_log');
console.log('');
console.log('# 2. Test ultra-simple PHP file');
console.log('echo "<?php echo \'PHP working\'; ?>" > test-ultra-simple.php');
console.log('chmod 644 test-ultra-simple.php');
console.log('curl -k https://travelin-agency-nlcs.vercel.app/test-ultra-simple.php');
console.log('');
console.log('# 3. Test ultra-simple API handler');
console.log('echo "<?php header(\'Content-Type: application/json\'); echo json_encode([\'test\' => \'working\']); ?>" > api-ultra-simple.php');
console.log('chmod 644 api-ultra-simple.php');
console.log('cp api-ultra-simple.php api-handler.php');
console.log('curl -k https://travelin-agency-nlcs.vercel.app/api/test');
console.log('');
console.log('# 4. Check file permissions');
console.log('ls -la api-handler.php index.php');
console.log('');
console.log('# 5. Check .htaccess');
console.log('head -10 .htaccess');
console.log('');
console.log('🎯 This will identify the exact cause of the 500 error!');
