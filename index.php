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

// Handle static files first
if (isset($pathInfo['extension'])) {
    $staticFile = __DIR__ . '/public' . $cleanUri;
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

// Handle API routes - try to proxy to Node.js if available
if (strpos($cleanUri, '/api/') === 0) {
    // For now, return a simple response for API routes
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'API endpoint', 'uri' => $cleanUri]);
    exit;
}

// Check if we have a built Nuxt.js application
$nuxtHtmlFile = __DIR__ . '/public/index.html';
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
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 World Trip Agency</h1>
        <div class="status">
            <h2>Website is Ready!</h2>
            <p>Your Nuxt.js application is now running on GoDaddy hosting.</p>
            <p>PHP is working correctly and ready to serve your application.</p>
        </div>
        
        <div class="links">
            <a href="/test.php">Test PHP</a>
            <a href="/public/">View Public Files</a>
            <a href="/api/">API Endpoints</a>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <p>1. Upload your built Nuxt.js files to the public/ directory</p>
        <p>2. Set up your database connection</p>
        <p>3. Configure your environment variables</p>
    </div>
</body>
</html>