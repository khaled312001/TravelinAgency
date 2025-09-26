<?php
// Ultra-simple index.php for testing
$requestUri = $_SERVER['REQUEST_URI'];
$cleanUri = strtok($requestUri, '?');

// Handle API routes
if (strpos($cleanUri, '/api/') === 0) {
    if (file_exists(__DIR__ . '/api-test-simple.php')) {
        include __DIR__ . '/api-test-simple.php';
        exit;
    } else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'api-test-simple.php not found']);
        exit;
    }
}

// For non-API requests, show a simple page
echo "<h1>Website Working</h1>";
echo "<p>Request URI: " . htmlspecialchars($requestUri) . "</p>";
echo "<p>Clean URI: " . htmlspecialchars($cleanUri) . "</p>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Current Directory: " . __DIR__ . "</p>";
echo "<p>Files in directory:</p>";
echo "<ul>";
$files = scandir(__DIR__);
foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        echo "<li>" . htmlspecialchars($file) . "</li>";
    }
}
echo "</ul>";
?>
