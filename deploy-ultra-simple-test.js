#!/usr/bin/env node

/**
 * Deploy Ultra Simple Test Script
 * This script creates the simplest possible test to isolate the 500 error
 */

import fs from 'fs';
import path from 'path';

console.log('🚨 Deploying ultra-simple test to isolate 500 error...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  const requiredFiles = [
    'api-test-simple.php',
    'index-ultra-simple.php'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
    }
  });

  console.log('\n📋 ULTRA-SIMPLE TEST DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the ultra-simple test files');
  console.log('cp api-test-simple.php .');
  console.log('cp index-ultra-simple.php .');
  console.log('');
  
  console.log('# 2. Backup current index.php');
  console.log('cp index.php index.php.backup-ultra-simple');
  console.log('');
  
  console.log('# 3. Replace with ultra-simple index.php');
  console.log('cp index-ultra-simple.php index.php');
  console.log('');
  
  console.log('# 4. Set permissions');
  console.log('chmod 644 index.php');
  console.log('chmod 644 api-test-simple.php');
  console.log('');
  
  console.log('# 5. Test the ultra-simple API');
  console.log('curl -k https://worldtripagency.com/api/test');
  console.log('');
  
  console.log('# 6. Test the main website');
  console.log('curl -k https://worldtripagency.com/');
  console.log('');
  
  console.log('# 7. Check server error logs');
  console.log('tail -f /var/log/apache2/error.log');
  console.log('');

  console.log('🔧 WHAT THIS TEST DOES:');
  console.log('✅ Creates the simplest possible PHP files');
  console.log('✅ Tests basic API routing without complexity');
  console.log('✅ Shows directory contents for debugging');
  console.log('✅ Isolates the 500 error to its root cause');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ If this works: The issue is with complex PHP code');
  console.log('✅ If this fails: The issue is with server configuration');
  console.log('✅ Directory listing will show all files');
  console.log('✅ API test should return JSON response');
  console.log('');

  console.log('🚨 TROUBLESHOOTING STEPS:');
  console.log('1. If ultra-simple test works: Gradually add complexity back');
  console.log('2. If ultra-simple test fails: Check server configuration');
  console.log('3. Check error logs for specific error messages');
  console.log('4. Verify PHP is working: php -v');
  console.log('5. Check file permissions: ls -la');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- Ultra-simple API: https://worldtripagency.com/api/test');
  console.log('- Main website: https://worldtripagency.com/');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
