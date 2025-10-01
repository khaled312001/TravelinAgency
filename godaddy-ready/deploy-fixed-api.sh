#!/bin/bash

echo "🚀 Deploying FIXED API Handler with Authentication..."
echo ""

# Backup current api-handler
if [ -f "api-handler.php" ]; then
    cp api-handler.php api-handler-backup-$(date +%Y%m%d-%H%M%S).php
    echo "✅ Backed up current api-handler.php"
fi

# Copy the complete fixed version
cp godaddy-ready/api-handler-complete.php api-handler.php
echo "✅ Copied fixed api-handler.php with authentication support"

# Verify the file
echo ""
echo "📋 Verifying api-handler.php:"
ls -lh api-handler.php

echo ""
echo "🔍 Checking database credentials:"
grep -A 3 "Database Configuration" api-handler.php

echo ""
echo "🔍 Verifying auth/login route is present:"
grep -c "auth/login" api-handler.php

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test the API: curl -X POST https://worldtripagency.com/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@wonderland.com\",\"password\":\"admin123\"}'"
echo "2. Clear browser cache: Ctrl+Shift+Delete"
echo "3. Test in browser: https://worldtripagency.com/admin/login/"

