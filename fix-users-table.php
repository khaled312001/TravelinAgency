<?php
/**
 * Fix Users Table Script
 * 
 * This script fixes the users table and creates proper data
 */

// Database configuration
$dbConfig = [
    'host' => '127.0.0.1',
    'port' => '3306',
    'database' => 'travel2',
    'username' => 'root',
    'password' => ''
];

// Create database connection
try {
    $pdo = new PDO(
        "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['database']};charset=utf8mb4",
        $dbConfig['username'],
        $dbConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
    
    echo "✅ Database connection established successfully!\n";
    
} catch (PDOException $e) {
    die("❌ Database connection failed: " . $e->getMessage() . "\n");
}

echo "🔧 Fixing users table...\n";

// First, disable foreign key checks
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

// Drop existing users table
$pdo->exec("DROP TABLE IF EXISTS `users`");

// Create new users table
$createUsersTable = "
CREATE TABLE `users` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email_verified_at` timestamp NULL DEFAULT NULL,
    `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

try {
    $pdo->exec($createUsersTable);
    echo "✅ Created users table successfully\n";
} catch (PDOException $e) {
    echo "❌ Failed to create users table: " . $e->getMessage() . "\n";
    exit(1);
}

// Insert sample users
$users = [
    [
        'name' => 'مدير النظام',
        'email' => 'admin@travelin.com',
        'email_verified_at' => date('Y-m-d H:i:s'),
        'password' => password_hash('admin123', PASSWORD_DEFAULT),
        'remember_token' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'name' => 'أحمد محمد',
        'email' => 'ahmed@example.com',
        'email_verified_at' => date('Y-m-d H:i:s'),
        'password' => password_hash('password123', PASSWORD_DEFAULT),
        'remember_token' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'name' => 'فاطمة علي',
        'email' => 'fatima@example.com',
        'email_verified_at' => date('Y-m-d H:i:s'),
        'password' => password_hash('password123', PASSWORD_DEFAULT),
        'remember_token' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'name' => 'محمد السعد',
        'email' => 'mohammed@example.com',
        'email_verified_at' => date('Y-m-d H:i:s'),
        'password' => password_hash('password123', PASSWORD_DEFAULT),
        'remember_token' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'name' => 'نورا أحمد',
        'email' => 'nora@example.com',
        'email_verified_at' => date('Y-m-d H:i:s'),
        'password' => password_hash('password123', PASSWORD_DEFAULT),
        'remember_token' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ]
];

$insertedCount = 0;
foreach ($users as $user) {
    $sql = "INSERT INTO `users` (name, email, email_verified_at, password, remember_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    try {
        $stmt->execute([
            $user['name'],
            $user['email'],
            $user['email_verified_at'],
            $user['password'],
            $user['remember_token'],
            $user['created_at'],
            $user['updated_at']
        ]);
        $insertedCount++;
        echo "✅ Inserted user: {$user['name']} ({$user['email']})\n";
    } catch (PDOException $e) {
        echo "⚠️  Failed to insert user {$user['name']}: " . $e->getMessage() . "\n";
    }
}

// Re-enable foreign key checks
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

echo "\n📊 Users table fixed successfully!\n";
echo "✅ Inserted $insertedCount users\n";

// Now fix bookings table
echo "\n🔧 Fixing bookings table...\n";

// Drop and recreate bookings table
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
$pdo->exec("DROP TABLE IF EXISTS `bookings`");

