<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Database configuration
$host = "localhost";
$dbname = "travel";
$username = "travel";
$password = "support@Passord123";

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// Get request URI
$requestUri = $_SERVER["REQUEST_URI"];
$cleanUri = parse_url($requestUri, PHP_URL_PATH);

// Route handling
switch ($cleanUri) {
    case "/api/test":
        echo json_encode(["status" => "working", "database" => "connected"]);
        break;
        
    case "/api/packages":
        try {
            // Use the correct column names from your database
            $stmt = $pdo->query("SELECT id, title_ar, title_en, description_ar, description_en, price, duration_days, travel_period, max_persons, category, active, featured, image_url, features, itinerary, included, excluded, created_at, updated_at FROM packages WHERE active = 1 ORDER BY id DESC");
            $packages = $stmt->fetchAll();
            
            // Transform the data to match frontend expectations
            $transformedPackages = [];
            foreach ($packages as $package) {
                $transformedPackages[] = [
                    'id' => $package['id'],
                    'title' => $package['title_en'], // Use English title as default
                    'title_ar' => $package['title_ar'],
                    'title_en' => $package['title_en'],
                    'description' => $package['description_en'], // Use English description as default
                    'description_ar' => $package['description_ar'],
                    'description_en' => $package['description_en'],
                    'price' => $package['price'],
                    'duration_days' => $package['duration_days'],
                    'travel_period' => $package['travel_period'],
                    'max_persons' => $package['max_persons'],
                    'category' => $package['category'],
                    'active' => $package['active'],
                    'featured' => $package['featured'],
                    'image_url' => $package['image_url'],
                    'features' => json_decode($package['features'] ?? '[]', true),
                    'itinerary' => json_decode($package['itinerary'] ?? '[]', true),
                    'included' => json_decode($package['included'] ?? '[]', true),
                    'excluded' => json_decode($package['excluded'] ?? '[]', true),
                    'created_at' => $package['created_at'],
                    'updated_at' => $package['updated_at']
                ];
            }
            
            echo json_encode($transformedPackages, JSON_UNESCAPED_SLASHES);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch packages: " . $e->getMessage()]);
        }
        break;
        
    case "/api/destinations":
        try {
            // Check if destinations table exists and has data
            $stmt = $pdo->query("SHOW TABLES LIKE 'destinations'");
            if ($stmt->rowCount() > 0) {
                // Try to get destinations with flexible column names
                $stmt = $pdo->query("DESCRIBE destinations");
                $columns = $stmt->fetchAll();
                $columnNames = array_column($columns, 'Field');
                
                // Build SELECT query based on available columns
                $selectFields = [];
                if (in_array('id', $columnNames)) $selectFields[] = 'id';
                if (in_array('name', $columnNames)) $selectFields[] = 'name';
                if (in_array('name_ar', $columnNames)) $selectFields[] = 'name_ar';
                if (in_array('name_en', $columnNames)) $selectFields[] = 'name_en';
                if (in_array('description', $columnNames)) $selectFields[] = 'description';
                if (in_array('description_ar', $columnNames)) $selectFields[] = 'description_ar';
                if (in_array('description_en', $columnNames)) $selectFields[] = 'description_en';
                if (in_array('image_url', $columnNames)) $selectFields[] = 'image_url';
                if (in_array('country', $columnNames)) $selectFields[] = 'country';
                if (in_array('active', $columnNames)) $selectFields[] = 'active';
                if (in_array('featured', $columnNames)) $selectFields[] = 'featured';
                if (in_array('created_at', $columnNames)) $selectFields[] = 'created_at';
                if (in_array('updated_at', $columnNames)) $selectFields[] = 'updated_at';
                
                if (empty($selectFields)) {
                    $selectFields = ['*'];
                }
                
                $query = "SELECT " . implode(', ', $selectFields) . " FROM destinations";
                if (in_array('active', $columnNames)) {
                    $query .= " WHERE active = 1";
                }
                $query .= " ORDER BY id DESC";
                
                $stmt = $pdo->query($query);
                $destinations = $stmt->fetchAll();
                
                // Transform destinations data
                $transformedDestinations = [];
                foreach ($destinations as $destination) {
                    $transformedDest = [
                        'id' => $destination['id'] ?? null,
                        'name' => $destination['name'] ?? $destination['name_en'] ?? 'Unknown Destination',
                        'name_ar' => $destination['name_ar'] ?? $destination['name'] ?? 'وجهة غير معروفة',
                        'name_en' => $destination['name_en'] ?? $destination['name'] ?? 'Unknown Destination',
                        'description' => $destination['description'] ?? $destination['description_en'] ?? '',
                        'description_ar' => $destination['description_ar'] ?? $destination['description'] ?? '',
                        'description_en' => $destination['description_en'] ?? $destination['description'] ?? '',
                        'image_url' => $destination['image_url'] ?? '',
                        'country' => $destination['country'] ?? '',
                        'active' => $destination['active'] ?? 1,
                        'featured' => $destination['featured'] ?? 0,
                        'created_at' => $destination['created_at'] ?? null,
                        'updated_at' => $destination['updated_at'] ?? null
                    ];
                    $transformedDestinations[] = $transformedDest;
                }
                
                echo json_encode($transformedDestinations, JSON_UNESCAPED_SLASHES);
            } else {
                // If destinations table doesn't exist, return sample data
                $sampleDestinations = [
                    [
                        'id' => '1',
                        'name' => 'Paris',
                        'name_ar' => 'باريس',
                        'name_en' => 'Paris',
                        'description' => 'The City of Light and romance',
                        'description_ar' => 'مدينة النور والرومانسية',
                        'description_en' => 'The City of Light and romance',
                        'image_url' => '/images/destinations/paris.jpg',
                        'country' => 'France',
                        'active' => 1,
                        'featured' => 1,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ],
                    [
                        'id' => '2',
                        'name' => 'Tokyo',
                        'name_ar' => 'طوكيو',
                        'name_en' => 'Tokyo',
                        'description' => 'Modern metropolis with ancient traditions',
                        'description_ar' => 'مدينة حديثة مع تقاليد قديمة',
                        'description_en' => 'Modern metropolis with ancient traditions',
                        'image_url' => '/images/destinations/tokyo.jpg',
                        'country' => 'Japan',
                        'active' => 1,
                        'featured' => 1,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ]
                ];
                echo json_encode($sampleDestinations, JSON_UNESCAPED_SLASHES);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch destinations: " . $e->getMessage()]);
        }
        break;
        
    case "/api/auth/login":
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $input = json_decode(file_get_contents("php://input"), true);
            $email = $input["email"] ?? "";
            $password = $input["password"] ?? "";
            
            // Check hardcoded admin credentials
            if ($email === "admin@wonderland.com" && $password === "admin123") {
                $token = base64_encode(json_encode([
                    "email" => $email,
                    "exp" => time() + 3600
                ]));
                
                // Return the proper response structure with user data
                $response = [
                    "success" => true,
                    "data" => [
                        "user" => [
                            "id" => "39529ff4-9888-11f0-bbdc-106530eb27a7",
                            "email" => "admin@wonderland.com",
                            "full_name" => "System Administrator",
                            "phone" => "+966501234567",
                            "role" => "super_admin",
                            "permissions" => [
                                "users.create" => true,
                                "users.read" => true,
                                "users.update" => true,
                                "users.delete" => true,
                                "packages.create" => true,
                                "packages.read" => true,
                                "packages.update" => true,
                                "packages.delete" => true,
                                "destinations.create" => true,
                                "destinations.read" => true,
                                "destinations.update" => true,
                                "destinations.delete" => true,
                                "bookings.create" => true,
                                "bookings.read" => true,
                                "bookings.update" => true,
                                "bookings.delete" => true,
                                "content.create" => true,
                                "content.read" => true,
                                "content.update" => true,
                                "content.delete" => true,
                                "settings.read" => true,
                                "settings.update" => true,
                                "analytics.read" => true,
                                "reports.read" => true
                            ],
                            "status" => "active"
                        ],
                        "token" => $token
                    ]
                ];
                echo json_encode($response);
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Invalid credentials"]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;
        
    case "/api/contact-messages":
        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            try {
                // Check if contact_messages table exists
                $stmt = $pdo->query("SHOW TABLES LIKE 'contact_messages'");
                if ($stmt->rowCount() > 0) {
                    $stmt = $pdo->query("SELECT id, name, email, phone, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC");
                    $messages = $stmt->fetchAll();
                    echo json_encode($messages, JSON_UNESCAPED_SLASHES);
                } else {
                    // Return sample data if table doesn't exist
                    $sampleMessages = [
                        [
                            "id" => 1,
                            "name" => "أحمد محمد",
                            "email" => "ahmed@example.com",
                            "phone" => "+966501234567",
                            "subject" => "استفسار عن رحلة إلى باريس",
                            "message" => "أرغب في معرفة تفاصيل الرحلة إلى باريس",
                            "status" => "new",
                            "created_at" => date('Y-m-d H:i:s')
                        ],
                        [
                            "id" => 2,
                            "name" => "فاطمة علي",
                            "email" => "fatima@example.com",
                            "phone" => "+966507654321",
                            "subject" => "حجز رحلة عائلية",
                            "message" => "نريد حجز رحلة عائلية لـ 4 أشخاص",
                            "status" => "read",
                            "created_at" => date('Y-m-d H:i:s', strtotime('-1 day'))
                        ]
                    ];
                    echo json_encode($sampleMessages, JSON_UNESCAPED_SLASHES);
                }
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to fetch contact messages: " . $e->getMessage()]);
            }
        } elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
            try {
                $input = json_decode(file_get_contents("php://input"), true);
                $name = $input["name"] ?? "";
                $email = $input["email"] ?? "";
                $phone = $input["phone"] ?? "";
                $subject = $input["subject"] ?? "";
                $message = $input["message"] ?? "";
                
                // Check if contact_messages table exists, create if not
                $stmt = $pdo->query("SHOW TABLES LIKE 'contact_messages'");
                if ($stmt->rowCount() == 0) {
                    $pdo->exec("CREATE TABLE contact_messages (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        phone VARCHAR(50),
                        subject VARCHAR(255),
                        message TEXT NOT NULL,
                        status ENUM('new', 'read', 'replied') DEFAULT 'new',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )");
                }
                
                $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$name, $email, $phone, $subject, $message]);
                
                echo json_encode(["success" => true, "message" => "Message sent successfully"]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to send message: " . $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;
        
    case "/api/seo":
        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            try {
                // Check if seo_settings table exists
                $stmt = $pdo->query("SHOW TABLES LIKE 'seo_settings'");
                if ($stmt->rowCount() > 0) {
                    $stmt = $pdo->query("SELECT * FROM seo_settings LIMIT 1");
                    $seo = $stmt->fetch();
                    echo json_encode($seo ?: [], JSON_UNESCAPED_SLASHES);
                } else {
                    // Return default SEO settings
                    $defaultSeo = [
                        "site_title" => "World Trip Agency - وكالة السفر العالمية",
                        "site_description" => "أفضل وكالة سفر في المملكة العربية السعودية - رحلات عالمية بأسعار مميزة",
                        "site_keywords" => "سفر, رحلات, وكالة سفر, سياحة, باريس, طوكيو, دبي",
                        "og_title" => "World Trip Agency - وكالة السفر العالمية",
                        "og_description" => "اكتشف أفضل الوجهات السياحية حول العالم مع عروض حصرية",
                        "og_image" => "/images/og-image.jpg",
                        "twitter_card" => "summary_large_image",
                        "robots" => "index, follow",
                        "canonical_url" => "https://worldtripagency.com"
                    ];
                    echo json_encode($defaultSeo, JSON_UNESCAPED_SLASHES);
                }
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to fetch SEO settings: " . $e->getMessage()]);
            }
        } elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
            try {
                $input = json_decode(file_get_contents("php://input"), true);
                
                // Check if seo_settings table exists, create if not
                $stmt = $pdo->query("SHOW TABLES LIKE 'seo_settings'");
                if ($stmt->rowCount() == 0) {
                    $pdo->exec("CREATE TABLE seo_settings (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        site_title VARCHAR(255),
                        site_description TEXT,
                        site_keywords TEXT,
                        og_title VARCHAR(255),
                        og_description TEXT,
                        og_image VARCHAR(255),
                        twitter_card VARCHAR(50),
                        robots VARCHAR(100),
                        canonical_url VARCHAR(255),
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )");
                }
                
                // Update or insert SEO settings
                $stmt = $pdo->prepare("INSERT INTO seo_settings (site_title, site_description, site_keywords, og_title, og_description, og_image, twitter_card, robots, canonical_url) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
                                     ON DUPLICATE KEY UPDATE 
                                     site_title = VALUES(site_title),
                                     site_description = VALUES(site_description),
                                     site_keywords = VALUES(site_keywords),
                                     og_title = VALUES(og_title),
                                     og_description = VALUES(og_description),
                                     og_image = VALUES(og_image),
                                     twitter_card = VALUES(twitter_card),
                                     robots = VALUES(robots),
                                     canonical_url = VALUES(canonical_url)");
                
                $stmt->execute([
                    $input["site_title"] ?? "",
                    $input["site_description"] ?? "",
                    $input["site_keywords"] ?? "",
                    $input["og_title"] ?? "",
                    $input["og_description"] ?? "",
                    $input["og_image"] ?? "",
                    $input["twitter_card"] ?? "",
                    $input["robots"] ?? "",
                    $input["canonical_url"] ?? ""
                ]);
                
                echo json_encode(["success" => true, "message" => "SEO settings updated successfully"]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update SEO settings: " . $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;
        
    case "/api/admin/stats":
        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            try {
                $stats = [];
                
                // Get packages count
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM packages WHERE active = 1");
                    $result = $stmt->fetch();
                    $stats["packages_count"] = $result["count"] ?? 0;
                } catch (Exception $e) {
                    $stats["packages_count"] = 0;
                }
                
                // Get destinations count
                try {
                    $stmt = $pdo->query("SHOW TABLES LIKE 'destinations'");
                    if ($stmt->rowCount() > 0) {
                        $stmt = $pdo->query("SELECT COUNT(*) as count FROM destinations WHERE active = 1");
                        $result = $stmt->fetch();
                        $stats["destinations_count"] = $result["count"] ?? 0;
                    } else {
                        $stats["destinations_count"] = 2; // Sample data count
                    }
                } catch (Exception $e) {
                    $stats["destinations_count"] = 0;
                }
                
                // Get contact messages count
                try {
                    $stmt = $pdo->query("SHOW TABLES LIKE 'contact_messages'");
                    if ($stmt->rowCount() > 0) {
                        $stmt = $pdo->query("SELECT COUNT(*) as count FROM contact_messages");
                        $result = $stmt->fetch();
                        $stats["messages_count"] = $result["count"] ?? 0;
                        
                        // Get new messages count
                        $stmt = $pdo->query("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'");
                        $result = $stmt->fetch();
                        $stats["new_messages_count"] = $result["count"] ?? 0;
                    } else {
                        $stats["messages_count"] = 2; // Sample data count
                        $stats["new_messages_count"] = 1;
                    }
                } catch (Exception $e) {
                    $stats["messages_count"] = 0;
                    $stats["new_messages_count"] = 0;
                }
                
                // Get bookings count (if table exists)
                try {
                    $stmt = $pdo->query("SHOW TABLES LIKE 'bookings'");
                    if ($stmt->rowCount() > 0) {
                        $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings");
                        $result = $stmt->fetch();
                        $stats["bookings_count"] = $result["count"] ?? 0;
                    } else {
                        $stats["bookings_count"] = 0;
                    }
                } catch (Exception $e) {
                    $stats["bookings_count"] = 0;
                }
                
                // Get users count
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users WHERE status = 'active'");
                    $result = $stmt->fetch();
                    $stats["users_count"] = $result["count"] ?? 0;
                } catch (Exception $e) {
                    $stats["users_count"] = 0;
                }
                
                // Get recent activity (last 7 days)
                $stats["recent_activity"] = [
                    "packages_added" => 0,
                    "messages_received" => 0,
                    "bookings_made" => 0
                ];
                
                // Add timestamp
                $stats["generated_at"] = date('Y-m-d H:i:s');
                
                echo json_encode($stats, JSON_UNESCAPED_SLASHES);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to fetch admin stats: " . $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
        break;
}
?>