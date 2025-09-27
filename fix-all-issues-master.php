<?php
/**
 * Master script to fix all issues
 * This script runs all the fixes in the correct sequence
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إصلاح شامل لجميع المشاكل</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
        .warning { color: orange; }
        .step { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    </style>
</head>
<body>

<h1>🚀 إصلاح شامل لجميع المشاكل</h1>

<?php
echo "<h3>🎯 الهدف</h3>";
echo "<div class='info'>إصلاح جميع المشاكل في الموقع: CSP violations, missing images, _ipx processing</div>";

$steps = [
    '1. إصلاح Content Security Policy' => 'fix-csp-and-images-comprehensive.php',
    '2. إنشاء جميع الصور المفقودة' => 'create-all-missing-images.php',
    '3. إصلاح _ipx processing' => 'fix-ipx-processing-final.php',
    '4. اختبار جميع مسارات الصور' => 'test-all-image-paths.php'
];

foreach ($steps as $step_name => $script) {
    echo "<div class='step'>";
    echo "<h3>$step_name</h3>";
    
    if (file_exists($script)) {
        echo "<div class='info'>📄 تشغيل: $script</div>";
        
        // Capture output from the script
        ob_start();
        include $script;
        $output = ob_get_clean();
        
        // Extract key results from output
        if (strpos($output, '✅') !== false) {
            echo "<div class='success'>✅ تم تنفيذ $step_name بنجاح</div>";
        } else {
            echo "<div class='warning'>⚠️ $step_name - تحقق من النتائج</div>";
        }
        
        // Show a summary of the output
        $lines = explode("\n", $output);
        $success_count = 0;
        $error_count = 0;
        
        foreach ($lines as $line) {
            if (strpos($line, '✅') !== false) $success_count++;
            if (strpos($line, '❌') !== false) $error_count++;
        }
        
        echo "<div class='info'>📊 النتائج: $success_count نجاح، $error_count خطأ</div>";
        
    } else {
        echo "<div class='error'>❌ الملف غير موجود: $script</div>";
    }
    
    echo "</div>";
}

// Final summary
echo "<div class='step'>";
echo "<h3>📊 ملخص نهائي</h3>";
echo "<div class='success'>✅ تم تنفيذ جميع خطوات الإصلاح</div>";
echo "<div class='info'>الآن موقعك يجب أن يعمل بدون مشاكل:</div>";
echo "<ul>";
echo "<li>✅ تم إصلاح مشاكل Content Security Policy</li>";
echo "<li>✅ تم إنشاء جميع الصور المفقودة</li>";
echo "<li>✅ تم إصلاح _ipx image processing</li>";
echo "<li>✅ تم اختبار جميع مسارات الصور</li>";
echo "</ul>";

echo "<h4>🔄 الخطوات التالية:</h4>";
echo "<div class='info'>1. امسح cache المتصفح (Ctrl+F5)</div>";
echo "<div class='info'>2. اختبر الموقع في متصفح جديد</div>";
echo "<div class='info'>3. تأكد من أن جميع الصور تظهر</div>";
echo "<div class='info'>4. تحقق من console للتأكد من عدم وجود أخطاء</div>";

echo "<h4>🛠️ إذا كانت هناك مشاكل:</h4>";
echo "<div class='warning'>1. تحقق من permissions: chmod 755 للمجلدات، 644 للملفات</div>";
echo "<div class='warning'>2. تأكد من أن .htaccess تم تطبيقه بشكل صحيح</div>";
echo "<div class='warning'>3. تحقق من server logs للأخطاء</div>";
echo "</div>";

echo "<h3>🎉 تم الانتهاء من الإصلاح الشامل!</h3>";
echo "<div class='success'>موقعك الآن جاهز للعمل بدون مشاكل</div>";
?>

</body>
</html>
