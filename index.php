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

// Check if this is a static file request
$requestUri = $_SERVER['REQUEST_URI'];
$pathInfo = pathinfo($requestUri);

// If it's a static file that exists, serve it directly
if (isset($pathInfo['extension'])) {
    $staticFile = __DIR__ . '/public' . $requestUri;
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
            'eot' => 'application/vnd.ms-fontobject'
        ];
        
        $extension = strtolower($pathInfo['extension']);
        if (isset($mimeTypes[$extension])) {
            header('Content-Type: ' . $mimeTypes[$extension]);
        }
        
        // Set cache headers for static assets
        header('Cache-Control: public, max-age=31536000');
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
        
        readfile($staticFile);
        exit;
    }
}

// For API routes, handle them with Node.js if available
if (strpos($requestUri, '/api/') === 0) {
    // Try to proxy to Node.js server if running
    $nodeServer = 'http://localhost:3000' . $requestUri;
    
    $context = stream_context_create([
        'http' => [
            'method' => $_SERVER['REQUEST_METHOD'],
            'header' => getallheaders(),
            'content' => file_get_contents('php://input'),
            'timeout' => 30
        ]
    ]);
    
    $response = @file_get_contents($nodeServer, false, $context);
    if ($response !== false) {
        // Forward response headers
        if (isset($http_response_header)) {
            foreach ($http_response_header as $header) {
                if (strpos($header, 'HTTP/') === 0) {
                    http_response_code(intval(substr($header, 9, 3)));
                } else {
                    header($header);
                }
            }
        }
        echo $response;
        exit;
    }
}

// For all other requests, serve the main HTML file
$htmlFile = __DIR__ . '/public/index.html';
if (file_exists($htmlFile)) {
    $content = file_get_contents($htmlFile);
    
    // Replace any localhost references with your domain
    $content = str_replace('http://localhost:3000', 'https://worldtripagency.com', $content);
    $content = str_replace('localhost:3000', 'worldtripagency.com', $content);
    
    // Set proper headers
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    echo $content;
} else {
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
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌍 World Trip Agency</h1>
            <div class="status">
                <h2>Website is being deployed...</h2>
                <p>Your Nuxt.js application is being set up on GoDaddy hosting.</p>
                <p>Please wait while we complete the deployment process.</p>
            </div>
            <p>If you continue to see this message, please contact support.</p>
        </div>
    </body>
    </html>
    <?php
}
?>
