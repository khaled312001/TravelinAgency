#!/bin/bash
echo "🚀 DEPLOYING FINAL FIX"
echo "====================="

# Backup current files
echo "📦 Backing up current files..."
cp index.php index.php.backup-$(date +%Y%m%d) 2>/dev/null || true
cp api-handler.php api-handler.php.backup-$(date +%Y%m%d) 2>/dev/null || true
cp .htaccess .htaccess.backup-$(date +%Y%m%d) 2>/dev/null || true

# Deploy the fix
echo "🚀 Deploying fix files..."
cp index-ultra-simple.php index.php
cp api-test-simple.php api-handler.php
cp .htaccess-working .htaccess

# Set permissions
echo "🔧 Setting permissions..."
chmod 644 index.php
chmod 644 api-handler.php
chmod 644 .htaccess

echo "✅ Deployment complete!"
echo ""
echo "🧪 TEST THESE URLs:"
echo "1. Main website: https://worldtripagency.com/"
echo "2. API test: https://worldtripagency.com/api/test"
echo "3. Basic PHP: https://worldtripagency.com/test-basic.php"
echo ""
echo "📋 If tests pass, gradually add complexity back:"
echo "1. Replace api-handler.php with full version"
echo "2. Replace index.php with full version"
echo "3. Test each step"
