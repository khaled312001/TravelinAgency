#!/usr/bin/env node

/**
 * Production Build Script for GoDaddy Hosting
 * This script prepares your Nuxt.js application for deployment on GoDaddy hosting
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building application for GoDaddy hosting...\n');

try {
  // Step 1: Clean previous builds
  console.log('📁 Cleaning previous builds...');
  if (fs.existsSync('.output')) {
    fs.rmSync('.output', { recursive: true, force: true });
  }
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Step 2: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Step 3: Build the application
  console.log('🔨 Building Nuxt.js application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 4: Generate static files
  console.log('📄 Generating static files...');
  execSync('npm run generate', { stdio: 'inherit' });

  // Step 5: Create deployment package
  console.log('📦 Creating deployment package...');
  
  const deployDir = 'deploy';
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

  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(deployDir, file));
      console.log(`✅ Copied ${file}`);
    }
  });

  // Copy public directory
  if (fs.existsSync('public')) {
    execSync(`cp -r public ${deployDir}/`, { stdio: 'inherit' });
    console.log('✅ Copied public directory');
  }

  // Copy server directory (for API routes)
  if (fs.existsSync('server')) {
    execSync(`cp -r server ${deployDir}/`, { stdio: 'inherit' });
    console.log('✅ Copied server directory');
  }

  // Copy .output directory (Nuxt build output)
  if (fs.existsSync('.output')) {
    execSync(`cp -r .output ${deployDir}/`, { stdio: 'inherit' });
    console.log('✅ Copied .output directory');
  }

  // Create production .env template
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
  const instructions = `# Deployment Instructions

## Files to Upload to GoDaddy

Upload the entire contents of this 'deploy' folder to your GoDaddy hosting root directory.

## Required Steps:

1. Upload all files to your hosting root directory
2. Rename .env.example to .env and update with your database credentials
3. Set file permissions:
   - Folders: 755
   - Files: 644
   - .htaccess: 644
4. Create your MySQL database in GoDaddy cPanel
5. Import your database schema
6. Test your website

## Important Files:
- .htaccess (Apache configuration)
- index.php (Application entry point)
- public/ (Static files)
- server/ (API routes)
- .output/ (Nuxt build output)

Your website should now work at: https://worldtripagency.com/
`;

  fs.writeFileSync(path.join(deployDir, 'README.txt'), instructions);
  console.log('✅ Created deployment instructions');

  console.log('\n🎉 Build completed successfully!');
  console.log('\n📁 Deployment files are ready in the "deploy" folder');
  console.log('📋 Upload the contents of the "deploy" folder to your GoDaddy hosting');
  console.log('🌐 Your website will be available at: https://worldtripagency.com/');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
