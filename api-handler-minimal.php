<?php
/**
 * Minimal API Handler for Testing
 * This is a simplified version to test basic functionality
 */

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the request URI and method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$cleanUri = strtok($requestUri, '?');

// Remove /api prefix
$apiPath = str_replace('/api', '', $cleanUri);

// Route API requests
switch ($apiPath) {
    case '/packages':
        if ($requestMethod === 'GET') {
            echo json_encode([
                [
                    'id' => 1,
                    'title' => 'Dubai Luxury Package',
                    'description' => 'Experience the luxury of Dubai',
                    'price' => 2500,
                    'duration' => '7 days',
                    'image' => '/output/public/images/packages/imported/dubai-luxury.jpg',
                    'featured' => true,
                    'destination' => 'Dubai, UAE'
                ]
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/auth/login':
        if ($requestMethod === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON data']);
                break;
            }
            
            if (empty($input['email']) || empty($input['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Email and password are required']);
                break;
            }
            
            // Simple hardcoded credentials
            if ($input['email'] === 'admin@wonderland.com' && $input['password'] === 'admin123') {
                echo json_encode([
                    'success' => true,
                    'token' => 'test-token-123',
                    'user' => [
                        'id' => 1,
                        'name' => 'Admin User',
                        'email' => 'admin@wonderland.com',
                        'role' => 'admin'
                    ]
                ]);
            } else {
                echo json_encode(['error' => 'Invalid credentials']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'API endpoint not found', 'path' => $apiPath]);
        break;
}
?>
