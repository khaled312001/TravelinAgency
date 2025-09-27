#!/usr/bin/env node

/**
 * Deploy Final Fixes Script
 * This script deploys the final fixes for API endpoints and image paths
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying final fixes for API and images...\n');

try {
  // Check if we have the necessary files
  console.log('📁 Checking files...');
  
  const requiredFiles = [
    'api-handler-enhanced.php',
    'index-final.php'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
    }
  });

  console.log('\n📋 FINAL DEPLOYMENT COMMANDS:');
  console.log('Run these commands on your GoDaddy server:\n');
  
  console.log('# 1. Copy the enhanced API handler');
  console.log('cp api-handler-enhanced.php api-handler.php');
  console.log('');
  
  console.log('# 2. Backup current index.php');
  console.log('cp index.php index.php.backup2');
  console.log('');
  
  console.log('# 3. Replace with final index.php');
  console.log('cp index-final.php index.php');
  console.log('');
  
  console.log('# 4. Set permissions');
  console.log('chmod 644 index.php');
  console.log('chmod 644 api-handler.php');
  console.log('');
  
  console.log('# 5. Test the APIs');
  console.log('curl -k https://travelin-agency-nlcs.vercel.app/api/packages');
  console.log('curl -k https://travelin-agency-nlcs.vercel.app/api/cms/site-settings');
  console.log('');

  console.log('🧪 TEST URLS:');
  console.log('- API Packages: https://travelin-agency-nlcs.vercel.app/api/packages');
  console.log('- API Destinations: https://travelin-agency-nlcs.vercel.app/api/destinations');
  console.log('- CMS Site Settings: https://travelin-agency-nlcs.vercel.app/api/cms/site-settings');
  console.log('- CMS Home Page: https://travelin-agency-nlcs.vercel.app/api/cms/pages/home');
  console.log('- CMS Navigation: https://travelin-agency-nlcs.vercel.app/api/cms/navigation');
  console.log('- Main Website: https://travelin-agency-nlcs.vercel.app/');
  console.log('');

  console.log('🔧 WHAT THIS FINAL FIX DOES:');
  console.log('✅ Adds missing CMS API endpoints (/api/cms/site-settings, etc.)');
  console.log('✅ Fixes image paths more comprehensively');
  console.log('✅ Handles CSS and JS asset paths correctly');
  console.log('✅ Provides fallback API handler');
  console.log('✅ Better error handling and debugging');
  console.log('');

  console.log('📝 EXPECTED RESULTS:');
  console.log('✅ No more 404 errors for CMS endpoints');
  console.log('✅ Images should load properly');
  console.log('✅ All API endpoints should return data');
  console.log('✅ Website should work without console errors');
  console.log('');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}
