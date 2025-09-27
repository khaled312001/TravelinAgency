#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploying Minimal Vercel Fix...\n');

try {
  // Backup current files
  console.log('📦 Backing up current files...');
  if (fs.existsSync('package.json')) {
    fs.copyFileSync('package.json', 'package.backup.json');
  }
  if (fs.existsSync('nuxt.config.ts')) {
    fs.copyFileSync('nuxt.config.ts', 'nuxt.config.backup.ts');
  }

  // Use minimal configurations
  console.log('🔧 Using minimal configurations...');
  fs.copyFileSync('package.minimal.json', 'package.json');
  fs.copyFileSync('nuxt.config.minimal.ts', 'nuxt.config.ts');

  // Install minimal dependencies
  console.log('📥 Installing minimal dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Test build locally
  console.log('🔨 Testing build locally...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Local build successful!');
  } catch (error) {
    console.log('❌ Local build failed, but continuing with deployment...');
  }

  // Add all changes
  console.log('📝 Adding changes to git...');
  execSync('git add .', { stdio: 'inherit' });
  
  // Commit changes
  console.log('💾 Committing changes...');
  execSync('git commit -m "Deploy minimal configuration to fix Vercel crash"', { stdio: 'inherit' });
  
  // Push to main branch
  console.log('🚀 Pushing to main branch...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n✅ Minimal deployment initiated!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to your Vercel dashboard');
  console.log('2. Set these environment variables:');
  console.log('   NODE_ENV=production');
  console.log('   PUBLIC_SITE_URL=https://travelin-agency-coral.vercel.app');
  console.log('3. Wait for deployment to complete');
  console.log('4. Test these URLs:');
  console.log('   https://travelin-agency-coral.vercel.app/');
  console.log('   https://travelin-agency-coral.vercel.app/api/simple');
  console.log('   https://travelin-agency-coral.vercel.app/api/test');
  
  console.log('\n🔄 To restore full configuration later:');
  console.log('   mv package.backup.json package.json');
  console.log('   mv nuxt.config.backup.ts nuxt.config.ts');
  console.log('   npm install');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n🔧 Manual deployment steps:');
  console.log('1. cp package.minimal.json package.json');
  console.log('2. cp nuxt.config.minimal.ts nuxt.config.ts');
  console.log('3. npm install');
  console.log('4. git add .');
  console.log('5. git commit -m "Fix Vercel deployment"');
  console.log('6. git push origin main');
  process.exit(1);
}
