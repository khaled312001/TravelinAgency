#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Diagnosing Vercel Deployment Issues...\n');

// Check current configuration
console.log('📋 Current Configuration:');
console.log('========================');

// Check package.json
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ package.json exists');
  console.log(`   Name: ${packageJson.name}`);
  console.log(`   Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`   DevDependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
} else {
  console.log('❌ package.json missing');
}

// Check nuxt.config.ts
if (fs.existsSync('nuxt.config.ts')) {
  console.log('✅ nuxt.config.ts exists');
  const config = fs.readFileSync('nuxt.config.ts', 'utf8');
  console.log(`   Size: ${config.length} characters`);
  console.log(`   Contains SSR: ${config.includes('ssr:') ? 'Yes' : 'No'}`);
  console.log(`   Contains modules: ${config.includes('modules:') ? 'Yes' : 'No'}`);
} else {
  console.log('❌ nuxt.config.ts missing');
}

// Check vercel.json
if (fs.existsSync('vercel.json')) {
  console.log('✅ vercel.json exists');
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  console.log(`   Framework: ${vercelConfig.framework || 'Not set'}`);
  console.log(`   Build Command: ${vercelConfig.buildCommand || 'Not set'}`);
  console.log(`   Output Directory: ${vercelConfig.outputDirectory || 'Not set'}`);
} else {
  console.log('⚠️ vercel.json missing (this might be the issue)');
}

// Check pages directory
if (fs.existsSync('pages')) {
  const pages = fs.readdirSync('pages');
  console.log(`✅ pages directory exists with ${pages.length} files`);
  pages.forEach(page => {
    console.log(`   - ${page}`);
  });
} else {
  console.log('❌ pages directory missing');
}

// Check server/api directory
if (fs.existsSync('server/api')) {
  const apiFiles = fs.readdirSync('server/api', { recursive: true });
  console.log(`✅ server/api directory exists with ${apiFiles.length} files`);
} else {
  console.log('⚠️ server/api directory missing');
}

// Check for problematic files
console.log('\n🚨 Potential Issues:');
console.log('===================');

const problematicFiles = [
  'server/api/packages/index.get.ts',
  'utils/database.ts',
  'plugins/i18n.client.ts',
  'plugins/language-direction.ts',
  'plugins/initial-direction.server.ts'
];

problematicFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`⚠️ ${file} exists (might cause issues)`);
  }
});

// Check for large dependencies
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const largeDeps = ['mysql2', 'prisma', '@prisma/client', 'twilio', 'chart.js'];
  
  console.log('\n📦 Large Dependencies:');
  largeDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`⚠️ ${dep}: ${packageJson.dependencies[dep]} (might cause build issues)`);
    }
  });
}

console.log('\n💡 Recommendations:');
console.log('==================');
console.log('1. Use the basic configuration: node deploy-basic.js');
console.log('2. Check Vercel function logs for the exact error');
console.log('3. Ensure Vercel project settings are correct');
console.log('4. Try deploying without any custom vercel.json');
console.log('5. Check if the build command is correct in Vercel dashboard');

console.log('\n🔗 Vercel Dashboard Links:');
console.log('=========================');
console.log('• Project Settings: https://vercel.com/dashboard');
console.log('• Function Logs: Check the Functions tab in your project');
console.log('• Build Logs: Check the Deployments tab');
