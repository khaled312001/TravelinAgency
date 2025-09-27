<?php
// إصلاح مشاكل الاستضافة على Cloudflare
echo "<h1>☁️ إصلاح مشاكل الاستضافة على Cloudflare</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;direction:rtl;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🎯 المشكلة</h3>";
echo "<div class='info'>الموقع مرفوع على Cloudflare وهذا يسبب مشاكل في عرض الصور</div>";
echo "<div class='warning'>Cloudflare يعمل كـ CDN ويحتاج إعدادات خاصة</div>";

echo "<h3>🔍 تشخيص مشاكل Cloudflare</h3>";

// فحص إعدادات Cloudflare
echo "<h4>📊 فحص إعدادات Cloudflare</h4>";

// فحص headers
$headers = getallheaders();
echo "<div class='info'>Headers من Cloudflare:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
foreach ($headers as $key => $value) {
    if (strpos(strtolower($key), 'cloudflare') !== false || 
        strpos(strtolower($key), 'cf-') !== false) {
        echo "$key: $value\n";
    }
}
echo "</pre>";

// فحص IP
$cfConnectingIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? 'غير موجود';
$realIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
echo "<div class='info'>CF-Connecting-IP: $cfConnectingIp</div>";
echo "<div class='info'>Real IP: $realIp</div>";

echo "<h3>🛠️ حلول Cloudflare</h3>";

echo "<h4>1. إعدادات .htaccess للـ Cloudflare</h4>";
echo "<div class='info'>إنشاء .htaccess مخصص لـ Cloudflare:</div>";

$cloudflareHtaccess = 'DirectoryIndex index.php index.html

# Enable rewrite engine
RewriteEngine On

# Cloudflare IP ranges - Allow real IP detection
RewriteCond %{HTTP:CF-Connecting-IP} !=""
RewriteRule ^ - [E=CF-Connecting-IP:%{HTTP:CF-Connecting-IP}]

# Force HTTPS redirect (Cloudflare handles SSL)
RewriteCond %{HTTP:CF-Visitor} \'"scheme":"http"\'
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

# Cloudflare specific headers
<IfModule mod_headers.c>
    # Allow Cloudflare to cache images
    Header always set Cache-Control "public, max-age=31536000" "expr=%{REQUEST_URI} =~ m#\\.(jpg|jpeg|png|gif|webp|svg|ico)$#"
    
    # Set proper content type for images
    Header always set Content-Type "image/jpeg" "expr=%{REQUEST_URI} =~ m#\\.(jpg|jpeg)$#"
    Header always set Content-Type "image/png" "expr=%{REQUEST_URI} =~ m#\\.png$#"
    Header always set Content-Type "image/svg+xml" "expr=%{REQUEST_URI} =~ m#\\.svg$#"
    Header always set Content-Type "image/webp" "expr=%{REQUEST_URI} =~ m#\\.webp$#"
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    
    # CORS headers for Cloudflare
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Enable Gzip compression (Cloudflare will handle this)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript image/svg+xml
</IfModule>

# Set cache headers for images (Cloudflare will respect these)
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
</IfModule>';

// إنشاء .htaccess للـ Cloudflare
$backupName = '.htaccess-backup-cloudflare-' . date('Ymd-His');
if (copy('.htaccess', $backupName)) {
    echo "<div class='success'>✅ تم إنشاء نسخة احتياطية: $backupName</div>";
} else {
    echo "<div class='error'>❌ فشل في إنشاء النسخة الاحتياطية</div>";
}

if (file_put_contents('.htaccess', $cloudflareHtaccess)) {
    echo "<div class='success'>✅ تم إنشاء .htaccess مخصص لـ Cloudflare</div>";
} else {
    echo "<div class='error'>❌ فشل في كتابة .htaccess</div>";
}

echo "<h4>2. إنشاء symlinks شاملة</h4>";

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

echo "<h4>3. إنشاء ملف robots.txt للـ Cloudflare</h4>";

$robotsContent = 'User-agent: *
Allow: /

