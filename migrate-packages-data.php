<?php
/**
 * Package Data Migration Script
 * 
 * This script migrates package data from the extracted-packages.json file
 * to the Laravel database
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

/**
 * Create packages table if it doesn't exist
 */
function createPackagesTable($pdo) {
    $createTable = "
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
        $pdo->exec($createTable);
        echo "✅ Packages table created/verified\n";
        return true;
    } catch (PDOException $e) {
        echo "❌ Failed to create packages table: " . $e->getMessage() . "\n";
        return false;
    }
}

/**
 * Load packages data from JSON file
 */
function loadPackagesFromJson($filePath) {
    if (!file_exists($filePath)) {
        echo "❌ JSON file not found: $filePath\n";
        return [];
    }
    
    $jsonContent = file_get_contents($filePath);
    $packages = json_decode($jsonContent, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "❌ Invalid JSON file: " . json_last_error_msg() . "\n";
        return [];
    }
    
    echo "✅ Loaded " . count($packages) . " packages from JSON file\n";
    return $packages;
}

/**
 * Insert package data into database
 */
function insertPackage($pdo, $package) {
    $sql = "
    INSERT INTO `packages` (
        `title_ar`, `title_en`, `description_ar`, `description_en`, 
        `price`, `duration_days`, `image_url`, `travel_period`, 
        `max_persons`, `featured`, `active`, `destination`, 
        `category`, `views`, `created_at`, `updated_at`
    ) VALUES (
        :title_ar, :title_en, :description_ar, :description_en,
        :price, :duration_days, :image_url, :travel_period,
        :max_persons, :featured, :active, :destination,
        :category, :views, :created_at, :updated_at
    )";
    
    $stmt = $pdo->prepare($sql);
    
    // Extract duration from string (e.g., "7 days" -> 7)
    $duration = 7;
    if (isset($package['duration'])) {
        preg_match('/(\d+)/', $package['duration'], $matches);
        if ($matches) {
            $duration = (int)$matches[1];
        }
    }
    
    // Determine category based on destination
    $category = 'international';
    if (isset($package['destination'])) {
        $destination = strtolower($package['destination']);
        if (strpos($destination, 'saudi') !== false || 
            strpos($destination, 'الرياض') !== false || 
            strpos($destination, 'جدة') !== false) {
            $category = 'domestic';
        } elseif (strpos($destination, 'makkah') !== false || 
                  strpos($destination, 'madinah') !== false ||
                  strpos($destination, 'مكة') !== false || 
                  strpos($destination, 'المدينة') !== false) {
            $category = 'religious';
        }
    }
    
    $data = [
        'title_ar' => $package['title'] ?? null,
        'title_en' => $package['title'] ?? null,
        'description_ar' => $package['description'] ?? null,
        'description_en' => $package['description'] ?? null,
        'price' => $package['price'] ?? 0,
        'duration_days' => $duration,
        'image_url' => $package['image'] ?? null,
        'travel_period' => $package['destination'] ?? null,
        'max_persons' => 10,
        'featured' => $package['featured'] ?? 1,
        'active' => ($package['status'] ?? 'active') === 'active' ? 1 : 0,
        'destination' => $package['destination'] ?? null,
        'category' => $category,
        'views' => 0,
        'created_at' => $package['created_at'] ?? date('Y-m-d H:i:s'),
        'updated_at' => $package['updated_at'] ?? date('Y-m-d H:i:s')
    ];
    
    try {
        $stmt->execute($data);
        return $pdo->lastInsertId();
    } catch (PDOException $e) {
        echo "⚠️  Failed to insert package '{$package['title']}': " . $e->getMessage() . "\n";
        return false;
    }
}

/**
 * Main migration function
 */
function migratePackagesData($pdo) {
    echo "🚀 Starting package data migration...\n";
    echo "=" . str_repeat("=", 50) . "\n";
    
    // Create packages table
    if (!createPackagesTable($pdo)) {
        return false;
    }
    
    // Load packages from JSON
    $packages = loadPackagesFromJson('extracted-packages.json');
    if (empty($packages)) {
        echo "❌ No packages to migrate\n";
        return false;
    }
    
    // Clear existing packages (optional)
    echo "🗑️  Clearing existing packages...\n";
    $pdo->exec("DELETE FROM `packages`");
    
    // Insert packages
    $insertedCount = 0;
    $failedCount = 0;
    
    foreach ($packages as $package) {
        $id = insertPackage($pdo, $package);
        if ($id) {
            $insertedCount++;
            echo "✅ Inserted package: {$package['title']} (ID: $id)\n";
        } else {
            $failedCount++;
        }
    }
    
    echo "\n" . str_repeat("=", 50) . "\n";
    echo "📊 Migration Summary:\n";
    echo "   ✅ Successfully inserted: $insertedCount packages\n";
    echo "   ❌ Failed to insert: $failedCount packages\n";
    echo "   📦 Total packages processed: " . count($packages) . "\n";
    
    if ($insertedCount > 0) {
        echo "\n🎉 Package data migration completed successfully!\n";
        return true;
    } else {
        echo "\n❌ No packages were successfully migrated\n";
        return false;
    }
}

// Run the migration
migratePackagesData($pdo);

// Close connection
$pdo = null;

echo "\n🔗 Database connection closed.\n";
echo "📝 Next steps:\n";
echo "   1. Run the main migration script: php migrate-to-laravel.php\n";
echo "   2. Test your Laravel application\n";
?>
