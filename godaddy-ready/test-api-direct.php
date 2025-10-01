<?php
// Direct API test - bypassing .htaccess
// Visit: https://worldtripagency.com/test-api-direct.php

header('Content-Type: application/json');

// Simulate what api-handler.php should do
require_once 'api-handler.php';

// Or test directly
echo json_encode([
    'test' => 'API handler exists',
    'api_file' => file_exists('api-handler.php') ? 'YES' : 'NO',
    'api_size' => file_exists('api-handler.php') ? filesize('api-handler.php') : 0
]);
?>

