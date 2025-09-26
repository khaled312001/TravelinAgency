<?php
/**
 * API Fix - GoDaddy Hosting - Nuxt.js Application Entry Point
 * This file serves as the entry point for your Nuxt.js application on GoDaddy hosting
 * with fixed API routing to use the current api-handler.php
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

// Handle IPX image optimization requests - redirect to original images
if (strpos($cleanUri, '/_ipx/') === 0) {
    // Extract the original image path from IPX URL
    $ipxPath = $cleanUri;
    
    // Remove /_ipx/ prefix
    $ipxPath = substr($ipxPath, 6);
    
    // Check if it's an external URL (like Pexels)
    if (strpos($ipxPath, 'https://') !== false || strpos($ipxPath, 'http://') !== false) {
        // For external URLs, redirect to the original external URL
        $externalUrl = '';
        if (preg_match('/(https?:\/\/[^\s&]+)/', $ipxPath, $matches)) {
            $externalUrl = $matches[1];
        }
        if ($externalUrl) {
            header("Location: " . $externalUrl);
            exit;
        }
    } else {
        // For local IPX images, try to serve the original image
        $possibleImagePaths = [
            __DIR__ . '/output/public/' . $ipxPath,
            __DIR__ . '/public/' . $ipxPath,
            __DIR__ . '/' . $ipxPath,
        ];

        foreach ($possibleImagePaths as $imagePath) {
            if (file_exists($imagePath) && is_file($imagePath)) {
                $mimeType = mime_content_type($imagePath);
                header('Content-Type: ' . $mimeType);
                readfile($imagePath);
                exit;
            }
        }
    }
    // If not found, fall through to 404 or main HTML
}

// Function to serve a file with appropriate headers
function serveFile($filePath, $mimeType = null, $cache = true) {
    if (!file_exists($filePath) || !is_file($filePath)) {
        return false;
    }

    if ($mimeType === null) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $filePath);
        finfo_close($finfo);
    }

    header('Content-Type: ' . $mimeType);
    if ($cache) {
        header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
    } else {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
    }
    readfile($filePath);
    exit;
}

// Handle static files first - check multiple possible locations
$staticPaths = [
    __DIR__ . '/output/public' . $cleanUri,
    __DIR__ . '/public' . $cleanUri,
    __DIR__ . $cleanUri, // For assets directly in public_html
    __DIR__ . '/output/public/_nuxt' . $cleanUri, // For Nuxt assets
    __DIR__ . '/_nuxt' . $cleanUri, // For Nuxt assets if output/public is not the base
];

if (isset($pathInfo['extension'])) {
    foreach ($staticPaths as $staticFile) {
        if (file_exists($staticFile) && is_file($staticFile)) {
            serveFile($staticFile);
        }
    }
}

// Handle API routes - FIXED: Use current api-handler.php
if (strpos($cleanUri, '/api/') === 0) {
    // Use the current api-handler.php file
    if (file_exists(__DIR__ . '/api-handler.php')) {
        include __DIR__ . '/api-handler.php';
        exit;
    } else {
        // Fallback to simple response
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'API endpoint', 'uri' => $cleanUri, 'error' => 'api-handler.php not found']);
        exit;
    }
}

// Check if we have a built Nuxt.js application - check multiple locations
$nuxtHtmlPaths = [
    __DIR__ . '/output/public/200.html',
    __DIR__ . '/public/200.html',
    __DIR__ . '/200.html'
];

foreach ($nuxtHtmlPaths as $nuxtHtmlFile) {
    if (file_exists($nuxtHtmlFile)) {
        $content = file_get_contents($nuxtHtmlFile);
        // Replace any localhost references if necessary (e.g., for API calls)
        $content = str_replace('http://localhost:3000', '', $content);
        header('Content-Type: text/html');
        echo $content;
        exit;
    }
}

// Fallback: If no Nuxt.js build or static file, show a debug page
http_response_code(404);
echo "<h1>404 Not Found</h1>";
echo "<p>The requested URL " . htmlspecialchars($requestUri) . " was not found on this server.</p>";
echo "<p>Debug Info:</p>";
echo "<ul>";
echo "<li>Current Directory: " . __DIR__ . "</li>";
echo "<li>Request URI: " . htmlspecialchars($requestUri) . "</li>";
echo "<li>Clean URI: " . htmlspecialchars($cleanUri) . "</li>";
echo "<li>Path Info: " . print_r($pathInfo, true) . "</li>";
echo "<li>PHP Version: " . phpversion() . "</li>";
echo "<li>Static Paths Checked:</li>";
echo "<ul>";
foreach ($staticPaths as $path) {
    echo "<li>" . htmlspecialchars($path) . " (Exists: " . (file_exists($path) ? 'Yes' : 'No') . ")</li>";
}
echo "</ul>";
echo "<li>Nuxt HTML Paths Checked:</li>";
echo "<ul>";
foreach ($nuxtHtmlPaths as $path) {
    echo "<li>" . htmlspecialchars($path) . " (Exists: " . (file_exists($path) ? 'Yes' : 'No') . ")</li>";
}
echo "</ul>";
echo "<li>API Handler Status:</li>";
echo "<ul>";
echo "<li>api-handler.php: " . (file_exists(__DIR__ . '/api-handler.php') ? 'Exists' : 'Not Found') . "</li>";
echo "</ul>";
echo "</ul>";
?>
