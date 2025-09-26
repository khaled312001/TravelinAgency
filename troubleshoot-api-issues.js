#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 TROUBLESHOOTING API ISSUES');
console.log('=============================\n');

// Create a troubleshooting script
const troubleshootScript = `#!/bin/bash
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
    \$pdo = new PDO('mysql:host=localhost;dbname=travel;charset=utf8mb4', 'travel', 'support@Passord123');
    echo 'Database connection: SUCCESS' . PHP_EOL;
} catch (Exception \$e) {
    echo 'Database connection: FAILED - ' . \$e->getMessage() . PHP_EOL;
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
curl -k https://worldtripagency.com/api-test-minimal.php
echo ""
echo ""

echo "10. 🔍 Check .htaccess configuration..."
echo "--------------------------------------"
cat .htaccess
echo ""
`;

// Write the troubleshooting script
fs.writeFileSync('troubleshoot-api-issues.sh', troubleshootScript);

console.log('✅ Created troubleshoot-api-issues.sh');
console.log('\n📋 TROUBLESHOOTING COMMANDS:');
console.log('============================');
console.log('');
console.log('# Run comprehensive troubleshooting');
console.log('bash troubleshoot-api-issues.sh');
console.log('');
console.log('# Or run individual checks:');
console.log('');
console.log('# 1. Check if files exist and have content');
console.log('ls -la api-handler.php index.php');
console.log('wc -c api-handler.php index.php');
console.log('');
console.log('# 2. Check PHP syntax');
console.log('php -l api-handler.php');
console.log('php -l index.php');
console.log('');
console.log('# 3. Test database connection');
console.log('php -r "try { \$pdo = new PDO(\'mysql:host=localhost;dbname=travel;charset=utf8mb4\', \'travel\', \'support@Passord123\'); echo \'SUCCESS\'; } catch (Exception \$e) { echo \'FAILED: \' . \$e->getMessage(); }"');
console.log('');
console.log('# 4. Create and test minimal API');
console.log('cat > api-test-minimal.php << "EOF"');
console.log('<?php');
console.log('header("Content-Type: application/json");');
console.log('echo json_encode(["status" => "minimal test working", "time" => date("Y-m-d H:i:s")]);');
console.log('?>');
console.log('EOF');
console.log('');
console.log('curl -k https://worldtripagency.com/api-test-minimal.php');
console.log('');
console.log('# 5. Check .htaccess');
console.log('cat .htaccess');
console.log('');
console.log('🎯 This will help identify:');
console.log('✅ If files were deployed correctly');
console.log('✅ If there are PHP syntax errors');
console.log('✅ If database connection is working');
console.log('✅ If .htaccess is configured properly');
console.log('✅ If the server can execute PHP files');
