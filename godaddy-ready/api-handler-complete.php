<?php
// Complete API Handler for GoDaddy Static Hosting
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Configuration - UPDATE THESE WITH YOUR GODADDY CREDENTIALS
$host = 'localhost';
$dbname = 'travel';
$username = 'travel';
$password = 'support@Passord123';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed', 'message' => $e->getMessage()]);
    exit();
}

// Get request path and method
$path = isset($_GET['path']) ? $_GET['path'] : (isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '');
$method = $_SERVER['REQUEST_METHOD'];

// Read JSON input for POST/PUT
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Simple router
try {
    // Public Navigation
    if ($path === 'public/navigation' && $method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM cms_navigation WHERE menu_name = 'main' AND is_active = 1 ORDER BY order_index");
        $navItems = $stmt->fetchAll();
        
        // Transform to match expected format
        $navigation = array_map(function($item) {
            return [
                'id' => $item['id'],
                'title' => $item['title'],
                'url' => $item['url'],
                'order_index' => $item['order_index'],
                'is_active' => (bool)$item['is_active']
            ];
        }, $navItems);
        
        echo json_encode(['success' => true, 'data' => ['menus' => ['main' => $navigation]]]);
        exit();
    }
    
    // CMS Site Settings
    if (preg_match('#^cms/site-settings#', $path) && $method === 'GET') {
        $publicOnly = isset($_GET['public_only']) && $_GET['public_only'] === 'true';
        
        if ($publicOnly) {
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM cms_site_settings WHERE is_public = 1");
        } else {
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM cms_site_settings");
        }
        
        $settings = [];
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        
        echo json_encode(['success' => true, 'data' => $settings]);
        exit();
    }
    
    // Packages List
    if ($path === 'packages' && $method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM packages WHERE active = 1 ORDER BY featured DESC, created_at DESC");
        $packages = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $packages]);
        exit();
    }
    
    // Single Package
    if (preg_match('#^packages/([a-f0-9\-]+)$#', $path, $matches) && $method === 'GET') {
        $id = $matches[1];
        $stmt = $pdo->prepare("SELECT * FROM packages WHERE id = ? AND active = 1");
        $stmt->execute([$id]);
        $package = $stmt->fetch();
        
        if ($package) {
            echo json_encode(['success' => true, 'data' => $package]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Package not found']);
        }
        exit();
    }
    
    // Destinations
    if ($path === 'destinations' && $method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM destinations WHERE active = 1 ORDER BY featured DESC, created_at DESC");
        $destinations = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $destinations]);
        exit();
    }
    
    // Package Inquiry
    if ($path === 'inquiries/package' && $method === 'POST') {
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        $packageId = $input['package_id'] ?? '';
        $packageTitle = $input['package_title'] ?? '';
        $message = $input['message'] ?? '';
        $locale = $input['locale'] ?? 'ar-SA';
        
        if (empty($name) || empty($phone) || empty($packageId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit();
        }
        
        $stmt = $pdo->prepare("INSERT INTO package_inquiries (name, email, phone, package_id, package_title, message, locale, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $email, $phone, $packageId, $packageTitle, $message, $locale]);
        
        echo json_encode(['success' => true, 'message' => 'Inquiry submitted successfully']);
        exit();
    }
    
    // Destination Inquiry
    if ($path === 'inquiries/destination' && $method === 'POST') {
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        $destinationName = $input['destination_name'] ?? '';
        $message = $input['message'] ?? '';
        $locale = $input['locale'] ?? 'ar-SA';
        
        if (empty($name) || empty($phone) || empty($destinationName)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit();
        }
        
        $stmt = $pdo->prepare("INSERT INTO destination_inquiries (name, email, phone, destination_name, message, locale, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $email, $phone, $destinationName, $message, $locale]);
        
        echo json_encode(['success' => true, 'message' => 'Inquiry submitted successfully']);
        exit();
    }
    
    // Contact Message
    if ($path === 'contact' && $method === 'POST') {
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        $subject = $input['subject'] ?? '';
        $message = $input['message'] ?? '';
        
        if (empty($name) || empty($email) || empty($message)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            exit();
        }
        
        $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $email, $phone, $subject, $message]);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        exit();
    }
    
    // Auth endpoints - return appropriate responses for static site
    if ($path === 'auth/login' && $method === 'POST') {
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Email and password are required']);
            exit();
        }

        // Check admin_users table
        $stmt = $pdo->prepare("SELECT id, email, password_hash, name, role FROM admin_users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password_hash'])) {
            // Login successful
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $admin['id'],
                    'email' => $admin['email'],
                    'name' => $admin['name'],
                    'role' => $admin['role']
                ]
            ]);
            exit();
        } else {
            // Invalid credentials
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
            exit();
        }
    }
    
    if ($path === 'auth/session' && $method === 'GET') {
        // No session on static site
        echo json_encode(['success' => false, 'user' => null]);
        exit();
    }
    
    // Default 404
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Endpoint not found', 'path' => $path]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error', 'message' => $e->getMessage()]);
}
?>

