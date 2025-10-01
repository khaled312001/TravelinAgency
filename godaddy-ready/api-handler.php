<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ⚠️ تحديث بيانات قاعدة البيانات من cPanel
$host = 'localhost';
$dbname = 'YOUR_DATABASE_NAME';  // ⚠️ حدّث هذا
$username = 'YOUR_DATABASE_USER';  // ⚠️ حدّث هذا
$password = 'YOUR_DATABASE_PASSWORD';  // ⚠️ حدّث هذا

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// Get request path
$path = isset($_GET['path']) ? $_GET['path'] : (isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '');
$method = $_SERVER['REQUEST_METHOD'];

// Read JSON input for POST/PUT
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Router
if (strpos($path, 'packages') === 0) {
    if ($method === 'GET' && !strpos($path, '/')) {
        // GET /api/packages
        $stmt = $pdo->query("SELECT * FROM packages WHERE status = 'published' ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }
} elseif (strpos($path, 'public/navigation') === 0) {
    // Navigation API
    $stmt = $pdo->query("SELECT * FROM cms_navigation WHERE menu_name = 'main' AND is_active = 1 ORDER BY order_index");
    $navItems = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => ['menus' => ['main' => $navItems]]]);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Endpoint not found']);
}
?>
