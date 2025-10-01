<?php
// Database Connection Test for GoDaddy
// Visit: http://worldtripagency.com/test-connection.php

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Database Connection Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .info { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>🔍 Database Connection Test</h1>
    <hr>

<?php
// Database credentials from your .env
$host = 'localhost';
$dbname = 'travel';
$username = 'travel';
$password = 'support@Passord123';

echo "<div class='info'>";
echo "<strong>Connection Details:</strong><br>";
echo "Host: $host<br>";
echo "Database: $dbname<br>";
echo "Username: $username<br>";
echo "Password: " . str_repeat('*', strlen($password)) . "<br>";
echo "</div>";

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "<p class='success'>✅ DATABASE CONNECTION SUCCESSFUL!</p>";
    
    // Test 1: Check tables
    echo "<h2>📋 Tables in Database:</h2>";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) > 0) {
        echo "<table>";
        echo "<tr><th>#</th><th>Table Name</th><th>Rows</th></tr>";
        foreach ($tables as $index => $table) {
            $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
            echo "<tr><td>" . ($index + 1) . "</td><td>$table</td><td>$count</td></tr>";
        }
        echo "</table>";
    } else {
        echo "<p class='error'>⚠️ No tables found in database!</p>";
    }
    
    // Test 2: Check navigation
    echo "<h2>🧭 Navigation Test:</h2>";
    $nav = $pdo->query("SELECT * FROM cms_navigation WHERE menu_name = 'main' ORDER BY order_index")->fetchAll();
    if (count($nav) > 0) {
        echo "<p class='success'>✅ Found " . count($nav) . " navigation items</p>";
        echo "<table>";
        echo "<tr><th>Title</th><th>URL</th><th>Active</th></tr>";
        foreach ($nav as $item) {
            echo "<tr><td>{$item['title']}</td><td>{$item['url']}</td><td>" . ($item['is_active'] ? '✅' : '❌') . "</td></tr>";
        }
        echo "</table>";
    } else {
        echo "<p class='error'>❌ No navigation items found!</p>";
    }
    
    // Test 3: Check packages
    echo "<h2>📦 Packages Test:</h2>";
    $packages = $pdo->query("SELECT id, title_ar, title_en, price FROM packages LIMIT 5")->fetchAll();
    if (count($packages) > 0) {
        echo "<p class='success'>✅ Found " . count($packages) . " packages</p>";
        echo "<table>";
        echo "<tr><th>Title (AR)</th><th>Title (EN)</th><th>Price</th></tr>";
        foreach ($packages as $pkg) {
            echo "<tr><td>{$pkg['title_ar']}</td><td>{$pkg['title_en']}</td><td>{$pkg['price']} SAR</td></tr>";
        }
        echo "</table>";
    } else {
        echo "<p class='error'>❌ No packages found!</p>";
    }
    
    // Test 4: Check site settings
    echo "<h2>⚙️ Site Settings Test:</h2>";
    $settings = $pdo->query("SELECT * FROM cms_site_settings WHERE is_public = 1")->fetchAll();
    if (count($settings) > 0) {
        echo "<p class='success'>✅ Found " . count($settings) . " public settings</p>";
        echo "<table>";
        echo "<tr><th>Key</th><th>Value</th></tr>";
        foreach ($settings as $setting) {
            echo "<tr><td>{$setting['setting_key']}</td><td>{$setting['setting_value']}</td></tr>";
        }
        echo "</table>";
    } else {
        echo "<p class='error'>❌ No settings found!</p>";
    }
    
    echo "<hr>";
    echo "<h2>🎉 Summary:</h2>";
    echo "<p class='success'>✅ Database is working correctly!</p>";
    echo "<p>You can now update api-handler.php with these credentials.</p>";
    
} catch (PDOException $e) {
    echo "<p class='error'>❌ CONNECTION FAILED!</p>";
    echo "<div class='info'>";
    echo "<strong>Error Message:</strong><br>";
    echo htmlspecialchars($e->getMessage());
    echo "</div>";
    
    echo "<h3>💡 How to Fix:</h3>";
    echo "<ol>";
    echo "<li>Check your database name, username, and password in cPanel</li>";
    echo "<li>Make sure the database user has ALL PRIVILEGES</li>";
    echo "<li>Verify the database was imported successfully</li>";
    echo "</ol>";
}
?>

<hr>
<p><small>⚠️ <strong>Security Note:</strong> Delete this file after testing!</small></p>

</body>
</html>

