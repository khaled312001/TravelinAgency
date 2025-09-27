<?php
// Ultra-simple working index for GoDaddy
// This file will definitely work without any syntax errors

// Turn on error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set proper headers
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>";
echo "<html lang='en'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "<title>World Trip Agency - Working</title>";
echo "<style>";
echo "body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }";
echo ".container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }";
echo ".success { color: #28a745; font-weight: bold; }";
echo ".error { color: #dc3545; font-weight: bold; }";
echo ".info { color: #007bff; }";
echo "h1 { color: #333; text-align: center; }";
echo "</style>";
echo "</head>";
echo "<body>";

echo "<div class='container'>";
echo "<h1>🌍 World Trip Agency</h1>";
echo "<h2>✅ PHP is Working!</h2>";

// Test basic PHP functionality
echo "<p class='success'>✅ PHP Version: " . phpversion() . "</p>";
echo "<p class='success'>✅ Current Time: " . date('Y-m-d H:i:s') . "</p>";
echo "<p class='success'>✅ Server: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";

// Test database connection
echo "<h3>🗄️ Database Test</h3>";
try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel', 'travel', 'support@Passord123');
    echo "<p class='success'>✅ Database connected successfully!</p>";
    
    // Test a simple query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM packages");
    $result = $stmt->fetch();
    echo "<p class='success'>✅ Packages table: " . $result['count'] . " records</p>";
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Database error: " . $e->getMessage() . "</p>";
}

// Test file system
echo "<h3>📁 File System Test</h3>";
if (file_exists('output/public/200.html')) {
    echo "<p class='success'>✅ Nuxt build files found</p>";
} else {
    echo "<p class='error'>❌ Nuxt build files not found</p>";
}

if (file_exists('public/images')) {
    echo "<p class='success'>✅ Images directory found</p>";
} else {
    echo "<p class='error'>❌ Images directory not found</p>";
}

// Test .htaccess
if (file_exists('.htaccess')) {
    echo "<p class='success'>✅ .htaccess file exists</p>";
} else {
    echo "<p class='error'>❌ .htaccess file missing</p>";
}

echo "<h3>🔧 Next Steps</h3>";
echo "<p class='info'>If you see this page, PHP is working correctly!</p>";
echo "<p class='info'>Now we can fix the main index.php file.</p>";

echo "</div>";
echo "</body>";
echo "</html>";
?>
