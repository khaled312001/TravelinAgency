#!/usr/bin/env node

/**
 * Fix GoDaddy Deployment Script
 * This script fixes the deployment issues for GoDaddy hosting
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 Fixing GoDaddy deployment issues...\n');

try {
  // Step 1: Check if we have the necessary files
  console.log('📁 Checking current file structure...');
  
  const requiredFiles = [
    'output/public/200.html',
    'index.php',
    '.htaccess',
    'package.json'
  ];
  
  const missingFiles = [];
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    } else {
      console.log(`✅ Found: ${file}`);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log(`❌ Missing files: ${missingFiles.join(', ')}`);
    
    // Try to build if output is missing
    if (missingFiles.some(f => f.startsWith('output/'))) {
      console.log('🔨 Building application...');
      try {
        execSync('npm run build', { stdio: 'inherit' });
        execSync('npm run generate', { stdio: 'inherit' });
        console.log('✅ Build completed');
      } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
      }
    }
  }

  // Step 2: Create a proper deployment structure
  console.log('\n📦 Creating deployment structure...');
  
  const deployDir = 'godaddy-fixed';
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  fs.mkdirSync(deployDir);
  
  // Copy the corrected index.php
  fs.copyFileSync('index-godaddy.php', path.join(deployDir, 'index.php'));
  console.log('✅ Copied corrected index.php');
  
  // Copy .htaccess
  if (fs.existsSync('.htaccess')) {
    fs.copyFileSync('.htaccess', path.join(deployDir, '.htaccess'));
    console.log('✅ Copied .htaccess');
  }
  
  // Copy output directory
  if (fs.existsSync('output')) {
    execSync(`xcopy output ${deployDir}\\output /E /I /H /Y`, { stdio: 'inherit' });
    console.log('✅ Copied output directory');
  }
  
  // Copy public directory (if it exists and is different from output/public)
  if (fs.existsSync('public') && !fs.existsSync('output/public')) {
    execSync(`xcopy public ${deployDir}\\public /E /I /H /Y`, { stdio: 'inherit' });
    console.log('✅ Copied public directory');
  }
  
  // Copy server directory for API routes
  if (fs.existsSync('server')) {
    execSync(`xcopy server ${deployDir}\\server /E /I /H /Y`, { stdio: 'inherit' });
    console.log('✅ Copied server directory');
  }
  
  // Create a simple test.php file
  const testPhp = `<?php
echo "<h1>PHP is working!</h1>";
echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>PHP version: " . phpversion() . "</p>";
echo "<p>Current directory: " . __DIR__ . "</p>";

// Check if output directory exists
if (file_exists(__DIR__ . '/output/public/200.html')) {
    echo "<p style='color: green;'>✅ output/public/200.html found</p>";
} else {
    echo "<p style='color: red;'>❌ output/public/200.html not found</p>";
}

// List files in current directory
echo "<h3>Files in current directory:</h3><ul>";
$files = scandir(__DIR__);
foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
        echo "<li>" . $file . "</li>";
    }
}
echo "</ul>";
?>`;
  
  fs.writeFileSync(path.join(deployDir, 'test.php'), testPhp);
  console.log('✅ Created test.php');
  
  // Create environment file template
  const envTemplate = `# Production Environment Configuration
# Update these values for your GoDaddy hosting

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=travel
DB_PASSWORD=support@Passord123
DB_NAME=travel

# JWT Configuration - CHANGE THIS IN PRODUCTION!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone

# Site Configuration
PUBLIC_SITE_URL=https://worldtripagency.com/
NODE_ENV=production
`;
  
  fs.writeFileSync(path.join(deployDir, '.env.example'), envTemplate);
  console.log('✅ Created .env.example');
  
  // Create deployment instructions
  const instructions = `# GoDaddy Deployment Instructions

## Quick Fix for 500 Error

1. **Upload Files**: Upload ALL contents of this 'godaddy-fixed' folder to your GoDaddy hosting root directory (public_html)

2. **File Permissions**: Set these permissions via cPanel File Manager:
   - Folders: 755
   - Files: 644
   - .htaccess: 644

3. **Test**: Visit https://worldtripagency.com/test.php to verify PHP is working

4. **Environment**: Rename .env.example to .env and update with your database credentials

## What This Fix Does:

- ✅ Corrected index.php to look in the right directories
- ✅ Added fallback paths for different deployment structures
- ✅ Included debug information to help troubleshoot
- ✅ Proper static file handling
- ✅ Correct MIME types and caching headers

## If Still Getting 500 Error:

1. Check error logs in cPanel
2. Verify .htaccess is uploaded and has correct permissions
3. Ensure all files are in the root directory (not in a subfolder)
4. Check that output/public/200.html exists

## File Structure Should Be:
public_html/
├── index.php (the corrected one)
├── .htaccess
├── test.php
├── output/
│   └── public/
│       ├── 200.html
│       ├── _nuxt/
│       └── images/
└── .env (rename from .env.example)

Your website should now work at: https://worldtripagency.com/
`;
  
  fs.writeFileSync(path.join(deployDir, 'DEPLOYMENT_INSTRUCTIONS.txt'), instructions);
  console.log('✅ Created deployment instructions');
  
  console.log('\n🎉 Deployment fix completed!');
  console.log('\n📁 Fixed files are ready in the "godaddy-fixed" folder');
  console.log('📋 Upload the contents of the "godaddy-fixed" folder to your GoDaddy hosting');
  console.log('🌐 Test at: https://worldtripagency.com/test.php');
  console.log('🌐 Your website will be available at: https://worldtripagency.com/');

} catch (error) {
  console.error('❌ Fix failed:', error.message);
  process.exit(1);
}
