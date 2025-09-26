#!/usr/bin/env node

import fs from 'fs';

console.log('🚀 DEPLOYING API ROUTING FIX');
console.log('============================\n');

// Read the fixed index.php
const fixedIndexPhp = fs.readFileSync('index.php', 'utf8');

console.log('✅ Fixed index.php loaded');
console.log('📋 Key changes:');
console.log('  - API routes now properly include api-handler.php');
console.log('  - Added CORS headers for API requests');
console.log('  - Added fallback error handling');
console.log('');

console.log('📋 DEPLOYMENT COMMANDS:');
console.log('======================');
console.log('Run these commands on your GoDaddy server:');
console.log('');
console.log('# 1. Backup current index.php');
console.log('cp index.php index.php.backup-api-fix-$(date +%Y%m%d)');
console.log('');
console.log('# 2. Deploy the fixed index.php');
console.log('cat > index.php << "EOF"');
console.log(fixedIndexPhp);
console.log('EOF');
console.log('');
console.log('# 3. Set permissions');
console.log('chmod 644 index.php');
console.log('');
console.log('# 4. Test the API endpoints');
console.log('curl -k https://worldtripagency.com/api/test');
console.log('curl -k https://worldtripagency.com/api/packages');
console.log('curl -k -X POST https://worldtripagency.com/api/auth/login \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"email":"admin@wonderland.com","password":"admin123"}\'');
console.log('');
console.log('🧪 EXPECTED RESULTS:');
console.log('===================');
console.log('✅ /api/test should return: {"message": "Simple API Test Working!"}');
console.log('✅ /api/packages should return: JSON array of packages');
console.log('✅ /api/auth/login should return: Success with JWT token');
console.log('');
console.log('🎯 This should fix the 404 errors for API endpoints!');
