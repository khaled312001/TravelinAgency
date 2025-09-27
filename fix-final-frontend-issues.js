#!/usr/bin/env node

import fs from 'fs';

console.log('🎯 FIXING FINAL FRONTEND ISSUES');
console.log('=================================\n');

// Create a comprehensive fix for the remaining frontend issues
const finalFrontendFix = `#!/bin/bash
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
RewriteCond %{REQUEST_URI} \\.(css|js|jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot|mp4|webm|ogg|pdf|zip)$
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
`;

fs.writeFileSync('fix-final-frontend-issues.sh', finalFrontendFix);
console.log('✅ Created: fix-final-frontend-issues.sh');

console.log('\n📋 FINAL FRONTEND FIXES:');
console.log('========================');
console.log('Run these commands on your GoDaddy server:');
console.log('');
console.log('# 1. Test current API responses');
console.log('curl -k https://worldtripagency.com/api/packages');
console.log('curl -k https://worldtripagency.com/api/destinations');
console.log('');
console.log('# 2. Create enhanced index.php for better image handling');
console.log('cat > index.php << "EOF"');
console.log('<?php');
console.log('// Enhanced index.php for better image and static file handling');
console.log('header(\'Content-Type: text/html; charset=utf-8\');');
console.log('');
console.log('// Get the request URI');
console.log('$requestUri = $_SERVER[\'REQUEST_URI\'];');
console.log('$cleanUri = parse_url($requestUri, PHP_URL_PATH);');
console.log('');
console.log('// Remove query parameters for routing');
console.log('$cleanUri = strtok($cleanUri, \'?\');');
console.log('');
console.log('// Handle API routes first');
console.log('if (strpos($cleanUri, \'/api/\') === 0) {');
console.log('    // Include the API handler');
console.log('    if (file_exists(__DIR__ . \'/api-handler.php\')) {');
console.log('        include __DIR__ . \'/api-handler.php\';');
console.log('        exit;');
console.log('    }');
console.log('}');
console.log('');
console.log('// Handle IPX image optimization requests');
console.log('if (strpos($cleanUri, \'/_ipx/\') === 0) {');
console.log('    // Extract the original image path from IPX URL');
console.log('    $ipxPath = substr($cleanUri, 6); // Remove \'/_ipx\'');
console.log('    ');
console.log('    // Remove IPX parameters (e.g., f_webp&q_80)');
console.log('    $ipxPath = preg_replace(\'/[?&].*$/\', \'\', $ipxPath);');
console.log('    ');
console.log('    // Check if it\'s an external URL (starts with http)');
console.log('    if (strpos($ipxPath, \'http\') === 0) {');
console.log('        // Redirect to external URL');
console.log('        header(\'Location: \' . $ipxPath, true, 302);');
console.log('        exit;');
console.log('    }');
console.log('    ');
console.log('    // For local images, try to serve them directly');
console.log('    $imagePath = __DIR__ . $ipxPath;');
console.log('    if (file_exists($imagePath)) {');
console.log('        $mimeType = mime_content_type($imagePath);');
console.log('        header(\'Content-Type: \' . $mimeType);');
console.log('        header(\'Cache-Control: public, max-age=31536000\'); // Cache for 1 year');
console.log('        readfile($imagePath);');
console.log('        exit;');
console.log('    }');
console.log('    ');
console.log('    // If image not found, return 404');
console.log('    http_response_code(404);');
console.log('    echo \'Image not found\';');
console.log('    exit;');
console.log('}');
console.log('');
console.log('// Handle static files (CSS, JS, images, videos, etc.)');
console.log('$staticExtensions = [\'css\', \'js\', \'jpg\', \'jpeg\', \'png\', \'gif\', \'webp\', \'svg\', \'ico\', \'woff\', \'woff2\', \'ttf\', \'eot\', \'mp4\', \'webm\', \'ogg\', \'pdf\', \'zip\'];');
console.log('$fileExtension = strtolower(pathinfo($cleanUri, PATHINFO_EXTENSION));');
console.log('');
console.log('if (in_array($fileExtension, $staticExtensions)) {');
console.log('    // Try multiple possible locations for static files');
console.log('    $possiblePaths = [');
console.log('        __DIR__ . $cleanUri,');
console.log('        __DIR__ . \'/public\' . $cleanUri,');
console.log('        __DIR__ . \'/output/public\' . $cleanUri,');
console.log('        __DIR__ . \'/dist\' . $cleanUri,');
console.log('        __DIR__ . \'/output\' . $cleanUri');
console.log('    ];');
console.log('    ');
console.log('    foreach ($possiblePaths as $filePath) {');
console.log('        if (file_exists($filePath)) {');
console.log('            // Set appropriate headers based on file type');
console.log('            if (in_array($fileExtension, [\'css\', \'js\'])) {');
console.log('                header(\'Content-Type: \' . ($fileExtension === \'css\' ? \'text/css\' : \'application/javascript\'));');
console.log('                header(\'Cache-Control: public, max-age=31536000\'); // Cache for 1 year');
console.log('            } elseif (in_array($fileExtension, [\'jpg\', \'jpeg\', \'png\', \'gif\', \'webp\', \'svg\', \'ico\'])) {');
console.log('                $mimeType = mime_content_type($filePath);');
console.log('                header(\'Content-Type: \' . $mimeType);');
console.log('                header(\'Cache-Control: public, max-age=31536000\'); // Cache for 1 year');
console.log('            } elseif (in_array($fileExtension, [\'mp4\', \'webm\', \'ogg\'])) {');
console.log('                $mimeType = mime_content_type($filePath);');
console.log('                header(\'Content-Type: \' . $mimeType);');
console.log('                header(\'Cache-Control: public, max-age=31536000\'); // Cache for 1 year');
console.log('                header(\'Accept-Ranges: bytes\');');
console.log('            }');
console.log('            ');
console.log('            readfile($filePath);');
console.log('            exit;');
console.log('        }');
console.log('    }');
console.log('    ');
console.log('    // If static file not found, return 404');
console.log('    http_response_code(404);');
console.log('    echo \'File not found: \' . $cleanUri;');
console.log('    exit;');
console.log('}');
console.log('');
console.log('// Handle Nuxt.js static assets');
console.log('if (strpos($cleanUri, \'/_nuxt/\') === 0) {');
console.log('    $nuxtPath = __DIR__ . \'/output\' . $cleanUri;');
console.log('    if (file_exists($nuxtPath)) {');
console.log('        $fileExtension = strtolower(pathinfo($nuxtPath, PATHINFO_EXTENSION));');
console.log('        if ($fileExtension === \'css\') {');
console.log('            header(\'Content-Type: text/css\');');
console.log('        } elseif ($fileExtension === \'js\') {');
console.log('            header(\'Content-Type: application/javascript\');');
console.log('        }');
console.log('        header(\'Cache-Control: public, max-age=31536000\'); // Cache for 1 year');
console.log('        readfile($nuxtPath);');
console.log('        exit;');
console.log('    }');
console.log('}');
console.log('');
console.log('// Serve the main Nuxt.js application');
console.log('$nuxtFiles = [');
console.log('    __DIR__ . \'/output/index.html\',');
console.log('    __DIR__ . \'/output/200.html\',');
console.log('    __DIR__ . \'/dist/index.html\',');
console.log('    __DIR__ . \'/index.html\'');
console.log('];');
console.log('');
console.log('foreach ($nuxtFiles as $nuxtFile) {');
console.log('    if (file_exists($nuxtFile)) {');
console.log('        $content = file_get_contents($nuxtFile);');
console.log('        ');
console.log('        // Fix any relative paths in the HTML');
console.log('        $content = str_replace(\'src="/\', \'src="\', $content);');
console.log('        $content = str_replace(\'href="/\', \'href="\', $content);');
console.log('        ');
console.log('        echo $content;');
console.log('        exit;');
console.log('    }');
console.log('}');
console.log('');
console.log('// Fallback: return a basic HTML page');
console.log('http_response_code(200);');
console.log('echo \'<!DOCTYPE html>');
console.log('<html>');
console.log('<head>');
console.log('    <title>World Trip Agency</title>');
console.log('    <meta charset="utf-8">');
console.log('    <meta name="viewport" content="width=device-width, initial-scale=1">');
console.log('</head>');
console.log('<body>');
console.log('    <h1>World Trip Agency</h1>');
console.log('    <p>Website is loading...</p>');
console.log('    <p>If you see this message, please contact support.</p>');
console.log('</body>');
console.log('</html>\';');
console.log('?>');
console.log('EOF');
console.log('');
console.log('# 3. Create enhanced .htaccess for better routing');
console.log('cat > .htaccess << "EOF"');
console.log('RewriteEngine On');
console.log('');
console.log('# Allow PHP files to execute');
console.log('<Files "*.php">');
console.log('    Order allow,deny');
console.log('    Allow from all');
console.log('</Files>');
console.log('');
console.log('# Handle API routes first');
console.log('RewriteCond %{REQUEST_URI} ^/api/');
console.log('RewriteRule ^(.*)$ /index.php [QSA,L]');
console.log('');
console.log('# Handle _nuxt assets (Nuxt.js static files)');
console.log('RewriteCond %{REQUEST_URI} ^/_nuxt/');
console.log('RewriteRule ^(.*)$ /index.php [QSA,L]');
console.log('');
console.log('# Handle _ipx image optimization');
console.log('RewriteCond %{REQUEST_URI} ^/_ipx/');
console.log('RewriteRule ^(.*)$ /index.php [QSA,L]');
console.log('');
console.log('# Handle static files (CSS, JS, images, videos, etc.)');
console.log('RewriteCond %{REQUEST_URI} \\.(css|js|jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot|mp4|webm|ogg|pdf|zip)$');
console.log('RewriteRule ^(.*)$ /index.php [QSA,L]');
console.log('');
console.log('# Handle everything else through index.php');
console.log('RewriteCond %{REQUEST_FILENAME} !-f');
console.log('RewriteCond %{REQUEST_FILENAME} !-d');
console.log('RewriteRule ^(.*)$ /index.php [QSA,L]');
console.log('EOF');
console.log('');
console.log('# 4. Test the fixes');
console.log('curl -k https://worldtripagency.com/');
console.log('curl -k https://worldtripagency.com/api/packages');
console.log('');
console.log('🎯 This should fix all remaining frontend issues!');