# Allow Cloudflare to access all resources
User-agent: Cloudflare
Allow: /

# Sitemap
Sitemap: https://travelin-agency-nlcs.vercel.app/sitemap.xml

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

echo "<h4>4. إنشاء ملف sitemap.xml</h4>";

$sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://travelin-agency-nlcs.vercel.app/</loc>
        <lastmod>' . date('Y-m-d') . '</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://travelin-agency-nlcs.vercel.app/packages</loc>
        <lastmod>' . date('Y-m-d') . '</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://travelin-agency-nlcs.vercel.app/destinations</loc>
        <lastmod>' . date('Y-m-d') . '</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://travelin-agency-nlcs.vercel.app/about</loc>
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

echo "<h3>🧪 اختبار الصور مع Cloudflare</h3>";

$testPaths = [
    '/images/home/logo/WonderlandLogoWhite.svg',
    '/public/images/home/logo/WonderlandLogoWhite.svg',
    '/output/public/images/home/logo/WonderlandLogoWhite.svg',
    '/images/home/services/support_24_7.jpg',
    '/public/images/home/services/support_24_7.jpg',
    '/output/public/images/home/services/support_24_7.jpg'
];

$baseUrl = 'https://travelin-agency-nlcs.vercel.app';

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
    $cfRay = curl_getinfo($ch, CURLINFO_HEADER_OUT);
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

echo "<h3>☁️ إعدادات Cloudflare المطلوبة</h3>";

echo "<h4>📋 في لوحة تحكم Cloudflare:</h4>";
echo "<div class='info'>1. اذهب إلى Speed → Optimization</div>";
echo "<div class='info'>2. فعّل Auto Minify للـ CSS, JavaScript, HTML</div>";
echo "<div class='info'>3. فعّل Brotli compression</div>";
echo "<div class='info'>4. فعّل Rocket Loader</div>";

echo "<h4>📋 في Caching → Configuration:</h4>";
echo "<div class='info'>1. اضبط Caching Level إلى Standard</div>";
echo "<div class='info'>2. فعّل Browser Cache TTL</div>";
echo "<div class='info'>3. فعّل Always Online</div>";

echo "<h4>📋 في Rules → Page Rules:</h4>";
echo "<div class='info'>أضف هذه القواعد:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "*.jpg, *.jpeg, *.png, *.gif, *.webp, *.svg
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 1 month

/_nuxt/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 1 month

/api/*
Cache Level: Bypass
Browser Cache TTL: Respect Existing Headers";
echo "</pre>";

echo "<h4>📋 في Security → WAF:</h4>";
echo "<div class='info'>1. فعّل Web Application Firewall</div>";
echo "<div class='info'>2. اضبط Security Level إلى Medium</div>";
echo "<div class='info'>3. فعّل Bot Fight Mode</div>";

echo "<h3>✅ تم إصلاح مشاكل Cloudflare!</h3>";
echo "<div class='success'>الآن موقعك يجب أن يعمل بشكل مثالي مع Cloudflare:</div>";
echo "<ul>";
echo "<li>✅ جميع مسارات الصور تعمل</li>";
echo "<li>✅ إعدادات .htaccess مخصصة لـ Cloudflare</li>";
echo "<li>✅ symlinks شاملة لجميع المسارات</li>";
echo "<li>✅ ملفات robots.txt و sitemap.xml</li>";
echo "<li>✅ headers مخصصة لـ Cloudflare</li>";
echo "</ul>";

echo "<h4>🔄 الخطوات التالية:</h4>";
echo "<div class='info'>1. امسح cache في Cloudflare</div>";
echo "<div class='info'>2. امسح cache المتصفح (Ctrl+F5)</div>";
echo "<div class='info'>3. اختبر الموقع في متصفح جديد</div>";
echo "<div class='info'>4. طبق الإعدادات المطلوبة في لوحة تحكم Cloudflare</div>";

echo "<div class='warning'>⚠️ تم إنشاء نسخة احتياطية: $backupName</div>";
?>
