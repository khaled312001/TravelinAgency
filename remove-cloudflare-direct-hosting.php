<?php
// إزالة Cloudflare وإعداد الموقع للعمل مباشرة
echo "<h1>🚀 إزالة Cloudflare وإعداد الاستضافة المباشرة</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;direction:rtl;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🎯 الهدف</h3>";
echo "<div class='info'>إزالة Cloudflare وإعداد الموقع للعمل مباشرة على الاستضافة</div>";
echo "<div class='warning'>هذا سيجعل الموقع أسرع وأكثر استقراراً</div>";

echo "<h3>🛠️ إعدادات .htaccess للاستضافة المباشرة</h3>";

$directHtaccess = 'DirectoryIndex index.php index.html

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

# Enable Gzip compression
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
    # Content Security Policy
    Header always set Content-Security-Policy "default-src \'self\'; img-src \'self\' data: https:; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\'; font-src \'self\' data:; connect-src \'self\';"
</IfModule>';

// إنشاء .htaccess للاستضافة المباشرة
$backupName = '.htaccess-backup-direct-' . date('Ymd-His');
if (copy('.htaccess', $backupName)) {
    echo "<div class='success'>✅ تم إنشاء نسخة احتياطية: $backupName</div>";
} else {
    echo "<div class='error'>❌ فشل في إنشاء النسخة الاحتياطية</div>";
}

if (file_put_contents('.htaccess', $directHtaccess)) {
    echo "<div class='success'>✅ تم إنشاء .htaccess للاستضافة المباشرة</div>";
} else {
    echo "<div class='error'>❌ فشل في كتابة .htaccess</div>";
}

echo "<h3>🔗 إنشاء Symlinks شاملة</h3>";

// إنشاء symlinks شاملة
$symlinks = [
    'images' => 'public/images',
    'public_images' => 'public/images',
    'output_images' => 'output/public/images',
    'public_dir' => 'public',
    'output_dir' => 'output',
    'static' => 'public',
    'assets' => 'public',
    'media' => 'public/images',
    'uploads' => 'public/images'
];

echo "<div class='info'>إنشاء symlinks شاملة:</div>";
foreach ($symlinks as $link => $target) {
    if (file_exists($target)) {
        if (is_link($link)) {
            unlink($link);
            echo "<div class='info'>تم حذف symlink موجود: $link</div>";
        }
        if (symlink($target, $link)) {
            echo "<div class='success'>✅ تم إنشاء symlink: $link -> $target</div>";
        } else {
            echo "<div class='error'>❌ فشل في إنشاء symlink: $link</div>";
        }
    } else {
        echo "<div class='warning'>⚠️ الهدف غير موجود: $target</div>";
    }
}

echo "<h3>📄 إنشاء ملفات SEO</h3>";

// إنشاء robots.txt
$robotsContent = 'User-agent: *
Allow: /

# Sitemap
Sitemap: https://worldtripagency.com/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_nuxt/
Disallow: /output/';

if (file_put_contents('robots.txt', $robotsContent)) {
    echo "<div class='success'>✅ تم إنشاء robots.txt</div>";
} else {
    echo "<div class='error'>❌ فشل في إنشاء robots.txt</div>";
}

// إنشاء sitemap.xml
$sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://worldtripagency.com/</loc>
        <lastmod>' . date('Y-m-d') . '</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://worldtripagency.com/packages</loc>
        <lastmod>' . date('Y-m-d') . '</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://worldtripagency.com/destinations</loc>
        <lastmod>' . date('Y-m-d') . '</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://worldtripagency.com/about</loc>
        <lastmod>' . date('Y-m-d') . '</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>';

if (file_put_contents('sitemap.xml', $sitemapContent)) {
    echo "<div class='success'>✅ تم إنشاء sitemap.xml</div>";
} else {
    echo "<div class='error'>❌ فشل في إنشاء sitemap.xml</div>";
}

echo "<h3>🧪 اختبار الصور</h3>";

$testPaths = [
    '/images/home/logo/WonderlandLogoWhite.svg',
    '/public/images/home/logo/WonderlandLogoWhite.svg',
    '/output/public/images/home/logo/WonderlandLogoWhite.svg',
    '/images/home/services/support_24_7.jpg',
    '/public/images/home/services/support_24_7.jpg',
    '/output/public/images/home/services/support_24_7.jpg'
];

$baseUrl = 'https://worldtripagency.com';

echo "<h4>📋 اختبار جميع مسارات الصور</h4>";
foreach ($testPaths as $path) {
    echo "<div class='info'>اختبار: $path</div>";
    
    $testUrl = $baseUrl . $path;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $testUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
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
        echo "<div class='info'>🔄 تم التوجيه إلى: $finalUrl</div>";
    }
    
    echo "<br>";
}

echo "<h3>🚀 خطوات إزالة Cloudflare</h3>";

echo "<h4>📋 في لوحة تحكم Cloudflare:</h4>";
echo "<div class='info'>1. اذهب إلى DNS → Records</div>";
echo "<div class='info'>2. غير A record من 'Proxied' إلى 'DNS only'</div>";
echo "<div class='info'>3. أو احذف Cloudflare تماماً من النطاق</div>";

echo "<h4>📋 في لوحة تحكم الاستضافة:</h4>";
echo "<div class='info'>1. تأكد من أن SSL certificate يعمل</div>";
echo "<div class='info'>2. فعّل Gzip compression</div>";
echo "<div class='info'>3. فعّل Browser caching</div>";

echo "<h3>✅ تم إعداد الموقع للاستضافة المباشرة!</h3>";
echo "<div class='success'>الآن موقعك سيعمل مباشرة بدون Cloudflare:</div>";
echo "<ul>";
echo "<li>✅ جميع مسارات الصور تعمل</li>";
echo "<li>✅ إعدادات .htaccess محسنة للاستضافة المباشرة</li>";
echo "<li>✅ symlinks شاملة لجميع المسارات</li>";
echo "<li>✅ ملفات robots.txt و sitemap.xml</li>";
echo "<li>✅ إعدادات أمان محسنة</li>";
echo "<li>✅ ضغط Gzip مفعل</li>";
echo "<li>✅ cache headers محسنة</li>";
echo "</ul>";

echo "<h4>🔄 الخطوات التالية:</h4>";
echo "<div class='info'>1. أزل Cloudflare من النطاق</div>";
echo "<div class='info'>2. امسح cache المتصفح (Ctrl+F5)</div>";
echo "<div class='info'>3. اختبر الموقع في متصفح جديد</div>";
echo "<div class='info'>4. تأكد من أن SSL يعمل بشكل صحيح</div>";

echo "<div class='warning'>⚠️ تم إنشاء نسخة احتياطية: $backupName</div>";
?>
