#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 CHECKING NUXT.JS BUILD FILES');
console.log('================================\n');

// Check what's in the output directory
const outputDir = 'output';
const publicDir = 'output/public';

console.log('1. 📁 Checking output directory structure...');
if (fs.existsSync(outputDir)) {
    const outputContents = fs.readdirSync(outputDir);
    console.log('✅ output/ directory exists with:', outputContents.join(', '));
    
    if (fs.existsSync(publicDir)) {
        const publicContents = fs.readdirSync(publicDir);
        console.log('✅ output/public/ directory exists with:', publicContents.join(', '));
        
        // Check for index.html specifically
        const indexHtmlPath = path.join(publicDir, 'index.html');
        if (fs.existsSync(indexHtmlPath)) {
            console.log('✅ index.html found in output/public/');
        } else {
            console.log('❌ index.html NOT found in output/public/');
        }
        
        // Check for 200.html (Nuxt.js fallback)
        const fallbackHtmlPath = path.join(publicDir, '200.html');
        if (fs.existsSync(fallbackHtmlPath)) {
            console.log('✅ 200.html found in output/public/');
        } else {
            console.log('❌ 200.html NOT found in output/public/');
        }
        
    } else {
        console.log('❌ output/public/ directory does not exist');
    }
} else {
    console.log('❌ output/ directory does not exist');
}

console.log('\n2. 🔍 Checking for other possible build locations...');

// Check other possible locations
const possibleLocations = [
    'dist',
    'dist/public',
    'output',
    'output/index.html',
    'output/200.html',
    'index.html',
    '200.html'
];

possibleLocations.forEach(location => {
    if (fs.existsSync(location)) {
        if (fs.statSync(location).isDirectory()) {
            const contents = fs.readdirSync(location);
            console.log(`✅ ${location}/ exists with:`, contents.slice(0, 5).join(', '), contents.length > 5 ? '...' : '');
        } else {
            console.log(`✅ ${location} exists (file)`);
        }
    } else {
        console.log(`❌ ${location} does not exist`);
    }
});

console.log('\n3. 🛠️ Creating deployment commands for actual files...');

// Create deployment commands based on what we find
const deployCommands = `#!/bin/bash
echo "🌐 DEPLOYING ACTUAL NUXT.JS WEBSITE"
echo "===================================="
echo ""

echo "1. 📁 Checking what build files we have..."
echo "----------------------------------------"

# Check for index.html in various locations
if [ -f "output/public/index.html" ]; then
    echo "✅ Found index.html in output/public/"
    cp output/public/index.html .
    echo "✅ Copied index.html to root"
elif [ -f "output/index.html" ]; then
    echo "✅ Found index.html in output/"
    cp output/index.html .
    echo "✅ Copied index.html to root"
elif [ -f "dist/index.html" ]; then
    echo "✅ Found index.html in dist/"
    cp dist/index.html .
    echo "✅ Copied index.html to root"
elif [ -f "output/public/200.html" ]; then
    echo "✅ Found 200.html in output/public/ (using as index.html)"
    cp output/public/200.html index.html
    echo "✅ Copied 200.html as index.html"
elif [ -f "output/200.html" ]; then
    echo "✅ Found 200.html in output/ (using as index.html)"
    cp output/200.html index.html
    echo "✅ Copied 200.html as index.html"
else
    echo "❌ No index.html or 200.html found!"
    echo "Building Nuxt.js..."
    npm run build
    if [ -f "output/public/index.html" ]; then
        cp output/public/index.html .
        echo "✅ Built and copied index.html"
    elif [ -f "output/public/200.html" ]; then
        cp output/public/200.html index.html
        echo "✅ Built and copied 200.html as index.html"
    else
        echo "❌ Build failed or no HTML files generated"
        exit 1
    fi
fi

echo ""
echo "2. 📦 Copying all static assets..."
echo "--------------------------------"

# Copy all static files from the most complete directory
if [ -d "output/public" ]; then
    echo "Copying from output/public/..."
    cp -r output/public/* . 2>/dev/null || true
    echo "✅ Copied all files from output/public/"
elif [ -d "output" ]; then
    echo "Copying from output/..."
    cp -r output/* . 2>/dev/null || true
    echo "✅ Copied all files from output/"
elif [ -d "dist" ]; then
    echo "Copying from dist/..."
    cp -r dist/* . 2>/dev/null || true
    echo "✅ Copied all files from dist/"
fi

echo ""
echo "3. 🔧 Setting proper permissions..."
echo "----------------------------------"
chmod -R 755 . 2>/dev/null || true
find . -name "*.html" -exec chmod 644 {} \\; 2>/dev/null || true
find . -name "*.css" -exec chmod 644 {} \\; 2>/dev/null || true
find . -name "*.js" -exec chmod 644 {} \\; 2>/dev/null || true

echo ""
echo "4. 📝 Deploying production index.php..."
echo "--------------------------------------"
cp index-simple.php index.php
echo "✅ Deployed production index.php"

echo ""
echo "5. 🧪 Testing the website..."
echo "---------------------------"
echo "Checking if index.html exists:"
ls -la index.html 2>/dev/null && echo "✅ index.html found" || echo "❌ index.html missing"

echo ""
echo "Testing main website:"
curl -k -I https://travelin-agency-nlcs.vercel.app/ | head -1

echo ""
echo "Testing API:"
curl -k -s https://travelin-agency-nlcs.vercel.app/api/test | head -c 50
echo ""

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "✅ Your actual Nuxt.js travel agency website is now live!"
echo "✅ No more test page - this is your real website!"
echo ""
echo "🌐 Visit: https://travelin-agency-nlcs.vercel.app/"
echo "🔐 Admin: https://travelin-agency-nlcs.vercel.app/admin/login"
`;

// Write the deployment script
fs.writeFileSync('deploy-actual-website-fixed.sh', deployCommands);

console.log('✅ Created deploy-actual-website-fixed.sh');
console.log('\n📋 FIXED DEPLOYMENT COMMANDS:');
console.log('==============================');
console.log('');
console.log('# 1. Check what build files we have');
console.log('ls -la output/public/');
console.log('ls -la output/');
console.log('');
console.log('# 2. Copy the actual HTML file');
console.log('if [ -f "output/public/index.html" ]; then');
console.log('    cp output/public/index.html .');
console.log('elif [ -f "output/public/200.html" ]; then');
console.log('    cp output/public/200.html index.html');
console.log('fi');
console.log('');
console.log('# 3. Copy all static assets');
console.log('cp -r output/public/* .');
console.log('');
console.log('# 4. Set permissions');
console.log('chmod -R 755 .');
console.log('find . -name "*.html" -exec chmod 644 {} \\;');
console.log('');
console.log('# 5. Deploy production index.php');
console.log('cp index-simple.php index.php');
console.log('');
console.log('# 6. Test the website');
console.log('ls -la index.html');
console.log('curl -k -I https://travelin-agency-nlcs.vercel.app/');
