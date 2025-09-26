#!/bin/bash
echo "🎯 FIXING FINAL FRONTEND ISSUES"
echo "================================="

echo ""
echo "1. 🔍 Testing current API responses..."
echo "-------------------------------------"
echo "Packages API:"
curl -k https://worldtripagency.com/api/packages | head -3

echo ""
echo "Destinations API:"
curl -k https://worldtripagency.com/api/destinations | head -3

echo ""
echo "2. 🔧 Creating enhanced index.php for better image handling..."
echo "------------------------------------------------------------"
cat > index.php << 'EOF'
<?php
// Enhanced index.php for better image and static file handling
header('Content-Type: text/html; charset=utf-8');

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$cleanUri = parse_url($requestUri, PHP_URL_PATH);

// Remove query parameters for routing
$cleanUri = strtok($cleanUri, '?');

// Handle API routes first
if (strpos($cleanUri, '/api/') === 0) {
    // Include the API handler
    if (file_exists(__DIR__ . '/api-handler.php')) {
        include __DIR__ . '/api-handler.php';
        exit;
    } else {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        echo json_encode([
            'error' => 'API handler not found',
            'message' => 'Please ensure api-handler.php exists',
            'timestamp' => date('c')
        ]);
        exit;
    }
}

// Handle IPX image optimization requests
if (strpos($cleanUri, '/_ipx/') === 0) {
    // Extract the original image path from IPX URL
    $ipxPath = substr($cleanUri, 6); // Remove '/_ipx'
    
    // Remove IPX parameters (e.g., f_webp&q_80)
    $ipxPath = preg_replace('/[?&].*$/', '', $ipxPath);
    
    // Check if it's an external URL (starts with http)
    if (strpos($ipxPath, 'http') === 0) {
        // Redirect to external URL
        header('Location: ' . $ipxPath, true, 302);
        exit;
    }
    
    // For local images, try to serve them directly
    $imagePath = __DIR__ . $ipxPath;
    if (file_exists($imagePath)) {
        $mimeType = mime_content_type($imagePath);
        header('Content-Type: ' . $mimeType);
        header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
        readfile($imagePath);
        exit;
    }
    
    // If image not found, return 404
    http_response_code(404);
    echo 'Image not found';
    exit;
}

// Handle static files (CSS, JS, images, videos, etc.)
$staticExtensions = ['css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'eot', 'mp4', 'webm', 'ogg', 'pdf', 'zip'];
$fileExtension = strtolower(pathinfo($cleanUri, PATHINFO_EXTENSION));

if (in_array($fileExtension, $staticExtensions)) {
    // Try multiple possible locations for static files
    $possiblePaths = [
        __DIR__ . $cleanUri,
        __DIR__ . '/public' . $cleanUri,
        __DIR__ . '/output/public' . $cleanUri,
        __DIR__ . '/dist' . $cleanUri,
        __DIR__ . '/output' . $cleanUri
    ];
    
    foreach ($possiblePaths as $filePath) {
        if (file_exists($filePath)) {
            // Set appropriate headers based on file type
            if (in_array($fileExtension, ['css', 'js'])) {
                header('Content-Type: ' . ($fileExtension === 'css' ? 'text/css' : 'application/javascript'));
                header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
            } elseif (in_array($fileExtension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'])) {
                $mimeType = mime_content_type($filePath);
                header('Content-Type: ' . $mimeType);
                header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
            } elseif (in_array($fileExtension, ['mp4', 'webm', 'ogg'])) {
                $mimeType = mime_content_type($filePath);
                header('Content-Type: ' . $mimeType);
                header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
                header('Accept-Ranges: bytes');
            }
            
            readfile($filePath);
            exit;
        }
    }
    
    // If static file not found, return 404
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
        header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
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
        
        // Fix any relative paths in the HTML
        $content = str_replace('src="/', 'src="', $content);
        $content = str_replace('href="/', 'href="', $content);
        
        echo $content;
        exit;
    }
}

// Fallback: return a basic HTML page
http_response_code(200);
echo '<!DOCTYPE html>
<html>
<head>
    <title>World Trip Agency</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <h1>World Trip Agency</h1>
    <p>Website is loading...</p>
    <p>If you see this message, please contact support.</p>
</body>
</html>';
?>
EOF

echo ""
echo "3. 🔧 Creating enhanced .htaccess for better routing..."
echo "-----------------------------------------------------"
cat > .htaccess << 'EOF'
RewriteEngine On

# Allow PHP files to execute
<Files "*.php">
    Order allow,deny
    Allow from all
</Files>

# Handle API routes first
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle _nuxt assets (Nuxt.js static files)
RewriteCond %{REQUEST_URI} ^/_nuxt/
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle _ipx image optimization
RewriteCond %{REQUEST_URI} ^/_ipx/
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle static files (CSS, JS, images, videos, etc.)
RewriteCond %{REQUEST_URI} \.(css|js|jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot|mp4|webm|ogg|pdf|zip)$
RewriteRule ^(.*)$ /index.php [QSA,L]

# Handle everything else through index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.php [QSA,L]
EOF

echo ""
echo "4. 🧪 Testing the fixes..."
echo "-------------------------"
echo "Testing main website:"
curl -k https://worldtripagency.com/ | head -5

echo ""
echo "Testing API endpoints:"
curl -k https://worldtripagency.com/api/packages | head -3

echo ""
echo "Testing image access:"
curl -I https://worldtripagency.com/images/packages/imported/dubai-luxury.jpg 2>/dev/null | head -3

echo ""
echo "✅ Final frontend fixes applied!"
echo "The website should now handle images, videos, and static files properly."
