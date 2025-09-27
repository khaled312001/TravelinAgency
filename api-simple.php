<?php
// Simple API handler for GoDaddy
// This replaces the problematic api-handler.php

// Set proper headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove /api/ prefix
$path = str_replace('/api/', '', $path);

// Simple routing
switch ($path) {
    case 'test':
        echo json_encode([
            'status' => 'success',
            'message' => 'API is working!',
            'time' => date('Y-m-d H:i:s'),
            'php_version' => phpversion()
        ]);
        break;
        
    case 'packages':
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=travel', 'travel', 'support@Passord123');
            $stmt = $pdo->query("SELECT * FROM packages LIMIT 10");
            $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'data' => $packages,
                'count' => count($packages)
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
        break;
        
    case 'destinations':
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=travel', 'travel', 'support@Passord123');
            $stmt = $pdo->query("SELECT * FROM destinations LIMIT 10");
            $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'data' => $destinations,
                'count' => count($destinations)
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'API endpoint not found',
            'path' => $path
        ]);
        break;
}
?>
