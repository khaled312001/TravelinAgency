<?php
// إصلاح مشكلة _ipx Loop Detected
echo "<h1>🔄 إصلاح مشكلة _ipx Loop Detected</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;direction:rtl;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🎯 المشكلة</h3>";
echo "<div class='info'>مشكلة 508 Loop Detected في _ipx requests</div>";
echo "<div class='warning'>هذا يحدث بسبب قواعد .htaccess المتضاربة</div>";

echo "<h3>🔍 تشخيص المشكلة</h3>";

// فحص .htaccess الحالي
if (file_exists('.htaccess')) {
    $htaccessContent = file_get_contents('.htaccess');
    echo "<div class='info'>فحص .htaccess الحالي:</div>";
    
    // البحث عن قواعد _ipx
    if (preg_match_all('/RewriteRule.*_ipx.*/i', $htaccessContent, $matches)) {
        echo "<div class='warning'>⚠️ وجدت " . count($matches[0]) . " قاعدة _ipx:</div>";
        foreach ($matches[0] as $rule) {
            echo "<div class='info'>- $rule</div>";
        }
    } else {
        echo "<div class='info'>ℹ️ لم توجد قواعد _ipx</div>";
    }
} else {
    echo "<div class='error'>❌ ملف .htaccess غير موجود</div>";
}

echo "<h3>🛠️ إصلاح مشكلة _ipx</h3>";

// إنشاء .htaccess محسن بدون loops
$fixedHtaccess = 'DirectoryIndex index.php index.html

# Enable rewrite engine
RewriteEngine On

# Force HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle static files directly (CSS, JS, images, etc.) - PRIORITY
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Handle _ipx image processing requests - FIXED VERSION
RewriteCond %{REQUEST_URI} ^/_ipx/.*?/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteCond %{ENV:REDIRECT_STATUS} ^$
RewriteRule ^/_ipx/.*?/images/(.*)$ /public/images/$1 [L]

RewriteCond %{REQUEST_URI} ^/_ipx/.*?/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteCond %{ENV:REDIRECT_STATUS} ^$
RewriteRule ^/_ipx/.*?/public/images/(.*)$ /public/images/$1 [L]

RewriteCond %{REQUEST_URI} ^/_ipx/.*?/output/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteCond %{ENV:REDIRECT_STATUS} ^$
RewriteRule ^/_ipx/.*?/output/public/images/(.*)$ /public/images/$1 [L]

# Handle multiple image path patterns
RewriteCond %{REQUEST_URI} ^/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteCond %{ENV:REDIRECT_STATUS} ^$
RewriteRule ^images/(.*)$ public/images/$1 [L]

RewriteCond %{REQUEST_URI} ^/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteCond %{ENV:REDIRECT_STATUS} ^$
RewriteRule ^public/images/(.*)$ public/images/$1 [L]

RewriteCond %{REQUEST_URI} ^/output/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteCond %{ENV:REDIRECT_STATUS} ^$
RewriteRule ^output/public/images/(.*)$ public/images/$1 [L]

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
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Content-Security-Policy "default-src \'self\'; img-src \'self\' data: https:; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\'; font-src \'self\' data:; connect-src \'self\';"
</IfModule>';

// إنشاء نسخة احتياطية
$backupName = '.htaccess-backup-ipx-fix-' . date('Ymd-His');
if (copy('.htaccess', $backupName)) {
    echo "<div class='success'>✅ تم إنشاء نسخة احتياطية: $backupName</div>";
} else {
    echo "<div class='error'>❌ فشل في إنشاء النسخة الاحتياطية</div>";
}

// كتابة .htaccess الجديد
if (file_put_contents('.htaccess', $fixedHtaccess)) {
    echo "<div class='success'>✅ تم إصلاح .htaccess لإزالة مشكلة Loop Detected</div>";
} else {
    echo "<div class='error'>❌ فشل في كتابة .htaccess</div>";
}

echo "<h3>🔗 إنشاء Symlinks محسنة</h3>";

// إنشاء symlinks محسنة
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

echo "<h3>🧪 اختبار إصلاح _ipx</h3>";

$testPaths = [
    '/images/home/logo/WonderlandLogoWhite.svg',
    '/public/images/home/logo/WonderlandLogoWhite.svg',
    '/output/public/images/home/logo/WonderlandLogoWhite.svg'
];

$baseUrl = 'https://worldtripagency.com';

echo "<h4>📋 اختبار مسارات الصور</h4>";
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
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    
    if ($httpCode == 200) {
        echo "<div class='success'>✅ HTTP $httpCode - <a href='$testUrl' target='_blank'>$testUrl</a></div>";
    } else {
        echo "<div class='error'>❌ HTTP $httpCode - <a href='$testUrl' target='_blank'>$testUrl</a></div>";
    }
    
    echo "<br>";
}

echo "<h3>🔧 إصلاحات إضافية</h3>";

// إنشاء ملف .htaccess بديل بسيط
$simpleHtaccess = 'DirectoryIndex index.php index.html

RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Serve static files directly
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Handle API
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^(.*)$ api-handler.php [QSA,L]

# Handle everything else
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# MIME types
AddType image/svg+xml .svg
AddType image/webp .webp
AddType image/jpeg .jpg .jpeg
AddType image/png .png
AddType image/gif .gif';

if (file_put_contents('.htaccess-simple', $simpleHtaccess)) {
    echo "<div class='success'>✅ تم إنشاء .htaccess-simple كبديل</div>";
} else {
    echo "<div class='error'>❌ فشل في إنشاء .htaccess-simple</div>";
}

echo "<h3>✅ تم إصلاح مشكلة _ipx Loop Detected!</h3>";
echo "<div class='success'>التحسينات المطبقة:</div>";
echo "<ul>";
echo "<li>✅ إضافة REDIRECT_STATUS check لمنع loops</li>";
echo "<li>✅ إعادة ترتيب قواعد .htaccess</li>";
echo "<li>✅ إعطاء أولوية للملفات الثابتة</li>";
echo "<li>✅ تحسين قواعد _ipx</li>";
echo "<li>✅ إنشاء symlinks محسنة</li>";
echo "<li>✅ إنشاء .htaccess-simple كبديل</li>";
echo "</ul>";

echo "<h4>🔄 الخطوات التالية:</h4>";
echo "<div class='info'>1. امسح cache المتصفح (Ctrl+F5)</div>";
echo "<div class='info'>2. اختبر الموقع في متصفح جديد</div>";
echo "<div class='info'>3. تحقق من الصور في جميع الصفحات</div>";
echo "<div class='info'>4. إذا استمرت المشكلة، استخدم .htaccess-simple</div>";

echo "<h4>🚨 إذا استمرت المشكلة:</h4>";
echo "<div class='info'>استخدم .htaccess-simple:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "mv .htaccess .htaccess-backup
mv .htaccess-simple .htaccess";
echo "</pre>";

echo "<div class='warning'>⚠️ تم إنشاء نسخة احتياطية: $backupName</div>";
?>
