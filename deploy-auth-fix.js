#!/usr/bin/env node

/**
 * Deploy Authentication Fix Script
 * This script deploys the authentication endpoints to fix admin login
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying authentication fix for admin login...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  const requiredFiles = [
    'api-handler-complete.php',
    'index-final-fix.php'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
    }
  });

  console.log('\n📋 DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the complete API handler with authentication');
  console.log('cp api-handler-complete.php api-handler.php');
  console.log('');
  
  console.log('# 2. Backup current index.php');
  console.log('cp index.php index.php.backup-auth');
  console.log('');
  
  console.log('# 3. Replace with final fix index.php');
  console.log('cp index-final-fix.php index.php');
  console.log('');
  
  console.log('# 4. Set permissions');
  console.log('chmod 644 index.php');
  console.log('chmod 644 api-handler.php');
  console.log('');
  
  console.log('# 5. Test the authentication endpoint');
  console.log('curl -k -X POST https://worldtripagency.com/api/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email":"admin@wonderland.com","password":"admin123"}\'');
  console.log('');

  console.log('🔐 ADMIN LOGIN CREDENTIALS:');
  console.log('The system now supports these admin credentials:');
  console.log('1. Email: admin@wonderland.com, Password: admin123 (from login page)');
  console.log('2. Email: admin@worldtripagency.com, Password: admin123');
  console.log('3. Email: admin@travel.com, Password: admin123');
  console.log('4. Email: admin, Password: admin123');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- Admin Login: https://worldtripagency.com/admin/login');
  console.log('- Auth Login API: https://worldtripagency.com/api/auth/login');
  console.log('- Auth Logout API: https://worldtripagency.com/api/auth/logout');
  console.log('- Auth Me API: https://worldtripagency.com/api/auth/me');
  console.log('- Main Website: https://worldtripagency.com/');
  console.log('');

  console.log('🔧 WHAT THIS FIX DOES:');
  console.log('✅ Adds missing /api/auth/login endpoint');
  console.log('✅ Adds /api/auth/logout endpoint');
  console.log('✅ Adds /api/auth/me endpoint');
  console.log('✅ Adds /api/auth/verify endpoint');
  console.log('✅ Implements JWT token generation and verification');
  console.log('✅ Includes admin@wonderland.com credentials (from login page)');
  console.log('✅ Provides fallback hardcoded credentials');
  console.log('✅ Handles database connection with fallback');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ Admin login will work with admin@wonderland.com / admin123');
  console.log('✅ No more 404 errors for /api/auth/login');
  console.log('✅ Authentication flow will be complete');
  console.log('✅ Admin dashboard will be accessible');
  console.log('✅ JWT tokens will be generated and verified');
  console.log('');

  console.log('🚨 IMPORTANT:');
  console.log('Make sure to run these commands on your GoDaddy server:');
  console.log('1. SSH into your server or use cPanel File Manager');
  console.log('2. Navigate to your public_html directory');
  console.log('3. Run the deployment commands above');
  console.log('4. Test the admin login at https://worldtripagency.com/admin/login');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
