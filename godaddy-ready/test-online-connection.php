<?php
// 🔍 Test Online Database Connection
// Upload this file to your GoDaddy public_html and visit it

header('Content-Type: text/html; charset=UTF-8');

echo "<!DOCTYPE html><html><head><title>Database Connection Test</title>";
echo "<style>body{font-family:Arial;padding:20px;background:#f5f5f5;}";
echo ".success{color:#28a745;}.error{color:#dc3545;}.info{color:#007bff;}";
echo "pre{background:#fff;padding:15px;border-radius:5px;}</style></head><body>";

echo "<h1>🔍 Online Database Connection Test</h1>";

// Database credentials
$host = 'localhost';
$dbname = 'travel';
$username = 'travel';
$password = 'support@Passord123';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2 class='success'>✅ Database Connection Successful!</h2>";
    
    // Test admin user
    echo "<h3>👤 Admin User Test:</h3>";
    $stmt = $pdo->query("SELECT email, name, role FROM admin_users LIMIT 1");
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<pre>";
    print_r($admin);
    echo "</pre>";
    
    // Test packages
    echo "<h3>📦 Packages Count:</h3>";
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM packages WHERE active = 1");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p class='info'>Active Packages: {$count['count']}</p>";
    
    // Test navigation
    echo "<h3>🧭 Navigation Items:</h3>";
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM cms_navigation WHERE menu_name = 'main'");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p class='info'>Navigation Items: {$count['count']}</p>";
    
    echo "<hr><h2 class='success'>🎉 All Tests Passed!</h2>";
    echo "<p><strong>Your database is working correctly online.</strong></p>";
    echo "<p>⚠️ <strong>Security:</strong> Delete this file after testing!</p>";
    
} catch(PDOException $e) {
    echo "<h2 class='error'>❌ Connection Failed</h2>";
    echo "<p class='error'>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<h3>Troubleshooting:</h3>";
    echo "<ul>";
    echo "<li>Check database name in cPanel</li>";
    echo "<li>Check database username</li>";
    echo "<li>Check database password</li>";
    echo "<li>Ensure user has permissions on the database</li>";
    echo "</ul>";
}

echo "</body></html>";
?>

