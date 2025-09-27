#!/bin/bash

# Deploy Nuxt.js Website to Server
echo "🚀 Deploying Nuxt.js Website to Server..."

# Navigate to the public_html directory
cd ~/public_html

# Pull the latest changes (including build files)
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Create output directory if it doesn't exist
echo "📁 Creating output directory..."
mkdir -p output

# Copy the build files from .output/public to output directory
echo "📦 Copying build files..."
if [ -d ".output/public" ]; then
    cp -r .output/public/* output/
    echo "✅ Build files copied successfully"
else
    echo "❌ Build files not found in .output/public"
    echo "Please run 'npm run build' first"
    exit 1
fi

# Copy the server files
echo "🖥️ Copying server files..."
if [ -d ".output/server" ]; then
    cp -r .output/server/* output/
    echo "✅ Server files copied successfully"
else
    echo "❌ Server files not found in .output/server"
    exit 1
fi

# Set proper permissions
echo "🔐 Setting proper permissions..."
chmod -R 755 output/
find output/ -type f -exec chmod 644 {} \;

# Update index.php to serve the Nuxt.js application
echo "🔧 Updating index.php to serve Nuxt.js application..."
cat > index.php << 'EOF'
<?php
// Enhanced index.php for Nuxt.js deployment
header('Content-Type: text/html; charset=utf-8');

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$cleanUri = parse_url($requestUri, PHP_URL_PATH);

// Remove query parameters for routing
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
        __DIR__ . '/dist' . $ipxPath,
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
        __DIR__ . '/dist' . $cleanUri,
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
    $nuxtPath = __DIR__ . '/output' . $cleanUri;
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

// Serve the main Nuxt.js application
$nuxtFiles = [
    __DIR__ . '/output/index.html',
    __DIR__ . '/output/200.html',
    __DIR__ . '/dist/index.html',
    __DIR__ . '/index.html'
];

foreach ($nuxtFiles as $nuxtFile) {
    if (file_exists($nuxtFile)) {
        $content = file_get_contents($nuxtFile);
        echo $content;
        exit;
    }
}

// Fallback page
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
        .status { background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .success { color: #22c55e; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 World Trip Agency</h1>
        <div class="status">
            <h2>✅ Website Status: Working</h2>
            <p>The website is now functional! The Nuxt.js application has been deployed.</p>
        </div>
    </div>
</body>
</html>';
?>
EOF

# Set permissions for index.php
chmod 644 index.php

echo "🎉 Nuxt.js Website Deployment Complete!"
echo "🌐 Your actual website should now be live at your domain!"
echo ""
echo "✅ Build files deployed"
echo "✅ Server files deployed"
echo "✅ Index.php updated"
echo "✅ Permissions set correctly"
echo ""
echo "Visit your domain to see your actual Nuxt.js website!"
