#!/usr/bin/env node

/**
 * Deploy Troubleshooting Script
 * This script helps troubleshoot the 500 Internal Server Error
 */

import fs from 'fs';
import path from 'path';

console.log('🚨 Deploying troubleshooting fixes for 500 Internal Server Error...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  const requiredFiles = [
    'api-handler-minimal.php',
    'test-api-syntax.php'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
    }
  });

  console.log('\n📋 TROUBLESHOOTING DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the troubleshooting files');
  console.log('cp api-handler-minimal.php .');
  console.log('cp test-api-syntax.php .');
  console.log('');
  
  console.log('# 2. Test PHP syntax');
  console.log('php test-api-syntax.php');
  console.log('');
  
  console.log('# 3. Test with minimal API handler');
  console.log('cp api-handler-minimal.php api-handler.php');
  console.log('chmod 644 api-handler.php');
  console.log('');
  
  console.log('# 4. Test the minimal authentication endpoint');
  console.log('curl -k -X POST https://worldtripagency.com/api/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email":"admin@wonderland.com","password":"admin123"}\'');
  console.log('');
  
  console.log('# 5. Test packages endpoint');
  console.log('curl -k https://worldtripagency.com/api/packages');
  console.log('');

  console.log('🔧 TROUBLESHOOTING STEPS:');
  console.log('✅ Step 1: Test PHP syntax to find any errors');
  console.log('✅ Step 2: Use minimal API handler to isolate the issue');
  console.log('✅ Step 3: Test basic functionality with simplified code');
  console.log('✅ Step 4: Gradually add complexity back');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ PHP syntax test should pass without errors');
  console.log('✅ Minimal API handler should work without 500 errors');
  console.log('✅ Authentication endpoint should return success');
  console.log('✅ Packages endpoint should return data');
  console.log('');

  console.log('🚨 IF STILL GETTING 500 ERRORS:');
  console.log('1. Check server error logs: tail -f /var/log/apache2/error.log');
  console.log('2. Check PHP error logs: tail -f /var/log/php_errors.log');
  console.log('3. Verify file permissions: ls -la api-handler.php');
  console.log('4. Test with even simpler PHP file');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- Auth Login: https://worldtripagency.com/api/auth/login');
  console.log('- API Packages: https://worldtripagency.com/api/packages');
  console.log('- Syntax Test: https://worldtripagency.com/test-api-syntax.php');
  console.log('');

  console.log('🔐 ADMIN LOGIN CREDENTIALS:');
  console.log('Email: admin@wonderland.com');
  console.log('Password: admin123');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
