<?php
// Test Database Connection for GoDaddy
// Upload this file to your server and visit it in the browser

echo "<h2>🔍 Database Connection Test</h2>";
echo "<hr>";

// ⚠️ UPDATE THESE VALUES FROM YOUR GODADDY CPANEL
$host = 'localhost';
$dbname = 'YOUR_DATABASE_NAME';  // ⚠️ Change this
$username = 'YOUR_DATABASE_USER';  // ⚠️ Change this
$password = 'YOUR_DATABASE_PASSWORD';  // ⚠️ Change this

echo "<p><strong>Attempting to connect with:</strong></p>";
echo "<ul>";
echo "<li>Host: $host</li>";
echo "<li>Database: $dbname</li>";
echo "<li>Username: $username</li>";
echo "<li>Password: " . (strlen($password) > 0 ? str_repeat('*', strlen($password)) : 'NOT SET') . "</li>";
echo "</ul>";
echo "<hr>";

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "<p style='color: green; font-size: 18px;'>✅ <strong>SUCCESS!</strong> Connected to database successfully!</p>";
    
    // Test query
    echo "<h3>Testing database structure...</h3>";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) > 0) {
        echo "<p>✅ Found " . count($tables) . " tables:</p>";
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li>$table</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: orange;'>⚠️ Database is empty. You need to import the schema.</p>";
    }
    
    // Check for travel tables
    $requiredTables = ['cms_navigation', 'cms_pages', 'destinations', 'packages'];
    $missingTables = [];
    
    echo "<h3>Checking required tables...</h3>";
    foreach ($requiredTables as $table) {
        if (in_array($table, $tables)) {
            echo "<p>✅ Table '$table' exists</p>";
        } else {
            echo "<p style='color: red;'>❌ Table '$table' is missing</p>";
            $missingTables[] = $table;
        }
    }
    
    if (count($missingTables) > 0) {
        echo "<hr>";
        echo "<p style='color: red; font-size: 16px;'><strong>⚠️ ACTION REQUIRED:</strong> Import the database schema from mysql/schema.sql</p>";
    } else {
        echo "<hr>";
        echo "<p style='color: green; font-size: 16px;'><strong>🎉 Database is ready!</strong> All required tables exist.</p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red; font-size: 18px;'>❌ <strong>CONNECTION FAILED!</strong></p>";
    echo "<p><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<hr>";
    echo "<h3>📋 How to fix this:</h3>";
    echo "<ol>";
    echo "<li>Go to GoDaddy cPanel</li>";
    echo "<li>Find <strong>MySQL Databases</strong></li>";
    echo "<li>Create a new database (or note the existing one)</li>";
    echo "<li>Create a new MySQL user with a password</li>";
    echo "<li>Add the user to the database with ALL PRIVILEGES</li>";
    echo "<li>Update the credentials in this file and api-handler.php</li>";
    echo "</ol>";
}

echo "<hr>";
echo "<p><small>After the connection works, you can delete this test file.</small></p>";
?>

