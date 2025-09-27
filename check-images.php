<?php
// Script to check image directories and create placeholder images if needed
echo "<h1>🖼️ Image Directory Check</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

$imageDirs = [
    'public/images/destinations/global/Georgia',
    'public/images/destinations/global/Istanbul',
    'public/images/destinations/global/London',
    'public/images/destinations/global/Cairo',
    'public/images/destinations/global/Madrid',
    'public/images/destinations/global/Barcelona',
    'public/images/destinations/global/Paris',
    'public/images/destinations/global/Thailand',
    'public/images/destinations/global/SharmElSheikh',
    'public/images/destinations/global/Morocco',
    'public/images/destinations/saudi/jeddah',
    'public/images/destinations/saudi/Medina',
    'public/images/destinations/saudi/Makkah',
    'public/images/destinations/saudi/alula',
    'public/images/destinations/saudi/riyadh',
    'public/images/home/heroSection'
];

echo "<h3>📁 Checking Image Directories</h3>";

foreach ($imageDirs as $dir) {
    if (is_dir($dir)) {
        echo "<div class='success'>✅ $dir exists</div>";
        
        // List files in directory
        $files = scandir($dir);
        $imageFiles = array_filter($files, function($file) {
            return preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file);
        });
        
        if (count($imageFiles) > 0) {
            echo "<div class='info'>📸 Images: " . implode(', ', $imageFiles) . "</div>";
        } else {
            echo "<div class='error'>❌ No images found in $dir</div>";
        }
    } else {
        echo "<div class='error'>❌ $dir missing</div>";
    }
}

echo "<h3>🔧 Recommendations</h3>";
echo "<div class='info'>1. Upload your destination images to the public/images/destinations/ directories</div>";
echo "<div class='info'>2. Make sure images are named correctly (e.g., Georgia1.jpeg, London1.jpeg)</div>";
echo "<div class='info'>3. Use web-optimized formats (WebP, JPEG) for better performance</div>";

echo "<h3>📋 Quick Fix</h3>";
echo "<div class='info'>If you don't have images yet, you can:</div>";
echo "<div class='info'>- Use placeholder images from unsplash.com or pexels.com</div>";
echo "<div class='info'>- Create simple colored rectangles as placeholders</div>";
echo "<div class='info'>- Use a CDN service for images</div>";
?>
