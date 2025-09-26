<?php
echo "<h1>PHP is working!</h1>";
echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>PHP version: " . phpversion() . "</p>";
echo "<p>Current directory: " . __DIR__ . "</p>";

// Check if output directory exists
if (file_exists(__DIR__ . '/output/public/200.html')) {
    echo "<p style='color: green;'>✅ output/public/200.html found</p>";
} else {
    echo "<p style='color: red;'>❌ output/public/200.html not found</p>";
}

// List files in current directory
echo "<h3>Files in current directory:</h3><ul>";
$files = scandir(__DIR__);
foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
        echo "<li>" . $file . "</li>";
    }
}
echo "</ul>";
?>