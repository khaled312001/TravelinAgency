#!/bin/bash
echo "🔧 TROUBLESHOOTING API ISSUES"
echo "============================="
echo ""

echo "1. 🔍 Check if api-handler.php exists and has content..."
echo "-------------------------------------------------------"
ls -la api-handler.php
echo ""
echo "File size:"
wc -c api-handler.php
echo ""

echo "2. 🔍 Check PHP syntax of api-handler.php..."
echo "--------------------------------------------"
php -l api-handler.php
echo ""

echo "3. 🔍 Check if index.php exists and has content..."
echo "-------------------------------------------------"
ls -la index.php
echo ""
echo "File size:"
wc -c index.php
echo ""

echo "4. 🔍 Check PHP syntax of index.php..."
echo "--------------------------------------"
php -l index.php
echo ""

echo "5. 🔍 Test direct PHP execution..."
echo "---------------------------------"
php -r "echo 'PHP is working: ' . phpversion() . PHP_EOL;"
echo ""

echo "6. 🔍 Check file permissions..."
echo "------------------------------"
ls -la *.php
echo ""

echo "7. 🔍 Test database connection directly..."
echo "-----------------------------------------"
php -r "
try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel;charset=utf8mb4', 'travel', 'support@Passord123');
    echo 'Database connection: SUCCESS' . PHP_EOL;
} catch (Exception $e) {
    echo 'Database connection: FAILED - ' . $e->getMessage() . PHP_EOL;
}
"
echo ""

echo "8. 🔍 Check server error logs..."
echo "-------------------------------"
echo "Checking common error log locations:"
echo "1. /var/log/apache2/error.log"
echo "2. /var/log/httpd/error_log"
echo "3. /home/t3w5k5yx5yrp/logs/error.log"
echo "4. /home/t3w5k5yx5yrp/public_html/error.log"
echo ""

echo "9. 🔍 Create minimal test API..."
echo "-------------------------------"
cat > api-test-minimal.php << 'EOF'
<?php
header('Content-Type: application/json');
echo json_encode(['status' => 'minimal test working', 'time' => date('Y-m-d H:i:s')]);
?>
EOF

echo "Testing minimal API:"
curl -k https://travelin-agency-nlcs.vercel.app/api-test-minimal.php
echo ""
echo ""

echo "10. 🔍 Check .htaccess configuration..."
echo "--------------------------------------"
cat .htaccess
echo ""
