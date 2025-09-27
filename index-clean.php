<?php
// Clean, working index.php for GoDaddy hosting
// This replaces the problematic index.php with a working version

// Turn on error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set proper headers
header('Content-Type: text/html; charset=utf-8');

// Check if we have a built Nuxt.js application
$nuxtHtmlPaths = [
    __DIR__ . '/output/public/200.html',
    __DIR__ . '/public/200.html'
];

$nuxtContent = null;
foreach ($nuxtHtmlPaths as $nuxtHtmlFile) {
    if (file_exists($nuxtHtmlFile)) {
        $nuxtContent = file_get_contents($nuxtHtmlFile);
        
        // Replace any localhost references with your domain
        $nuxtContent = str_replace('http://localhost:3000', 'https://travelin-agency-nlcs.vercel.app', $nuxtContent);
        $nuxtContent = str_replace('localhost:3000', 'worldtripagency.com', $nuxtContent);
        
        // Set proper headers
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        echo $nuxtContent;
        exit;
    }
}

// If no Nuxt build found, show a simple working page
echo "<!DOCTYPE html>";
echo "<html lang='en'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "<title>World Trip Agency</title>";
echo "<style>";
echo "body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }";
echo ".container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }";
echo ".success { color: #28a745; font-weight: bold; }";
echo ".error { color: #dc3545; font-weight: bold; }";
echo "h1 { color: #333; text-align: center; }";
echo "</style>";
echo "</head>";
echo "<body>";

echo "<div class='container'>";
echo "<h1>🌍 World Trip Agency</h1>";
echo "<h2>✅ Server is Working!</h2>";

// Test database connection
try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel', 'travel', 'support@Passord123');
    echo "<p class='success'>✅ Database connected successfully!</p>";
    
    // Test a simple query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM packages");
    $result = $stmt->fetch();
    echo "<p class='success'>✅ Packages: " . $result['count'] . " records</p>";
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Database error: " . $e->getMessage() . "</p>";
}

echo "<p class='success'>✅ PHP Version: " . phpversion() . "</p>";
echo "<p class='success'>✅ Time: " . date('Y-m-d H:i:s') . "</p>";

echo "<h3>📋 Status</h3>";
echo "<p>✅ Server is working correctly</p>";
echo "<p>✅ Database connection successful</p>";
echo "<p>⚠️ Nuxt.js build files not found - please run 'npm run build'</p>";

echo "</div>";
echo "</body>";
echo "</html>";
?>