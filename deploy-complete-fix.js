#!/usr/bin/env node

/**
 * Deploy Complete Fix Script
 * This script deploys the complete fixes including authentication endpoints for admin login
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying complete fixes including authentication endpoints...\n');

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

  console.log('\n📋 COMPLETE FIX DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the complete API handler with authentication');
  console.log('cp api-handler-complete.php api-handler.php');
  console.log('');
  
  console.log('# 2. Backup current index.php');
  console.log('cp index.php index.php.backup5');
  console.log('');
  
  console.log('# 3. Replace with final fix index.php');
  console.log('cp index-final-fix.php index.php');
  console.log('');
  
  console.log('# 4. Set permissions');
  console.log('chmod 644 index.php');
  console.log('chmod 644 api-handler.php');
  console.log('');
  
  console.log('# 5. Test the APIs');
  console.log('curl -k https://worldtripagency.com/api/packages');
  console.log('curl -k https://worldtripagency.com/api/auth/login');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- API Packages: https://worldtripagency.com/api/packages');
  console.log('- API Destinations: https://worldtripagency.com/api/destinations');
  console.log('- CMS Site Settings: https://worldtripagency.com/api/cms/site-settings');
  console.log('- CMS Home Page: https://worldtripagency.com/api/cms/pages/home');
  console.log('- CMS Navigation: https://worldtripagency.com/api/cms/navigation');
  console.log('- Auth Login: https://worldtripagency.com/api/auth/login');
  console.log('- Auth Logout: https://worldtripagency.com/api/auth/logout');
  console.log('- Auth Me: https://worldtripagency.com/api/auth/me');
  console.log('- Auth Verify: https://worldtripagency.com/api/auth/verify');
  console.log('- Main Website: https://worldtripagency.com/');
  console.log('- Admin Login: https://worldtripagency.com/admin/login');
  console.log('');

  console.log('🔧 WHAT THIS COMPLETE FIX DOES:');
  console.log('✅ Handles IPX optimization for external URLs (Pexels, etc.)');
  console.log('✅ Redirects external IPX URLs to original external URLs');
  console.log('✅ Handles local IPX URLs and serves original images');
  console.log('✅ Ensures proper data structure for frontend processing');
  console.log('✅ Uses JSON_UNESCAPED_SLASHES for proper JSON encoding');
  console.log('✅ Connects to MySQL database for real data');
  console.log('✅ Provides fallback sample data if database fails');
  console.log('✅ Fixes all image and asset paths comprehensively');
  console.log('✅ Handles static files from multiple locations');
  console.log('✅ Comprehensive error handling and logging');
  console.log('✅ **NEW: Authentication endpoints for admin login**');
  console.log('✅ **NEW: JWT token generation and verification**');
  console.log('✅ **NEW: Hardcoded admin credentials for fallback**');
  console.log('✅ **NEW: Complete admin authentication flow**');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ No more IPX 404 errors for external URLs');
  console.log('✅ External images (Pexels) load properly');
  console.log('✅ Local images load from correct paths');
  console.log('✅ Frontend processes API data correctly (no more undefined)');
  console.log('✅ All API endpoints return properly structured data');
  console.log('✅ **NEW: Admin login works properly**');
  console.log('✅ **NEW: Authentication flow is complete**');
  console.log('✅ **NEW: Admin dashboard is accessible**');
  console.log('✅ Clean browser console with no errors');
  console.log('✅ Website works perfectly with all features');
  console.log('');

  console.log('🔐 ADMIN LOGIN CREDENTIALS:');
  console.log('The system supports multiple admin credentials:');
  console.log('1. Database admin users (if database is available)');
  console.log('2. Hardcoded fallback credentials:');
  console.log('   - Email: admin@worldtripagency.com, Password: admin123');
  console.log('   - Email: admin@travel.com, Password: admin123');
  console.log('   - Email: admin, Password: admin123');
  console.log('');

  console.log('🗄️ DATABASE CONNECTION:');
  console.log('The API handler will try to connect to your MySQL database using:');
  console.log('- Host: localhost (or DB_HOST from .env)');
  console.log('- User: travel (or DB_USER from .env)');
  console.log('- Password: support@Passord123 (or DB_PASSWORD from .env)');
  console.log('- Database: travel (or DB_NAME from .env)');
  console.log('');
  console.log('If database connection fails, it will use sample data and hardcoded admin credentials.');
  console.log('');

  console.log('🎯 KEY IMPROVEMENTS:');
  console.log('1. IPX External URL Handling: Redirects Pexels and other external URLs');
  console.log('2. Frontend Data Structure: Ensures proper data types and structure');
  console.log('3. JSON Encoding: Uses JSON_UNESCAPED_SLASHES for proper encoding');
  console.log('4. Error Handling: Comprehensive error handling and logging');
  console.log('5. Fallback Protection: Sample data if database unavailable');
  console.log('6. **NEW: Authentication System: Complete JWT-based auth system**');
  console.log('7. **NEW: Admin Login: Working admin login with fallback credentials**');
  console.log('8. **NEW: Token Management: JWT token generation and verification**');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
