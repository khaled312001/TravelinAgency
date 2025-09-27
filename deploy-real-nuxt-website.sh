#!/bin/bash

echo "🚀 Deploying Real Nuxt.js Website to Server..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Copy the real Nuxt.js build files
echo "📁 Copying real Nuxt.js build files..."
cp -r .output/public/* output/

# Update index.php to serve the real Nuxt.js application
echo "🔧 Updating index.php for real Nuxt.js..."
cat > index.php << 'EOF'
<?php
// Real Nuxt.js Static Site index.php
header('Content-Type: text/html; charset=utf-8');

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$cleanUri = parse_url($requestUri, PHP_URL_PATH);
$cleanUri = strtok($cleanUri, '?');

// Handle API routes first
if (strpos($cleanUri, '/api/') === 0) {
    if (file_exists(__DIR__ . '/api-handler.php')) {
        include __DIR__ . '/api-handler.php';
        exit;
    }
}

// Handle IPX image optimization requests
if (strpos($cleanUri, '/_ipx/') === 0) {
    $ipxPath = substr($cleanUri, 6);
    $ipxPath = preg_replace('/[?&].*$/', '', $ipxPath);
    
    if (strpos($ipxPath, 'http') === 0) {
        header('Location: ' . $ipxPath, true, 302);
        exit;
    }
    
    $possiblePaths = [
        __DIR__ . $ipxPath,
        __DIR__ . '/public' . $ipxPath,
        __DIR__ . '/output' . $ipxPath,
        __DIR__ . '/.output/public' . $ipxPath,
        __DIR__ . '/images' . $ipxPath
    ];
    
    foreach ($possiblePaths as $imagePath) {
        if (file_exists($imagePath)) {
            $mimeType = mime_content_type($imagePath);
            header('Content-Type: ' . $mimeType);
            header('Cache-Control: public, max-age=31536000');
            readfile($imagePath);
            exit;
        }
    }
    
    http_response_code(404);
    echo 'Image not found: ' . $ipxPath;
    exit;
}

// Handle static files
$staticExtensions = ['css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'eot', 'mp4', 'webm', 'ogg', 'pdf', 'zip'];
$fileExtension = strtolower(pathinfo($cleanUri, PATHINFO_EXTENSION));

if (in_array($fileExtension, $staticExtensions)) {
    $possiblePaths = [
        __DIR__ . $cleanUri,
        __DIR__ . '/public' . $cleanUri,
        __DIR__ . '/output' . $cleanUri,
        __DIR__ . '/.output/public' . $cleanUri,
        __DIR__ . '/images' . $cleanUri
    ];

    foreach ($possiblePaths as $filePath) {
        if (file_exists($filePath)) {
            if (in_array($fileExtension, ['css', 'js'])) {
                header('Content-Type: ' . ($fileExtension === 'css' ? 'text/css' : 'application/javascript'));
                header('Cache-Control: public, max-age=31536000');
            } elseif (in_array($fileExtension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'])) {
                $mimeType = mime_content_type($filePath);
                header('Content-Type: ' . $mimeType);
                header('Cache-Control: public, max-age=31536000');
            }
            readfile($filePath);
            exit;
        }
    }
    
    http_response_code(404);
    echo 'File not found: ' . $cleanUri;
    exit;
}

// Handle Nuxt.js static assets
if (strpos($cleanUri, '/_nuxt/') === 0) {
    $possiblePaths = [
        __DIR__ . '/output' . $cleanUri,
        __DIR__ . '/.output/public' . $cleanUri
    ];
    
    foreach ($possiblePaths as $nuxtPath) {
        if (file_exists($nuxtPath)) {
            $fileExtension = strtolower(pathinfo($nuxtPath, PATHINFO_EXTENSION));
            if ($fileExtension === 'css') {
                header('Content-Type: text/css');
            } elseif ($fileExtension === 'js') {
                header('Content-Type: application/javascript');
            }
            header('Cache-Control: public, max-age=31536000');
            readfile($nuxtPath);
            exit;
        }
    }
}

// Serve the main Nuxt.js application - prioritize real index.html
$nuxtFiles = [
    __DIR__ . '/output/index.html',
    __DIR__ . '/.output/public/index.html'
];

foreach ($nuxtFiles as $nuxtFile) {
    if (file_exists($nuxtFile)) {
        $content = file_get_contents($nuxtFile);
        echo $content;
        exit;
    }
}

// Fallback if no files found
http_response_code(200);
echo '<!DOCTYPE html>
<html lang="ar-SA" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>World Trip Agency</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #40a0d8; text-align: center; margin-bottom: 30px; }
        .error { background: #ffe6e6; padding: 20px; border-radius: 5px; margin: 20px 0; color: #d32f2f; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 World Trip Agency</h1>
        <div class="error">
            <h2>❌ Error: Nuxt.js files not found</h2>
            <p>Please check that the build files are properly deployed.</p>
        </div>
    </div>
</body>
</html>';
?>
EOF

# Set proper permissions
echo "🔐 Setting permissions..."
chmod 644 index.php
chmod -R 644 output/
chmod -R 755 output/

echo "✅ Real Nuxt.js Website Deployment Complete!"
echo "🌐 Your actual TravelinAgency website should now be live!"
echo "📱 Visit your domain to see your real Nuxt.js pages!"
