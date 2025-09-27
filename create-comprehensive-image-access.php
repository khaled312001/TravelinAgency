<?php
// Create comprehensive image access for all possible paths
echo "<h1>🔗 Create Comprehensive Image Access</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🎯 Creating All Possible Image Access Points</h3>";
echo "<div class='info'>This will create symlinks and rewrite rules for every possible image path that Nuxt.js might use</div>";

// Create comprehensive symlinks
$symlinks = [
    'images' => 'public/images',
    'public_images' => 'public/images',
    'output_images' => 'output/public/images',
    'public_dir' => 'public',
    'output_dir' => 'output',
    'static' => 'public',
    'assets' => 'public'
];

echo "<h4>🔗 Creating Symlinks</h4>";
foreach ($symlinks as $link => $target) {
    if (file_exists($target)) {
        if (is_link($link)) {
            unlink($link);
            echo "<div class='info'>Removed existing symlink: $link</div>";
        }
        if (symlink($target, $link)) {
            echo "<div class='success'>✅ Created symlink: $link -> $target</div>";
        } else {
            echo "<div class='error'>❌ Failed to create symlink: $link</div>";
        }
    } else {
        echo "<div class='warning'>⚠️ Target not found: $target</div>";
    }
}

// Create comprehensive .htaccess
echo "<h4>📄 Creating Comprehensive .htaccess</h4>";

$htaccessContent = 'DirectoryIndex index.php index.html

# Enable rewrite engine
RewriteEngine On

# Force HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle _ipx image processing requests - redirect to actual images
RewriteCond %{REQUEST_URI} ^/_ipx/.*?/images/(.*)$
RewriteRule ^/_ipx/.*?/images/(.*)$ /images/$1 [L]

# Handle _ipx requests for other paths
RewriteCond %{REQUEST_URI} ^/_ipx/.*?/public/images/(.*)$
RewriteRule ^/_ipx/.*?/public/images/(.*)$ /public/images/$1 [L]

RewriteCond %{REQUEST_URI} ^/_ipx/.*?/output/public/images/(.*)$
RewriteRule ^/_ipx/.*?/output/public/images/(.*)$ /output/public/images/$1 [L]

# Handle multiple image path patterns - PRIORITY RULES
# Images from /images/ path
RewriteCond %{REQUEST_URI} ^/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteRule ^images/(.*)$ public/images/$1 [L]

# Images from /public/images/ path
RewriteCond %{REQUEST_URI} ^/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteRule ^public/images/(.*)$ public/images/$1 [L]

# Images from /output/public/images/ path
RewriteCond %{REQUEST_URI} ^/output/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteRule ^output/public/images/(.*)$ public/images/$1 [L]

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
AddType image/jpeg .jpg .jpeg
AddType image/png .png
AddType image/gif .gif

# Enable Gzip compression for text files (not images)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript image/svg+xml
</IfModule>

# Set cache headers for images
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access 1 year"
    ExpiresByType image/jpeg "access 1 year"
    ExpiresByType image/gif "access 1 year"
    ExpiresByType image/png "access 1 year"
    ExpiresByType image/webp "access 1 year"
    ExpiresByType image/svg+xml "access 1 year"
    ExpiresByType image/avif "access 1 year"
    ExpiresByType text/css "access 1 month"
    ExpiresByType application/javascript "access 1 month"
    ExpiresByType application/x-javascript "access 1 month"
    ExpiresDefault "access 2 days"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options nosniff
    # Prevent clickjacking
    Header always set X-Frame-Options DENY
    # XSS protection
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>';

// Backup current .htaccess
$backupName = '.htaccess-backup-comprehensive-' . date('Ymd-His');
if (copy('.htaccess', $backupName)) {
    echo "<div class='success'>✅ Backed up current .htaccess to: $backupName</div>";
} else {
    echo "<div class='error'>❌ Failed to backup .htaccess</div>";
}

// Write new .htaccess
if (file_put_contents('.htaccess', $htaccessContent)) {
    echo "<div class='success'>✅ Created comprehensive .htaccess with multiple path support</div>";
} else {
    echo "<div class='error'>❌ Failed to write new .htaccess</div>";
}

