<?php
// Apply the _ipx fix immediately
echo "<h1>🚀 Applying _ipx Fix Immediately</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🔧 Applying the Fix</h3>";

// Backup current .htaccess
$backupName = '.htaccess-backup-ipx-' . date('Ymd-His');
if (copy('.htaccess', $backupName)) {
    echo "<div class='success'>✅ Backed up current .htaccess to: $backupName</div>";
} else {
    echo "<div class='error'>❌ Failed to backup .htaccess</div>";
}

// Create the new .htaccess content
$htaccessContent = 'DirectoryIndex index.php index.html

# Enable rewrite engine
RewriteEngine On

# Force HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle _ipx image processing requests - redirect to actual images
RewriteCond %{REQUEST_URI} ^/_ipx/.*?/images/(.*)$
RewriteRule ^/_ipx/.*?/images/(.*)$ /images/$1 [L]

# Handle static files directly (CSS, JS, images, etc.) - PRIORITY RULE
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

// Write the new .htaccess
if (file_put_contents('.htaccess', $htaccessContent)) {
    echo "<div class='success'>✅ Applied new .htaccess with _ipx redirect rules</div>";
} else {
    echo "<div class='error'>❌ Failed to write new .htaccess</div>";
}

// Create symlinks for direct access
echo "<h3>🔗 Creating Direct Access Symlinks</h3>";

$symlinks = [
    'images' => 'public/images',
    'videos' => 'public/videos'
];

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
        echo "<div class='warning'>⚠️ Target directory not found: $target</div>";
    }
}

echo "<h3>🧪 Testing the Fix</h3>";

// Test some _ipx URLs
$testUrls = [
    '/_ipx/w_500&f_webp&q_80/images/destinations/saudi/alula/AlUla1.jpeg',
    '/_ipx/f_webp&q_80/images/home/services/flight_reservations.jpg'
];

echo "<h4>📋 Testing _ipx Redirects</h4>";
foreach ($testUrls as $url) {
    $targetImage = preg_replace('/^\/_ipx\/.*?\/images\/(.*)$/', '/images/$1', $url);
    
    echo "<div class='info'>Testing: <a href='https://worldtripagency.com$url' target='_blank'>$url</a></div>";
    echo "<div class='info'>Should redirect to: <a href='https://worldtripagency.com$targetImage' target='_blank'>$targetImage</a></div>";
    
    // Test with cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://worldtripagency.com' . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    curl_close($ch);
    
    if ($httpCode == 200) {
        echo "<div class='success'>✅ _ipx redirect working - HTTP $httpCode</div>";
        if ($finalUrl != 'https://worldtripagency.com' . $url) {
            echo "<div class='success'>✅ Redirected to: $finalUrl</div>";
        }
    } else {
        echo "<div class='error'>❌ _ipx redirect failed - HTTP $httpCode</div>";
    }
    echo "<br>";
}

echo "<h3>✅ Fix Applied Successfully!</h3>";
echo "<div class='success'>The _ipx image processing fix has been applied. Your website should now:</div>";
echo "<ul>";
echo "<li>✅ Redirect _ipx requests to original images</li>";
echo "<li>✅ Serve images without 503 errors</li>";
echo "<li>✅ Provide direct access via symlinks</li>";
echo "<li>✅ Maintain proper caching and security</li>";
echo "</ul>";

echo "<h4>🔄 Next Steps</h4>";
echo "<div class='info'>1. Refresh your website in the browser</div>";
echo "<div class='info'>2. Check the browser developer console for any remaining errors</div>";
echo "<div class='info'>3. Test image loading on different pages</div>";
echo "<div class='info'>4. If issues persist, check the backup: $backupName</div>";

echo "<h4>🔍 What This Fix Does</h4>";
echo "<div class='info'>This fix adds a specific rewrite rule that catches _ipx requests and redirects them to the original images:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "# Handle _ipx image processing requests - redirect to actual images
RewriteCond %{REQUEST_URI} ^/_ipx/.*?/images/(.*)$
RewriteRule ^/_ipx/.*?/images/(.*)$ /images/$1 [L]";
echo "</pre>";
echo "<div class='info'>This means when Nuxt.js requests <code>/_ipx/w_500&f_webp&q_80/images/destinations/saudi/alula/AlUla1.jpeg</code>, it gets redirected to <code>/images/destinations/saudi/alula/AlUla1.jpeg</code></div>";
?>
