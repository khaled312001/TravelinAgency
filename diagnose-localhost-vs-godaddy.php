<?php
// Diagnose differences between localhost and GoDaddy image serving
echo "<h1>🔍 Diagnose Localhost vs GoDaddy Image Serving</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🎯 Problem Analysis</h3>";
echo "<div class='info'>Website works 100% on localhost:3000 but images don't show on GoDaddy domain</div>";
echo "<div class='warning'>This indicates a server configuration or path issue on GoDaddy</div>";

echo "<h3>🔍 Comprehensive Image Path Analysis</h3>";

// Test different image paths and configurations
$testPaths = [
    // Direct paths
    '/images/home/logo/WonderlandLogoWhite.svg',
    '/images/home/services/support_24_7.jpg',
    '/images/destinations/global/Barcelona/Barcelona1.jpeg',
    
    // With public prefix
    '/public/images/home/logo/WonderlandLogoWhite.svg',
    '/public/images/home/services/support_24_7.jpg',
    
    // With output/public prefix
    '/output/public/images/home/logo/WonderlandLogoWhite.svg',
    '/output/public/images/home/services/support_24_7.jpg',
    
    // Symlink paths
    '/images/home/logo/WonderlandLogoWhite.svg',
    '/images/home/services/support_24_7.jpg'
];

echo "<h4>📋 Testing All Possible Image Paths</h4>";
$baseUrl = 'https://worldtripagency.com';

foreach ($testPaths as $path) {
    echo "<div class='info'>Testing: $path</div>";
    
    // Check if file exists locally
    $localPath = __DIR__ . $path;
    $exists = file_exists($localPath);
    
    if ($exists) {
        $size = filesize($localPath);
        echo "<div class='success'>✅ Local file exists - Size: " . number_format($size) . " bytes</div>";
    } else {
        echo "<div class='error'>❌ Local file missing: $localPath</div>";
    }
    
    // Test web access
    $testUrl = $baseUrl . $path;
    echo "<div class='info'>Web URL: <a href='$testUrl' target='_blank'>$testUrl</a></div>";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $testUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    curl_close($ch);
    
    if ($httpCode == 200) {
        echo "<div class='success'>✅ Web access OK - HTTP $httpCode, Type: $contentType</div>";
    } else {
        echo "<div class='error'>❌ Web access failed - HTTP $httpCode</div>";
    }
    
    if ($finalUrl != $testUrl) {
        echo "<div class='info'>🔄 Redirected to: $finalUrl</div>";
    }
    
    echo "<br>";
}

echo "<h3>🔧 Current Server Configuration</h3>";

// Check current .htaccess
echo "<h4>📄 Current .htaccess Content</h4>";
if (file_exists('.htaccess')) {
    $htaccess = file_get_contents('.htaccess');
    echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;max-height:300px;overflow:auto;'>";
    echo htmlspecialchars($htaccess);
    echo "</pre>";
} else {
    echo "<div class='error'>❌ .htaccess file not found</div>";
}

// Check symlinks
echo "<h4>🔗 Symlink Status</h4>";
$symlinks = ['images', 'videos'];
foreach ($symlinks as $link) {
    if (is_link($link)) {
        $target = readlink($link);
        echo "<div class='success'>✅ Symlink: $link -> $target</div>";
    } else {
        echo "<div class='warning'>⚠️ Not a symlink: $link</div>";
    }
}

// Check directory structure
echo "<h4>📁 Directory Structure</h4>";
$dirs = ['public', 'public/images', 'output', 'output/public', 'output/public/images'];
foreach ($dirs as $dir) {
    if (is_dir($dir)) {
        $perms = substr(sprintf('%o', fileperms($dir)), -4);
        echo "<div class='success'>✅ Directory exists: $dir (perms: $perms)</div>";
    } else {
        echo "<div class='error'>❌ Directory missing: $dir</div>";
    }
}

echo "<h3>🛠️ Potential Solutions</h3>";

echo "<h4>1. Create Multiple Access Points</h4>";
echo "<div class='info'>Create symlinks for all possible image paths:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "# Create comprehensive symlinks
ln -sf public/images images
ln -sf public/images public_images
ln -sf output/public/images output_images
ln -sf public public_dir";
echo "</pre>";

echo "<h4>2. Update .htaccess for Multiple Paths</h4>";
echo "<div class='info'>Add rules to handle all possible image paths:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "# Handle multiple image path patterns
RewriteCond %{REQUEST_URI} ^/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteRule ^images/(.*)$ public/images/$1 [L]

RewriteCond %{REQUEST_URI} ^/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteRule ^public/images/(.*)$ public/images/$1 [L]

RewriteCond %{REQUEST_URI} ^/output/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteRule ^output/public/images/(.*)$ public/images/$1 [L]";
echo "</pre>";

echo "<h4>3. Check Nuxt.js Configuration</h4>";
echo "<div class='info'>The issue might be in how Nuxt.js is configured for production. Check:</div>";
echo "<ul>";
echo "<li>Base URL configuration in nuxt.config.ts</li>";
echo "<li>Image provider settings</li>";
echo "<li>Static asset handling</li>";
echo "<li>Build output configuration</li>";
echo "</ul>";

echo "<h3>🧪 Quick Test Commands</h3>";
echo "<div class='info'>Run these commands to test different approaches:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "# Test direct file access
curl -I https://worldtripagency.com/images/home/logo/WonderlandLogoWhite.svg
curl -I https://worldtripagency.com/public/images/home/logo/WonderlandLogoWhite.svg

# Check if files exist
ls -la public/images/home/logo/
ls -la output/public/images/home/logo/

# Test symlinks
ls -la images/
ls -la public_images/";
echo "</pre>";

echo "<h3>📊 Summary</h3>";
echo "<div class='info'>The fact that localhost works but GoDaddy doesn't suggests:</div>";
echo "<ol>";
echo "<li><strong>Path Resolution Issue:</strong> Nuxt.js might be using different paths in production</li>";
echo "<li><strong>Server Configuration:</strong> GoDaddy might need specific rewrite rules</li>";
echo "<li><strong>Build Output:</strong> The production build might be looking in different directories</li>";
echo "<li><strong>Base URL:</strong> The application might be using absolute URLs that don't match the server structure</li>";
echo "</ol>";

echo "<div class='warning'>⚠️ Next step: Run the comprehensive symlink creation script to ensure all possible paths work.</div>";
?>
