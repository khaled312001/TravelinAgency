#!/usr/bin/env node

/**
 * GoDaddy Troubleshooting Script
 * This script helps diagnose and fix GoDaddy deployment issues
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 GoDaddy Troubleshooting Guide\n');

console.log('❌ ISSUE: Even simple-test.php is giving 500 error');
console.log('📋 This indicates a fundamental problem with file upload or permissions\n');

console.log('🔧 TROUBLESHOOTING STEPS:\n');

console.log('1. 📁 CHECK FILE UPLOAD:');
console.log('   - Log into GoDaddy cPanel');
console.log('   - Open File Manager');
console.log('   - Navigate to public_html folder');
console.log('   - Verify these files exist:');
console.log('     ✅ index.php');
console.log('     ✅ .htaccess');
console.log('     ✅ simple-test.php');
console.log('     ✅ output/ folder\n');

console.log('2. 🔐 CHECK PERMISSIONS:');
console.log('   - Right-click each file in cPanel File Manager');
console.log('   - Set permissions:');
console.log('     📄 Files: 644');
console.log('     📁 Folders: 755\n');

console.log('3. 🧪 TEST STEP BY STEP:');
console.log('   a) First test: https://worldtripagency.com/simple-test.php');
console.log('   b) If that works, test: https://worldtripagency.com/');
console.log('   c) If that works, test: https://worldtripagency.com/test.php\n');

console.log('4. 🚨 IF STILL 500 ERROR:');
console.log('   - Check cPanel Error Logs');
console.log('   - Try removing .htaccess temporarily');
console.log('   - Contact GoDaddy support\n');

console.log('5. 📝 MANUAL UPLOAD INSTRUCTIONS:');
console.log('   - Upload files from godaddy-fixed/ folder to public_html/');
console.log('   - Use cPanel File Manager (not FTP)');
console.log('   - Set correct permissions\n');

// Check if we have the necessary files locally
console.log('📂 LOCAL FILE CHECK:');
const requiredFiles = [
  'godaddy-fixed/index.php',
  'godaddy-fixed/.htaccess',
  'godaddy-fixed/test.php',
  'simple-test.php',
  '.htaccess-minimal'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ Found: ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
  }
});

console.log('\n📋 NEXT STEPS:');
console.log('1. Follow the manual deployment instructions in deploy-to-godaddy-manual.md');
console.log('2. Upload files manually via cPanel File Manager');
console.log('3. Set correct permissions');
console.log('4. Test step by step');
console.log('5. Check error logs if issues persist\n');

console.log('🌐 TEST URLS:');
console.log('- Simple test: https://worldtripagency.com/simple-test.php');
console.log('- Main site: https://worldtripagency.com/');
console.log('- Debug test: https://worldtripagency.com/test.php\n');

console.log('📞 If nothing works, contact GoDaddy support with:');
console.log('- Your domain: worldtripagency.com');
console.log('- Error: 500 Internal Server Error');
console.log('- Request: Check PHP version, file permissions, and error logs');
