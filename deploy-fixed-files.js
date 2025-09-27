#!/usr/bin/env node

/**
 * Deploy Fixed Files Script
 * This script moves the corrected files from godaddy-fixed to the root directory
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Deploying fixed files to GoDaddy hosting...\n');

try {
  // Check if godaddy-fixed folder exists
  if (!fs.existsSync('godaddy-fixed')) {
    console.error('❌ godaddy-fixed folder not found!');
    console.log('Please make sure you have pulled the latest changes from GitHub.');
    process.exit(1);
  }

  console.log('📁 Found godaddy-fixed folder');

  // Backup current files
  console.log('💾 Creating backup of current files...');
  const backupDir = 'backup-' + new Date().toISOString().replace(/[:.]/g, '-');
  if (fs.existsSync('index.php')) {
    fs.mkdirSync(backupDir);
    fs.copyFileSync('index.php', path.join(backupDir, 'index.php'));
    console.log('✅ Backed up index.php');
  }
  if (fs.existsSync('.htaccess')) {
    fs.copyFileSync('.htaccess', path.join(backupDir, '.htaccess'));
    console.log('✅ Backed up .htaccess');
  }

  // Deploy corrected index.php
  console.log('📄 Deploying corrected index.php...');
  if (fs.existsSync('godaddy-fixed/index.php')) {
    fs.copyFileSync('godaddy-fixed/index.php', 'index.php');
    console.log('✅ Deployed corrected index.php');
  } else {
    console.log('❌ godaddy-fixed/index.php not found');
  }

  // Deploy corrected .htaccess
  console.log('⚙️ Deploying corrected .htaccess...');
  if (fs.existsSync('godaddy-fixed/.htaccess')) {
    fs.copyFileSync('godaddy-fixed/.htaccess', '.htaccess');
    console.log('✅ Deployed corrected .htaccess');
  } else {
    console.log('❌ godaddy-fixed/.htaccess not found');
  }

  // Deploy test.php
  console.log('🧪 Deploying test.php...');
  if (fs.existsSync('godaddy-fixed/test.php')) {
    fs.copyFileSync('godaddy-fixed/test.php', 'test.php');
    console.log('✅ Deployed test.php');
  }

  // Ensure output directory exists and is properly structured
  console.log('📂 Ensuring output directory structure...');
  if (fs.existsSync('godaddy-fixed/output')) {
    if (fs.existsSync('output')) {
      console.log('🗑️ Removing old output directory...');
      fs.rmSync('output', { recursive: true, force: true });
    }
    console.log('📁 Copying output directory...');
    execSync(`xcopy godaddy-fixed\\output output /E /I /H /Y`, { stdio: 'inherit' });
    console.log('✅ Output directory deployed');
  }

  // Deploy server directory if it doesn't exist
  if (fs.existsSync('godaddy-fixed/server') && !fs.existsSync('server')) {
    console.log('📁 Copying server directory...');
    execSync(`xcopy godaddy-fixed\\server server /E /I /H /Y`, { stdio: 'inherit' });
    console.log('✅ Server directory deployed');
  }

  // Create .env from example if it doesn't exist
  if (fs.existsSync('godaddy-fixed/.env.example') && !fs.existsSync('.env')) {
    console.log('📝 Creating .env from example...');
    fs.copyFileSync('godaddy-fixed/.env.example', '.env');
    console.log('✅ Created .env file');
    console.log('⚠️  Please update .env with your actual database credentials');
  }

  console.log('\n🎉 Deployment completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Test your website: https://travelin-agency-nlcs.vercel.app/');
  console.log('2. Test PHP: https://travelin-agency-nlcs.vercel.app/test.php');
  console.log('3. Update .env file with your database credentials if needed');
  console.log('4. Check file permissions in cPanel if issues persist');
  
  console.log('\n📁 Backup created in:', backupDir);
  console.log('🌐 Your website should now work at: https://travelin-agency-nlcs.vercel.app/');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
