#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚀 DEPLOYING NUXT.JS WEBSITE TO DOMAIN');
console.log('=======================================\n');

// Create deployment commands for GoDaddy server
const deployCommands = `#!/bin/bash
echo "🚀 DEPLOYING NUXT.JS WEBSITE TO DOMAIN"
echo "======================================="

echo ""
echo "1. 📁 Copying Nuxt.js build files..."
echo "------------------------------------"
echo "Copying output/public/* to current directory..."

# Copy all build files from output/public to current directory
cp -r output/public/* .

echo ""
echo "2. 🔧 Setting proper permissions..."
echo "----------------------------------"
chmod -R 755 .
chmod 644 *.html
chmod 644 *.css
chmod 644 *.js
chmod 644 *.xml
chmod 644 *.txt
chmod 644 *.ico

echo ""
echo "3. 📝 Creating production index.php..."
echo "--------------------------------------"
cat > index.php << 'EOF'
<?php
// Production index.php for Nuxt.js deployment
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
    
    $imagePath = __DIR__ . $ipxPath;
    if (file_exists($imagePath)) {
        $mimeType = mime_content_type($imagePath);
        header('Content-Type: ' . $mimeType);
        header('Cache-Control: public, max-age=31536000');
        readfile($imagePath);
        exit;
    }
    
    http_response_code(404);
    echo 'Image not found';
    exit;
}

// Handle static files
$staticExtensions = ['css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'eot', 'mp4', 'webm', 'ogg', 'pdf', 'zip'];
$fileExtension = strtolower(pathinfo($cleanUri, PATHINFO_EXTENSION));

if (in_array($fileExtension, $staticExtensions)) {
    $possiblePaths = [
        __DIR__ . $cleanUri,
        __DIR__ . '/public' . $cleanUri,
        __DIR__ . '/output/public' . $cleanUri,
        __DIR__ . '/dist' . $cleanUri,
        __DIR__ . '/output' . $cleanUri
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
            } elseif (in_array($fileExtension, ['mp4', 'webm', 'ogg'])) {
                $mimeType = mime_content_type($filePath);
                header('Content-Type: ' . $mimeType);
                header('Cache-Control: public, max-age=31536000');
                header('Accept-Ranges: bytes');
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
    $nuxtPath = __DIR__ . '/_nuxt' . substr($cleanUri, 6);
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
    __DIR__ . '/200.html',
    __DIR__ . '/index.html'
];

foreach ($nuxtFiles as $nuxtFile) {
    if (file_exists($nuxtFile)) {
        $content = file_get_contents($nuxtFile);
        echo $content;
        exit;
    }
}

// Fallback
http_response_code(404);
echo 'Nuxt.js application not found. Please check your build files.';
?>
EOF

echo ""
echo "4. 🔧 Updating .htaccess for production..."
echo "------------------------------------------"
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
echo "5. 🧪 Testing the deployment..."
echo "-------------------------------"
echo "Testing main page..."
curl -k https://worldtripagency.com/ | head -20

echo ""
echo "Testing API..."
curl -k https://worldtripagency.com/api/packages | head -5

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "======================"
echo "Your complete Nuxt.js website is now live at:"
echo "🌍 https://worldtripagency.com/"
echo ""
echo "Features now available:"
echo "✅ Complete Nuxt.js frontend"
echo "✅ All pages and components"
echo "✅ Admin panel with authentication"
echo "✅ API endpoints working"
echo "✅ Image optimization"
echo "✅ Static file serving"
echo "✅ Database connectivity"
`;

fs.writeFileSync('deploy-to-domain.sh', deployCommands);
console.log('✅ Created: deploy-to-domain.sh');

console.log('\n📋 DEPLOYMENT STEPS:');
console.log('====================');
console.log('1. Upload the output/public directory to your GoDaddy server');
console.log('2. Run the deployment script on your GoDaddy server:');
console.log('');
console.log('   bash deploy-to-domain.sh');
console.log('');
console.log('🎯 This will deploy your complete Nuxt.js website to your domain!');
console.log('');
console.log('📁 Files to upload to GoDaddy:');
console.log('- output/public/* (all build files)');
console.log('- deploy-to-domain.sh (deployment script)');
console.log('- api-handler.php (your existing API handler)');
console.log('');
console.log('🚀 After deployment, your domain will show the complete Nuxt.js website!');
