#!/usr/bin/env node

/**
 * Deploy Routing Fix Script
 * This script deploys the fixed API routing
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying API routing fix...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  if (fs.existsSync('api-handler-routing-fix.php')) {
    console.log('✅ Found: api-handler-routing-fix.php');
  } else {
    console.log('❌ Missing: api-handler-routing-fix.php');
    process.exit(1);
  }

  console.log('\n📋 ROUTING FIX DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the fixed routing API handler');
  console.log('cp api-handler-routing-fix.php api-handler.php');
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
  console.log('✅ Fixes API routing for authentication endpoints');
  console.log('✅ Adds debug logging for API requests');
  console.log('✅ Ensures proper path matching for /api/auth/* routes');
  console.log('✅ Maintains all existing functionality');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ /api/auth/login will work correctly');
  console.log('✅ Admin login will function properly');
  console.log('✅ All other API endpoints remain working');
  console.log('✅ Better error messages for debugging');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- Auth Login: https://travelin-agency-nlcs.vercel.app/api/auth/login');
  console.log('- API Packages: https://travelin-agency-nlcs.vercel.app/api/packages');
  console.log('- API Destinations: https://travelin-agency-nlcs.vercel.app/api/destinations');
  console.log('- Admin Login: https://travelin-agency-nlcs.vercel.app/admin/login');
  console.log('');

  console.log('🔐 ADMIN LOGIN CREDENTIALS:');
  console.log('Email: admin@wonderland.com');
  console.log('Password: admin123');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
