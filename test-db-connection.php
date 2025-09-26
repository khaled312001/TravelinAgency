<?php
// Test database connection script
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';  // Fixed from 'localh'
$dbname = 'travel';
$username = 'travel';
$password = 'support@Passord123';

echo "Testing database connection...
";
echo "Host: " . $host . "
";
echo "Database: " . $dbname . "
";
echo "Username: " . $username . "
";
echo "Password: " . (strlen($password) > 0 ? "***" . substr($password, -3) : "empty") . "

";

try {
    // Create PDO connection
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    
    echo "✅ Database connection successful!

";
    
    // Test if packages table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'packages'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Packages table exists
";
        
        // Count packages
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM packages");
        $result = $stmt->fetch();
        echo "📦 Total packages: " . $result['count'] . "
";
        
        // Show sample packages
        $stmt = $pdo->query("SELECT id, title, price FROM packages LIMIT 3");
        $packages = $stmt->fetchAll();
        echo "
📋 Sample packages:
";
        foreach ($packages as $package) {
            echo "  - ID: {$package['id']}, Title: {$package['title']}, Price: {$package['price']}
";
        }
    } else {
        echo "❌ Packages table does not exist
";
    }
    
    // Test if destinations table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'destinations'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Destinations table exists
";
        
        // Count destinations
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM destinations");
        $result = $stmt->fetch();
        echo "🌍 Total destinations: " . $result['count'] . "
";
    } else {
        echo "❌ Destinations table does not exist
";
    }
    
    // Test if admin_users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Admin users table exists
";
        
        // Count admin users
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM admin_users");
        $result = $stmt->fetch();
        echo "👤 Total admin users: " . $result['count'] . "
";
    } else {
        echo "❌ Admin users table does not exist
";
    }
    
    echo "
🎉 Database test completed successfully!
";
    
} catch (PDOException $e) {
    echo "❌ Database connection failed!
";
    echo "Error: " . $e->getMessage() . "
";
    echo "
Troubleshooting steps:
";
    echo "1. Check if MySQL service is running
";
    echo "2. Verify database credentials
";
    echo "3. Check if database 'travel' exists
";
    echo "4. Verify user 'travel' has access to database
";
}
?>