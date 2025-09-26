#!/usr/bin/env node

/**
 * Deploy Index API Fix Script
 * This script fixes the index.php to properly route API requests to api-handler.php
 */

import fs from 'fs';
import path from 'path';

console.log('🚨 Deploying index.php API routing fix...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  if (fs.existsSync('index-api-fix.php')) {
    console.log('✅ Found: index-api-fix.php');
  } else {
    console.log('❌ Missing: index-api-fix.php');
    process.exit(1);
  }

  console.log('\n📋 INDEX API FIX DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Backup current index.php');
  console.log('cp index.php index.php.backup-api-fix');
  console.log('');
  
  console.log('# 2. Replace with fixed index.php');
  console.log('cp index-api-fix.php index.php');
  console.log('');
  
  console.log('# 3. Set permissions');
  console.log('chmod 644 index.php');
  console.log('');
  
  console.log('# 4. Test the authentication endpoint');
  console.log('curl -k -X POST https://worldtripagency.com/api/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email":"admin@wonderland.com","password":"admin123"}\'');
  console.log('');
  
  console.log('# 5. Test packages endpoint');
  console.log('curl -k https://worldtripagency.com/api/packages');
  console.log('');

  console.log('🔧 WHAT THIS FIX DOES:');
  console.log('✅ Fixes index.php to properly route API requests to api-handler.php');
  console.log('✅ Removes dependency on non-existent api-handler-database.php');
  console.log('✅ Ensures API requests are handled by the current api-handler.php');
  console.log('✅ Maintains all existing functionality (IPX, static files, etc.)');
  console.log('✅ Adds proper error handling and debugging');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ No more 500 Internal Server Error for API requests');
  console.log('✅ /api/auth/login will work correctly');
  console.log('✅ /api/packages will return data');
  console.log('✅ All other API endpoints will function');
  console.log('✅ Website will continue to work normally');
  console.log('');

  console.log('🚨 ROOT CAUSE:');
  console.log('The index.php was looking for api-handler-database.php first,');
  console.log('which doesn\'t exist, causing the 500 error. This fix ensures');
  console.log('it uses the current api-handler.php file directly.');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- Auth Login: https://worldtripagency.com/api/auth/login');
  console.log('- API Packages: https://worldtripagency.com/api/packages');
  console.log('- API Destinations: https://worldtripagency.com/api/destinations');
  console.log('- Main Website: https://worldtripagency.com/');
  console.log('');

  console.log('🔐 ADMIN LOGIN CREDENTIALS:');
  console.log('Email: admin@wonderland.com');
  console.log('Password: admin123');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
