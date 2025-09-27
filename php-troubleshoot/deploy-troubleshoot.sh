#!/bin/bash
echo "🔍 PHP TROUBLESHOOTING DEPLOYMENT"
echo "================================="

# Copy test files
cp test-basic.php .
cp test-info.php .
cp test-errors.php .
cp test-json.php .
cp test-database.php .

# Set permissions
chmod 644 test-*.php

echo "✅ Test files deployed"
echo ""
echo "🧪 TEST THESE URLs:"
echo "1. Basic PHP: https://worldtripagency.com/test-basic.php"
echo "2. PHP Info: https://worldtripagency.com/test-info.php"
echo "3. Error Reporting: https://worldtripagency.com/test-errors.php"
echo "4. JSON API: https://worldtripagency.com/test-json.php"
echo "5. Database: https://worldtripagency.com/test-database.php"
echo ""
echo "🔧 TROUBLESHOOTING STEPS:"
echo "1. Test each URL above"
echo "2. Check which ones work vs fail"
echo "3. If all fail: Server PHP configuration issue"
echo "4. If some work: Specific PHP feature issue"
echo "5. Check error logs: tail -f error_log"
echo ""
echo "📋 NEXT STEPS:"
echo "- If basic PHP works: The issue is with specific code"
echo "- If basic PHP fails: Server configuration problem"
echo "- If JSON works but database fails: Database connection issue"
echo "- If all fail: Contact GoDaddy support about PHP execution"
