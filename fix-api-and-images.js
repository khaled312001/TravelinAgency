#!/usr/bin/env node

/**
 * Fix API and Images Script
 * This script fixes the API endpoints and image paths for GoDaddy hosting
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing API endpoints and image paths...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  const requiredFiles = [
    'api-handler.php',
    'index-fixed.php'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
    }
  });

  console.log('\n📋 DEPLOYMENT INSTRUCTIONS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the API handler');
  console.log('cp api-handler.php .');
  console.log('');
  
  console.log('# 2. Backup current index.php');
  console.log('cp index.php index.php.backup');
  console.log('');
  
  console.log('# 3. Replace with fixed index.php');
  console.log('cp index-fixed.php index.php');
  console.log('');
  
  console.log('# 4. Set permissions');
  console.log('chmod 644 index.php');
  console.log('chmod 644 api-handler.php');
  console.log('');
  
  console.log('# 5. Test the API');
  console.log('curl https://worldtripagency.com/api/packages');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- API Packages: https://worldtripagency.com/api/packages');
  console.log('- API Destinations: https://worldtripagency.com/api/destinations');
  console.log('- Main Website: https://worldtripagency.com/');
  console.log('');

  console.log('🔧 WHAT THIS FIXES:');
  console.log('✅ API endpoints now return real data instead of placeholders');
  console.log('✅ Image paths are corrected to use /output/public/images/');
  console.log('✅ Proper CORS headers for API requests');
  console.log('✅ Better error handling for API routes');
  console.log('');

  console.log('📝 FILES TO UPLOAD:');
  console.log('1. api-handler.php - Handles API requests with real data');
  console.log('2. index-fixed.php - Updated index.php with image path fixes');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
