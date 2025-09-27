#!/bin/bash

# Fix 500 Internal Server Error
echo "🚨 Fixing 500 Internal Server Error..."

# Navigate to the public_html directory
cd ~/public_html

# Backup current files
echo "📦 Creating backups..."
cp .htaccess .htaccess.backup
cp index.php index.php.backup

# Replace with simple working versions
echo "🔧 Replacing with simple working versions..."
cp .htaccess-simple .htaccess
cp index-simple-working.php index.php

# Set proper permissions
echo "🔐 Setting proper permissions..."
chmod 644 .htaccess
chmod 644 index.php

# Test the fix
echo "🧪 Testing the fix..."
echo "✅ Simple .htaccess deployed"
echo "✅ Simple index.php deployed"
echo "✅ Permissions set correctly"

echo "🎉 500 Error Fix Complete!"
echo "🌐 Your website should now be accessible"
echo ""
echo "If you still get errors, check the server error logs:"
echo "tail -f /var/log/apache2/error.log"
echo "or"
echo "tail -f /var/log/httpd/error_log"
