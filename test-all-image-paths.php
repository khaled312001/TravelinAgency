<?php
/**
 * Comprehensive test for all image paths
 * This script tests all image paths to ensure they load correctly
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اختبار شامل لجميع مسارات الصور</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
        .warning { color: orange; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .test-result { margin: 5px 0; }
    </style>
</head>
<body>

<h1>🧪 اختبار شامل لجميع مسارات الصور</h1>

<?php
echo "<h3>🎯 الهدف</h3>";
echo "<div class='info'>اختبار جميع مسارات الصور للتأكد من أنها تعمل بشكل صحيح</div>";

// Test categories
$test_categories = [
    'Logo Images' => [
        '/images/home/logo/WonderlandLogoWhite.svg',
        '/public/images/home/logo/WonderlandLogoWhite.svg',
        '/output/public/images/home/logo/WonderlandLogoWhite.svg',
    ],
    'Service Images' => [
        '/images/home/services/tourism_consultation.jpg',
        '/public/images/home/services/tourism_consultation.jpg',
        '/output/public/images/home/services/tourism_consultation.jpg',
    ],
    'Package Images' => [
        '/images/packages/pexels-photo-2506923.jpg',
        '/images/packages/pexels-photo-1694621.jpg',
        '/images/packages/pexels-photo-802024.jpg',
        '/images/packages/pexels-photo-338515.jpg',
        '/images/packages/pexels-photo-1010657.jpg',
        '/images/packages/pexels-photo-532263.jpg',
        '/images/packages/pexels-photo-2356045.jpg',
        '/images/packages/pexels-photo-3787839.jpg',
    ],
    'Saudi Destination Images' => [
        '/images/destinations/saudi/riyadh/Ryiadh1.jpeg',
        '/images/destinations/saudi/Makkah/Makkah1.jpeg',
        '/images/destinations/saudi/Medina/Medina1.jpeg',
        '/images/destinations/saudi/alula/AlUla1.jpeg',
    ],
    'Global Destination Images' => [
        '/images/destinations/global/Madrid/Madrid1.jpeg',
        '/images/destinations/global/Barcelona/Barcelona1.jpeg',
        '/images/destinations/global/Georgia/Georgia1.jpeg',
        '/images/destinations/global/London/London1.jpeg',
        '/images/destinations/global/Morocco/Morocco1.jpeg',
        '/images/destinations/global/Paris/Paris1.jpeg',
        '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
        '/images/destinations/global/Istanbul/Istanbul1.jpeg',
        '/images/destinations/global/Cairo/Cairo1.jpeg',
    ],
    '_ipx Processing Tests' => [
        '/_ipx/f_webp&q_80/images/home/services/tourism_consultation.jpg',
        '/_ipx/w_500&f_webp&q_80/images/destinations/saudi/alula/AlUla1.jpeg',
        '/_ipx/q_80/images/packages/pexels-photo-2506923.jpg',
        '/_ipx/images/home/logo/WonderlandLogoWhite.svg',
    ],
    'Symlink Tests' => [
        '/images/home/logo/WonderlandLogoWhite.svg',
        '/public_images/home/logo/WonderlandLogoWhite.svg',
        '/output_images/home/logo/WonderlandLogoWhite.svg',
        '/media/home/logo/WonderlandLogoWhite.svg',
        '/uploads/home/logo/WonderlandLogoWhite.svg',
    ]
];

$total_tests = 0;
$passed_tests = 0;
$failed_tests = 0;

foreach ($test_categories as $category => $paths) {
    echo "<div class='test-section'>";
    echo "<h3>📋 $category</h3>";
    
    foreach ($paths as $path) {
        $total_tests++;
        $url = 'https://worldtripagency.com' . $path;
        $result = test_image_path($url);
        
        if ($result['success']) {
            echo "<div class='test-result success'>✅ $path - {$result['status']} - <a href='$url' target='_blank'>Test</a></div>";
            $passed_tests++;
        } else {
            echo "<div class='test-result error'>❌ $path - {$result['status']} - <a href='$url' target='_blank'>Test</a></div>";
            $failed_tests++;
        }
    }
    
    echo "</div>";
}

// Summary
echo "<div class='test-section'>";
echo "<h3>📊 ملخص النتائج</h3>";
echo "<div class='info'>إجمالي الاختبارات: $total_tests</div>";
echo "<div class='success'>الاختبارات الناجحة: $passed_tests</div>";
echo "<div class='error'>الاختبارات الفاشلة: $failed_tests</div>";

$success_rate = $total_tests > 0 ? round(($passed_tests / $total_tests) * 100, 2) : 0;
echo "<div class='info'>معدل النجاح: $success_rate%</div>";

if ($success_rate >= 90) {
    echo "<div class='success'>🎉 ممتاز! معظم الصور تعمل بشكل صحيح</div>";
} elseif ($success_rate >= 70) {
    echo "<div class='warning'>⚠️ جيد، لكن هناك بعض المشاكل</div>";
} else {
    echo "<div class='error'>❌ هناك مشاكل كثيرة تحتاج إلى إصلاح</div>";
}
echo "</div>";

// File existence check
echo "<div class='test-section'>";
echo "<h3>📁 فحص وجود الملفات محلياً</h3>";

$local_paths = [
    'public/images/home/logo/WonderlandLogoWhite.svg',
    'public/images/home/services/tourism_consultation.jpg',
    'public/images/packages/pexels-photo-2506923.jpg',
    'public/images/destinations/saudi/riyadh/Ryiadh1.jpeg',
    'public/images/destinations/global/London/London1.jpeg',
];

foreach ($local_paths as $path) {
    if (file_exists($path)) {
        $size = filesize($path);
        echo "<div class='test-result success'>✅ $path - حجم: " . number_format($size) . " بايت</div>";
    } else {
        echo "<div class='test-result error'>❌ $path - غير موجود</div>";
    }
}
echo "</div>";

// Symlink check
echo "<div class='test-section'>";
echo "<h3>🔗 فحص Symlinks</h3>";

$symlinks = [
    'images' => 'public/images',
    'public_images' => 'public/images',
    'output_images' => 'output/public/images',
    'media' => 'public/images',
    'uploads' => 'public/images',
];

foreach ($symlinks as $link => $target) {
    if (is_link($link)) {
        $actual_target = readlink($link);
        if ($actual_target === $target) {
            echo "<div class='test-result success'>✅ $link -> $target</div>";
        } else {
            echo "<div class='test-result error'>❌ $link -> $actual_target (متوقع: $target)</div>";
        }
    } else {
        echo "<div class='test-result error'>❌ $link - ليس symlink</div>";
    }
}
echo "</div>";

echo "<h3>✅ تم الانتهاء من الاختبار!</h3>";
echo "<div class='info'>إذا كانت هناك مشاكل، قم بتشغيل scripts الإصلاح</div>";

/**
 * Test image path
 */
function test_image_path($url) {
    $context = stream_context_create([
        'http' => [
            'method' => 'HEAD',
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ]);
    
    $headers = @get_headers($url, 1, $context);
    
    if ($headers === false) {
        return ['success' => false, 'status' => 'No response'];
    }
    
    $status_line = $headers[0];
    
    if (strpos($status_line, '200') !== false) {
        return ['success' => true, 'status' => 'HTTP 200'];
    } elseif (strpos($status_line, '301') !== false || strpos($status_line, '302') !== false) {
        return ['success' => true, 'status' => 'HTTP 301/302 (Redirect)'];
    } elseif (strpos($status_line, '404') !== false) {
        return ['success' => false, 'status' => 'HTTP 404 (Not Found)'];
    } elseif (strpos($status_line, '500') !== false) {
        return ['success' => false, 'status' => 'HTTP 500 (Server Error)'];
    } elseif (strpos($status_line, '503') !== false) {
        return ['success' => false, 'status' => 'HTTP 503 (Service Unavailable)'];
    } else {
        return ['success' => false, 'status' => $status_line];
    }
}
?>

</body>
</html>
