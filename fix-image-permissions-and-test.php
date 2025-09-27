<?php
// Fix image permissions and test access
echo "<h1>🔧 Fix Image Permissions and Test Access</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

echo "<h3>🔧 Fixing File Permissions</h3>";

// Function to fix permissions recursively
function fixPermissions($path, $isDir = false) {
    if ($isDir) {
        if (chmod($path, 0755)) {
            echo "<div class='success'>✅ Fixed directory permissions: $path (755)</div>";
        } else {
            echo "<div class='error'>❌ Failed to fix directory permissions: $path</div>";
        }
    } else {
        if (chmod($path, 0644)) {
            echo "<div class='success'>✅ Fixed file permissions: $path (644)</div>";
        } else {
            echo "<div class='error'>❌ Failed to fix file permissions: $path</div>";
        }
    }
}

// Fix permissions for key directories
$directories = [
    'public',
    'public/images',
    'public/images/home',
    'public/images/home/logo',
    'public/images/home/services',
    'public/images/destinations',
    'public/images/destinations/global',
    'public/images/packages'
];

echo "<h4>📁 Fixing Directory Permissions</h4>";
foreach ($directories as $dir) {
    if (is_dir($dir)) {
        fixPermissions($dir, true);
    } else {
        echo "<div class='warning'>⚠️ Directory not found: $dir</div>";
    }
}

// Fix permissions for key image files
$keyImages = [
    'public/images/home/logo/WonderlandLogoWhite.svg',
    'public/images/home/services/support_24_7.jpg',
    'public/images/home/services/tourism_consultation.jpg',
    'public/images/home/services/hotel_reservations.jpg',
    'public/images/destinations/global/Barcelona/Barcelona1.jpeg',
    'public/images/packages/pexels-photo-338515.jpg'
];

echo "<h4>🖼️ Fixing Key Image File Permissions</h4>";
foreach ($keyImages as $image) {
    if (file_exists($image)) {
        fixPermissions($image, false);
    } else {
        echo "<div class='warning'>⚠️ Image not found: $image</div>";
    }
}

// Fix all image files in public/images recursively
echo "<h4>🔄 Fixing All Image Files Recursively</h4>";
function fixAllImagePermissions($dir) {
    if (!is_dir($dir)) return;
    
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file == '.' || $file == '..') continue;
        
        $fullPath = $dir . '/' . $file;
        
        if (is_dir($fullPath)) {
            fixAllImagePermissions($fullPath);
        } elseif (preg_match('/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i', $file)) {
            if (chmod($fullPath, 0644)) {
                echo "<div class='success'>✅ Fixed: $fullPath</div>";
            } else {
                echo "<div class='error'>❌ Failed: $fullPath</div>";
            }
        }
    }
}

fixAllImagePermissions('public/images');

echo "<h3>🧪 Testing Image Access</h3>";

// Test direct file access
echo "<h4>📋 Testing Direct File Access</h4>";
foreach ($keyImages as $image) {
    echo "<div class='info'>Testing: $image</div>";
    
    if (file_exists($image)) {
        $size = filesize($image);
        $perms = substr(sprintf('%o', fileperms($image)), -4);
        $readable = is_readable($image) ? 'Yes' : 'No';
        
        echo "<div class='success'>✅ Exists - Size: " . number_format($size) . " bytes, Perms: $perms, Readable: $readable</div>";
        
        // Test if we can read the file content
        $content = file_get_contents($image);
        if ($content !== false) {
            echo "<div class='success'>✅ File content readable (" . strlen($content) . " bytes)</div>";
        } else {
            echo "<div class='error'>❌ Cannot read file content</div>";
        }
    } else {
        echo "<div class='error'>❌ File does not exist</div>";
    }
    echo "<br>";
}

// Test web access using cURL
echo "<h4>🌐 Testing Web Access</h4>";
$baseUrl = 'https://travelin-agency-nlcs.vercel.app';

foreach ($keyImages as $image) {
    $webPath = str_replace('public', '', $image);
    $testUrl = $baseUrl . $webPath;
    
    echo "<div class='info'>Testing URL: $testUrl</div>";
    
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
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($httpCode == 200) {
        echo "<div class='success'>✅ Web access OK - HTTP $httpCode, Type: $contentType</div>";
    } else {
        echo "<div class='error'>❌ Web access failed - HTTP $httpCode</div>";
        if ($error) {
            echo "<div class='error'>❌ cURL Error: $error</div>";
        }
    }
    echo "<br>";
}

echo "<h3>📋 Next Steps</h3>";
echo "<div class='info'>After running this script:</div>";
echo "<ol>";
echo "<li>Replace your current .htaccess with the optimized version</li>";
echo "<li>Test the website in your browser</li>";
echo "<li>Check browser developer tools for any remaining errors</li>";
echo "<li>If issues persist, try creating symlinks for direct access</li>";
echo "</ol>";

echo "<h4>🔄 Commands to Run After This Script</h4>";
echo "<pre style='background:#f5f5f5;padding:10px;border:1px solid #ddd;'>";
echo "# Backup current .htaccess
cp .htaccess .htaccess-backup-$(date +%Y%m%d-%H%M%S)

# Use optimized .htaccess
cp .htaccess-optimized-images .htaccess

# Test a specific image
curl -I https://travelin-agency-nlcs.vercel.app/images/home/logo/WonderlandLogoWhite.svg";
echo "</pre>";
?>
