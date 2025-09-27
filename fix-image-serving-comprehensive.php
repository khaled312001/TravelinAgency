<?php
// Comprehensive image serving fix for GoDaddy
echo "<h1>🖼️ Comprehensive Image Serving Fix</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🔍 Diagnosing Image Serving Issues</h3>";

// Test specific image files that are failing
$testImages = [
    '/images/home/logo/WonderlandLogoWhite.svg',
    '/images/home/services/support_24_7.jpg',
    '/images/home/services/tourism_consultation.jpg',
    '/images/home/services/hotel_reservations.jpg',
    '/images/destinations/global/Barcelona/Barcelona1.jpeg',
    '/images/packages/pexels-photo-338515.jpg'
];

echo "<h4>📋 Testing Image File Access</h4>";
foreach ($testImages as $imagePath) {
    $fullPath = __DIR__ . '/public' . $imagePath;
    echo "<div class='info'>Testing: $imagePath</div>";
    
    if (file_exists($fullPath)) {
        $size = filesize($fullPath);
        $perms = substr(sprintf('%o', fileperms($fullPath)), -4);
        echo "<div class='success'>✅ File exists - Size: " . number_format($size) . " bytes, Perms: $perms</div>";
        
        // Test if file is readable
        if (is_readable($fullPath)) {
            echo "<div class='success'>✅ File is readable</div>";
        } else {
            echo "<div class='error'>❌ File is not readable</div>";
        }
    } else {
        echo "<div class='error'>❌ File does not exist</div>";
    }
    echo "<br>";
}

// Check directory permissions
echo "<h4>📁 Directory Permissions Check</h4>";
$directories = [
    'public',
    'public/images',
    'public/images/home',
    'public/images/home/logo',
    'public/images/home/services',
    'public/images/destinations',
    'public/images/destinations/global',
    'public/images/packages'
];

foreach ($directories as $dir) {
    if (is_dir($dir)) {
        $perms = substr(sprintf('%o', fileperms($dir)), -4);
        $readable = is_readable($dir) ? 'Yes' : 'No';
        echo "<div class='success'>✅ $dir - Perms: $perms, Readable: $readable</div>";
    } else {
        echo "<div class='error'>❌ Directory not found: $dir</div>";
    }
}

// Check .htaccess content
echo "<h4>🔧 .htaccess Analysis</h4>";
if (file_exists('.htaccess')) {
    $htaccess = file_get_contents('.htaccess');
    echo "<div class='success'>✅ .htaccess exists</div>";
    
    // Check for image-related rules
    if (strpos($htaccess, 'RewriteCond %{REQUEST_URI} ^/images/') !== false) {
        echo "<div class='success'>✅ Found image rewrite rules</div>";
    } else {
        echo "<div class='warning'>⚠️ No specific image rewrite rules found</div>";
    }
    
    if (strpos($htaccess, 'DirectoryIndex') !== false) {
        echo "<div class='success'>✅ DirectoryIndex directive found</div>";
    } else {
        echo "<div class='warning'>⚠️ DirectoryIndex directive missing</div>";
    }
} else {
    echo "<div class='error'>❌ .htaccess file not found</div>";
}

// Test web server response
echo "<h4>🌐 Web Server Response Test</h4>";
$testUrl = 'https://travelin-agency-nlcs.vercel.app/images/home/logo/WonderlandLogoWhite.svg';
echo "<div class='info'>Testing URL: $testUrl</div>";

// Use cURL to test the URL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $testUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

echo "<div class='info'>HTTP Code: $httpCode</div>";
echo "<div class='info'>Content Type: $contentType</div>";

if ($httpCode == 200) {
    echo "<div class='success'>✅ Image is accessible via web</div>";
} else {
    echo "<div class='error'>❌ Image not accessible via web (HTTP $httpCode)</div>";
}

echo "<h3>🛠️ Recommended Fixes</h3>";
echo "<div class='info'>Based on the analysis, here are the recommended fixes:</div>";

echo "<h4>1. Update .htaccess for Better Image Serving</h4>";
echo "<div class='info'>Create a new .htaccess with optimized image serving rules:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "DirectoryIndex index.php index.html

# Enable rewrite engine
RewriteEngine On

# Force HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle static files directly (CSS, JS, images, etc.)
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Handle API routes
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^(.*)$ api-handler.php [QSA,L]

# Handle Nuxt.js client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# Set proper MIME types for images
AddType image/svg+xml .svg
AddType image/webp .webp
AddType image/avif .avif

# Enable Gzip compression
&lt;IfModule mod_deflate.c&gt;
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript image/svg+xml
&lt;/IfModule&gt;

# Set cache headers for images
&lt;IfModule mod_expires.c&gt;
    ExpiresActive On
    ExpiresByType image/jpg \"access 1 year\"
    ExpiresByType image/jpeg \"access 1 year\"
    ExpiresByType image/gif \"access 1 year\"
    ExpiresByType image/png \"access 1 year\"
    ExpiresByType image/webp \"access 1 year\"
    ExpiresByType image/svg+xml \"access 1 year\"
    ExpiresByType image/avif \"access 1 year\"
&lt;/IfModule&gt;";
echo "</pre>";

echo "<h4>2. Fix File Permissions</h4>";
echo "<div class='info'>Run these commands to fix permissions:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "# Fix directory permissions
find public/images -type d -exec chmod 755 {} \;

# Fix file permissions  
find public/images -type f -exec chmod 644 {} \;

# Ensure public directory is accessible
chmod 755 public
chmod 755 public/images";
echo "</pre>";

echo "<h4>3. Test Direct Image Access</h4>";
echo "<div class='info'>Test these URLs directly in your browser:</div>";
echo "<ul>";
foreach ($testImages as $imagePath) {
    echo "<li><a href='https://travelin-agency-nlcs.vercel.app$imagePath' target='_blank'>https://travelin-agency-nlcs.vercel.app$imagePath</a></li>";
}
echo "</ul>";

echo "<h4>4. Alternative: Create Symlinks</h4>";
echo "<div class='info'>If the above doesn't work, create direct symlinks:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "# Create symlinks for direct access
ln -sf public/images images
ln -sf public/images/home/images/home
ln -sf public/images/destinations images/destinations
ln -sf public/images/packages images/packages";
echo "</pre>";

echo "<h3>📊 Summary</h3>";
echo "<div class='info'>The ERR_CONNECTION_RESET errors suggest that the web server is having trouble serving static files. This is commonly caused by:</div>";
echo "<ul>";
echo "<li>Incorrect .htaccess rewrite rules</li>";
echo "<li>File permission issues</li>";
echo "<li>Missing MIME type configurations</li>";
echo "<li>Web server configuration conflicts</li>";
echo "</ul>";
echo "<div class='warning'>⚠️ Try the fixes in order, and test after each step to identify which one resolves the issue.</div>";
?>
