<?php
// Fix for image serving issues on GoDaddy
echo "<h1>🖼️ Image Serving Fix</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

echo "<h3>🔍 Current Issue</h3>";
echo "<div class='info'>Your images exist but Nuxt.js is trying to process them through _ipx service which isn't working on GoDaddy.</div>";

echo "<h3>✅ Images Found</h3>";
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

$totalImages = 0;
foreach ($imageDirs as $dir) {
    if (is_dir($dir)) {
        $files = scandir($dir);
        $imageFiles = array_filter($files, function($file) {
            return preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file);
        });
        $totalImages += count($imageFiles);
        echo "<div class='success'>✅ $dir: " . count($imageFiles) . " images</div>";
    }
}

echo "<h3>🔧 Solutions</h3>";
echo "<div class='info'><strong>Option 1: Disable _ipx in Nuxt.js config</strong></div>";
echo "<div class='info'>Add this to your nuxt.config.ts:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "export default defineNuxtConfig({\n";
echo "  image: {\n";
echo "    ipx: false\n";
echo "  }\n";
echo "})";
echo "</pre>";

echo "<div class='info'><strong>Option 2: Create symlinks for direct access</strong></div>";
echo "<div class='info'>Create direct access to images without _ipx processing</div>";

echo "<h3>📋 Quick Fix Commands</h3>";
echo "<div class='info'>Run these commands on your GoDaddy server:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "# Create direct image access\n";
echo "ln -sf public/images images\n";
echo "ln -sf public/images/destinations destinations\n";
echo "ln -sf public/images/packages packages\n";
echo "ln -sf public/images/home home\n";
echo "\n# Set proper permissions\n";
echo "chmod -R 755 public/images/\n";
echo "chmod -R 644 public/images/**/*.jpg\n";
echo "chmod -R 644 public/images/**/*.jpeg\n";
echo "chmod -R 644 public/images/**/*.png\n";
echo "chmod -R 644 public/images/**/*.webp";
echo "</pre>";

echo "<h3>🎯 Test Your Images</h3>";
echo "<div class='info'>After running the commands, test these URLs:</div>";
echo "<ul>";
echo "<li><a href='/images/destinations/global/London/London1.jpeg' target='_blank'>London1.jpeg</a></li>";
echo "<li><a href='/images/destinations/global/Paris/Paris1.jpeg' target='_blank'>Paris1.jpeg</a></li>";
echo "<li><a href='/images/destinations/saudi/jeddah/Jeddah1.jpeg' target='_blank'>Jeddah1.jpeg</a></li>";
echo "<li><a href='/images/home/heroSection/hero-image.webp' target='_blank'>Hero Image</a></li>";
echo "</ul>";

echo "<h3>📊 Summary</h3>";
echo "<div class='success'>✅ Found $totalImages images in your directories</div>";
echo "<div class='info'>🔧 Need to fix _ipx image processing for GoDaddy</div>";
echo "<div class='info'>💡 Images exist, just need proper serving configuration</div>";
?>
