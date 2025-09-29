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
$result = $conn->query('SELECT id, numeric_id, title_ar, image_url FROM packages ORDER BY numeric_id');
echo "\n📸 All packages in database:\n";
echo "=====================================\n";

$missingImages = [];
$existingImages = [];

while ($row = $result->fetch_assoc()) {
    $imagePath = $row['image_url'];
    $fullPath = __DIR__ . '/public' . $imagePath;
    
    if (file_exists($fullPath)) {
        $existingImages[] = $row;
        echo "✅ ID: {$row['numeric_id']} | {$row['title_ar']} | {$row['image_url']}\n";
    } else {
        $missingImages[] = $row;
        echo "❌ ID: {$row['numeric_id']} | {$row['title_ar']} | {$row['image_url']} (MISSING)\n";
    }
}

echo "\n📊 Summary:\n";
echo "Total packages: " . (count($existingImages) + count($missingImages)) . "\n";
echo "Existing images: " . count($existingImages) . "\n";
echo "Missing images: " . count($missingImages) . "\n";

if (count($missingImages) > 0) {
    echo "\n🔧 Missing images that need to be fixed:\n";
    foreach ($missingImages as $package) {
        echo "- ID {$package['numeric_id']}: {$package['image_url']}\n";
    }
}

$conn->close();
?>
