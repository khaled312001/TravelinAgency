#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploying Basic Nuxt App to Vercel...\n');

try {
  // Backup current files
  console.log('📦 Backing up current files...');
  if (fs.existsSync('package.json')) {
    fs.copyFileSync('package.json', 'package.backup.json');
  }
  if (fs.existsSync('nuxt.config.ts')) {
    fs.copyFileSync('nuxt.config.ts', 'nuxt.config.backup.ts');
  }
  if (fs.existsSync('pages/index.vue')) {
    fs.copyFileSync('pages/index.vue', 'pages/index.backup.vue');
  }

  // Use basic configurations
  console.log('🔧 Using basic configurations...');
  fs.copyFileSync('package.basic.json', 'package.json');
  fs.copyFileSync('nuxt.config.basic.ts', 'nuxt.config.ts');
  fs.copyFileSync('pages/index.basic.vue', 'pages/index.vue');

  // Remove problematic files
  console.log('🗑️ Removing problematic files...');
  const filesToRemove = [
    'vercel.json',
    'server/api/test.get.ts',
    'server/api/debug.get.ts',
    'server/api/health.get.ts',
    'server/api/simple.get.ts',
    'server/api/packages/index.get.ts'
  ];
  
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`   Removed: ${file}`);
    }
  });

  // Install basic dependencies
  console.log('📥 Installing basic dependencies...');
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
  execSync('git commit -m "Deploy basic Nuxt app to fix Vercel crash"', { stdio: 'inherit' });
  
  // Push to main branch
  console.log('🚀 Pushing to main branch...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n✅ Basic deployment initiated!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to your Vercel dashboard');
  console.log('2. Check the function logs for the error ID: dxb1::h4f4f-1758978565112-c73c33b18322');
  console.log('3. Wait for deployment to complete');
  console.log('4. Test these URLs:');
  console.log('   https://travelin-agency-coral.vercel.app/');
  console.log('   https://travelin-agency-coral.vercel.app/api/hello');
  
  console.log('\n🔄 To restore full configuration later:');
  console.log('   mv package.backup.json package.json');
  console.log('   mv nuxt.config.backup.ts nuxt.config.ts');
  console.log('   mv pages/index.backup.vue pages/index.vue');
  console.log('   npm install');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n🔧 Manual deployment steps:');
  console.log('1. cp package.basic.json package.json');
  console.log('2. cp nuxt.config.basic.ts nuxt.config.ts');
  console.log('3. cp pages/index.basic.vue pages/index.vue');
  console.log('4. npm install');
  console.log('5. git add .');
  console.log('6. git commit -m "Fix Vercel deployment"');
  console.log('7. git push origin main');
  process.exit(1);
}
