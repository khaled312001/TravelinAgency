#!/usr/bin/env node

/**
 * Deploy Quick Routing Fix Script
 * This script provides commands to fix the API routing issue
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying quick API routing fix...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  if (fs.existsSync('fix-api-routing.php')) {
    console.log('✅ Found: fix-api-routing.php');
  } else {
    console.log('❌ Missing: fix-api-routing.php');
    process.exit(1);
  }

  console.log('\n📋 QUICK ROUTING FIX DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the routing fix script');
  console.log('cp fix-api-routing.php .');
  console.log('');
  
  console.log('# 2. Run the fix script');
  console.log('php fix-api-routing.php');
  console.log('');
  
  console.log('# 3. Test the authentication endpoint');
  console.log('curl -k -X POST https://worldtripagency.com/api/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email":"admin@wonderland.com","password":"admin123"}\'');
  console.log('');

  console.log('🔧 WHAT THIS FIX DOES:');
  console.log('✅ Fixes the routing logic in the existing api-handler.php');
  console.log('✅ Adds debug logging for API requests');
  console.log('✅ Ensures proper path matching for /api/auth/* routes');
  console.log('✅ Creates a backup of the original file');
  console.log('✅ Maintains all existing functionality');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ /api/auth/login will work correctly');
  console.log('✅ Admin login will function properly');
  console.log('✅ All other API endpoints remain working');
  console.log('✅ Better error messages for debugging');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- Auth Login: https://worldtripagency.com/api/auth/login');
  console.log('- API Packages: https://worldtripagency.com/api/packages');
  console.log('- API Destinations: https://worldtripagency.com/api/destinations');
  console.log('- Admin Login: https://worldtripagency.com/admin/login');
  console.log('');

  console.log('🔐 ADMIN LOGIN CREDENTIALS:');
  console.log('Email: admin@wonderland.com');
  console.log('Password: admin123');
  console.log('');

  console.log('🚨 IMPORTANT:');
  console.log('1. This fix modifies the existing api-handler.php file');
  console.log('2. A backup will be created automatically');
  console.log('3. The fix adds authentication routes to the existing switch statement');
  console.log('4. All existing functionality is preserved');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
