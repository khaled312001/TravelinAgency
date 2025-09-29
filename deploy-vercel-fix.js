#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploying Vercel Fix...\n');

try {
  // Check if we're in a git repository
  execSync('git status', { stdio: 'pipe' });
  console.log('✅ Git repository found');
} catch (error) {
  console.log('❌ Not a git repository. Please initialize git first:');
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "Initial commit"');
  process.exit(1);
}

try {
  // Add all changes
  console.log('📝 Adding changes to git...');
  execSync('git add .', { stdio: 'inherit' });
  
  // Commit changes
  console.log('💾 Committing changes...');
  execSync('git commit -m "Fix Vercel deployment - simplified configuration"', { stdio: 'inherit' });
  
  // Push to main branch
  console.log('🚀 Pushing to main branch...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n✅ Deployment initiated!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to your Vercel dashboard');
  console.log('2. Set these environment variables:');
  console.log('   NODE_ENV=production');
  console.log('   PUBLIC_SITE_URL=https://travelin-agency-coral.vercel.app');
  console.log('3. Wait for deployment to complete');
  console.log('4. Test these URLs:');
  console.log('   https://travelin-agency-coral.vercel.app/api/simple');
  console.log('   https://travelin-agency-coral.vercel.app/api/test');
  console.log('   https://travelin-agency-coral.vercel.app/api/debug');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n🔧 Manual deployment steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Fix Vercel deployment"');
  console.log('3. git push origin main');
  process.exit(1);
}
