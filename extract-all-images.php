<?php
// Extract all images and paths from project folders and MySQL database
echo "<h1>📸 Extract All Images and Paths</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🔍 Scanning Project Folders for Images</h3>";

// Function to scan directories recursively for images
function scanForImages($dir, $basePath = '') {
    $images = [];
    if (is_dir($dir)) {
        $files = scandir($dir);
        foreach ($files as $file) {
            if ($file != '.' && $file != '..') {
                $fullPath = $dir . '/' . $file;
                $relativePath = $basePath . '/' . $file;
                
                if (is_dir($fullPath)) {
                    $images = array_merge($images, scanForImages($fullPath, $relativePath));
                } elseif (preg_match('/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i', $file)) {
                    $images[] = [
                        'file' => $file,
                        'path' => $relativePath,
                        'full_path' => $fullPath,
                        'size' => file_exists($fullPath) ? filesize($fullPath) : 0,
                        'exists' => file_exists($fullPath)
                    ];
                }
            }
        }
    }
    return $images;
}

// Scan different directories
$directories = [
    'public/images' => 'public/images',
    'public' => 'public',
    'output/public' => 'output/public',
    'assets' => 'assets',
    'static' => 'static'
];

$allImages = [];
foreach ($directories as $dir => $basePath) {
    if (is_dir($dir)) {
        echo "<div class='success'>✅ Scanning: $dir</div>";
        $images = scanForImages($dir, $basePath);
        $allImages = array_merge($allImages, $images);
        echo "<div class='info'>Found " . count($images) . " images in $dir</div>";
    } else {
        echo "<div class='error'>❌ Directory not found: $dir</div>";
    }
}

echo "<h3>📊 Images Found in Project Folders</h3>";
echo "<table border='1' style='border-collapse:collapse;width:100%;'>";
echo "<tr style='background:#f0f0f0;'><th>File</th><th>Path</th><th>Size</th><th>Status</th></tr>";

foreach ($allImages as $image) {
    $status = $image['exists'] ? "<span style='color:green;'>✅ Exists</span>" : "<span style='color:red;'>❌ Missing</span>";
    $size = $image['size'] > 0 ? number_format($image['size']) . ' bytes' : '0 bytes';
    echo "<tr>";
    echo "<td>{$image['file']}</td>";
    echo "<td>{$image['path']}</td>";
    echo "<td>$size</td>";
    echo "<td>$status</td>";
    echo "</tr>";
}
echo "</table>";

