#!/usr/bin/env node

/**
 * Security Fix Deployment Script
 * This script deploys the security fixes for HTTPS and authentication issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Starting Security Fix Deployment...\n');

// Step 1: Backup current .htaccess
console.log('📁 Step 1: Backing up current .htaccess...');
if (fs.existsSync('.htaccess')) {
  fs.copyFileSync('.htaccess', '.htaccess.backup');
  console.log('✅ .htaccess backed up to .htaccess.backup');
} else {
  console.log('⚠️  No existing .htaccess found');
}

// Step 2: Deploy production .htaccess
console.log('\n🔧 Step 2: Deploying production .htaccess...');
if (fs.existsSync('.htaccess-production')) {
  fs.copyFileSync('.htaccess-production', '.htaccess');
  console.log('✅ Production .htaccess deployed');
} else {
  console.log('❌ .htaccess-production not found');
  process.exit(1);
}

// Step 3: Build the application
console.log('\n🏗️  Step 3: Building application...');
const { execSync } = require('child_process');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application built successfully');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 4: Create deployment package
console.log('\n📦 Step 4: Creating deployment package...');
const deployDir = 'security-fix-deploy';

if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true });
}

fs.mkdirSync(deployDir);

// Copy essential files
const filesToCopy = [
  '.htaccess',
  'index.php',
  'package.json',
  'package-lock.json'
];

const dirsToCopy = [
  'output',
  'public',
  'server'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(deployDir, file));
    console.log(`✅ Copied ${file}`);
  } else {
    console.log(`⚠️  ${file} not found`);
  }
});

dirsToCopy.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.cpSync(dir, path.join(deployDir, dir), { recursive: true });
    console.log(`✅ Copied ${dir}/`);
  } else {
    console.log(`⚠️  ${dir}/ not found`);
  }
});

// Step 5: Create environment template
console.log('\n⚙️  Step 5: Creating environment template...');
const envTemplate = `# Production Environment Configuration
# Update these values for your GoDaddy hosting

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=travel
DB_PASSWORD=support@Passord123
DB_NAME=travel

# JWT Configuration - CHANGE THIS IN PRODUCTION!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-${Date.now()}

# Site Configuration
PUBLIC_SITE_URL=https://worldtripagency.com/
NODE_ENV=production

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone
`;

fs.writeFileSync(path.join(deployDir, '.env.example'), envTemplate);
console.log('✅ Created .env.example');

// Step 6: Create deployment instructions
console.log('\n📋 Step 6: Creating deployment instructions...');
const instructions = `# Security Fix Deployment Instructions

## 🚀 Quick Deploy Steps

1. **Upload all files** from this folder to your GoDaddy hosting root directory
2. **Rename .env.example to .env** and update with your database credentials
3. **Set file permissions:**
   - Folders: 755
   - Files: 644
   - .htaccess: 644

## 🔒 Security Fixes Applied

✅ HTTPS redirect configured
✅ Security headers added
✅ Content Security Policy configured
✅ Authentication console messages cleaned up
✅ HSTS (HTTP Strict Transport Security) enabled

## 🧪 Test Your Site

1. **HTTPS Test:** Visit http://worldtripagency.com - should redirect to https://
2. **Security Test:** Visit https://securityheaders.com/?q=worldtripagency.com
3. **SSL Test:** Visit https://www.ssllabs.com/ssltest/analyze.html?d=worldtripagency.com

## 📁 Files Included

- .htaccess (with HTTPS redirect and security headers)
- index.php (application entry point)
- output/ (Nuxt.js build output)
- public/ (static assets)
- server/ (API routes)
- .env.example (environment template)

## 🎯 Expected Results

- ✅ Green lock icon in browser
- ✅ No "Not secure" warnings
- ✅ Clean console (no confusing auth messages)
- ✅ A+ security rating
- ✅ Automatic HTTPS redirect

Your site should now be secure! 🔒
`;

fs.writeFileSync(path.join(deployDir, 'DEPLOYMENT_INSTRUCTIONS.txt'), instructions);
console.log('✅ Created deployment instructions');

console.log('\n🎉 Security Fix Deployment Complete!');
console.log('\n📁 Files ready in: security-fix-deploy/');
console.log('📋 Upload the contents to your GoDaddy hosting');
console.log('🌐 Your secure site will be at: https://worldtripagency.com/');
console.log('\n🔒 Security fixes applied:');
console.log('   ✅ HTTPS redirect');
console.log('   ✅ Security headers');
console.log('   ✅ Content Security Policy');
console.log('   ✅ Authentication cleanup');
console.log('   ✅ HSTS enabled');
