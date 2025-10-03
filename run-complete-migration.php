<?php
/**
 * Complete Database Migration Script
 * 
 * This script runs the complete migration process from Vue project to Laravel project
 * 
 * Steps:
 * 1. Setup Laravel environment
 * 2. Migrate package data from JSON
 * 3. Migrate all database tables
 * 4. Verify migration
 */

echo "🚀 Starting Complete Database Migration Process\n";
echo "=" . str_repeat("=", 60) . "\n";
echo "📋 Migration Steps:\n";
echo "   1. Setup Laravel environment\n";
echo "   2. Migrate package data from JSON\n";
echo "   3. Migrate all database tables\n";
echo "   4. Verify migration\n";
echo "=" . str_repeat("=", 60) . "\n\n";

// Step 1: Setup Laravel environment
echo "🔧 Step 1: Setting up Laravel environment...\n";
$setupScript = 'php setup-laravel-migration.php';
$output = shell_exec($setupScript);
if ($output) {
    echo $output;
    echo "✅ Laravel environment setup completed\n\n";
} else {
    echo "⚠️  Laravel environment setup may have issues\n\n";
}

// Step 2: Migrate package data from JSON
echo "📦 Step 2: Migrating package data from JSON...\n";
$packageScript = 'php migrate-packages-data.php';
$output = shell_exec($packageScript);
if ($output) {
    echo $output;
    echo "✅ Package data migration completed\n\n";
} else {
    echo "⚠️  Package data migration may have issues\n\n";
}

// Step 3: Migrate all database tables
echo "🗄️  Step 3: Migrating all database tables...\n";
$migrationScript = 'php migrate-to-laravel.php';
$output = shell_exec($migrationScript);
if ($output) {
    echo $output;
    echo "✅ Database tables migration completed\n\n";
} else {
    echo "⚠️  Database tables migration may have issues\n\n";
}

// Step 4: Verify migration
echo "🔍 Step 4: Verifying migration...\n";
verifyMigration();

echo "\n" . str_repeat("=", 60) . "\n";
echo "🎉 Complete Migration Process Finished!\n";
echo "📝 Next Steps:\n";
echo "   1. Navigate to Laravel project: cd F:\\TravelinAgency\\travelin-agency-laravel\n";
echo "   2. Run Laravel migrations: php artisan migrate\n";
echo "   3. Generate application key: php artisan key:generate\n";
echo "   4. Start Laravel server: php artisan serve\n";
echo "   5. Test your application at: http://localhost:8000\n";
echo "=" . str_repeat("=", 60) . "\n";

/**
 * Verify migration by checking database tables and data
 */
function verifyMigration() {
    $dbConfig = [
        'host' => '127.0.0.1',
        'port' => '3306',
        'database' => 'travel2',
        'username' => 'root',
        'password' => ''
    ];
    
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
        
        // Check tables
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo "📊 Database Tables Found: " . count($tables) . "\n";
        foreach ($tables as $table) {
            $countStmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
            $count = $countStmt->fetch()['count'];
            echo "   📋 $table: $count records\n";
        }
        
        // Check specific important tables
        $importantTables = ['packages', 'users', 'bookings', 'contact_messages'];
        foreach ($importantTables as $table) {
            if (in_array($table, $tables)) {
                $countStmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
                $count = $countStmt->fetch()['count'];
                if ($count > 0) {
                    echo "   ✅ $table: $count records (GOOD)\n";
                } else {
                    echo "   ⚠️  $table: 0 records (EMPTY)\n";
                }
            } else {
                echo "   ❌ $table: Table not found\n";
            }
        }
        
        echo "✅ Migration verification completed\n";
        
    } catch (PDOException $e) {
        echo "❌ Migration verification failed: " . $e->getMessage() . "\n";
    }
}
?>
