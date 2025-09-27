<?php
echo "PHP is working!<br>";
echo "Current time: " . date('Y-m-d H:i:s') . "<br>";
echo "PHP version: " . phpversion() . "<br>";

// Test database connection
try {
    $host = "localhost";
    $dbname = "travel";
    $username = "travel";
    $password = "support@Passord123";
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    
    echo "✅ Database connection successful!<br>";
    
    // Test if packages table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'packages'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Packages table exists<br>";
        
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM packages");
        $result = $stmt->fetch();
        echo "📦 Packages count: " . $result['count'] . "<br>";
    } else {
        echo "⚠️  Packages table not found<br>";
    }
    
} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "<br>";
}
?>