<?php
// Simple working API handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$cleanUri = strtok($requestUri, '?');
$apiPath = str_replace('/api', '', $cleanUri);

switch ($apiPath) {
    case '/test':
        echo json_encode([
            'status' => 'success',
            'message' => 'API is working correctly',
            'timestamp' => date('c'),
            'php_version' => phpversion(),
            'request_method' => $requestMethod,
            'api_path' => $apiPath
        ]);
        break;
        
    case '/packages':
        if ($requestMethod === 'GET') {
            // Sample packages data
            $packages = [
                [
                    'id' => 1,
                    'title' => 'Dubai Luxury Package',
                    'description' => 'Experience the luxury of Dubai with our premium package',
                    'price' => 2500,
                    'duration' => '7 days',
                    'image' => '/images/packages/imported/dubai-luxury.jpg',
                    'featured' => true,
                    'destination' => 'Dubai, UAE',
                    'created_at' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 2,
                    'title' => 'Paris Romance Package',
                    'description' => 'Romantic getaway to the City of Light',
                    'price' => 1800,
                    'duration' => '5 days',
                    'image' => '/images/packages/imported/paris-romance.jpg',
                    'featured' => true,
                    'destination' => 'Paris, France',
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ];
            
            echo json_encode($packages, JSON_UNESCAPED_SLASHES);
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
            
            // Hardcoded admin credentials
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
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/auth/logout':
        if ($requestMethod === 'POST') {
            echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/auth/me':
        if ($requestMethod === 'GET') {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => 1,
                    'email' => 'admin@wonderland.com',
                    'role' => 'admin'
                ]
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/destinations':
        if ($requestMethod === 'GET') {
            $destinations = [
                [
                    'id' => 1,
                    'name' => 'Dubai',
                    'country' => 'UAE',
                    'description' => 'The luxury capital of the Middle East',
                    'image' => '/images/destinations/dubai.jpg'
                ],
                [
                    'id' => 2,
                    'name' => 'Paris',
                    'country' => 'France',
                    'description' => 'The romantic City of Light',
                    'image' => '/images/destinations/paris.jpg'
                ]
            ];
            
            echo json_encode($destinations, JSON_UNESCAPED_SLASHES);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/cms/site-settings':
        if ($requestMethod === 'GET') {
            echo json_encode([
                'site_name' => 'World Trip Agency',
                'site_description' => 'Your gateway to amazing travel experiences',
                'contact_email' => 'info@worldtripagency.com',
                'contact_phone' => '+1-555-0123',
                'social_media' => [
                    'facebook' => 'https://facebook.com/worldtripagency',
                    'twitter' => 'https://twitter.com/worldtripagency',
                    'instagram' => 'https://instagram.com/worldtripagency'
                ]
            ], JSON_UNESCAPED_SLASHES);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/contact-messages':
        if ($requestMethod === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON data']);
                break;
            }
            
            if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Name, email, and message are required']);
                break;
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Thank you for your message. We will get back to you soon!'
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'error' => 'API endpoint not found',
            'path' => $apiPath,
            'available_endpoints' => [
                '/test',
                '/packages',
                '/auth/login',
                '/auth/logout',
                '/auth/me',
                '/destinations',
                '/cms/site-settings',
                '/contact-messages'
            ]
        ]);
        break;
}
?>