echo "<h3>🗄️ Images in MySQL Database</h3>";

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel', 'travel', 'support@Passord123');
    
    // Check packages table for images
    echo "<h4>📦 Packages Table Images</h4>";
    
    // First, check what columns exist in packages table
    $stmt = $pdo->query("SHOW COLUMNS FROM packages");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Build dynamic query based on available columns
    $selectFields = ['id'];
    if (in_array('name', $columns)) $selectFields[] = 'name';
    if (in_array('title', $columns)) $selectFields[] = 'title';
    if (in_array('package_name', $columns)) $selectFields[] = 'package_name';
    if (in_array('image_url', $columns)) $selectFields[] = 'image_url';
    if (in_array('images', $columns)) $selectFields[] = 'images';
    if (in_array('image', $columns)) $selectFields[] = 'image';
    if (in_array('photo', $columns)) $selectFields[] = 'photo';
    if (in_array('picture', $columns)) $selectFields[] = 'picture';
    
    $query = "SELECT " . implode(', ', $selectFields) . " FROM packages";
    $stmt = $pdo->query($query);
    $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($packages) > 0) {
        echo "<table border='1' style='border-collapse:collapse;width:100%;'>";
        echo "<tr style='background:#f0f0f0;'>";
        foreach ($selectFields as $field) {
            echo "<th>" . ucfirst(str_replace('_', ' ', $field)) . "</th>";
        }
        echo "</tr>";
        
        foreach ($packages as $package) {
            echo "<tr>";
            foreach ($selectFields as $field) {
                echo "<td>" . htmlspecialchars($package[$field] ?? 'N/A') . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<div class='warning'>⚠️ No packages found in database</div>";
    }
    
    // Check destinations table for images
    echo "<h4>🌍 Destinations Table Images</h4>";
    
    // First, check what columns exist in destinations table
    $stmt = $pdo->query("SHOW COLUMNS FROM destinations");
    $destColumns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Build dynamic query based on available columns
    $destSelectFields = ['id'];
    if (in_array('name', $destColumns)) $destSelectFields[] = 'name';
    if (in_array('title', $destColumns)) $destSelectFields[] = 'title';
    if (in_array('destination_name', $destColumns)) $destSelectFields[] = 'destination_name';
    if (in_array('image_url', $destColumns)) $destSelectFields[] = 'image_url';
    if (in_array('images', $destColumns)) $destSelectFields[] = 'images';
    if (in_array('image', $destColumns)) $destSelectFields[] = 'image';
    if (in_array('photo', $destColumns)) $destSelectFields[] = 'photo';
    if (in_array('picture', $destColumns)) $destSelectFields[] = 'picture';
    
    $destQuery = "SELECT " . implode(', ', $destSelectFields) . " FROM destinations";
    $stmt = $pdo->query($destQuery);
    $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($destinations) > 0) {
        echo "<table border='1' style='border-collapse:collapse;width:100%;'>";
        echo "<tr style='background:#f0f0f0;'>";
        foreach ($destSelectFields as $field) {
            echo "<th>" . ucfirst(str_replace('_', ' ', $field)) . "</th>";
        }
        echo "</tr>";
        
        foreach ($destinations as $destination) {
            echo "<tr>";
            foreach ($destSelectFields as $field) {
                echo "<td>" . htmlspecialchars($destination[$field] ?? 'N/A') . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<div class='warning'>⚠️ No destinations found in database</div>";
    }
    
    // Check other tables that might contain images
    echo "<h4>🔍 Other Tables with Image Fields</h4>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW COLUMNS FROM `$table` LIKE '%image%'");
        $imageColumns = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (count($imageColumns) > 0) {
            echo "<div class='info'>📋 Table: $table - Image columns: " . implode(', ', $imageColumns) . "</div>";
        }
    }
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Database error: " . $e->getMessage() . "</div>";
}

echo "<h3>📋 Export Options</h3>";
echo "<div class='info'>You can export this data in different formats:</div>";
echo "<ul>";
echo "<li><strong>CSV Format:</strong> <a href='?export=csv' target='_blank'>Download CSV</a></li>";
echo "<li><strong>JSON Format:</strong> <a href='?export=json' target='_blank'>Download JSON</a></li>";
echo "<li><strong>SQL Format:</strong> <a href='?export=sql' target='_blank'>Download SQL</a></li>";
echo "</ul>";

// Handle export requests
if (isset($_GET['export'])) {
    $exportType = $_GET['export'];
    
    if ($exportType === 'csv') {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="images_export.csv"');
        
        $output = fopen('php://output', 'w');
        fputcsv($output, ['File', 'Path', 'Size', 'Status', 'Source']);
        
        foreach ($allImages as $image) {
            $status = $image['exists'] ? 'Exists' : 'Missing';
            fputcsv($output, [$image['file'], $image['path'], $image['size'], $status, 'File System']);
        }
        
        fclose($output);
        exit;
    }
    
    if ($exportType === 'json') {
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="images_export.json"');
        
        $exportData = [
            'file_system_images' => $allImages,
            'database_images' => [
                'packages' => $packages ?? [],
                'destinations' => $destinations ?? []
            ],
            'export_date' => date('Y-m-d H:i:s'),
            'total_images' => count($allImages),
            'database_columns_checked' => [
                'packages' => $selectFields ?? [],
                'destinations' => $destSelectFields ?? []
            ]
        ];
        
        echo json_encode($exportData, JSON_PRETTY_PRINT);
        exit;
    }
}

echo "<h3>📊 Summary</h3>";
echo "<div class='success'>✅ Total images found in file system: " . count($allImages) . "</div>";
echo "<div class='info'>📁 Scanned directories: " . implode(', ', array_keys($directories)) . "</div>";
echo "<div class='info'>🗄️ Database tables checked: packages, destinations</div>";
echo "<div class='info'>📅 Export date: " . date('Y-m-d H:i:s') . "</div>";
?>
