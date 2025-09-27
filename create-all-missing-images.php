<?php
/**
 * Create all missing images based on console error logs
 * This script creates placeholder images for all the missing files
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إنشاء جميع الصور المفقودة</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
        .warning { color: orange; }
    </style>
</head>
<body>

<h1>🖼️ إنشاء جميع الصور المفقودة</h1>

<?php
echo "<h3>🎯 الهدف</h3>";
echo "<div class='info'>إنشاء جميع الصور المفقودة بناءً على أخطاء console</div>";

// All missing images from console logs
$missing_images = [
    // Package images
    'public/images/packages/pexels-photo-2506923.jpg',
    'public/images/packages/pexels-photo-1694621.jpg', 
    'public/images/packages/pexels-photo-802024.jpg',
    'public/images/packages/pexels-photo-338515.jpg',
    'public/images/packages/pexels-photo-1010657.jpg',
    'public/images/packages/pexels-photo-532263.jpg',
    'public/images/packages/pexels-photo-2356045.jpg',
    'public/images/packages/pexels-photo-3787839.jpg',
    
    // Destination images - Saudi
    'public/images/destinations/saudi/riyadh/Ryiadh1.jpeg',
    'public/images/destinations/saudi/Makkah/Makkah1.jpeg',
    'public/images/destinations/saudi/Medina/Medina1.jpeg',
    'public/images/destinations/saudi/alula/AlUla1.jpeg',
    
    // Destination images - Global
    'public/images/destinations/global/Madrid/Madrid1.jpeg',
    'public/images/destinations/global/Barcelona/Barcelona1.jpeg',
    'public/images/destinations/global/Georgia/Georgia1.jpeg',
    'public/images/destinations/global/London/London1.jpeg',
    'public/images/destinations/global/Morocco/Morocco1.jpeg',
    'public/images/destinations/global/Paris/Paris1.jpeg',
    'public/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
    'public/images/destinations/global/Istanbul/Istanbul1.jpeg',
    'public/images/destinations/global/Cairo/Cairo1.jpeg',
    
    // Additional common images
    'public/images/home/services/tourism_consultation.jpg',
    'public/images/home/services/travel_planning.jpg',
    'public/images/home/services/visa_assistance.jpg',
    'public/images/home/services/airline_booking.jpg',
    'public/images/home/services/hotel_reservation.jpg',
    'public/images/home/services/transportation.jpg',
    
    // Logo and branding
    'public/images/home/logo/WonderlandLogoWhite.svg',
    'public/images/home/logo/WonderlandLogoDark.svg',
    'public/images/home/logo/WonderlandLogoColor.svg',
];

echo "<h3>📁 إنشاء المجلدات</h3>";

// Create all necessary directories
$directories = [
    'public/images/packages',
    'public/images/destinations/saudi/riyadh',
    'public/images/destinations/saudi/Makkah',
    'public/images/destinations/saudi/Medina',
    'public/images/destinations/saudi/alula',
    'public/images/destinations/global/Madrid',
    'public/images/destinations/global/Barcelona',
    'public/images/destinations/global/Georgia',
    'public/images/destinations/global/London',
    'public/images/destinations/global/Morocco',
    'public/images/destinations/global/Paris',
    'public/images/destinations/global/SharmElSheikh',
    'public/images/destinations/global/Istanbul',
    'public/images/destinations/global/Cairo',
    'public/images/home/services',
    'public/images/home/logo',
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "<div class='success'>✅ تم إنشاء المجلد: $dir</div>";
        } else {
            echo "<div class='error'>❌ فشل في إنشاء المجلد: $dir</div>";
        }
    } else {
        echo "<div class='info'>ℹ️ المجلد موجود: $dir</div>";
    }
}

echo "<h3>🖼️ إنشاء الصور</h3>";

$created_count = 0;
$failed_count = 0;

foreach ($missing_images as $image_path) {
    if (!file_exists($image_path)) {
        $result = create_placeholder_image($image_path);
        if ($result) {
            echo "<div class='success'>✅ تم إنشاء: $image_path</div>";
            $created_count++;
        } else {
            echo "<div class='error'>❌ فشل في إنشاء: $image_path</div>";
            $failed_count++;
        }
    } else {
        echo "<div class='info'>ℹ️ موجود: $image_path</div>";
    }
}

echo "<h3>📊 النتائج</h3>";
echo "<div class='success'>✅ تم إنشاء $created_count صورة</div>";
echo "<div class='error'>❌ فشل في إنشاء $failed_count صورة</div>";

echo "<h3>🧪 اختبار الصور</h3>";

// Test some key images
$test_images = [
    'public/images/home/logo/WonderlandLogoWhite.svg',
    'public/images/home/services/tourism_consultation.jpg',
    'public/images/packages/pexels-photo-2506923.jpg',
    'public/images/destinations/saudi/riyadh/Ryiadh1.jpeg',
    'public/images/destinations/global/London/London1.jpeg',
];

foreach ($test_images as $image) {
    if (file_exists($image)) {
        $size = filesize($image);
        echo "<div class='success'>✅ $image - حجم: " . number_format($size) . " بايت</div>";
    } else {
        echo "<div class='error'>❌ $image - غير موجود</div>";
    }
}

echo "<h3>✅ تم الانتهاء!</h3>";
echo "<div class='success'>تم إنشاء جميع الصور المفقودة</div>";
echo "<div class='info'>الآن يجب أن تظهر جميع الصور في الموقع</div>";

/**
 * Create a placeholder image
 */
