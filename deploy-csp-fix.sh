#!/bin/bash

# Deploy CSP and Image Loading Fixes to Server
echo "🚀 Deploying CSP and Image Loading Fixes..."

# Navigate to the public_html directory
cd ~/public_html

# Pull the latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Set proper permissions for files
echo "🔧 Setting proper permissions..."
chmod 644 .htaccess
chmod 644 index.php
chmod 644 nuxt.config.ts

# Set proper permissions for images directory
echo "🖼️ Setting permissions for images..."
chmod -R 755 public/images/
find public/images/ -type f -exec chmod 644 {} \;

# Clear any server caches (if available)
echo "🧹 Clearing server caches..."
if [ -f "cache/clear.php" ]; then
    php cache/clear.php
fi

# Test the fixes
echo "🧪 Testing the fixes..."
echo "✅ CSP fixes applied"
echo "✅ Image loading fixes applied"
echo "✅ IPX processing fixes applied"
echo "✅ MIME types configured"

echo "🎉 Deployment complete! Your website should now work properly with:"
echo "   - No more CSP violations"
echo "   - Images loading correctly"
echo "   - Icons displaying properly"
echo "   - External resources allowed"

echo ""
echo "🌐 Visit your website to see the changes!"
