<?php
// Fix for logo and services section images
echo "<h1>🖼️ Fix Logo and Services Images</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

echo "<h3>🔍 Checking Logo and Services Images</h3>";

// Check logo files
$logoFiles = [
    'public/images/home/logo/WonderlandLogoWhite.svg',
    'public/images/home/logo/logo.svg',
    'public/images/logo.svg',
    'public/images/home/logo/logo.png',
    'public/images/home/logo/logo.jpg'
];

echo "<h4>📋 Logo Files Check:</h4>";
foreach ($logoFiles as $logo) {
    if (file_exists($logo)) {
        echo "<div class='success'>✅ $logo exists</div>";
    } else {
        echo "<div class='error'>❌ $logo missing</div>";
    }
}

// Check services images
$servicesFiles = [
    'public/images/home/services/flight_reservations.jpg',
    'public/images/home/services/hotel_reservations.jpg',
    'public/images/home/services/tourism_consultation.jpg',
    'public/images/home/services/visa_services.jpg',
    'public/images/home/services/package_tours.jpg',
    'public/images/home/services/transportation.jpg'
];

echo "<h4>📋 Services Images Check:</h4>";
foreach ($servicesFiles as $service) {
    if (file_exists($service)) {
        echo "<div class='success'>✅ $service exists</div>";
    } else {
        echo "<div class='error'>❌ $service missing</div>";
    }
}

echo "<h3>🔧 Quick Fixes</h3>";

echo "<div class='info'><strong>Fix 1: Create missing logo files</strong></div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "# Create logo directory if it doesn't exist\n";
echo "mkdir -p public/images/home/logo\n";
echo "\n# Create a simple SVG logo\n";
echo "cat > public/images/home/logo/WonderlandLogoWhite.svg << 'EOF'\n";
echo '<?xml version="1.0" encoding="UTF-8"?>\n';
echo '<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">\n';
echo '  <rect width="200" height="60" fill="#1e40af"/>\n';
echo '  <text x="100" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">World Trip Agency</text>\n';
echo '</svg>\n';
echo "EOF\n";
echo "\n# Set permissions\n";
echo "chmod 644 public/images/home/logo/WonderlandLogoWhite.svg";
echo "</pre>";

echo "<div class='info'><strong>Fix 2: Create missing services images</strong></div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "# Create services directory\n";
echo "mkdir -p public/images/home/services\n";
echo "\n# Create placeholder images for services\n";
echo "# You can replace these with actual service images later\n";
echo "echo 'Creating placeholder service images...'\n";
echo "# Use ImageMagick or create simple colored rectangles\n";
echo "# For now, we'll create simple HTML placeholders";
echo "</pre>";

echo "<h3>📋 Commands to Run</h3>";
echo "<div class='info'>Run these commands on your GoDaddy server:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "# Create logo directory and file\n";
echo "mkdir -p public/images/home/logo\n";
echo "\n# Create a simple SVG logo\n";
echo "cat > public/images/home/logo/WonderlandLogoWhite.svg << 'EOF'\n";
echo '<?xml version="1.0" encoding="UTF-8"?>\n';
echo '<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">\n';
echo '  <rect width="200" height="60" fill="#1e40af"/>\n';
echo '  <text x="100" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">World Trip Agency</text>\n';
echo '</svg>\n';
echo "EOF\n";
echo "\n# Create services directory\n";
echo "mkdir -p public/images/home/services\n";
echo "\n# Set permissions\n";
echo "chmod -R 644 public/images/home/logo/\n";
echo "chmod -R 644 public/images/home/services/\n";
echo "\n# Test the logo\n";
echo "curl -I https://worldtripagency.com/images/home/logo/WonderlandLogoWhite.svg";
echo "</pre>";

echo "<h3>🎯 Alternative: Use Placeholder Images</h3>";
echo "<div class='info'>If you don't have the actual images, you can use placeholder services:</div>";
echo "<ul>";
echo "<li><a href='https://via.placeholder.com/300x200/1e40af/ffffff?text=Flight+Reservations' target='_blank'>Flight Reservations Placeholder</a></li>";
echo "<li><a href='https://via.placeholder.com/300x200/059669/ffffff?text=Hotel+Reservations' target='_blank'>Hotel Reservations Placeholder</a></li>";
echo "<li><a href='https://via.placeholder.com/300x200/dc2626/ffffff?text=Tourism+Consultation' target='_blank'>Tourism Consultation Placeholder</a></li>";
echo "<li><a href='https://via.placeholder.com/300x200/7c3aed/ffffff?text=Visa+Services' target='_blank'>Visa Services Placeholder</a></li>";
echo "<li><a href='https://via.placeholder.com/300x200/ea580c/ffffff?text=Package+Tours' target='_blank'>Package Tours Placeholder</a></li>";
echo "<li><a href='https://via.placeholder.com/300x200/0891b2/ffffff?text=Transportation' target='_blank'>Transportation Placeholder</a></li>";
echo "</ul>";

echo "<h3>📊 Summary</h3>";
echo "<div class='info'>🔧 Need to create missing logo and services images</div>";
echo "<div class='info'>💡 Use the commands above to create placeholder images</div>";
echo "<div class='info'>🎨 Replace placeholders with actual images later</div>";
?>
