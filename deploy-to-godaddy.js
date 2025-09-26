#!/usr/bin/env node

/**
 * Simple deployment script for GoDaddy hosting
 * This script prepares the files you need to upload to your GoDaddy server
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Preparing files for GoDaddy deployment...\n');

try {
  // Create deployment directory
  const deployDir = 'godaddy-deploy';
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  fs.mkdirSync(deployDir);

  // Copy essential files
  const filesToCopy = [
    '.htaccess',
    'index.php',
    'server.js',
    'package.json',
    'package-lock.json'
  ];

  console.log('📁 Copying essential files...');
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(deployDir, file));
      console.log(`✅ Copied ${file}`);
    } else {
      console.log(`⚠️  ${file} not found`);
    }
  });

  // Copy public directory
  if (fs.existsSync('public')) {
    console.log('📁 Copying public directory...');
    copyDir('public', path.join(deployDir, 'public'));
    console.log('✅ Copied public directory');
  }

  // Copy server directory (for API routes)
  if (fs.existsSync('server')) {
    console.log('📁 Copying server directory...');
    copyDir('server', path.join(deployDir, 'server'));
    console.log('✅ Copied server directory');
  }

  // Copy output directory if it exists (skip if permission issues)
  if (fs.existsSync('output')) {
    console.log('📁 Copying output directory...');
    try {
      copyDir('output', path.join(deployDir, 'output'));
      console.log('✅ Copied output directory');
    } catch (error) {
      console.log('⚠️  Skipped output directory due to permission issues');
      console.log('   This is normal - the output directory contains build files');
    }
  }

  // Create production .env template
  const envTemplate = `# Production Environment Configuration for GoDaddy Hosting
# Update these values for your production server

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

## Files Ready for Upload

All files in this 'godaddy-deploy' folder are ready to be uploaded to your GoDaddy hosting.

## Upload Steps:

1. **Upload all files** from this folder to your GoDaddy hosting root directory (public_html)

2. **Set up environment variables:**
   - Rename .env.example to .env
   - Update the database credentials in .env file
   - Make sure NODE_ENV=production

3. **Set file permissions:**
   - Folders: 755
   - Files: 644
   - .htaccess: 644

4. **Create your MySQL database** in GoDaddy cPanel

5. **Import your database schema** if you have one

## Important Files:
- .htaccess (Apache configuration for routing)
- index.php (Application entry point)
- public/ (Static files and assets)
- server/ (API routes)
- output/ (Nuxt.js build output)

## Test Your Website:
- Main site: https://worldtripagency.com/
- PHP test: https://worldtripagency.com/test.php
- API test: https://worldtripagency.com/api/

## Troubleshooting:
- If you get 500 errors, check the .htaccess file
- If static files don't load, check the public/ directory
- If API doesn't work, check the server/ directory

Your website should now work at: https://worldtripagency.com/
`;

  fs.writeFileSync(path.join(deployDir, 'README.txt'), instructions);
  console.log('✅ Created deployment instructions');

  console.log('\n🎉 Deployment files are ready!');
  console.log(`\n📁 Upload the contents of the "${deployDir}" folder to your GoDaddy hosting`);
  console.log('🌐 Your website will be available at: https://worldtripagency.com/');
  console.log('\n📋 Next steps:');
  console.log('1. Upload all files to public_html directory');
  console.log('2. Rename .env.example to .env and update database credentials');
  console.log('3. Set proper file permissions');
  console.log('4. Test your website!');

} catch (error) {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
}

// Helper function to copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
