<?php
// Fix permissions and test images
echo "<h1>🔧 Fix Permissions and Test Images</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

echo "<h3>🔍 Current Status</h3>";

// Check if images exist
$logoFile = 'public/images/home/logo/WonderlandLogoWhite.svg';
$servicesDir = 'public/images/home/services/';

if (file_exists($logoFile)) {
    echo "<div class='success'>✅ Logo file exists: $logoFile</div>";
    echo "<div class='info'>📏 File size: " . filesize($logoFile) . " bytes</div>";
    echo "<div class='info'>🔒 Permissions: " . substr(sprintf('%o', fileperms($logoFile)), -4) . "</div>";
} else {
    echo "<div class='error'>❌ Logo file missing: $logoFile</div>";
}

if (is_dir($servicesDir)) {
    echo "<div class='success'>✅ Services directory exists: $servicesDir</div>";
    $servicesFiles = scandir($servicesDir);
    $imageFiles = array_filter($servicesFiles, function($file) {
        return preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file);
    });
    echo "<div class='info'>📸 Found " . count($imageFiles) . " service images</div>";
    foreach ($imageFiles as $file) {
        echo "<div class='success'>  ✅ $file</div>";
    }
} else {
    echo "<div class='error'>❌ Services directory missing: $servicesDir</div>";
}

echo "<h3>🔧 Permission Fix Commands</h3>";
echo "<div class='info'>Run these commands to fix permissions:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "# Fix directory permissions first\n";
echo "chmod 755 public/images/home/\n";
echo "chmod 755 public/images/home/logo/\n";
echo "chmod 755 public/images/home/services/\n";
echo "\n# Then fix file permissions\n";
echo "find public/images/home/ -name '*.svg' -exec chmod 644 {} \\;\n";
echo "find public/images/home/ -name '*.jpg' -exec chmod 644 {} \\;\n";
echo "find public/images/home/ -name '*.jpeg' -exec chmod 644 {} \\;\n";
echo "find public/images/home/ -name '*.png' -exec chmod 644 {} \\;\n";
echo "\n# Alternative: Use sudo if available\n";
echo "sudo chmod -R 644 public/images/home/\n";
echo "sudo chmod -R 755 public/images/home/";
echo "</pre>";

echo "<h3>🎯 Test Your Images</h3>";
echo "<div class='info'>Test these URLs in your browser:</div>";
echo "<ul>";
echo "<li><a href='/images/home/logo/WonderlandLogoWhite.svg' target='_blank'>Logo: /images/home/logo/WonderlandLogoWhite.svg</a></li>";
echo "<li><a href='/images/home/services/flight_reservations.jpg' target='_blank'>Flight Reservations</a></li>";
echo "<li><a href='/images/home/services/hotel_reservations.jpg' target='_blank'>Hotel Reservations</a></li>";
echo "<li><a href='/images/home/services/tourism_consultation.jpg' target='_blank'>Tourism Consultation</a></li>";
echo "<li><a href='/images/home/services/visa_services.jpg' target='_blank'>Visa Services</a></li>";
echo "</ul>";

echo "<h3>📋 Quick Test Commands</h3>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "# Test if files are accessible via web\n";
echo "curl -I https://travelin-agency-nlcs.vercel.app/images/home/logo/WonderlandLogoWhite.svg\n";
echo "curl -I https://travelin-agency-nlcs.vercel.app/images/home/services/flight_reservations.jpg\n";
echo "\n# Check file ownership\n";
echo "ls -la public/images/home/logo/\n";
echo "ls -la public/images/home/services/";
echo "</pre>";

echo "<h3>🎉 Expected Result</h3>";
echo "<div class='success'>After fixing permissions, your logo and services images should display properly on the website.</div>";
echo "<div class='info'>The images were created successfully - it's just a permission issue that needs to be resolved.</div>";
?>
