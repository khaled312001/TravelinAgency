<?php
// Test script to check admin login and database connection
// Run this on your server: php test-admin-login.php

// Database configuration
$dbConfig = [
    'host' => 'localhost',
    'port' => 3306,
    'user' => 'travel',
    'password' => 'support@Passord123',
    'database' => 'travel'
];

echo "🔍 Testing Admin Login System...\n\n";

try {
    echo "1. Testing database connection...\n";
    $pdo = new PDO(
        "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['database']};charset=utf8mb4",
        $dbConfig['user'],
        $dbConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    echo "✅ Database connection successful\n\n";

    echo "2. Checking if users table exists...\n";
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Users table exists\n";
    } else {
        echo "❌ Users table does not exist\n";
        echo "💡 You need to create the database tables first\n";
        exit(1);
    }

    echo "3. Checking if admin_profiles table exists...\n";
    $stmt = $pdo->query("SHOW TABLES LIKE 'admin_profiles'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Admin profiles table exists\n";
    } else {
        echo "❌ Admin profiles table does not exist\n";
        echo "💡 You need to create the database tables first\n";
        exit(1);
    }

    echo "4. Checking for admin user...\n";
    $stmt = $pdo->prepare('SELECT id, email, full_name, status FROM users WHERE email = ?');
    $stmt->execute(['admin@wonderland.com']);
    $adminUser = $stmt->fetch();

    if ($adminUser) {
        echo "✅ Admin user found:\n";
        echo "   ID: {$adminUser['id']}\n";
        echo "   Email: {$adminUser['email']}\n";
        echo "   Name: {$adminUser['full_name']}\n";
        echo "   Status: {$adminUser['status']}\n";

        echo "5. Checking admin profile...\n";
        $stmt = $pdo->prepare('SELECT role, permissions FROM admin_profiles WHERE user_id = ?');
        $stmt->execute([$adminUser['id']]);
        $adminProfile = $stmt->fetch();

        if ($adminProfile) {
            echo "✅ Admin profile found:\n";
            echo "   Role: {$adminProfile['role']}\n";
            echo "   Permissions: {$adminProfile['permissions']}\n";
        } else {
            echo "❌ Admin profile not found\n";
            echo "💡 Creating admin profile...\n";
            
            $stmt = $pdo->prepare('INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())');
            $stmt->execute([$adminUser['id'], 'super_admin', json_encode([
                'users.create' => true,
                'users.read' => true,
                'users.update' => true,
                'users.delete' => true,
                'packages.create' => true,
                'packages.read' => true,
                'packages.update' => true,
                'packages.delete' => true,
                'destinations.create' => true,
                'destinations.read' => true,
                'destinations.update' => true,
                'destinations.delete' => true,
                'bookings.create' => true,
                'bookings.read' => true,
                'bookings.update' => true,
                'bookings.delete' => true,
                'content.create' => true,
                'content.read' => true,
                'content.update' => true,
                'content.delete' => true,
                'settings.read' => true,
                'settings.update' => true,
                'analytics.read' => true,
                'reports.read' => true
            ])]);
            echo "✅ Admin profile created\n";
        }

        echo "6. Testing password verification...\n";
        $stmt = $pdo->prepare('SELECT password FROM users WHERE email = ?');
        $stmt->execute(['admin@wonderland.com']);
        $userWithPassword = $stmt->fetch();

        if ($userWithPassword) {
            if (password_verify('admin123', $userWithPassword['password'])) {
                echo "✅ Password verification successful\n";
            } else {
                echo "❌ Password verification failed\n";
                echo "💡 Updating password...\n";
                $newPassword = password_hash('admin123', PASSWORD_DEFAULT);
                $stmt = $pdo->prepare('UPDATE users SET password = ? WHERE email = ?');
                $stmt->execute([$newPassword, 'admin@wonderland.com']);
                echo "✅ Password updated\n";
            }
        }

    } else {
        echo "❌ Admin user not found\n";
        echo "💡 Creating admin user...\n";
        
        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO users (email, password, full_name, phone, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())');
        $stmt->execute(['admin@wonderland.com', $hashedPassword, 'مدير النظام', '+966501234567', 'active']);
        
        $userId = $pdo->lastInsertId();
        echo "✅ Admin user created with ID: $userId\n";
        
        $stmt = $pdo->prepare('INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())');
        $stmt->execute([$userId, 'super_admin', json_encode([
            'users.create' => true,
            'users.read' => true,
            'users.update' => true,
            'users.delete' => true,
            'packages.create' => true,
            'packages.read' => true,
            'packages.update' => true,
            'packages.delete' => true,
            'destinations.create' => true,
            'destinations.read' => true,
            'destinations.update' => true,
            'destinations.delete' => true,
            'bookings.create' => true,
            'bookings.read' => true,
            'bookings.update' => true,
            'bookings.delete' => true,
            'content.create' => true,
            'content.read' => true,
            'content.update' => true,
            'content.delete' => true,
            'settings.read' => true,
            'settings.update' => true,
            'analytics.read' => true,
            'reports.read' => true
        ])]);
        echo "✅ Admin profile created\n";
    }

    echo "\n🎉 Admin login system is ready!\n";
    echo "📧 Email: admin@wonderland.com\n";
    echo "🔑 Password: admin123\n";
    echo "🌐 Login URL: https://worldtripagency.com/admin/login\n";

} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    
    if ($e->getCode() == 1045) {
        echo "\n💡 Database connection failed. Please check:\n";
        echo "1. Database credentials\n";
        echo "2. MySQL server is running\n";
        echo "3. Database 'travel' exists\n";
        echo "4. User 'travel' has proper permissions\n";
    } elseif ($e->getCode() == 42S02) {
        echo "\n💡 Database tables not found. Please run the database setup first.\n";
    }
    
    exit(1);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
