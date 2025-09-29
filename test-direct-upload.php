<?php
// Test direct upload to see if it works
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = mime_content_type($file['tmp_name']);
    
    if (!in_array($fileType, $allowedTypes)) {
        die(json_encode(["error" => "Invalid file type"]));
    }
    
    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        die(json_encode(["error" => "File too large"]));
    }
    
    // Create uploads directory if it doesn't exist
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'logo_' . time() . '_' . uniqid() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $imageUrl = '/uploads/' . $filename;
        
        // Update site_logo setting in database
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=wonderland_travel', 'root', '');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $stmt = $pdo->prepare("INSERT INTO cms_site_settings (setting_key, setting_value, setting_type, category, is_public) VALUES ('site_logo', ?, 'image', 'general', 1) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmt->execute([$imageUrl]);
            
            echo json_encode([
                "success" => true,
                "message" => "Image uploaded and database updated successfully",
                "url" => $imageUrl,
                "filename" => $filename
            ]);
        } catch (Exception $e) {
            echo json_encode([
                "success" => true,
                "message" => "Image uploaded but database update failed: " . $e->getMessage(),
                "url" => $imageUrl,
                "filename" => $filename
            ]);
        }
    } else {
        echo json_encode(["error" => "Failed to save uploaded file"]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Direct Upload Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .upload-area { border: 2px dashed #ccc; padding: 20px; text-align: center; margin: 20px 0; }
        .result { margin: 20px 0; padding: 10px; background: #f5f5f5; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>اختبار رفع مباشر</h1>
    
    <form method="POST" enctype="multipart/form-data">
        <div class="upload-area">
            <input type="file" name="image" accept="image/*" required>
            <br><br>
            <button type="submit">رفع الصورة</button>
        </div>
    </form>
    
    <div id="result"></div>
    
    <script>
        // Show result if there's a response
        <?php if (isset($_POST['image'])): ?>
        document.getElementById('result').innerHTML = 'تم الرفع بنجاح!';
        document.getElementById('result').className = 'result success';
        <?php endif; ?>
    </script>
</body>
</html>
