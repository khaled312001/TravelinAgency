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

// Get packages with their image paths
$result = $conn->query('SELECT id, numeric_id, title_ar, image_url FROM packages ORDER BY numeric_id LIMIT 10');
echo "\n📸 Current image paths in database:\n";
echo "=====================================\n";

while ($row = $result->fetch_assoc()) {
    echo "ID: {$row['numeric_id']} | {$row['title_ar']} | {$row['image_url']}\n";
}

$conn->close();
?>
