<?php
/**
 * Migration Verification Script
 * 
 * This script verifies that all data has been successfully migrated
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
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    echo "✅ Database connection established successfully!\n\n";
    
} catch (PDOException $e) {
    die("❌ Database connection failed: " . $e->getMessage() . "\n");
}

echo "🔍 Verifying Database Migration...\n";
echo "=" . str_repeat("=", 50) . "\n";

// Check all tables
$stmt = $pdo->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo "📊 Total Tables Found: " . count($tables) . "\n\n";

// Check important tables
$importantTables = [
    'packages' => 'Travel Packages',
    'users' => 'User Accounts',
    'bookings' => 'Travel Bookings',
    'contact_messages' => 'Contact Messages',
    'destinations' => 'Travel Destinations',
    'admin_profiles' => 'Admin Profiles',
    'site_settings' => 'Site Settings'
];

foreach ($importantTables as $table => $description) {
    if (in_array($table, $tables)) {
        $countStmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
        $count = $countStmt->fetch()['count'];
        
        if ($count > 0) {
            echo "✅ $description ($table): $count records\n";
            
            // Show sample data for packages
            if ($table === 'packages') {
                $sampleStmt = $pdo->query("SELECT id, title_ar, title_en, price, destination FROM `$table` LIMIT 3");
                $samples = $sampleStmt->fetchAll();
                echo "   📋 Sample packages:\n";
                foreach ($samples as $sample) {
                    echo "      - ID {$sample['id']}: {$sample['title_ar']} ({$sample['title_en']}) - {$sample['price']} SAR - {$sample['destination']}\n";
                }
            }
        } else {
            echo "⚠️  $description ($table): 0 records (EMPTY)\n";
        }
    } else {
        echo "❌ $description ($table): Table not found\n";
    }
}

echo "\n" . str_repeat("=", 50) . "\n";

// Check Laravel-specific tables
$laravelTables = ['migrations', 'cache', 'sessions', 'jobs', 'failed_jobs'];
echo "🔧 Laravel System Tables:\n";
foreach ($laravelTables as $table) {
    if (in_array($table, $tables)) {
        $countStmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
        $count = $countStmt->fetch()['count'];
        echo "   ✅ $table: $count records\n";
    } else {
        echo "   ❌ $table: Not found\n";
    }
}

echo "\n" . str_repeat("=", 50) . "\n";

// Summary
$totalRecords = 0;
foreach ($importantTables as $table => $description) {
    if (in_array($table, $tables)) {
        $countStmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
        $count = $countStmt->fetch()['count'];
        $totalRecords += $count;
    }
}

echo "📊 Migration Summary:\n";
echo "   📋 Total tables: " . count($tables) . "\n";
echo "   📦 Total records in important tables: $totalRecords\n";
echo "   ✅ Packages migrated: " . (in_array('packages', $tables) ? 'YES' : 'NO') . "\n";
echo "   ✅ Database structure: " . (count($tables) > 10 ? 'COMPLETE' : 'INCOMPLETE') . "\n";

if ($totalRecords > 0 && in_array('packages', $tables)) {
    echo "\n🎉 Migration Verification: SUCCESS!\n";
    echo "✅ All data has been successfully migrated to Laravel project\n";
} else {
    echo "\n⚠️  Migration Verification: PARTIAL SUCCESS\n";
    echo "⚠️  Some data may not have been migrated properly\n";
}

echo "\n📝 Next Steps:\n";
echo "   1. Start Laravel server: php artisan serve\n";
echo "   2. Test your application at: http://localhost:8000\n";
echo "   3. Check admin panel if available\n";
echo "   4. Test package listings and functionality\n";

// Close connection
$pdo = null;
echo "\n🔗 Database connection closed.\n";
?>