function create_placeholder_image($image_path) {
    $extension = strtolower(pathinfo($image_path, PATHINFO_EXTENSION));
    $filename = basename($image_path);
    $name = pathinfo($filename, PATHINFO_FILENAME);
    
    if ($extension === 'svg') {
        return create_svg_placeholder($image_path, $name);
    } elseif (in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) {
        return create_raster_placeholder($image_path, $name, $extension);
    }
    
    return false;
}

function create_svg_placeholder($image_path, $name) {
    $svg_content = <<<SVG
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#357ABD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad1)"/>
  <rect x="20" y="20" width="360" height="260" fill="none" stroke="white" stroke-width="2" rx="10"/>
  <text x="50%" y="45%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="18" fill="white" font-weight="bold">
    $name
  </text>
  <text x="50%" y="55%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="white" opacity="0.8">
    Placeholder Image
  </text>
</svg>
SVG;
    
    return file_put_contents($image_path, $svg_content) !== false;
}

function create_raster_placeholder($image_path, $name, $extension) {
    // Create image
    $width = 400;
    $height = 300;
    $image = imagecreate($width, $height);
    
    // Colors
    $bg_color = imagecolorallocate($image, 74, 144, 226); // Blue background
    $border_color = imagecolorallocate($image, 255, 255, 255); // White border
    $text_color = imagecolorallocate($image, 255, 255, 255); // White text
    
    // Draw border
    imagerectangle($image, 10, 10, $width-11, $height-11, $border_color);
    
    // Add text
    $font_size = 5;
    $text_width = imagefontwidth($font_size) * strlen($name);
    $text_height = imagefontheight($font_size);
    $x = ($width - $text_width) / 2;
    $y = ($height - $text_height) / 2;
    
    imagestring($image, $font_size, $x, $y, $name, $text_color);
    
    // Add "Placeholder" text
    $placeholder_text = "Placeholder";
    $placeholder_width = imagefontwidth($font_size) * strlen($placeholder_text);
    $placeholder_x = ($width - $placeholder_width) / 2;
    $placeholder_y = $y + $text_height + 10;
    
    imagestring($image, $font_size, $placeholder_x, $placeholder_y, $placeholder_text, $text_color);
    
    // Save image
    $result = false;
    switch ($extension) {
        case 'jpg':
        case 'jpeg':
            $result = imagejpeg($image, $image_path, 90);
            break;
        case 'png':
            $result = imagepng($image, $image_path);
            break;
        case 'webp':
            $result = imagewebp($image, $image_path, 90);
            break;
    }
    
    imagedestroy($image);
    
    if ($result) {
        chmod($image_path, 0644);
    }
    
    return $result;
}
?>

</body>
</html>
