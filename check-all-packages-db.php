<?php
// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'travel';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected to database successfully!\n";

// Get all packages with their image paths
$result = $conn->query('SELECT id, numeric_id, title_ar, image_url, created_at FROM packages ORDER BY created_at DESC');
echo "\n📦 All packages in database:\n";
echo "=====================================\n";

$totalCount = 0;
while ($row = $result->fetch_assoc()) {
    $totalCount++;
    echo "ID: {$row['numeric_id']} | UUID: {$row['id']} | {$row['title_ar']} | {$row['image_url']} | {$row['created_at']}\n";
}

echo "\n📊 Total packages in database: {$totalCount}\n";

$conn->close();
?>
