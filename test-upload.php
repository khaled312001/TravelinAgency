<?php
echo "🧪 Testing Image Upload Functionality...\n\n";

// Test the upload endpoint
$testImagePath = __DIR__ . '/test-logo.png';

// Create a simple test image if it doesn't exist
if (!file_exists($testImagePath)) {
    // Create a simple 100x100 PNG image
    $image = imagecreate(100, 100);
    $bg = imagecolorallocate($image, 40, 160, 216); // Blue background
    $text_color = imagecolorallocate($image, 255, 255, 255); // White text
    imagestring($image, 5, 20, 40, 'LOGO', $text_color);
    imagepng($image, $testImagePath);
    imagedestroy($image);
    echo "✅ Created test image: $testImagePath\n";
}

// Test upload using cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://worldtripagency.com/api/upload/image');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'image' => new CURLFile($testImagePath, 'image/png', 'test-logo.png')
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "📤 Upload Test Results:\n";
echo "HTTP Code: $httpCode\n";

if ($error) {
    echo "❌ cURL Error: $error\n";
} else {
    echo "📝 Response: $response\n";
    
    $data = json_decode($response, true);
    if ($data && isset($data['success']) && $data['success']) {
        echo "✅ Upload successful!\n";
        echo "📁 File URL: " . $data['url'] . "\n";
        echo "📄 Filename: " . $data['filename'] . "\n";
    } else {
        echo "❌ Upload failed: " . ($data['error'] ?? 'Unknown error') . "\n";
    }
}

echo "\n🔍 Testing Site Settings API...\n";

// Test site settings API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://worldtripagency.com/api/cms/site-settings');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "📤 Site Settings Test Results:\n";
echo "HTTP Code: $httpCode\n";

if ($error) {
    echo "❌ cURL Error: $error\n";
} else {
    echo "📝 Response: $response\n";
    
    $data = json_decode($response, true);
    if ($data && isset($data['site_logo'])) {
        echo "✅ Site settings loaded successfully!\n";
        echo "🖼️ Current logo: " . $data['site_logo'] . "\n";
    } else {
        echo "❌ Failed to load site settings\n";
    }
}

echo "\n🎉 Upload functionality test complete!\n";
?>
