<?php
// Simple database check script
// Run this on your server: php check-database.php

echo "🔍 Checking Database and Admin User...\n\n";

// Database configuration
$dbConfig = [
    'host' => 'localhost',
    'port' => 3306,
    'user' => 'travel',
    'password' => 'support@Passord123',
    'database' => 'travel'
];

try {
    echo "1. Connecting to database...\n";
    $pdo = new PDO(
        "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['database']};charset=utf8mb4",
        $dbConfig['user'],
        $dbConfig['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "✅ Database connected successfully\n\n";

    echo "2. Checking tables...\n";
    $tables = ['users', 'admin_profiles'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Table '$table' exists\n";
        } else {
            echo "❌ Table '$table' does not exist\n";
        }
    }

    echo "\n3. Checking admin user...\n";
    $stmt = $pdo->prepare('SELECT id, email, full_name, status FROM users WHERE email = ?');
    $stmt->execute(['admin@wonderland.com']);
    $user = $stmt->fetch();

    if ($user) {
        echo "✅ Admin user found:\n";
        echo "   ID: {$user['id']}\n";
        echo "   Email: {$user['email']}\n";
        echo "   Name: {$user['full_name']}\n";
        echo "   Status: {$user['status']}\n";

        echo "\n4. Checking admin profile...\n";
        $stmt = $pdo->prepare('SELECT role, permissions FROM admin_profiles WHERE user_id = ?');
        $stmt->execute([$user['id']]);
        $profile = $stmt->fetch();

        if ($profile) {
            echo "✅ Admin profile found:\n";
            echo "   Role: {$profile['role']}\n";
        } else {
            echo "❌ Admin profile not found - creating it...\n";
            $stmt = $pdo->prepare('INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())');
            $stmt->execute([$user['id'], 'super_admin', '{}']);
            echo "✅ Admin profile created\n";
        }

        echo "\n5. Testing password...\n";
        $stmt = $pdo->prepare('SELECT password FROM users WHERE email = ?');
        $stmt->execute(['admin@wonderland.com']);
        $userWithPassword = $stmt->fetch();

        if ($userWithPassword) {
            if (password_verify('admin123', $userWithPassword['password'])) {
                echo "✅ Password is correct\n";
            } else {
                echo "❌ Password is incorrect - updating it...\n";
                $newPassword = password_hash('admin123', PASSWORD_DEFAULT);
                $stmt = $pdo->prepare('UPDATE users SET password = ? WHERE email = ?');
                $stmt->execute([$newPassword, 'admin@wonderland.com']);
                echo "✅ Password updated\n";
            }
        }

    } else {
        echo "❌ Admin user not found - creating it...\n";
        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO users (email, password, full_name, phone, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())');
        $stmt->execute(['admin@wonderland.com', $hashedPassword, 'مدير النظام', '+966501234567', 'active']);
        
        $userId = $pdo->lastInsertId();
        echo "✅ Admin user created with ID: $userId\n";
        
        $stmt = $pdo->prepare('INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())');
        $stmt->execute([$userId, 'super_admin', '{}']);
        echo "✅ Admin profile created\n";
    }

    echo "\n🎉 Database check complete!\n";
    echo "📧 Email: admin@wonderland.com\n";
    echo "🔑 Password: admin123\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
