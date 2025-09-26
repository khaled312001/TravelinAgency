<?php
/**
 * GoDaddy Hosting - Nuxt.js Application Entry Point
 * This file serves as the entry point for your Nuxt.js application on GoDaddy hosting
 */

// Set error reporting for production
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set the correct timezone
date_default_timezone_set('UTC');

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$pathInfo = pathinfo($requestUri);

// Remove query string from URI
$cleanUri = strtok($requestUri, '?');

// Handle static files first - check multiple possible locations
$staticPaths = [
    __DIR__ . '/output/public' . $cleanUri,
    __DIR__ . '/public' . $cleanUri,
    __DIR__ . '/godaddy-deploy/output/public' . $cleanUri,
    __DIR__ . '/godaddy-deploy/public' . $cleanUri
];

if (isset($pathInfo['extension'])) {
    foreach ($staticPaths as $staticFile) {
        if (file_exists($staticFile) && is_file($staticFile)) {
            $mimeTypes = [
                'css' => 'text/css',
                'js' => 'application/javascript',
                'json' => 'application/json',
                'png' => 'image/png',
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'svg' => 'image/svg+xml',
                'ico' => 'image/x-icon',
                'woff' => 'font/woff',
                'woff2' => 'font/woff2',
                'ttf' => 'font/ttf',
                'eot' => 'application/vnd.ms-fontobject',
                'xml' => 'application/xml',
                'txt' => 'text/plain'
            ];
            
            $extension = strtolower($pathInfo['extension']);
            if (isset($mimeTypes[$extension])) {
                header('Content-Type: ' . $mimeTypes[$extension]);
            }
            
            // Set cache headers for static assets
            if (in_array($extension, ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'woff', 'woff2'])) {
                header('Cache-Control: public, max-age=31536000');
                header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
            }
            
            readfile($staticFile);
            exit;
        }
    }
}

// Handle API routes - include the API handler
if (strpos($cleanUri, '/api/') === 0) {
    // Try to include the API handler
    if (file_exists(__DIR__ . '/api-handler.php')) {
        include __DIR__ . '/api-handler.php';
        exit;
    } else {
        // Fallback API response
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

// Check if we have a built Nuxt.js application - check multiple locations
$nuxtHtmlPaths = [
    __DIR__ . '/output/public/200.html',
    __DIR__ . '/public/200.html',
    __DIR__ . '/godaddy-deploy/output/public/200.html',
    __DIR__ . '/godaddy-deploy/public/200.html'
];

foreach ($nuxtHtmlPaths as $nuxtHtmlFile) {
    if (file_exists($nuxtHtmlFile)) {
        $content = file_get_contents($nuxtHtmlFile);
        
        // Replace any localhost references with your domain
        $content = str_replace('http://localhost:3000', 'https://worldtripagency.com', $content);
        $content = str_replace('localhost:3000', 'worldtripagency.com', $content);
        
        // Set proper headers
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        echo $content;
        exit;
    }
}

// Fallback: serve a basic HTML page
http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>World Trip Agency</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        h1 { margin-bottom: 20px; }
        p { margin-bottom: 15px; line-height: 1.6; }
        .status { 
            background: rgba(255,255,255,0.2); 
            padding: 20px; 
            border-radius: 5px; 
            margin: 20px 0;
        }
        .links {
            margin-top: 30px;
        }
        .links a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
            padding: 10px 20px;
            border: 1px solid white;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 10px;
        }
        .links a:hover {
            background: rgba(255,255,255,0.2);
        }
        .error {
            background: rgba(255,0,0,0.2);
            border: 1px solid rgba(255,0,0,0.5);
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 World Trip Agency</h1>
        <div class="error">
            <h2>⚠️ Deployment Issue Detected</h2>
            <p>Your Nuxt.js application files are not found in the expected locations.</p>
        </div>
        
        <div class="status">
            <h3>🔍 Debug Information:</h3>
            <p><strong>Current Directory:</strong> <?php echo __DIR__; ?></p>
            <p><strong>Request URI:</strong> <?php echo htmlspecialchars($requestUri); ?></p>
            <p><strong>Clean URI:</strong> <?php echo htmlspecialchars($cleanUri); ?></p>
            
            <h4>📁 Checking for files in:</h4>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                <?php foreach ($nuxtHtmlPaths as $path): ?>
                    <li><?php echo $path; ?> - <?php echo file_exists($path) ? '✅ Found' : '❌ Not found'; ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
        
        <div class="links">
            <a href="/test.php">Test PHP</a>
            <a href="/public/">View Public Files</a>
            <a href="/output/public/">View Output Files</a>
            <a href="/godaddy-deploy/">View Deploy Files</a>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <p>1. Upload your built Nuxt.js files to the correct directory</p>
        <p>2. Ensure the output/public/200.html file exists</p>
        <p>3. Check file permissions (folders: 755, files: 644)</p>
        <p>4. Verify your .htaccess file is in place</p>
    </div>
</body>
</html>