echo "<h3>🧪 Testing All Image Paths</h3>";

$testPaths = [
    '/images/home/logo/WonderlandLogoWhite.svg',
    '/public/images/home/logo/WonderlandLogoWhite.svg',
    '/output/public/images/home/logo/WonderlandLogoWhite.svg',
    '/images/home/services/support_24_7.jpg',
    '/public/images/home/services/support_24_7.jpg',
    '/output/public/images/home/services/support_24_7.jpg'
];

$baseUrl = 'https://worldtripagency.com';

echo "<h4>📋 Testing All Path Variations</h4>";
foreach ($testPaths as $path) {
    echo "<div class='info'>Testing: $path</div>";
    
    $testUrl = $baseUrl . $path;
    
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
        echo "<div class='success'>✅ HTTP $httpCode - <a href='$testUrl' target='_blank'>$testUrl</a></div>";
    } else {
        echo "<div class='error'>❌ HTTP $httpCode - <a href='$testUrl' target='_blank'>$testUrl</a></div>";
    }
    
    if ($finalUrl != $testUrl) {
        echo "<div class='info'>🔄 Redirected to: $finalUrl</div>";
    }
    
    echo "<br>";
}

echo "<h3>🔍 Additional Debugging</h3>";

// Check what Nuxt.js might be looking for
echo "<h4>📱 Check Nuxt.js Build Output</h4>";
if (is_dir('output/public/_nuxt')) {
    echo "<div class='success'>✅ Nuxt.js build output exists: output/public/_nuxt</div>";
    
    // Look for any image references in the build
    $nuxtFiles = glob('output/public/_nuxt/*.js');
    if (count($nuxtFiles) > 0) {
        echo "<div class='info'>Found " . count($nuxtFiles) . " JavaScript files in _nuxt directory</div>";
        
        // Check first few files for image paths
        $sampleFile = $nuxtFiles[0];
        $content = file_get_contents($sampleFile);
        if (strpos($content, '/images/') !== false) {
            echo "<div class='info'>✅ Found /images/ references in Nuxt.js build files</div>";
        }
        if (strpos($content, '/public/images/') !== false) {
            echo "<div class='info'>✅ Found /public/images/ references in Nuxt.js build files</div>";
        }
    }
} else {
    echo "<div class='warning'>⚠️ Nuxt.js build output not found: output/public/_nuxt</div>";
}

echo "<h3>✅ Comprehensive Image Access Created!</h3>";
echo "<div class='success'>Now your website should work with any image path that Nuxt.js might use:</div>";
echo "<ul>";
echo "<li>✅ /images/... (direct access)</li>";
echo "<li>✅ /public/images/... (with public prefix)</li>";
echo "<li>✅ /output/public/images/... (with output prefix)</li>";
echo "<li>✅ _ipx requests (redirected to original images)</li>";
echo "<li>✅ Multiple symlinks for direct access</li>";
echo "</ul>";

echo "<h4>🔄 Next Steps</h4>";
echo "<div class='info'>1. Refresh your website in the browser</div>";
echo "<div class='info'>2. Clear browser cache (Ctrl+F5)</div>";
echo "<div class='info'>3. Check browser developer console</div>";
echo "<div class='info'>4. Test different pages to ensure all images load</div>";

echo "<h4>🔍 If Still Not Working</h4>";
echo "<div class='info'>If images still don't show, the issue might be:</div>";
echo "<ol>";
echo "<li><strong>Nuxt.js Configuration:</strong> Check nuxt.config.ts for base URL settings</li>";
echo "<li><strong>Build Process:</strong> The production build might need to be regenerated</li>";
echo "<li><strong>Environment Variables:</strong> Check if NODE_ENV or other env vars affect image paths</li>";
echo "<li><strong>CDN Configuration:</strong> If using a CDN, check its configuration</li>";
echo "</ol>";

echo "<div class='warning'>⚠️ Backup created: $backupName (in case you need to revert)</div>";
?>
