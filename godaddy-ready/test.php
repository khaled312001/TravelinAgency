<?php
// Simple test file to check if PHP is working
echo "PHP is working! ✓<br>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";

// Check if files exist
$files_to_check = ['index.html', '.htaccess', 'api-handler.php'];
echo "<br><strong>File Check:</strong><br>";
foreach ($files_to_check as $file) {
    if (file_exists($file)) {
        echo "✓ $file exists<br>";
    } else {
        echo "✗ $file NOT found<br>";
    }
}

// Check Apache modules
echo "<br><strong>Apache Modules:</strong><br>";
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    $important_modules = ['mod_rewrite', 'mod_headers', 'mod_deflate', 'mod_expires'];
    foreach ($important_modules as $module) {
        if (in_array($module, $modules)) {
            echo "✓ $module enabled<br>";
        } else {
            echo "✗ $module NOT enabled<br>";
        }
    }
} else {
    echo "Cannot check modules (not using Apache or no access)<br>";
}

echo "<br><strong>If you see this, PHP works!</strong><br>";
echo "<a href='index.html'>Go to Homepage</a>";
?>

