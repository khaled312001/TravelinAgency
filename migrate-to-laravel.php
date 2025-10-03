<?php
/**
 * Database Migration Script: Vue Project to Laravel Project
 * 
 * This script migrates all data from the Vue project database to the Laravel project database
 * 
 * Source Database: travel2 (Vue project)
 * Target Database: travel2 (Laravel project)
 * 
 * Usage: php migrate-to-laravel.php
 */

// Database configurations
$sourceConfig = [
    'host' => '127.0.0.1',
    'port' => '3306',
    'database' => 'travel2',
    'username' => 'root',
    'password' => ''
];

$targetConfig = [
    'host' => '127.0.0.1',
    'port' => '3306',
    'database' => 'travel2',
    'username' => 'root',
    'password' => ''
];

// Create database connections
try {
    $sourcePdo = new PDO(
        "mysql:host={$sourceConfig['host']};port={$sourceConfig['port']};dbname={$sourceConfig['database']};charset=utf8mb4",
        $sourceConfig['username'],
        $sourceConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
    
    $targetPdo = new PDO(
        "mysql:host={$targetConfig['host']};port={$targetConfig['port']};dbname={$targetConfig['database']};charset=utf8mb4",
        $targetConfig['username'],
        $targetConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
    
    echo "✅ Database connections established successfully!\n";
    
} catch (PDOException $e) {
    die("❌ Database connection failed: " . $e->getMessage() . "\n");
}

/**
 * Get all tables from source database
 */
function getSourceTables($pdo) {
    $stmt = $pdo->query("SHOW TABLES");
    $tables = [];
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $tables[] = $row[0];
    }
    return $tables;
}

/**
 * Get table structure
 */
function getTableStructure($pdo, $tableName) {
    $stmt = $pdo->query("DESCRIBE `$tableName`");
    return $stmt->fetchAll();
}

/**
 * Get all data from a table
 */
function getTableData($pdo, $tableName) {
    $stmt = $pdo->query("SELECT * FROM `$tableName`");
    return $stmt->fetchAll();
}

/**
 * Check if table exists in target database
 */
function tableExists($pdo, $tableName) {
    $stmt = $pdo->query("SHOW TABLES LIKE '$tableName'");
    return $stmt->rowCount() > 0;
}

/**
 * Create table in target database based on source structure
 */
function createTableInTarget($sourcePdo, $targetPdo, $tableName) {
    // Get CREATE TABLE statement from source
    $stmt = $sourcePdo->query("SHOW CREATE TABLE `$tableName`");
    $createTable = $stmt->fetch();
    $createStatement = $createTable['Create Table'];
    
    // Modify the statement to be compatible with Laravel
    $createStatement = str_replace('AUTO_INCREMENT', 'AUTO_INCREMENT', $createStatement);
    
    try {
        $targetPdo->exec("DROP TABLE IF EXISTS `$tableName`");
        $targetPdo->exec($createStatement);
        echo "✅ Created table: $tableName\n";
        return true;
    } catch (PDOException $e) {
        echo "❌ Failed to create table $tableName: " . $e->getMessage() . "\n";
        return false;
    }
}

/**
 * Insert data into target table
 */
function insertDataIntoTable($targetPdo, $tableName, $data) {
    if (empty($data)) {
        echo "ℹ️  No data to insert for table: $tableName\n";
        return 0;
    }
    
    // Get column names from first row
    $columns = array_keys($data[0]);
    $columnList = '`' . implode('`, `', $columns) . '`';
    $placeholders = ':' . implode(', :', $columns);
    
    $sql = "INSERT INTO `$tableName` ($columnList) VALUES ($placeholders)";
    $stmt = $targetPdo->prepare($sql);
    
    $insertedCount = 0;
    foreach ($data as $row) {
        try {
            $stmt->execute($row);
            $insertedCount++;
        } catch (PDOException $e) {
            echo "⚠️  Failed to insert row in $tableName: " . $e->getMessage() . "\n";
        }
    }
    
    echo "✅ Inserted $insertedCount records into $tableName\n";
    return $insertedCount;
}

/**
 * Migrate specific tables with Laravel-compatible structure
 */
function migratePackagesTable($sourcePdo, $targetPdo) {
    echo "\n🔄 Migrating packages table...\n";
    
    // Create Laravel-compatible packages table
    $createPackagesTable = "
    CREATE TABLE IF NOT EXISTS `packages` (
        `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        `title_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        `title_en` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        `description_ar` text COLLATE utf8mb4_unicode_ci,
        `description_en` text COLLATE utf8mb4_unicode_ci,
        `price` decimal(10,2) NOT NULL,
        `duration_days` int(11) NOT NULL DEFAULT 7,
        `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        `travel_period` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        `max_persons` int(11) NOT NULL DEFAULT 10,
        `featured` tinyint(1) NOT NULL DEFAULT 0,
        `active` tinyint(1) NOT NULL DEFAULT 1,
        `gallery` json DEFAULT NULL,
        `included_services` json DEFAULT NULL,
        `excluded_services` json DEFAULT NULL,
        `destination` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        `views` int(11) NOT NULL DEFAULT 0,
        `created_at` timestamp NULL DEFAULT NULL,
        `updated_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    try {
        $targetPdo->exec("DROP TABLE IF EXISTS `packages`");
        $targetPdo->exec($createPackagesTable);
        echo "✅ Created Laravel-compatible packages table\n";
    } catch (PDOException $e) {
        echo "❌ Failed to create packages table: " . $e->getMessage() . "\n";
        return false;
    }
    
    // Get data from source
    $sourceData = getTableData($sourcePdo, 'packages');
    
    if (empty($sourceData)) {
        echo "ℹ️  No packages data found in source database\n";
        return true;
    }
    
    // Transform data for Laravel structure
    $transformedData = [];
    foreach ($sourceData as $row) {
        $transformedRow = [
            'title_ar' => $row['title_ar'] ?? $row['title'] ?? null,
            'title_en' => $row['title_en'] ?? $row['title'] ?? null,
            'description_ar' => $row['description_ar'] ?? $row['description'] ?? null,
            'description_en' => $row['description_en'] ?? $row['description'] ?? null,
            'price' => $row['price'] ?? 0,
            'duration_days' => $row['duration_days'] ?? 7,
            'image_url' => $row['image_url'] ?? $row['image'] ?? null,
            'travel_period' => $row['travel_period'] ?? $row['destination'] ?? null,
            'max_persons' => $row['max_persons'] ?? 10,
            'featured' => $row['featured'] ?? ($row['status'] === 'active' ? 1 : 0),
            'active' => $row['active'] ?? ($row['status'] === 'active' ? 1 : 0),
            'destination' => $row['destination'] ?? null,
            'category' => $row['category'] ?? 'international',
            'views' => $row['views'] ?? 0,
            'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? date('Y-m-d H:i:s')
        ];
        $transformedData[] = $transformedRow;
    }
    
    return insertDataIntoTable($targetPdo, 'packages', $transformedData);
}

/**
 * Migrate users table
 */
function migrateUsersTable($sourcePdo, $targetPdo) {
    echo "\n🔄 Migrating users table...\n";
    
    // Create Laravel-compatible users table
    $createUsersTable = "
    CREATE TABLE IF NOT EXISTS `users` (
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
        $targetPdo->exec("DROP TABLE IF EXISTS `users`");
        $targetPdo->exec($createUsersTable);
        echo "✅ Created Laravel-compatible users table\n";
    } catch (PDOException $e) {
        echo "❌ Failed to create users table: " . $e->getMessage() . "\n";
        return false;
    }
    
    // Get data from source
    $sourceData = getTableData($sourcePdo, 'users');
    
    if (empty($sourceData)) {
        echo "ℹ️  No users data found in source database\n";
        return true;
    }
    
    // Transform data for Laravel structure
    $transformedData = [];
    foreach ($sourceData as $row) {
        $transformedRow = [
            'name' => $row['full_name'] ?? $row['username'] ?? $row['name'] ?? 'User',
            'email' => $row['email'] ?? 'user@example.com',
            'email_verified_at' => $row['email_verified_at'] ?? null,
            'password' => $row['password_hash'] ?? $row['password'] ?? password_hash('password', PASSWORD_DEFAULT),
            'remember_token' => null,
            'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? date('Y-m-d H:i:s')
        ];
        $transformedData[] = $transformedRow;
    }
    
    return insertDataIntoTable($targetPdo, 'users', $transformedData);
}

/**
 * Migrate bookings table
 */
function migrateBookingsTable($sourcePdo, $targetPdo) {
    echo "\n🔄 Migrating bookings table...\n";
    
    // Create Laravel-compatible bookings table
    $createBookingsTable = "
    CREATE TABLE IF NOT EXISTS `bookings` (
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
    
    try {
        $targetPdo->exec("DROP TABLE IF EXISTS `bookings`");
        $targetPdo->exec($createBookingsTable);
        echo "✅ Created Laravel-compatible bookings table\n";
    } catch (PDOException $e) {
        echo "❌ Failed to create bookings table: " . $e->getMessage() . "\n";
        return false;
    }
    
    // Get data from source
    $sourceData = getTableData($sourcePdo, 'bookings');
    
    if (empty($sourceData)) {
        echo "ℹ️  No bookings data found in source database\n";
        return true;
    }
    
    // Transform data for Laravel structure
    $transformedData = [];
    foreach ($sourceData as $row) {
        $transformedRow = [
            'user_id' => $row['user_id'] ?? null,
            'package_id' => $row['package_id'] ?? 1,
            'booking_date' => $row['booking_date'] ?? date('Y-m-d'),
            'travel_date' => $row['travel_date'] ?? date('Y-m-d', strtotime('+30 days')),
            'persons' => $row['persons'] ?? 1,
            'total_price' => $row['total_price'] ?? 0,
            'status' => $row['status'] ?? 'pending',
            'customer_name' => $row['customer_name'] ?? 'Customer',
            'customer_email' => $row['customer_email'] ?? 'customer@example.com',
            'customer_phone' => $row['customer_phone'] ?? '+966501234567',
            'special_requests' => $row['special_requests'] ?? null,
            'travelers_info' => null,
            'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? date('Y-m-d H:i:s')
        ];
        $transformedData[] = $transformedRow;
    }
    
    return insertDataIntoTable($targetPdo, 'bookings', $transformedData);
}

/**
 * Migrate contact_messages table
 */
function migrateContactMessagesTable($sourcePdo, $targetPdo) {
    echo "\n🔄 Migrating contact_messages table...\n";
    
    // Create Laravel-compatible contact_messages table
    $createContactMessagesTable = "
    CREATE TABLE IF NOT EXISTS `contact_messages` (
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
    
    try {
        $targetPdo->exec("DROP TABLE IF EXISTS `contact_messages`");
        $targetPdo->exec($createContactMessagesTable);
        echo "✅ Created Laravel-compatible contact_messages table\n";
    } catch (PDOException $e) {
        echo "❌ Failed to create contact_messages table: " . $e->getMessage() . "\n";
        return false;
    }
    
    // Get data from source
    $sourceData = getTableData($sourcePdo, 'contact_messages');
    
    if (empty($sourceData)) {
        echo "ℹ️  No contact_messages data found in source database\n";
        return true;
    }
    
    // Transform data for Laravel structure
    $transformedData = [];
    foreach ($sourceData as $row) {
        $transformedRow = [
            'name' => $row['name'] ?? 'Anonymous',
            'email' => $row['email'] ?? 'anonymous@example.com',
            'phone' => $row['phone'] ?? null,
            'subject' => $row['subject'] ?? 'General Inquiry',
            'message' => $row['message'] ?? '',
            'type' => $row['type'] ?? 'general',
            'is_read' => $row['is_read'] ?? 0,
            'read_at' => $row['read_at'] ?? null,
            'read_by' => $row['read_by'] ?? null,
            'metadata' => null,
            'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? date('Y-m-d H:i:s')
        ];
        $transformedData[] = $transformedRow;
    }
    
    return insertDataIntoTable($targetPdo, 'contact_messages', $transformedData);
}

/**
 * Migrate other tables
 */
function migrateOtherTables($sourcePdo, $targetPdo) {
    echo "\n🔄 Migrating other tables...\n";
    
    $sourceTables = getSourceTables($sourcePdo);
    $excludedTables = ['packages', 'users', 'bookings', 'contact_messages', 'migrations'];
    
    foreach ($sourceTables as $tableName) {
        if (in_array($tableName, $excludedTables)) {
            continue;
        }
        
        echo "\n📋 Processing table: $tableName\n";
        
        // Create table in target
        if (createTableInTarget($sourcePdo, $targetPdo, $tableName)) {
            // Get and insert data
            $data = getTableData($sourcePdo, $tableName);
            insertDataIntoTable($targetPdo, $tableName, $data);
        }
    }
}

/**
 * Main migration function
 */
function runMigration($sourcePdo, $targetPdo) {
    echo "🚀 Starting database migration from Vue project to Laravel project...\n";
    echo "=" . str_repeat("=", 60) . "\n";
    
    $totalRecords = 0;
    
    // Migrate core tables with Laravel-compatible structure
    $totalRecords += migratePackagesTable($sourcePdo, $targetPdo);
    $totalRecords += migrateUsersTable($sourcePdo, $targetPdo);
    $totalRecords += migrateBookingsTable($sourcePdo, $targetPdo);
    $totalRecords += migrateContactMessagesTable($sourcePdo, $targetPdo);
    
    // Migrate other tables
    migrateOtherTables($sourcePdo, $targetPdo);
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "✅ Migration completed successfully!\n";
    echo "📊 Total records migrated: $totalRecords\n";
    echo "🎉 Your Laravel project database is now ready!\n";
}

// Run the migration
runMigration($sourcePdo, $targetPdo);

// Close connections
$sourcePdo = null;
$targetPdo = null;

echo "\n🔗 Database connections closed.\n";
echo "📝 Next steps:\n";
echo "   1. Update your Laravel .env file with the correct database settings\n";
echo "   2. Run: php artisan migrate (to ensure all Laravel migrations are applied)\n";
echo "   3. Run: php artisan db:seed (to seed any additional data)\n";
echo "   4. Test your Laravel application\n";
?>
