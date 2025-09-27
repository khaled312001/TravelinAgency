<?php
// Fix GoDaddy Permissions Script
// Run this on your GoDaddy server to fix file permissions

echo "<h1>🔧 GoDaddy Permissions Fix</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

// Function to set permissions
function setPermissions($file, $perms) {
    if (file_exists($file)) {
        if (chmod($file, $perms)) {
            echo "<div class='success'>✅ Set $file to " . substr(sprintf('%o', $perms), -4) . "</div>";
            return true;
        } else {
            echo "<div class='error'>❌ Failed to set permissions for $file</div>";
            return false;
        }
    } else {
        echo "<div class='warning'>⚠️ $file not found</div>";
        return false;
    }
}

echo "<h2>📁 Setting File Permissions</h2>";

// Set file permissions (644)
$files = [
    'index.php',
    'api-handler.php',
    '.htaccess',
    '.env',
    'test.php',
    'simple-test.php',
    'diagnose-godaddy-server.php'
];

foreach ($files as $file) {
    setPermissions($file, 0644);
}

echo "<h2>📂 Setting Directory Permissions</h2>";

// Set directory permissions (755)
$dirs = [
    'output',
    'output/public',
    'output/public/_nuxt',
    'public',
    'public/images'
];

foreach ($dirs as $dir) {
    setPermissions($dir, 0755);
}

echo "<h2>🔧 Testing .htaccess</h2>";

// Check if .htaccess is readable
if (file_exists('.htaccess')) {
    if (is_readable('.htaccess')) {
        echo "<div class='success'>✅ .htaccess is readable</div>";
    } else {
        echo "<div class='error'>❌ .htaccess is not readable</div>";
    }
    
    // Try to read content
    $content = file_get_contents('.htaccess');
    if ($content !== false) {
        echo "<div class='success'>✅ .htaccess content readable</div>";
        if (strpos($content, 'RewriteEngine On') !== false) {
            echo "<div class='success'>✅ .htaccess contains RewriteEngine</div>";
        } else {
            echo "<div class='error'>❌ .htaccess missing RewriteEngine</div>";
        }
    } else {
        echo "<div class='error'>❌ Cannot read .htaccess content</div>";
    }
} else {
    echo "<div class='error'>❌ .htaccess file not found</div>";
}

echo "<h2>🧪 Testing PHP Execution</h2>";

// Test basic PHP functionality
echo "<div class='success'>✅ PHP is executing</div>";
echo "<div class='info'>PHP Version: " . phpversion() . "</div>";
echo "<div class='info'>Current Directory: " . __DIR__ . "</div>";

// Test if we can create a test file
$test_file = 'permission-test.txt';
if (file_put_contents($test_file, 'test') !== false) {
    echo "<div class='success'>✅ Can write files</div>";
    unlink($test_file); // Clean up
} else {
    echo "<div class='error'>❌ Cannot write files</div>";
}

echo "<h2>📋 Next Steps</h2>";
echo "<p>1. Test your site: <a href='simple-test.php'>simple-test.php</a></p>";
echo "<p>2. Run diagnostics: <a href='diagnose-godaddy-server.php'>diagnose-godaddy-server.php</a></p>";
echo "<p>3. Test API: <a href='api-handler.php'>api-handler.php</a></p>";
echo "<p>4. Test main site: <a href='index.php'>index.php</a></p>";

echo "<h2>🎯 Common GoDaddy Issues</h2>";
echo "<ul>";
echo "<li>Make sure you're in the correct directory (public_html)</li>";
echo "<li>Check if mod_rewrite is enabled in cPanel</li>";
echo "<li>Verify PHP version is 7.4+ or 8.x</li>";
echo "<li>Ensure MySQL service is running</li>";
echo "<li>Check error logs in cPanel</li>";
echo "</ul>";
?>
