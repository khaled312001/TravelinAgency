<?php
/**
 * API Handler for GoDaddy Hosting
 * This file handles API requests and returns appropriate data
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
            echo json_encode(getPackages());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/destinations':
        if ($requestMethod === 'GET') {
            echo json_encode(getDestinations());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/contact-messages':
        if ($requestMethod === 'POST') {
            echo json_encode(handleContactMessage());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    // Authentication endpoints
    case '/auth/login':
        if ($requestMethod === 'POST') {
            echo json_encode(handleLogin());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/auth/logout':
        if ($requestMethod === 'POST') {
            echo json_encode(handleLogout());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/auth/me':
        if ($requestMethod === 'GET') {
            echo json_encode(handleGetUser());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/auth/verify':
        if ($requestMethod === 'POST') {
            echo json_encode(handleVerifyToken());
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

function getPackages() {
    // Return sample packages data
    return [
        [
            'id' => 1,
            'title' => 'Dubai Luxury Package',
            'description' => 'Experience the luxury of Dubai with our premium package',
            'price' => 2500,
            'duration' => '7 days',
            'image' => '/output/public/images/packages/imported/dubai-luxury.jpg',
            'featured' => true,
            'destination' => 'Dubai, UAE'
        ],
        [
            'id' => 2,
            'title' => 'Bali Paradise',
            'description' => 'Discover the beauty of Bali with our tropical package',
            'price' => 1800,
            'duration' => '5 days',
            'image' => '/output/public/images/packages/imported/bali-paradise.jpg',
            'featured' => true,
            'destination' => 'Bali, Indonesia'
        ],
        [
            'id' => 3,
            'title' => 'London Royal Experience',
            'description' => 'Explore the royal heritage of London',
            'price' => 2200,
            'duration' => '6 days',
            'image' => '/output/public/images/packages/imported/london-royal.jpg',
            'featured' => true,
            'destination' => 'London, UK'
        ],
        [
            'id' => 4,
            'title' => 'Paris Romance',
            'description' => 'Romantic getaway in the city of love',
            'price' => 2000,
            'duration' => '5 days',
            'image' => '/output/public/images/packages/imported/paris-romance.jpg',
            'featured' => true,
            'destination' => 'Paris, France'
        ],
        [
            'id' => 5,
            'title' => 'Maldives Luxury',
            'description' => 'Ultimate luxury in the Maldives',
            'price' => 3500,
            'duration' => '7 days',
            'image' => '/output/public/images/packages/imported/maldives-luxury.jpg',
            'featured' => true,
            'destination' => 'Maldives'
        ],
        [
            'id' => 6,
            'title' => 'Tokyo Modern',
            'description' => 'Experience modern Japan in Tokyo',
            'price' => 2800,
            'duration' => '8 days',
            'image' => '/output/public/images/packages/imported/tokyo-modern.jpg',
            'featured' => true,
            'destination' => 'Tokyo, Japan'
        ]
    ];
}

function getDestinations() {
    // Return sample destinations data
    return [
        [
            'id' => 1,
            'name' => 'Barcelona',
            'country' => 'Spain',
            'description' => 'Beautiful city with amazing architecture',
            'image' => '/output/public/images/destinations/global/Barcelona/Barcelona1.jpeg',
            'featured' => true
        ],
        [
            'id' => 2,
            'name' => 'Cairo',
            'country' => 'Egypt',
            'description' => 'Ancient wonders and modern marvels',
            'image' => '/output/public/images/destinations/global/Cairo/Cairo1.jpeg',
            'featured' => true
        ],
        [
            'id' => 3,
            'name' => 'Georgia',
            'country' => 'Georgia',
            'description' => 'Stunning landscapes and rich culture',
            'image' => '/output/public/images/destinations/global/Georgia/Georgia1.jpeg',
            'featured' => true
        ],
        [
            'id' => 4,
            'name' => 'Istanbul',
            'country' => 'Turkey',
            'description' => 'Where East meets West',
            'image' => '/output/public/images/destinations/global/Istanbul/Istanbul1.jpeg',
            'featured' => true
        ],
        [
            'id' => 5,
            'name' => 'London',
            'country' => 'UK',
            'description' => 'Royal heritage and modern culture',
            'image' => '/output/public/images/destinations/global/London/London1.jpeg',
            'featured' => true
        ],
        [
            'id' => 6,
            'name' => 'Madrid',
            'country' => 'Spain',
            'description' => 'Vibrant capital with rich history',
            'image' => '/output/public/images/destinations/global/Madrid/Madrid1.jpeg',
            'featured' => true
        ],
        [
            'id' => 7,
            'name' => 'Morocco',
            'country' => 'Morocco',
            'description' => 'Exotic beauty and ancient traditions',
            'image' => '/output/public/images/destinations/global/Morocco/Morocco1.jpeg',
            'featured' => true
        ],
        [
            'id' => 8,
            'name' => 'Paris',
            'country' => 'France',
            'description' => 'City of light and romance',
            'image' => '/output/public/images/destinations/global/Paris/Paris1.jpeg',
            'featured' => true
        ],
        [
            'id' => 9,
            'name' => 'Thailand',
            'country' => 'Thailand',
            'description' => 'Tropical paradise with rich culture',
            'image' => '/output/public/images/destinations/global/Thailand/Thailand1.jpeg',
            'featured' => true
        ],
        [
            'id' => 10,
            'name' => 'Riyadh',
            'country' => 'Saudi Arabia',
            'description' => 'Modern capital with traditional charm',
            'image' => '/output/public/images/destinations/saudi/riyadh/Ryiadh1.jpeg',
            'featured' => true
        ]
    ];
}

function handleContactMessage() {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        return ['error' => 'Invalid JSON data'];
    }
    
    // Validate required fields
    $required = ['name', 'email', 'message'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            return ['error' => "Missing required field: $field"];
        }
    }
    
    // Here you would typically save to database
    // For now, just return success
    return [
        'success' => true,
        'message' => 'Contact message received successfully',
        'data' => [
            'name' => $input['name'],
            'email' => $input['email'],
            'message' => $input['message'],
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ];
}

// Authentication functions
function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        return ['error' => 'Invalid JSON data'];
    }
    
    if (empty($input['email']) || empty($input['password'])) {
        http_response_code(400);
        return ['error' => 'Email and password are required'];
    }
    
    // Hardcoded admin credentials for fallback
    $adminCredentials = [
        'admin@worldtripagency.com' => 'admin123',
        'admin@travel.com' => 'admin123',
        'admin@wonderland.com' => 'admin123',
        'admin' => 'admin123'
    ];
    
    if (isset($adminCredentials[$input['email']]) && $adminCredentials[$input['email']] === $input['password']) {
        $token = generateJWT([
            'id' => 1,
            'name' => 'Admin User',
            'email' => $input['email'],
            'role' => 'admin'
        ]);
        
        return [
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => 1,
                'name' => 'Admin User',
                'email' => $input['email'],
                'role' => 'admin'
            ]
        ];
    }
    
    return ['error' => 'Invalid credentials'];
}

function handleLogout() {
    return [
        'success' => true,
        'message' => 'Logged out successfully'
    ];
}

function handleGetUser() {
    $headers = getallheaders();
    $token = null;
    
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        }
    }
    
    if (!$token) {
        http_response_code(401);
        return ['error' => 'No token provided'];
    }
    
    $user = verifyJWT($token);
    if (!$user) {
        http_response_code(401);
        return ['error' => 'Invalid token'];
    }
    
    return [
        'success' => true,
        'user' => $user
    ];
}

function handleVerifyToken() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['token'])) {
        http_response_code(400);
        return ['error' => 'Token is required'];
    }
    
    $user = verifyJWT($input['token']);
    if (!$user) {
        http_response_code(401);
        return ['error' => 'Invalid token'];
    }
    
    return [
        'success' => true,
        'user' => $user
    ];
}

function generateJWT($user) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role'] ?? 'admin',
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60)
    ]);
    
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, 'your-secret-key', true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0])), true);
    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
    
    if (!$payload || $payload['exp'] < time()) {
        return false;
    }
    
    $signature = hash_hmac('sha256', $parts[0] . "." . $parts[1], 'your-secret-key', true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    if ($base64Signature !== $parts[2]) {
        return false;
    }
    
    return [
        'id' => $payload['user_id'],
        'name' => $payload['name'],
        'email' => $payload['email'],
        'role' => $payload['role']
    ];
}
?>
