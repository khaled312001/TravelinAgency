<?php
// Ultra-simple PHP test for GoDaddy
// This should work even if other files have issues

// Turn on error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "PHP is working!<br>";
echo "Time: " . date('Y-m-d H:i:s') . "<br>";
echo "PHP Version: " . phpversion() . "<br>";

// Test if we can read files
if (file_exists('index.php')) {
    echo "✅ index.php exists<br>";
} else {
    echo "❌ index.php missing<br>";
}

if (file_exists('api-handler.php')) {
    echo "✅ api-handler.php exists<br>";
} else {
    echo "❌ api-handler.php missing<br>";
}

if (file_exists('.htaccess')) {
    echo "✅ .htaccess exists<br>";
} else {
    echo "❌ .htaccess missing<br>";
}

// Test database connection
echo "<br>Testing database connection...<br>";
try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel', 'travel', 'support@Passord123');
    echo "✅ Database connected successfully<br>";
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
}

echo "<br>✅ Simple test completed!";
?>