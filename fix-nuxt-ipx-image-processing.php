<?php
// Fix Nuxt.js _ipx image processing issues
echo "<h1>🖼️ Fix Nuxt.js _ipx Image Processing Issues</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🔍 Analyzing the Issue</h3>";
echo "<div class='info'>The problem is that Nuxt.js is trying to process images through _ipx (Image Processing) but getting 503 errors:</div>";
echo "<ul>";
echo "<li><code>GET https://worldtripagency.com/_ipx/w_500&f_webp&q_80/images/destinations/saudi/alula/AlUla1.jpeg 503 (Service Unavailable)</code></li>";
echo "<li><code>GET https://worldtripagency.com/_ipx/f_webp&q_80/images/home/services/flight_reservations.jpg 503 (Service Unavailable)</code></li>";
echo "</ul>";

echo "<h3>🛠️ Solution: Disable _ipx and Serve Images Directly</h3>";

// Create a new .htaccess that handles _ipx redirects
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
file_put_contents('.htaccess-ipx-fix', $htaccessContent);

echo "<div class='success'>✅ Created .htaccess-ipx-fix with _ipx redirect rules</div>";

echo "<h3>🧪 Testing _ipx Redirects</h3>";

// Test URLs that are failing
$testIpxUrls = [
    '/_ipx/w_500&f_webp&q_80/images/destinations/saudi/alula/AlUla1.jpeg',
    '/_ipx/f_webp&q_80/images/home/services/flight_reservations.jpg',
    '/_ipx/w_300&q_80/images/destinations/global/Barcelona/Barcelona1.jpeg'
];

echo "<h4>📋 Testing _ipx URL Redirects</h4>";
foreach ($testIpxUrls as $ipxUrl) {
    $targetImage = preg_replace('/^\/_ipx\/.*?\/images\/(.*)$/', '/images/$1', $ipxUrl);
    
    echo "<div class='info'>Testing: $ipxUrl</div>";
    echo "<div class='info'>Should redirect to: $targetImage</div>";
    
    // Check if target image exists
    $targetPath = __DIR__ . '/public' . $targetImage;
    if (file_exists($targetPath)) {
        echo "<div class='success'>✅ Target image exists</div>";
    } else {
        echo "<div class='error'>❌ Target image missing: $targetPath</div>";
    }
    echo "<br>";
}

echo "<h3>🔧 Additional Fixes</h3>";

// Create symlinks for direct access
echo "<h4>🔗 Creating Direct Access Symlinks</h4>";

$symlinks = [
    'images' => 'public/images',
    'videos' => 'public/videos'
];

foreach ($symlinks as $link => $target) {
    if (file_exists($target)) {
        if (is_link($link)) {
            unlink($link);
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

echo "<h3>📋 Implementation Steps</h3>";
echo "<div class='info'>Follow these steps to fix the _ipx image processing issues:</div>";

echo "<h4>1. Apply the _ipx Fix</h4>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "# Backup current .htaccess
cp .htaccess .htaccess-backup-ipx-$(date +%Y%m%d-%H%M%S)

# Apply the _ipx fix
cp .htaccess-ipx-fix .htaccess";
echo "</pre>";

echo "<h4>2. Test the Fix</h4>";
echo "<div class='info'>Test these URLs in your browser:</div>";
echo "<ul>";
foreach ($testIpxUrls as $ipxUrl) {
    $targetImage = preg_replace('/^\/_ipx\/.*?\/images\/(.*)$/', '/images/$1', $ipxUrl);
    echo "<li><a href='https://worldtripagency.com$ipxUrl' target='_blank'>https://worldtripagency.com$ipxUrl</a> (should redirect to <a href='https://worldtripagency.com$targetImage' target='_blank'>$targetImage</a>)</li>";
}
echo "</ul>";

echo "<h4>3. Alternative: Disable _ipx in Nuxt.js</h4>";
echo "<div class='info'>If the redirect approach doesn\'t work, you can disable _ipx in your Nuxt.js configuration:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "// In nuxt.config.ts
export default defineNuxtConfig({
  image: {
    // Disable _ipx processing
    ipx: false,
    // Or use a different provider
    provider: 'static'
  }
})";
echo "</pre>";

echo "<h3>📊 Expected Results</h3>";
echo "<div class='info'>After applying these fixes, you should see:</div>";
echo "<ul>";
echo "<li>✅ No more 503 Service Unavailable errors for _ipx URLs</li>";
echo "<li>✅ Images loading properly on the website</li>";
echo "<li>✅ Direct access to images via symlinks</li>";
echo "<li>✅ Proper image caching and compression</li>";
echo "</ul>";

echo "<h3>🔍 Root Cause Analysis</h3>";
echo "<div class='info'>The issue occurs because:</div>";
echo "<ol>";
echo "<li><strong>Nuxt.js _ipx Processing:</strong> Nuxt.js tries to process images through _ipx for optimization</li>";
echo "<li><strong>GoDaddy Limitations:</strong> GoDaddy shared hosting doesn\'t support the _ipx image processing service</li>";
echo "<li><strong>503 Errors:</strong> The server returns 503 Service Unavailable for _ipx requests</li>";
echo "<li><strong>Solution:</strong> Redirect _ipx requests to the original images</li>";
echo "</ol>";

echo "<div class='warning'>⚠️ This fix redirects _ipx requests to original images, which means you lose automatic image optimization but gain compatibility with GoDaddy hosting.</div>";
?>
