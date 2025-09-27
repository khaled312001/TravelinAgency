<?php
// Script to create admin user for the TravelinAgency website
// Run this on your server: php create-admin-user.php

// Database configuration
$dbConfig = [
    'host' => 'localhost',
    'port' => 3306,
    'user' => 'travel',
    'password' => 'support@Passord123',
    'database' => 'travel'
];

try {
    echo "🔌 Connecting to database...\n";
    $pdo = new PDO(
        "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['database']};charset=utf8mb4",
        $dbConfig['user'],
        $dbConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    echo "✅ Connected to database successfully\n";

    // Check if admin user already exists
    $stmt = $pdo->prepare('SELECT id, email FROM users WHERE email = ?');
    $stmt->execute(['admin@wonderland.com']);
    $existingUser = $stmt->fetch();

    if ($existingUser) {
        echo "⚠️ Admin user already exists: {$existingUser['email']}\n";
        echo "🔄 Updating admin user...\n";
        
        // Hash the password
        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        
        // Update existing user
        $stmt = $pdo->prepare('UPDATE users SET password = ?, full_name = ?, phone = ?, status = ?, updated_at = NOW() WHERE email = ?');
        $stmt->execute([$hashedPassword, 'مدير النظام', '+966501234567', 'active', 'admin@wonderland.com']);
        
        $userId = $existingUser['id'];
        
        // Update or create admin profile
        $stmt = $pdo->prepare('
            INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
            role = VALUES(role),
            permissions = VALUES(permissions),
            updated_at = NOW()
        ');
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
        
        echo "✅ Admin user updated successfully\n";
        
    } else {
        echo "🆕 Creating new admin user...\n";
        
        // Hash the password
        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        
        // Create user
        $stmt = $pdo->prepare('INSERT INTO users (email, password, full_name, phone, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())');
        $stmt->execute(['admin@wonderland.com', $hashedPassword, 'مدير النظام', '+966501234567', 'active']);
        
        $userId = $pdo->lastInsertId();
        echo "✅ User created with ID: $userId\n";
        
        // Create admin profile
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
        
        echo "✅ Admin profile created successfully\n";
    }

    echo "\n🎉 Admin user setup complete!\n";
    echo "📧 Email: admin@wonderland.com\n";
    echo "🔑 Password: admin123\n";
    echo "👑 Role: super_admin\n";
    echo "\n🌐 You can now login to: https://worldtripagency.com/admin/login\n";

} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    
    if ($e->getCode() == 1045) {
        echo "\n💡 Database connection failed. Please check:\n";
        echo "1. Database credentials in the script\n";
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
