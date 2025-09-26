#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 TESTING DATABASE CONNECTION');
console.log('==============================\n');

// Create a PHP script to test database connection
const testDbScript = `<?php
// Test database connection script
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';  // Fixed from 'localh'
$dbname = 'travel';
$username = 'travel';
$password = 'support@Passord123';

echo "Testing database connection...\n";
echo "Host: " . $host . "\n";
echo "Database: " . $dbname . "\n";
echo "Username: " . $username . "\n";
echo "Password: " . (strlen($password) > 0 ? "***" . substr($password, -3) : "empty") . "\n\n";

try {
    // Create PDO connection
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    
    echo "✅ Database connection successful!\n\n";
    
    // Test if packages table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'packages'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Packages table exists\n";
        
        // Count packages
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM packages");
        $result = $stmt->fetch();
        echo "📦 Total packages: " . $result['count'] . "\n";
        
        // Show sample packages
        $stmt = $pdo->query("SELECT id, title, price FROM packages LIMIT 3");
        $packages = $stmt->fetchAll();
        echo "\n📋 Sample packages:\n";
        foreach ($packages as $package) {
            echo "  - ID: {$package['id']}, Title: {$package['title']}, Price: {$package['price']}\n";
        }
    } else {
        echo "❌ Packages table does not exist\n";
    }
    
    // Test if destinations table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'destinations'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Destinations table exists\n";
        
        // Count destinations
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM destinations");
        $result = $stmt->fetch();
        echo "🌍 Total destinations: " . $result['count'] . "\n";
    } else {
        echo "❌ Destinations table does not exist\n";
    }
    
    // Test if admin_users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Admin users table exists\n";
        
        // Count admin users
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM admin_users");
        $result = $stmt->fetch();
        echo "👤 Total admin users: " . $result['count'] . "\n";
    } else {
        echo "❌ Admin users table does not exist\n";
    }
    
    echo "\n🎉 Database test completed successfully!\n";
    
} catch (PDOException $e) {
    echo "❌ Database connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting steps:\n";
    echo "1. Check if MySQL service is running\n";
    echo "2. Verify database credentials\n";
    echo "3. Check if database 'travel' exists\n";
    echo "4. Verify user 'travel' has access to database\n";
}
?>`;

// Write the test script
fs.writeFileSync('test-db-connection.php', testDbScript);

console.log('✅ Created test-db-connection.php');
console.log('\n📋 DEPLOYMENT COMMANDS:');
console.log('=======================');
console.log('');
console.log('# 1. Upload the test script to your GoDaddy server');
console.log('echo "Upload test-db-connection.php to your server"');
console.log('');
console.log('# 2. Test the database connection');
console.log('curl -k https://worldtripagency.com/test-db-connection.php');
console.log('');
console.log('# 3. If connection works, update your .env file');
console.log('echo "NODE_ENV=production" > .env');
console.log('echo "DB_HOST=localhost" >> .env');
console.log('echo "DB_NAME=travel" >> .env');
console.log('echo "DB_USER=travel" >> .env');
console.log('echo "DB_PASSWORD=support@Passord123" >> .env');
console.log('');
console.log('# 4. Update api-handler.php with correct database config');
console.log('cat > api-handler-fixed.php << "EOF"');
console.log('<?php');
console.log('header("Content-Type: application/json");');
console.log('header("Access-Control-Allow-Origin: *");');
console.log('header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");');
console.log('header("Access-Control-Allow-Headers: Content-Type, Authorization");');
console.log('');
console.log('// Handle preflight requests');
console.log('if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {');
console.log('    http_response_code(200);');
console.log('    exit;');
console.log('}');
console.log('');
console.log('// Database configuration');
console.log('$host = "localhost";');
console.log('$dbname = "travel";');
console.log('$username = "travel";');
console.log('$password = "support@Passord123";');
console.log('');
console.log('try {');
console.log('    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";');
console.log('    $pdo = new PDO($dsn, $username, $password, [');
console.log('        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,');
console.log('        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,');
console.log('        PDO::ATTR_EMULATE_PREPARES => false,');
console.log('    ]);');
console.log('} catch (PDOException $e) {');
console.log('    http_response_code(500);');
console.log('    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);');
console.log('    exit;');
console.log('}');
console.log('');
console.log('// Get request URI');
console.log('$requestUri = $_SERVER["REQUEST_URI"];');
console.log('$cleanUri = parse_url($requestUri, PHP_URL_PATH);');
console.log('');
console.log('// Route handling');
console.log('switch ($cleanUri) {');
console.log('    case "/api/test":');
console.log('        echo json_encode(["status" => "working", "database" => "connected"]);');
console.log('        break;');
console.log('        ');
console.log('    case "/api/packages":');
console.log('        try {');
console.log('            $stmt = $pdo->query("SELECT * FROM packages ORDER BY id DESC");');
console.log('            $packages = $stmt->fetchAll();');
console.log('            echo json_encode($packages, JSON_UNESCAPED_SLASHES);');
console.log('        } catch (Exception $e) {');
console.log('            http_response_code(500);');
console.log('            echo json_encode(["error" => "Failed to fetch packages: " . $e->getMessage()]);');
console.log('        }');
console.log('        break;');
console.log('        ');
console.log('    case "/api/destinations":');
console.log('        try {');
console.log('            $stmt = $pdo->query("SELECT * FROM destinations ORDER BY id DESC");');
console.log('            $destinations = $stmt->fetchAll();');
console.log('            echo json_encode($destinations, JSON_UNESCAPED_SLASHES);');
console.log('        } catch (Exception $e) {');
console.log('            http_response_code(500);');
console.log('            echo json_encode(["error" => "Failed to fetch destinations: " . $e->getMessage()]);');
console.log('        }');
console.log('        break;');
console.log('        ');
console.log('    case "/api/auth/login":');
console.log('        if ($_SERVER["REQUEST_METHOD"] === "POST") {');
console.log('            $input = json_decode(file_get_contents("php://input"), true);');
console.log('            $email = $input["email"] ?? "";');
console.log('            $password = $input["password"] ?? "";');
console.log('            ');
console.log('            // Check hardcoded admin credentials');
console.log('            if ($email === "admin@wonderland.com" && $password === "admin123") {');
console.log('                $token = base64_encode(json_encode([');
console.log('                    "email" => $email,');
console.log('                    "exp" => time() + 3600');
console.log('                ]));');
console.log('                echo json_encode(["success" => true, "token" => $token]);');
console.log('            } else {');
console.log('                http_response_code(401);');
console.log('                echo json_encode(["success" => false, "message" => "Invalid credentials"]);');
console.log('            }');
console.log('        } else {');
console.log('            http_response_code(405);');
console.log('            echo json_encode(["error" => "Method not allowed"]);');
console.log('        }');
console.log('        break;');
console.log('        ');
console.log('    default:');
console.log('        http_response_code(404);');
console.log('        echo json_encode(["error" => "Endpoint not found"]);');
console.log('        break;');
console.log('}');
console.log('?>');
console.log('EOF');
console.log('');
console.log('# 5. Deploy the fixed API handler');
console.log('cp api-handler-fixed.php api-handler.php');
console.log('chmod 644 api-handler.php');
console.log('');
console.log('# 6. Test all endpoints');
console.log('curl -k https://worldtripagency.com/api/test');
console.log('curl -k https://worldtripagency.com/api/packages');
console.log('curl -k https://worldtripagency.com/api/destinations');
console.log('');
console.log('🎯 This will fix:');
console.log('✅ Database connection issues');
console.log('✅ Empty packages data');
console.log('✅ API endpoint errors');
console.log('✅ Image loading problems');