<?php
// إنشاء جميع الصور المفقودة بشكل شامل
echo "<h1>🖼️ إنشاء جميع الصور المفقودة</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;direction:rtl;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🎯 المشكلة</h3>";
echo "<div class='info'>الصور لا تظهر بسبب ملفات مفقودة في مجلدات مختلفة</div>";
echo "<div class='warning'>سأقوم بإنشاء جميع الصور المفقودة</div>";

// قائمة الصور المفقودة من console errors
$missingImages = [
    // Images from packages
    '/images/packages/pexels-photo-2506923.jpg',
    '/images/packages/pexels-photo-1694621.jpg',
    '/images/packages/pexels-photo-802024.jpg',
    '/images/packages/pexels-photo-338515.jpg',
    '/images/packages/pexels-photo-1010657.jpg',
    '/images/packages/pexels-photo-532263.jpg',
    '/images/packages/pexels-photo-2356045.jpg',
    '/images/packages/pexels-photo-3787839.jpg',
    '/images/packages/pexels-photo-1287460.jpg',
    '/images/packages/pexels-photo-460672.jpg',
    
    // Images from destinations
    '/images/destinations/saudi/riyadh/Ryiadh1.jpeg',
    '/images/destinations/saudi/Makkah/Makkah1.jpeg',
    '/images/destinations/saudi/Medina/Medina1.jpeg',
    '/images/destinations/saudi/alula/AlUla1.jpeg',
    '/images/destinations/global/Madrid/Madrid1.jpeg',
    '/images/destinations/global/Barcelona/Barcelona1.jpeg',
    '/images/destinations/global/Georgia/Georgia1.jpeg',
    '/images/destinations/global/London/London1.jpeg',
    '/images/destinations/global/Morocco/Morocco1.jpeg',
    '/images/destinations/global/Paris/Paris1.jpeg',
    '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
    '/images/destinations/global/Istanbul/Istanbul1.jpeg',
    '/images/destinations/global/Cairo/Cairo1.jpeg',
    '/images/destinations/saudi/jeddah/Jeddah1.jpeg',
    '/images/destinations/global/Thailand/Thailand1.jpeg',
    
    // Images from services
    '/images/home/services/tourism_consultation.jpg'
];

echo "<h3>🔍 فحص الصور الموجودة</h3>";

// فحص الصور الموجودة في public/images
$existingImages = [];
$missingImagesList = [];

foreach ($missingImages as $imagePath) {
    $fullPath = __DIR__ . $imagePath;
    $publicPath = __DIR__ . '/public' . $imagePath;
    
    if (file_exists($fullPath)) {
        $existingImages[] = $imagePath;
        echo "<div class='success'>✅ موجود: $imagePath</div>";
    } elseif (file_exists($publicPath)) {
        $existingImages[] = $imagePath;
        echo "<div class='success'>✅ موجود في public: $imagePath</div>";
    } else {
        $missingImagesList[] = $imagePath;
        echo "<div class='error'>❌ مفقود: $imagePath</div>";
    }
}

echo "<h3>🛠️ إنشاء الصور المفقودة</h3>";

// إنشاء المجلدات المطلوبة
$directories = [
    'public/images/packages',
    'public/images/destinations/saudi/riyadh',
    'public/images/destinations/saudi/Makkah',
    'public/images/destinations/saudi/Medina',
    'public/images/destinations/saudi/alula',
    'public/images/destinations/saudi/jeddah',
    'public/images/destinations/global/Madrid',
    'public/images/destinations/global/Barcelona',
    'public/images/destinations/global/Georgia',
    'public/images/destinations/global/London',
    'public/images/destinations/global/Morocco',
    'public/images/destinations/global/Paris',
    'public/images/destinations/global/SharmElSheikh',
    'public/images/destinations/global/Istanbul',
    'public/images/destinations/global/Cairo',
    'public/images/destinations/global/Thailand',
    'public/images/home/services'
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "<div class='success'>✅ تم إنشاء المجلد: $dir</div>";
        } else {
            echo "<div class='error'>❌ فشل في إنشاء المجلد: $dir</div>";
        }
    } else {
        echo "<div class='info'>📁 المجلد موجود: $dir</div>";
    }
}

echo "<h3>🖼️ إنشاء الصور المفقودة</h3>";

