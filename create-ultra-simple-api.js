#!/usr/bin/env node

import fs from 'fs';

console.log('🚨 CREATING ULTRA-SIMPLE API HANDLER');
console.log('====================================\n');

// Create the absolute simplest API handler possible
const ultraSimpleApi = `<?php
// Ultra-simple API handler - minimal code
header('Content-Type: application/json');
echo json_encode(['message' => 'Ultra-simple API working!']);
?>`;

// Create an even simpler test
const simpleTest = `<?php
echo 'Simple test working';
?>`;

// Write the files
fs.writeFileSync('api-ultra-simple.php', ultraSimpleApi);
fs.writeFileSync('test-ultra-simple.php', simpleTest);

console.log('✅ Created: api-ultra-simple.php');
console.log('✅ Created: test-ultra-simple.php');

console.log('\n📋 DEPLOYMENT COMMANDS:');
console.log('======================');
console.log('Run these commands on your GoDaddy server:');
console.log('');
console.log('# 1. Check latest error logs');
console.log('tail -10 error_log');
console.log('');
console.log('# 2. Test ultra-simple PHP file first');
console.log('cp test-ultra-simple.php test-simple.php');
console.log('chmod 644 test-simple.php');
console.log('curl -k https://travelin-agency-nlcs.vercel.app/test-simple.php');
console.log('');
console.log('# 3. Deploy ultra-simple API handler');
console.log('cp api-ultra-simple.php api-handler.php');
console.log('chmod 644 api-handler.php');
console.log('');
console.log('# 4. Test the ultra-simple API');
console.log('curl -k https://travelin-agency-nlcs.vercel.app/api/test');
console.log('');
console.log('# 5. If that works, test with more complex handler');
console.log('cp api-handler-working.php api-handler.php');
console.log('chmod 644 api-handler.php');
console.log('curl -k https://travelin-agency-nlcs.vercel.app/api/test');
console.log('');
console.log('🔍 TROUBLESHOOTING STEPS:');
console.log('========================');
console.log('1. If ultra-simple test fails: Server configuration issue');
console.log('2. If ultra-simple API fails: PHP execution issue');
console.log('3. If complex API fails: Code complexity issue');
console.log('4. Check error logs after each test');
console.log('');
console.log('🎯 This will isolate the exact cause of the 500 error!');
