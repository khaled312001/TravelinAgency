#!/bin/bash

# GoDaddy Cleanup Script
# This removes source code from public_html and keeps only built files
# Run this on your GoDaddy server via SSH

echo "🚀 GoDaddy Cleanup - Removing Source Code, Keeping Built Files"
echo ""

# Move to home directory
cd ~

# Backup current public_html
echo "📦 Backing up current public_html..."
backup_name="public_html_backup_$(date +%Y%m%d_%H%M%S)"
mv public_html "$backup_name" && echo "✅ Backed up to $backup_name" || exit 1

# Create fresh public_html
echo "📁 Creating fresh public_html..."
mkdir public_html

echo ""
echo "🔍 Looking for built files in backup..."

# Set backup path
BACKUP="$backup_name"

# Copy built HTML files
echo "📄 Copying HTML files..."
find "$BACKUP" -maxdepth 1 -name "*.html" -exec cp {} public_html/ \; 2>/dev/null

# Copy _nuxt directory (JavaScript/CSS)
if [ -d "$BACKUP/_nuxt" ]; then
    cp -r "$BACKUP/_nuxt" public_html/
    echo "✓ _nuxt copied"
fi

# Copy images directory (IMPORTANT!)
if [ -d "$BACKUP/images" ]; then
    cp -r "$BACKUP/images" public_html/
    echo "✓ images copied ($(find public_html/images -type f | wc -l) files)"
else
    echo "⚠️  WARNING: No images folder found!"
fi

# Copy .htaccess (try multiple locations)
if [ -f "$BACKUP/public/.htaccess" ]; then
    cp "$BACKUP/public/.htaccess" public_html/.htaccess
elif [ -f "$BACKUP/.htaccess" ]; then
    cp "$BACKUP/.htaccess" public_html/.htaccess
fi
echo "✓ .htaccess copied" 2>/dev/null

# Copy api-handler.php (try multiple locations)
if [ -f "$BACKUP/godaddy-ready/api-handler-complete.php" ]; then
    cp "$BACKUP/godaddy-ready/api-handler-complete.php" public_html/api-handler.php
elif [ -f "$BACKUP/api-handler.php" ]; then
    cp "$BACKUP/api-handler.php" public_html/api-handler.php
fi
echo "✓ api-handler.php copied" 2>/dev/null

# Copy other necessary files
cp "$BACKUP/page-statuses.json" public_html/ 2>/dev/null
cp "$BACKUP/favicon.ico" public_html/ 2>/dev/null

# Copy sitemap files
[ -d "$BACKUP/__sitemap__" ] && cp -r "$BACKUP/__sitemap__" public_html/

# Copy locale directories if they exist
[ -d "$BACKUP/ar-SA" ] && cp -r "$BACKUP/ar-SA" public_html/
[ -d "$BACKUP/en-US" ] && cp -r "$BACKUP/en-US" public_html/

# Copy page directories
[ -d "$BACKUP/about" ] && cp -r "$BACKUP/about" public_html/
[ -d "$BACKUP/packages" ] && cp -r "$BACKUP/packages" public_html/
[ -d "$BACKUP/custom-package" ] && cp -r "$BACKUP/custom-package" public_html/

echo ""
echo "🔍 Verifying cleanup..."
cd ~/public_html

echo ""
echo "✅ Done! Current structure:"
ls -la

echo ""
echo "📊 Summary:"
echo "HTML: $(ls -1 *.html 2>/dev/null | wc -l) files"
echo "_nuxt: $([ -d _nuxt ] && echo "✓ EXISTS" || echo "❌ MISSING")"
echo "images: $([ -d images ] && echo "✓ $(find images -type f | wc -l) files" || echo "❌ MISSING")"
echo "api-handler.php: $([ -f api-handler.php ] && echo "✓ EXISTS" || echo "❌ MISSING")"

echo ""
if [ ! -d images ]; then
    echo "⚠️  WARNING: Images directory is MISSING!"
    echo "⚠️  You need to upload the images from your local computer."
    echo "⚠️  Build locally with: .\\build-for-godaddy.ps1"
    echo "⚠️  Then upload godaddy-ready/images/ folder"
fi

if [ ! -d _nuxt ]; then
    echo "⚠️  WARNING: _nuxt directory is MISSING!"
    echo "⚠️  You need to upload built files from your local computer."
fi

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Build project on your Windows computer: .\\build-for-godaddy.ps1"
echo "2. Upload contents of godaddy-ready/ folder to this public_html/"
echo "3. Update database credentials in api-handler.php"
echo "4. Test your website!"
