#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🚀 FINAL FIX DEPLOYMENT');
console.log('======================\n');

// Create deployment directory
const deployDir = 'final-fix';
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir);
}

// Copy existing working files
const filesToCopy = [
  'index-ultra-simple.php',
  'api-test-simple.php',
  '.htaccess-working'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(deployDir, file));
    console.log(`✅ Copied: ${file}`);
  } else {
    console.log(`❌ Not found: ${file}`);
  }
});

// Create deployment script
const deployScript = `#!/bin/bash
echo "🚀 DEPLOYING FINAL FIX"
echo "====================="

# Backup current files
echo "📦 Backing up current files..."
cp index.php index.php.backup-$(date +%Y%m%d) 2>/dev/null || true
cp api-handler.php api-handler.php.backup-$(date +%Y%m%d) 2>/dev/null || true
cp .htaccess .htaccess.backup-$(date +%Y%m%d) 2>/dev/null || true

# Deploy the fix
echo "🚀 Deploying fix files..."
cp index-ultra-simple.php index.php
cp api-test-simple.php api-handler.php
cp .htaccess-working .htaccess

# Set permissions
echo "🔧 Setting permissions..."
chmod 644 index.php
chmod 644 api-handler.php
chmod 644 .htaccess

echo "✅ Deployment complete!"
echo ""
echo "🧪 TEST THESE URLs:"
echo "1. Main website: https://travelin-agency-nlcs.vercel.app/"
echo "2. API test: https://travelin-agency-nlcs.vercel.app/api/test"
echo "3. Basic PHP: https://travelin-agency-nlcs.vercel.app/test-basic.php"
echo ""
echo "📋 If tests pass, gradually add complexity back:"
echo "1. Replace api-handler.php with full version"
echo "2. Replace index.php with full version"
echo "3. Test each step"
`;

fs.writeFileSync(path.join(deployDir, 'deploy.sh'), deployScript);
console.log('✅ Created: deploy.sh');

console.log('\n📋 DEPLOYMENT STEPS:');
console.log('===================');
console.log('1. Copy files to server:');
console.log('   cp index-ultra-simple.php .');
console.log('   cp api-test-simple.php .');
console.log('   cp .htaccess-working .');
console.log('');
console.log('2. Deploy the fix:');
console.log('   cp index-ultra-simple.php index.php');
console.log('   cp api-test-simple.php api-handler.php');
console.log('   cp .htaccess-working .htaccess');
console.log('');
console.log('3. Set permissions:');
console.log('   chmod 644 index.php api-handler.php .htaccess');
console.log('');
console.log('4. Test:');
console.log('   curl -k https://travelin-agency-nlcs.vercel.app/');
console.log('   curl -k https://travelin-agency-nlcs.vercel.app/api/test');
console.log('');
console.log('🎯 This should fix the 500 errors!');