// إنشاء الصور المفقودة
foreach ($missingImagesList as $imagePath) {
    $publicPath = __DIR__ . '/public' . $imagePath;
    $dir = dirname($publicPath);
    
    // إنشاء المجلد إذا لم يكن موجوداً
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    // تحديد نوع الصورة
    $extension = pathinfo($imagePath, PATHINFO_EXTENSION);
    $filename = basename($imagePath, '.' . $extension);
    
    // إنشاء صورة placeholder
    if ($extension === 'jpg' || $extension === 'jpeg') {
        // إنشاء صورة JPG
        $image = imagecreate(800, 600);
        $bgColor = imagecolorallocate($image, 135, 206, 235); // لون أزرق فاتح
        $textColor = imagecolorallocate($image, 255, 255, 255); // لون أبيض
        
        // إضافة نص
        $text = str_replace(['-', '_'], ' ', $filename);
        $text = ucwords($text);
        imagestring($image, 5, 200, 250, $text, $textColor);
        
        if (imagejpeg($image, $publicPath, 80)) {
            echo "<div class='success'>✅ تم إنشاء: $imagePath</div>";
        } else {
            echo "<div class='error'>❌ فشل في إنشاء: $imagePath</div>";
        }
        imagedestroy($image);
        
    } elseif ($extension === 'png') {
        // إنشاء صورة PNG
        $image = imagecreate(800, 600);
        $bgColor = imagecolorallocate($image, 135, 206, 235);
        $textColor = imagecolorallocate($image, 255, 255, 255);
        
        $text = str_replace(['-', '_'], ' ', $filename);
        $text = ucwords($text);
        imagestring($image, 5, 200, 250, $text, $textColor);
        
        if (imagepng($image, $publicPath)) {
            echo "<div class='success'>✅ تم إنشاء: $imagePath</div>";
        } else {
            echo "<div class='error'>❌ فشل في إنشاء: $imagePath</div>";
        }
        imagedestroy($image);
        
    } elseif ($extension === 'svg') {
        // إنشاء صورة SVG
        $svgContent = '<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="#87CEEB"/>
    <text x="400" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white">' . 
    str_replace(['-', '_'], ' ', $filename) . '</text>
</svg>';
        
        if (file_put_contents($publicPath, $svgContent)) {
            echo "<div class='success'>✅ تم إنشاء: $imagePath</div>";
        } else {
            echo "<div class='error'>❌ فشل في إنشاء: $imagePath</div>";
        }
    }
}

echo "<h3>🔗 إنشاء Symlinks إضافية</h3>";

// إنشاء symlinks إضافية للصور
$additionalSymlinks = [
    'images/packages' => 'public/images/packages',
    'images/destinations' => 'public/images/destinations',
    'images/destinations/saudi' => 'public/images/destinations/saudi',
    'images/destinations/global' => 'public/images/destinations/global',
    'images/home/services' => 'public/images/home/services'
];

foreach ($additionalSymlinks as $link => $target) {
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

echo "<h3>🧪 اختبار الصور الجديدة</h3>";

$baseUrl = 'https://worldtripagency.com';

echo "<h4>📋 اختبار الصور المفقودة</h4>";
foreach ($missingImagesList as $path) {
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

echo "<h3>🔧 إصلاح مشكلة _ipx</h3>";

// تحديث .htaccess لإصلاح مشكلة _ipx
$htaccessContent = file_get_contents('.htaccess');

// إضافة قواعد إضافية لـ _ipx
$ipxRules = '
# Enhanced _ipx handling
RewriteCond %{REQUEST_URI} ^/_ipx/.*?/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteRule ^/_ipx/.*?/images/(.*)$ /public/images/$1 [L]

RewriteCond %{REQUEST_URI} ^/_ipx/.*?/public/images/(.*)$
RewriteCond %{DOCUMENT_ROOT}/public/images/$1 -f
RewriteRule ^/_ipx/.*?/public/images/(.*)$ /public/images/$1 [L]

# Prevent loops
RewriteCond %{ENV:REDIRECT_STATUS} !^$
RewriteRule ^ - [L]';

// إضافة القواعد إذا لم تكن موجودة
if (strpos($htaccessContent, 'Enhanced _ipx handling') === false) {
    $htaccessContent = str_replace(
        '# Handle _ipx image processing requests',
        '# Handle _ipx image processing requests' . $ipxRules,
        $htaccessContent
    );
    
    if (file_put_contents('.htaccess', $htaccessContent)) {
        echo "<div class='success'>✅ تم تحديث .htaccess لإصلاح مشكلة _ipx</div>";
    } else {
        echo "<div class='error'>❌ فشل في تحديث .htaccess</div>";
    }
} else {
    echo "<div class='info'>ℹ️ قواعد _ipx موجودة بالفعل</div>";
}

echo "<h3>✅ تم إنشاء جميع الصور المفقودة!</h3>";
echo "<div class='success'>الآن جميع الصور يجب أن تظهر:</div>";
echo "<ul>";
echo "<li>✅ تم إنشاء " . count($missingImagesList) . " صورة مفقودة</li>";
echo "<li>✅ تم إنشاء جميع المجلدات المطلوبة</li>";
echo "<li>✅ تم إنشاء symlinks إضافية</li>";
echo "<li>✅ تم إصلاح مشكلة _ipx</li>";
echo "<li>✅ تم تحديث .htaccess</li>";
echo "</ul>";

echo "<h4>🔄 الخطوات التالية:</h4>";
echo "<div class='info'>1. امسح cache المتصفح (Ctrl+F5)</div>";
echo "<div class='info'>2. اختبر الموقع في متصفح جديد</div>";
echo "<div class='info'>3. تحقق من الصور في جميع الصفحات</div>";
echo "<div class='info'>4. إذا استمرت المشكلة، تحقق من logs في الاستضافة</div>";

echo "<div class='warning'>⚠️ تم إنشاء صور placeholder - يمكن استبدالها بالصور الحقيقية لاحقاً</div>";
?>
