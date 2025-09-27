<?php
// Script to create the enhanced API handler directly on the server
$apiHandlerContent = '<?php
// Enhanced API handler with all missing endpoints
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Get the request URI
$requestUri = $_SERVER["REQUEST_URI"];
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove /api/ prefix
$path = str_replace("/api/", "", $path);

// Simple routing
switch ($path) {
    case "test":
        echo json_encode([
            "status" => "success",
            "message" => "API is working!",
            "time" => date("Y-m-d H:i:s"),
            "php_version" => phpversion()
        ]);
        break;
        
    case "packages":
        try {
            $pdo = new PDO("mysql:host=localhost;dbname=travel", "travel", "support@Passord123");
            $stmt = $pdo->query("SELECT * FROM packages LIMIT 10");
            $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                "status" => "success",
                "data" => $packages,
                "count" => count($packages)
            ]);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Database error: " . $e->getMessage()
            ]);
        }
        break;
        
    case "destinations":
        try {
            $pdo = new PDO("mysql:host=localhost;dbname=travel", "travel", "support@Passord123");
            $stmt = $pdo->query("SELECT * FROM destinations LIMIT 10");
            $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                "status" => "success",
                "data" => $destinations,
                "count" => count($destinations)
            ]);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Database error: " . $e->getMessage()
            ]);
        }
        break;
        
    case "cms/site-settings":
        // Handle the missing CMS endpoint
        $query = $_GET["public_only"] ?? false;
        
        if ($query === "true") {
            echo json_encode([
                "status" => "success",
                "data" => [
                    "site_name" => "World Trip Agency",
                    "site_description" => "Your trusted travel partner",
                    "contact_email" => "info@worldtripagency.com",
                    "contact_phone" => "+966 50 123 4567",
                    "social_media" => [
                        "facebook" => "https://facebook.com/worldtripagency",
                        "instagram" => "https://instagram.com/worldtripagency",
                        "twitter" => "https://twitter.com/worldtripagency"
                    ],
                    "hero_title" => "Discover Amazing Destinations",
                    "hero_subtitle" => "Plan your perfect trip with our expert travel services",
                    "featured_destinations" => ["Paris", "London", "Tokyo", "Dubai"],
                    "testimonials" => [
                        [
                            "name" => "Ahmed Al-Rashid",
                            "text" => "Amazing service! They made our honeymoon perfect.",
                            "rating" => 5
                        ],
                        [
                            "name" => "Sarah Johnson",
                            "text" => "Professional and reliable. Highly recommended!",
                            "rating" => 5
                        ]
                    ]
                ]
            ]);
        } else {
            echo json_encode([
                "status" => "success",
                "data" => [
                    "site_name" => "World Trip Agency",
                    "site_description" => "Your trusted travel partner",
                    "contact_email" => "info@worldtripagency.com",
                    "contact_phone" => "+966 50 123 4567"
                ]
            ]);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "API endpoint not found",
            "path" => $path,
            "available_endpoints" => [
                "test",
                "packages",
                "destinations",
                "cms/site-settings"
            ]
        ]);
        break;
}
?>';

// Create the enhanced API handler
if (file_put_contents('api-handler-enhanced.php', $apiHandlerContent)) {
    echo "<h1>✅ API Handler Created Successfully!</h1>";
    echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .info{color:blue;}</style>";
    echo "<div class='success'>✅ api-handler-enhanced.php created successfully!</div>";
    echo "<div class='info'>📋 Next steps:</div>";
    echo "<ol>";
    echo "<li>Backup current API handler: <code>mv api-handler.php api-handler-old.php</code></li>";
    echo "<li>Use the enhanced version: <code>mv api-handler-enhanced.php api-handler.php</code></li>";
    echo "<li>Set permissions: <code>chmod 644 api-handler.php</code></li>";
    echo "<li>Test the API: <a href='/api/test' target='_blank'>/api/test</a></li>";
    echo "<li>Test CMS settings: <a href='/api/cms/site-settings?public_only=true' target='_blank'>/api/cms/site-settings</a></li>";
    echo "</ol>";
} else {
    echo "<h1>❌ Error Creating API Handler</h1>";
    echo "<div style='color:red;'>Failed to create api-handler-enhanced.php</div>";
}
?>
