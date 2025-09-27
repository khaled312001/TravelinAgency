<?php
// Create the missing logo file
echo "<h1>🎨 Create Missing Logo</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

$logoDir = 'public/images/home/logo/';
$logoFile = $logoDir . 'WonderlandLogoWhite.svg';

echo "<h3>🔍 Current Status</h3>";

if (file_exists($logoFile)) {
    echo "<div class='success'>✅ Logo file already exists: $logoFile</div>";
    echo "<div class='info'>📏 File size: " . filesize($logoFile) . " bytes</div>";
} else {
    echo "<div class='error'>❌ Logo file missing: $logoFile</div>";
    
    // Create directory if it doesn't exist
    if (!is_dir($logoDir)) {
        if (mkdir($logoDir, 0755, true)) {
            echo "<div class='success'>✅ Created directory: $logoDir</div>";
        } else {
            echo "<div class='error'>❌ Failed to create directory: $logoDir</div>";
        }
    }
    
    // Create the logo file
    $logoContent = '<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="60" fill="#1e40af"/>
  <text x="100" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">World Trip Agency</text>
</svg>';
    
    if (file_put_contents($logoFile, $logoContent)) {
        echo "<div class='success'>✅ Logo file created successfully: $logoFile</div>";
        echo "<div class='info'>📏 File size: " . filesize($logoFile) . " bytes</div>";
        
        // Set permissions
        if (chmod($logoFile, 0644)) {
            echo "<div class='success'>✅ Permissions set: 644</div>";
        } else {
            echo "<div class='warning'>⚠️ Could not set permissions</div>";
        }
    } else {
        echo "<div class='error'>❌ Failed to create logo file</div>";
    }
}

echo "<h3>🎯 Test the Logo</h3>";
echo "<div class='info'>Test these URLs:</div>";
echo "<ul>";
echo "<li><a href='/images/home/logo/WonderlandLogoWhite.svg' target='_blank'>Direct access: /images/home/logo/WonderlandLogoWhite.svg</a></li>";
echo "<li><a href='https://worldtripagency.com/images/home/logo/WonderlandLogoWhite.svg' target='_blank'>Full URL: https://worldtripagency.com/images/home/logo/WonderlandLogoWhite.svg</a></li>";
echo "</ul>";

echo "<h3>📋 Manual Commands</h3>";
echo "<div class='info'>If the above didn't work, run these commands manually:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "# Create directory\n";
echo "mkdir -p public/images/home/logo\n";
echo "\n# Create logo file\n";
echo "cat > public/images/home/logo/WonderlandLogoWhite.svg << 'EOF'\n";
echo '<?xml version="1.0" encoding="UTF-8"?>\n';
echo '<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">\n';
echo '  <rect width="200" height="60" fill="#1e40af"/>\n';
echo '  <text x="100" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">World Trip Agency</text>\n';
echo '</svg>\n';
echo "EOF\n";
echo "\n# Set permissions\n";
echo "chmod 644 public/images/home/logo/WonderlandLogoWhite.svg\n";
echo "chmod 755 public/images/home/logo/";
echo "</pre>";

echo "<h3>🎉 Expected Result</h3>";
echo "<div class='success'>After creating the logo, it should display in the header of your website.</div>";
echo "<div class='info'>The logo is a simple blue rectangle with white text saying 'World Trip Agency'.</div>";
?>
