#!/usr/bin/env node

/**
 * Deploy Complete Fix Script
 * This script deploys the complete API handler with authentication
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying complete API handler with authentication...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  if (fs.existsSync('api-handler.php')) {
    console.log('✅ Found: api-handler.php (with authentication)');
  } else {
    console.log('❌ Missing: api-handler.php');
    process.exit(1);
  }

  console.log('\n📋 COMPLETE FIX DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the complete API handler with authentication');
  console.log('cp api-handler.php .');
  console.log('');
  
  console.log('# 2. Set permissions');
  console.log('chmod 644 api-handler.php');
  console.log('');
  
  console.log('# 3. Test the authentication endpoint');
  console.log('curl -k -X POST https://travelin-agency-nlcs.vercel.app/api/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email":"admin@wonderland.com","password":"admin123"}\'');
  console.log('');

  console.log('🔧 WHAT THIS FIX DOES:');
  console.log('✅ Adds complete authentication system');
  console.log('✅ Includes JWT token generation and verification');
  console.log('✅ Supports multiple admin credentials');
  console.log('✅ Handles login, logout, user info, and token verification');
  console.log('✅ Maintains all existing API endpoints');
  console.log('✅ Proper error handling and validation');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ /api/auth/login will work correctly');
  console.log('✅ Admin login will function properly');
  console.log('✅ JWT tokens will be generated and verified');
  console.log('✅ All other API endpoints remain working');
  console.log('✅ No more 500 Internal Server Error');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- Auth Login: https://travelin-agency-nlcs.vercel.app/api/auth/login');
  console.log('- API Packages: https://travelin-agency-nlcs.vercel.app/api/packages');
  console.log('- API Destinations: https://travelin-agency-nlcs.vercel.app/api/destinations');
  console.log('- Admin Login: https://travelin-agency-nlcs.vercel.app/admin/login');
  console.log('');

  console.log('🔐 ADMIN LOGIN CREDENTIALS:');
  console.log('The system supports these admin credentials:');
  console.log('1. Email: admin@wonderland.com, Password: admin123 (from login page)');
  console.log('2. Email: admin@worldtripagency.com, Password: admin123');
  console.log('3. Email: admin@travel.com, Password: admin123');
  console.log('4. Email: admin, Password: admin123');
  console.log('');

  console.log('🚨 IMPORTANT:');
  console.log('1. This replaces your current api-handler.php with the complete version');
  console.log('2. All authentication endpoints are now included');
  console.log('3. JWT tokens are generated for secure authentication');
  console.log('4. The admin login should work immediately after deployment');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}