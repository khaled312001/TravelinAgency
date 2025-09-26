<?php
/**
 * Test API Syntax Script
 * This script tests if the API handler has any syntax errors
 */

echo "Testing API handler syntax...\n";

// Test if the file exists
if (!file_exists('api-handler.php')) {
    echo "❌ ERROR: api-handler.php not found!\n";
    exit(1);
}

echo "✅ api-handler.php exists\n";

// Test PHP syntax
$output = [];
$return_code = 0;
exec('php -l api-handler.php 2>&1', $output, $return_code);

if ($return_code === 0) {
    echo "✅ PHP syntax is valid\n";
    echo "Output: " . implode("\n", $output) . "\n";
} else {
    echo "❌ PHP syntax error found!\n";
    echo "Error: " . implode("\n", $output) . "\n";
    exit(1);
}

// Test if we can include the file
try {
    ob_start();
    include 'api-handler.php';
    $output = ob_get_clean();
    echo "✅ File can be included without errors\n";
} catch (Exception $e) {
    echo "❌ Error including file: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n🎉 All tests passed! The API handler should work correctly.\n";
?>
