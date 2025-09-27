<?php
// Fix for download issue on GoDaddy
echo "<h1>🔧 Fixing Download Issue</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

echo "<h3>🔍 Diagnosing the Issue</h3>";

// Check if index.php exists and is readable
if (file_exists('index.php')) {
    echo "<div class='success'>✅ index.php exists</div>";
    if (is_readable('index.php')) {
        echo "<div class='success'>✅ index.php is readable</div>";
    } else {
        echo "<div class='error'>❌ index.php is not readable</div>";
    }
} else {
    echo "<div class='error'>❌ index.php does not exist</div>";
}

// Check if 200.html exists
if (file_exists('output/public/200.html')) {
    echo "<div class='success'>✅ output/public/200.html exists</div>";
} else {
    echo "<div class='error'>❌ output/public/200.html does not exist</div>";
}

// Check .htaccess
if (file_exists('.htaccess')) {
    echo "<div class='success'>✅ .htaccess exists</div>";
    $htaccess = file_get_contents('.htaccess');
    if (strpos($htaccess, 'DirectoryIndex') !== false) {
        echo "<div class='success'>✅ DirectoryIndex is set in .htaccess</div>";
    } else {
        echo "<div class='error'>❌ DirectoryIndex not found in .htaccess</div>";
    }
} else {
    echo "<div class='error'>❌ .htaccess does not exist</div>";
}

echo "<h3>🔧 Quick Fixes</h3>";

echo "<div class='info'><strong>Fix 1: Add DirectoryIndex to .htaccess</strong></div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "DirectoryIndex index.php index.html\n";
echo "RewriteEngine On\n";
echo "RewriteCond %{REQUEST_FILENAME} !-f\n";
echo "RewriteCond %{REQUEST_FILENAME} !-d\n";
echo "RewriteRule ^(.*)$ index.php [QSA,L]";
echo "</pre>";

echo "<div class='info'><strong>Fix 2: Check file permissions</strong></div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "chmod 644 index.php\n";
echo "chmod 644 .htaccess\n";
echo "chmod 644 output/public/200.html";
echo "</pre>";

echo "<div class='info'><strong>Fix 3: Create a simple test index</strong></div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "<?php\n";
echo "header('Content-Type: text/html; charset=utf-8');\n";
echo "echo '<h1>World Trip Agency</h1>';\n";
echo "echo '<p>Site is working!</p>';\n";
echo "echo '<p>Time: ' . date('Y-m-d H:i:s') . '</p>';\n";
echo "?>";
echo "</pre>";

echo "<h3>📋 Commands to Run</h3>";
echo "<div class='info'>Run these commands on your GoDaddy server:</div>";
echo "<pre style='background:#f5f5f5;padding:10px;border-radius:5px;'>";
echo "# Fix .htaccess\n";
echo "echo 'DirectoryIndex index.php index.html' > .htaccess\n";
echo "echo 'RewriteEngine On' >> .htaccess\n";
echo "echo 'RewriteCond %{REQUEST_FILENAME} !-f' >> .htaccess\n";
echo "echo 'RewriteCond %{REQUEST_FILENAME} !-d' >> .htaccess\n";
echo "echo 'RewriteRule ^(.*)$ index.php [QSA,L]' >> .htaccess\n";
echo "\n# Fix permissions\n";
echo "chmod 644 index.php\n";
echo "chmod 644 .htaccess\n";
echo "\n# Test the site\n";
echo "curl -I https://travelin-agency-nlcs.vercel.app/";
echo "</pre>";

echo "<h3>🎯 Expected Result</h3>";
echo "<div class='success'>After the fix, https://travelin-agency-nlcs.vercel.app/ should display the webpage instead of downloading a file.</div>";
?>