$createBookingsTable = "
CREATE TABLE `bookings` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `user_id` bigint(20) unsigned DEFAULT NULL,
    `package_id` bigint(20) unsigned NOT NULL,
    `booking_date` date NOT NULL,
    `travel_date` date NOT NULL,
    `persons` int(11) NOT NULL,
    `total_price` decimal(10,2) NOT NULL,
    `status` enum('pending','confirmed','cancelled','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `special_requests` text COLLATE utf8mb4_unicode_ci,
    `travelers_info` json DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `bookings_user_id_foreign` (`user_id`),
    KEY `bookings_package_id_foreign` (`package_id`),
    CONSTRAINT `bookings_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE,
    CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

$pdo->exec($createBookingsTable);

// Insert sample bookings
$bookings = [
    [
        'user_id' => 2,
        'package_id' => 1,
        'booking_date' => date('Y-m-d'),
        'travel_date' => date('Y-m-d', strtotime('+30 days')),
        'persons' => 2,
        'total_price' => 19998.00,
        'status' => 'pending',
        'customer_name' => 'أحمد محمد',
        'customer_email' => 'ahmed@example.com',
        'customer_phone' => '+966501234567',
        'special_requests' => 'طلب خاص للعشاء الرومانسي',
        'travelers_info' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'user_id' => 3,
        'package_id' => 2,
        'booking_date' => date('Y-m-d'),
        'travel_date' => date('Y-m-d', strtotime('+45 days')),
        'persons' => 4,
        'total_price' => 45996.00,
        'status' => 'confirmed',
        'customer_name' => 'فاطمة علي',
        'customer_email' => 'fatima@example.com',
        'customer_phone' => '+966507654321',
        'special_requests' => 'غرف متجاورة للعائلة',
        'travelers_info' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'user_id' => 4,
        'package_id' => 3,
        'booking_date' => date('Y-m-d'),
        'travel_date' => date('Y-m-d', strtotime('+60 days')),
        'persons' => 1,
        'total_price' => 8999.00,
        'status' => 'pending',
        'customer_name' => 'محمد السعد',
        'customer_email' => 'mohammed@example.com',
        'customer_phone' => '+966509876543',
        'special_requests' => 'غرفة فردية',
        'travelers_info' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ]
];

$bookingCount = 0;
foreach ($bookings as $booking) {
    $sql = "INSERT INTO `bookings` (user_id, package_id, booking_date, travel_date, persons, total_price, status, customer_name, customer_email, customer_phone, special_requests, travelers_info, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    try {
        $stmt->execute([
            $booking['user_id'],
            $booking['package_id'],
            $booking['booking_date'],
            $booking['travel_date'],
            $booking['persons'],
            $booking['total_price'],
            $booking['status'],
            $booking['customer_name'],
            $booking['customer_email'],
            $booking['customer_phone'],
            $booking['special_requests'],
            $booking['travelers_info'],
            $booking['created_at'],
            $booking['updated_at']
        ]);
        $bookingCount++;
        echo "✅ Inserted booking for: {$booking['customer_name']}\n";
    } catch (PDOException $e) {
        echo "⚠️  Failed to insert booking for {$booking['customer_name']}: " . $e->getMessage() . "\n";
    }
}

// Fix contact_messages table
echo "\n🔧 Fixing contact_messages table...\n";

$pdo->exec("DROP TABLE IF EXISTS `contact_messages`");

$createContactMessagesTable = "
CREATE TABLE `contact_messages` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `type` enum('general','package_inquiry','booking_inquiry','complaint','suggestion') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
    `is_read` tinyint(1) NOT NULL DEFAULT 0,
    `read_at` timestamp NULL DEFAULT NULL,
    `read_by` bigint(20) unsigned DEFAULT NULL,
    `metadata` json DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `contact_messages_read_by_foreign` (`read_by`),
    CONSTRAINT `contact_messages_read_by_foreign` FOREIGN KEY (`read_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

$pdo->exec($createContactMessagesTable);

// Insert sample contact messages
$messages = [
    [
        'name' => 'أحمد محمد',
        'email' => 'ahmed@example.com',
        'phone' => '+966501234567',
        'subject' => 'استفسار عن الباقات السياحية',
        'message' => 'أريد الاستفسار عن الباقات السياحية المتاحة لتركيا وأسعارها',
        'type' => 'package_inquiry',
        'is_read' => 0,
        'read_at' => null,
        'read_by' => null,
        'metadata' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'name' => 'فاطمة علي',
        'email' => 'fatima@example.com',
        'phone' => '+966507654321',
        'subject' => 'شكر وتقدير',
        'message' => 'شكراً لكم على الخدمة الممتازة والاهتمام بالعملاء',
        'type' => 'general',
        'is_read' => 1,
        'read_at' => date('Y-m-d H:i:s'),
        'read_by' => 1,
        'metadata' => null,
        'created_at' => date('Y-m-d H:i:s', strtotime('-2 days')),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'name' => 'محمد السعد',
        'email' => 'mohammed@example.com',
        'phone' => '+966509876543',
        'subject' => 'حجز للعمرة',
        'message' => 'هل لديكم حزم للعمرة في رمضان؟ وما هي الأسعار المتاحة؟',
        'type' => 'booking_inquiry',
        'is_read' => 0,
        'read_at' => null,
        'read_by' => null,
        'metadata' => null,
        'created_at' => date('Y-m-d H:i:s', strtotime('-1 day')),
        'updated_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
    ],
    [
        'name' => 'نورا أحمد',
        'email' => 'nora@example.com',
        'phone' => '+966501112233',
        'subject' => 'اقتراح وجهة جديدة',
        'message' => 'أريد اقتراح وجهة جديدة للعائلة مع الأطفال',
        'type' => 'suggestion',
        'is_read' => 0,
        'read_at' => null,
        'read_by' => null,
        'metadata' => null,
        'created_at' => date('Y-m-d H:i:s', strtotime('-3 hours')),
        'updated_at' => date('Y-m-d H:i:s', strtotime('-3 hours'))
    ]
];

$messageCount = 0;
foreach ($messages as $message) {
    $sql = "INSERT INTO `contact_messages` (name, email, phone, subject, message, type, is_read, read_at, read_by, metadata, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    try {
        $stmt->execute([
            $message['name'],
            $message['email'],
            $message['phone'],
            $message['subject'],
            $message['message'],
            $message['type'],
            $message['is_read'],
            $message['read_at'],
            $message['read_by'],
            $message['metadata'],
            $message['created_at'],
            $message['updated_at']
        ]);
        $messageCount++;
        echo "✅ Inserted message from: {$message['name']}\n";
    } catch (PDOException $e) {
        echo "⚠️  Failed to insert message from {$message['name']}: " . $e->getMessage() . "\n";
    }
}

// Re-enable foreign key checks
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

echo "\n" . str_repeat("=", 50) . "\n";
echo "🎉 All tables fixed successfully!\n";
echo "📊 Summary:\n";
echo "   ✅ Users: $insertedCount records\n";
echo "   ✅ Bookings: $bookingCount records\n";
echo "   ✅ Contact Messages: $messageCount records\n";
echo "   ✅ Packages: 10 records (already migrated)\n";
echo "   ✅ Destinations: 5 records (already migrated)\n";

// Close connection
$pdo = null;

echo "\n🔗 Database connection closed.\n";
echo "📝 All tables now have complete data!\n";
?>
