<?php
/**
 * Ultimate GoDaddy Hosting - Nuxt.js Application Entry Point
 * This file serves as the entry point for your Nuxt.js application on GoDaddy hosting
 * with comprehensive image path fixes and IPX optimization handling
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
    // Example: /_ipx/f_webp&q_80/images/destinations/global/Barcelona/Barcelona1.jpeg
    // Should become: /output/public/images/destinations/global/Barcelona/Barcelona1.jpeg
    
    $ipxPath = $cleanUri;
    $originalPath = '';
    
    // Remove /_ipx/ prefix
    $ipxPath = substr($ipxPath, 6);
    
    // Find the first occurrence of /images/ or /videos/
    if (preg_match('/\/(images|videos)\//', $ipxPath, $matches, PREG_OFFSET_CAPTURE)) {
        $originalPath = substr($ipxPath, $matches[0][1]);
        $originalPath = '/output/public' . $originalPath;
        
        // Check if the original file exists
        $staticPaths = [
            __DIR__ . $originalPath,
            __DIR__ . '/output/public' . substr($ipxPath, $matches[0][1]),
            __DIR__ . '/public' . substr($ipxPath, $matches[0][1])
        ];
        
        foreach ($staticPaths as $staticFile) {
            if (file_exists($staticFile) && is_file($staticFile)) {
                // Set appropriate headers
                $extension = strtolower(pathinfo($staticFile, PATHINFO_EXTENSION));
                $mimeTypes = [
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'webp' => 'image/webp',
                    'svg' => 'image/svg+xml',
                    'webm' => 'video/webm',
                    'mp4' => 'video/mp4'
                ];
                
                if (isset($mimeTypes[$extension])) {
                    header('Content-Type: ' . $mimeTypes[$extension]);
                }
                
                // Set cache headers
                header('Cache-Control: public, max-age=31536000');
                header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
                
                readfile($staticFile);
                exit;
            }
        }
    }
    
    // If no original file found, return 404
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Image not found', 'ipx_path' => $cleanUri]);
    exit;
}

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
                'txt' => 'text/plain',
                'webm' => 'video/webm',
                'mp4' => 'video/mp4'
            ];
            
            $extension = strtolower($pathInfo['extension']);
            if (isset($mimeTypes[$extension])) {
                header('Content-Type: ' . $mimeTypes[$extension]);
            }
            
            // Set cache headers for static assets
            if (in_array($extension, ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'woff', 'woff2', 'webm', 'mp4'])) {
                header('Cache-Control: public, max-age=31536000');
                header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
            }
            
            readfile($staticFile);
            exit;
        }
    }
}

// Handle API routes - use the database-connected API handler
if (strpos($cleanUri, '/api/') === 0) {
    // Include the database-connected API handler
    if (file_exists(__DIR__ . '/api-handler-database.php')) {
        include __DIR__ . '/api-handler-database.php';
    } else if (file_exists(__DIR__ . '/api-handler-enhanced.php')) {
        include __DIR__ . '/api-handler-enhanced.php';
    } else if (file_exists(__DIR__ . '/api-handler.php')) {
        include __DIR__ . '/api-handler.php';
    } else {
        // Fallback to simple response
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'API endpoint', 'uri' => $cleanUri]);
    }
    exit;
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
        $content = str_replace('http://localhost:3000', 'https://travelin-agency-nlcs.vercel.app', $content);
        $content = str_replace('localhost:3000', 'worldtripagency.com', $content);
        
        // Comprehensive image path fixes
        // Fix /images/ paths
        $content = str_replace('"/images/', '"/output/public/images/', $content);
        $content = str_replace("'/images/", "'/output/public/images/", $content);
        $content = str_replace('src="/images/', 'src="/output/public/images/', $content);
        $content = str_replace("src='/images/", "src='/output/public/images/", $content);
        $content = str_replace('url("/images/', 'url("/output/public/images/', $content);
        $content = str_replace("url('/images/", "url('/output/public/images/", $content);
        
        // Fix /videos/ paths
        $content = str_replace('"/videos/', '"/output/public/videos/', $content);
        $content = str_replace("'/videos/", "'/output/public/videos/", $content);
        $content = str_replace('src="/videos/', 'src="/output/public/videos/', $content);
        $content = str_replace("src='/videos/", "src='/output/public/videos/", $content);
        
        // Fix /_nuxt/ paths
        $content = str_replace('"/_nuxt/', '"/output/public/_nuxt/', $content);
        $content = str_replace("'/_nuxt/", "'/output/public/_nuxt/", $content);
        
        // Fix any remaining asset paths
        $content = str_replace('"/assets/', '"/output/public/assets/', $content);
        $content = str_replace("'/assets/", "'/output/public/assets/", $content);
        
        // Disable IPX image optimization by replacing IPX URLs with direct image URLs
        $content = preg_replace('/\/_ipx\/[^"\']*?\/images\//', '/output/public/images/', $content);
        $content = preg_replace('/\/_ipx\/[^"\']*?\/videos\//', '/output/public/videos/', $content);
        
        // Set proper headers
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        echo $content;
        exit;
    }
}

// Fallback: serve a basic HTML page with debugging information
http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>World Trip Agency - Debug Mode</title>
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
            max-width: 800px;
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
            text-align: left;
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
        .success {
            background: rgba(0,255,0,0.2);
            border: 1px solid rgba(0,255,0,0.5);
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        pre {
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 World Trip Agency - Debug Mode</h1>
        
        <div class="success">
            <h2>✅ Ultimate Index.php is Active!</h2>
            <p>This is the enhanced version with IPX image optimization fixes and database connectivity.</p>
        </div>
        
        <div class="status">
            <h3>🔍 Debug Information:</h3>
            <p><strong>Current Directory:</strong> <?php echo __DIR__; ?></p>
            <p><strong>Request URI:</strong> <?php echo htmlspecialchars($requestUri); ?></p>
            <p><strong>Clean URI:</strong> <?php echo htmlspecialchars($cleanUri); ?></p>
            <p><strong>PHP Version:</strong> <?php echo phpversion(); ?></p>
            <p><strong>Server Time:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
            
            <h4>📁 Checking for Nuxt.js files in:</h4>
            <ul style="text-align: left; max-width: 600px; margin: 0 auto;">
                <?php foreach ($nuxtHtmlPaths as $path): ?>
                    <li><?php echo $path; ?> - <?php echo file_exists($path) ? '✅ Found' : '❌ Not found'; ?></li>
                <?php endforeach; ?>
            </ul>
            
            <h4>🗄️ Database Connection Test:</h4>
            <?php
            // Test database connection
            $dbHost = getenv('DB_HOST') ?: 'localhost';
            $dbUser = getenv('DB_USER') ?: 'travel';
            $dbPassword = getenv('DB_PASSWORD') ?: 'support@Passord123';
            $dbName = getenv('DB_NAME') ?: 'travel';
            
            try {
                $conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
                if ($conn->connect_error) {
                    echo '<p style="color: #ff6b6b;">❌ Database connection failed: ' . $conn->connect_error . '</p>';
                } else {
                    echo '<p style="color: #51cf66;">✅ Database connection successful!</p>';
                    echo '<p><strong>Host:</strong> ' . $dbHost . '</p>';
                    echo '<p><strong>Database:</strong> ' . $dbName . '</p>';
                    echo '<p><strong>User:</strong> ' . $dbUser . '</p>';
                    
                    // Test a simple query
                    $result = $conn->query("SHOW TABLES");
                    if ($result) {
                        echo '<p><strong>Tables found:</strong> ' . $result->num_rows . '</p>';
                    }
                    $conn->close();
                }
            } catch (Exception $e) {
                echo '<p style="color: #ff6b6b;">❌ Database error: ' . $e->getMessage() . '</p>';
            }
            ?>
        </div>
        
        <div class="links">
            <a href="/simple-test.php">Test PHP</a>
            <a href="/api/packages">API Packages</a>
            <a href="/api/destinations">API Destinations</a>
            <a href="/api/cms/site-settings">CMS Settings</a>
            <a href="/output/public/">View Output Files</a>
        </div>
        
        <div class="status">
            <h3>🔧 What This Ultimate Version Does:</h3>
            <ul style="text-align: left; max-width: 600px; margin: 0 auto;">
                <li>✅ Handles IPX image optimization requests</li>
                <li>✅ Redirects IPX URLs to original images</li>
                <li>✅ Connects to MySQL database for real data</li>
                <li>✅ Provides fallback sample data if DB fails</li>
                <li>✅ Fixes all image and asset paths</li>
                <li>✅ Handles static files from multiple locations</li>
                <li>✅ Comprehensive error handling and logging</li>
            </ul>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <p>1. Upload your built Nuxt.js files to the correct directory</p>
        <p>2. Ensure the output/public/200.html file exists</p>
        <p>3. Check file permissions (folders: 755, files: 644)</p>
        <p>4. Verify your .htaccess file is in place</p>
        <p>5. Test the API endpoints above</p>
    </div>
</body>
</html>
