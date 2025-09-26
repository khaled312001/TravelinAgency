<?php
/**
 * Database Connection Test Script
 * This script tests the database connection and shows what's happening
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

// Database configuration
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbUser = getenv('DB_USER') ?: 'travel';
$dbPassword = getenv('DB_PASSWORD') ?: 'support@Passord123';
$dbName = getenv('DB_NAME') ?: 'travel';
$dbPort = getenv('DB_PORT') ?: '3306';

echo "<h1>Database Connection Test</h1>";
echo "<h2>Configuration:</h2>";
echo "<p><strong>Host:</strong> $dbHost</p>";
echo "<p><strong>User:</strong> $dbUser</p>";
echo "<p><strong>Password:</strong> " . (empty($dbPassword) ? 'EMPTY' : 'SET') . "</p>";
echo "<p><strong>Database:</strong> $dbName</p>";
echo "<p><strong>Port:</strong> $dbPort</p>";

echo "<h2>Connection Test:</h2>";

try {
    $conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName, $dbPort);
    
    if ($conn->connect_error) {
        echo "<p style='color: red;'><strong>❌ Connection Failed:</strong> " . $conn->connect_error . "</p>";
        echo "<h3>Possible Solutions:</h3>";
        echo "<ul>";
        echo "<li>Check if MySQL service is running</li>";
        echo "<li>Verify database credentials in .env file</li>";
        echo "<li>Check if database 'travel' exists</li>";
        echo "<li>Verify user 'travel' has access to database</li>";
        echo "<li>Check if GoDaddy allows remote MySQL connections</li>";
        echo "</ul>";
    } else {
        echo "<p style='color: green;'><strong>✅ Connection Successful!</strong></p>";
        
        // Test queries
        echo "<h3>Database Tables:</h3>";
        $result = $conn->query("SHOW TABLES");
        if ($result) {
            echo "<ul>";
            while ($row = $result->fetch_array()) {
                echo "<li>" . $row[0] . "</li>";
            }
            echo "</ul>";
        } else {
            echo "<p style='color: red;'>❌ Could not fetch tables: " . $conn->error . "</p>";
        }
        
        // Test packages table
        echo "<h3>Packages Table Test:</h3>";
        $result = $conn->query("SELECT COUNT(*) as count FROM packages");
        if ($result) {
            $row = $result->fetch_assoc();
            echo "<p><strong>Packages count:</strong> " . $row['count'] . "</p>";
            
            if ($row['count'] > 0) {
                $result = $conn->query("SELECT * FROM packages LIMIT 3");
                if ($result) {
                    echo "<h4>Sample packages:</h4>";
                    echo "<pre>";
                    while ($row = $result->fetch_assoc()) {
                        print_r($row);
                    }
                    echo "</pre>";
                }
            }
        } else {
            echo "<p style='color: red;'>❌ Packages table not found or error: " . $conn->error . "</p>";
        }
        
        // Test destinations table
        echo "<h3>Destinations Table Test:</h3>";
        $result = $conn->query("SELECT COUNT(*) as count FROM destinations");
        if ($result) {
            $row = $result->fetch_assoc();
            echo "<p><strong>Destinations count:</strong> " . $row['count'] . "</p>";
        } else {
            echo "<p style='color: red;'>❌ Destinations table not found or error: " . $conn->error . "</p>";
        }
        
        // Test admin_users table
        echo "<h3>Admin Users Table Test:</h3>";
        $result = $conn->query("SELECT COUNT(*) as count FROM admin_users");
        if ($result) {
            $row = $result->fetch_assoc();
            echo "<p><strong>Admin users count:</strong> " . $row['count'] . "</p>";
        } else {
            echo "<p style='color: red;'>❌ Admin users table not found or error: " . $conn->error . "</p>";
        }
        
        $conn->close();
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'><strong>❌ Exception:</strong> " . $e->getMessage() . "</p>";
}

echo "<h2>Environment Variables:</h2>";
echo "<pre>";
print_r($_ENV);
echo "</pre>";

echo "<h2>PHP Info:</h2>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>MySQL Extension:</strong> " . (extension_loaded('mysqli') ? 'Loaded' : 'Not Loaded') . "</p>";
echo "<p><strong>Current Directory:</strong> " . __DIR__ . "</p>";
echo "<p><strong>Server Time:</strong> " . date('Y-m-d H:i:s') . "</p>";
?>
