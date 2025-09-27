<?php
// GoDaddy Server Diagnostic Script
// Run this on your GoDaddy server to identify issues

echo "<h1>🔍 GoDaddy Server Diagnostic</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .warning{color:orange;} .info{color:blue;}</style>";

// Test 1: PHP Version and Configuration
echo "<h2>📋 PHP Configuration</h2>";
echo "<div class='info'>PHP Version: " . phpversion() . "</div>";
echo "<div class='info'>Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "</div>";
echo "<div class='info'>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</div>";
echo "<div class='info'>Current Directory: " . __DIR__ . "</div>";

// Test 2: File Permissions
echo "<h2>📁 File Permissions Check</h2>";
$files_to_check = [
    'index.php',
    'api-handler.php',
    '.htaccess',
    '.env',
    'test.php'
];

foreach ($files_to_check as $file) {
    if (file_exists($file)) {
        $perms = fileperms($file);
        $readable = is_readable($file) ? 'Yes' : 'No';
        $writable = is_writable($file) ? 'Yes' : 'No';
        echo "<div class='success'>✅ $file - Exists (Perms: " . substr(sprintf('%o', $perms), -4) . ", Readable: $readable, Writable: $writable)</div>";
    } else {
        echo "<div class='error'>❌ $file - Not found</div>";
    }
}

// Test 3: Directory Permissions
echo "<h2>📂 Directory Permissions Check</h2>";
$dirs_to_check = [
    'output',
    'output/public',
    'public',
    'public/images'
];

foreach ($dirs_to_check as $dir) {
    if (is_dir($dir)) {
        $perms = fileperms($dir);
        $readable = is_readable($dir) ? 'Yes' : 'No';
        $writable = is_writable($dir) ? 'Yes' : 'No';
        echo "<div class='success'>✅ $dir/ - Exists (Perms: " . substr(sprintf('%o', $perms), -4) . ", Readable: $readable, Writable: $writable)</div>";
    } else {
        echo "<div class='error'>❌ $dir/ - Not found</div>";
    }
}

// Test 4: PHP Extensions
echo "<h2>🔧 PHP Extensions</h2>";
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'mbstring'];
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<div class='success'>✅ $ext - Loaded</div>";
    } else {
        echo "<div class='error'>❌ $ext - Not loaded</div>";
    }
}

// Test 5: Database Connection
echo "<h2>🗄️ Database Connection Test</h2>";
try {
    $host = "localhost";
    $dbname = "travel";
    $username = "travel";
    $password = "support@Passord123";
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    
    echo "<div class='success'>✅ Database connection successful!</div>";
    
    // Test tables
    $tables = ['packages', 'destinations', 'users'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $count_stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $count = $count_stmt->fetch()['count'];
            echo "<div class='success'>✅ Table '$table' exists ($count records)</div>";
        } else {
            echo "<div class='warning'>⚠️ Table '$table' not found</div>";
        }
    }
    
} catch (PDOException $e) {
    echo "<div class='error'>❌ Database connection failed: " . $e->getMessage() . "</div>";
}

// Test 6: .htaccess Test
echo "<h2>🔧 .htaccess Test</h2>";
if (file_exists('.htaccess')) {
    $htaccess_content = file_get_contents('.htaccess');
    if (strpos($htaccess_content, 'RewriteEngine On') !== false) {
        echo "<div class='success'>✅ .htaccess contains RewriteEngine On</div>";
    } else {
        echo "<div class='error'>❌ .htaccess missing RewriteEngine On</div>";
    }
    
    if (strpos($htaccess_content, 'index.php') !== false) {
        echo "<div class='success'>✅ .htaccess contains index.php rewrite rule</div>";
    } else {
        echo "<div class='error'>❌ .htaccess missing index.php rewrite rule</div>";
    }
} else {
    echo "<div class='error'>❌ .htaccess file not found</div>";
}

// Test 7: Environment Variables
echo "<h2>⚙️ Environment Variables</h2>";
if (file_exists('.env')) {
    echo "<div class='success'>✅ .env file exists</div>";
    $env_content = file_get_contents('.env');
    $env_vars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    foreach ($env_vars as $var) {
        if (strpos($env_content, $var) !== false) {
            echo "<div class='success'>✅ $var configured</div>";
        } else {
            echo "<div class='error'>❌ $var missing</div>";
        }
    }
} else {
    echo "<div class='error'>❌ .env file not found</div>";
}

// Test 8: Build Files
echo "<h2>🏗️ Build Files Check</h2>";
$build_files = [
    'output/public/200.html',
    'output/public/_nuxt',
    'public/images'
];

foreach ($build_files as $file) {
    if (file_exists($file)) {
        echo "<div class='success'>✅ $file - Found</div>";
    } else {
        echo "<div class='error'>❌ $file - Missing</div>";
    }
}

// Test 9: Error Reporting
echo "<h2>🐛 Error Reporting</h2>";
echo "<div class='info'>Error Reporting: " . (ini_get('display_errors') ? 'On' : 'Off') . "</div>";
echo "<div class='info'>Log Errors: " . (ini_get('log_errors') ? 'On' : 'Off') . "</div>";
echo "<div class='info'>Error Log: " . ini_get('error_log') . "</div>";

// Test 10: Simple PHP Test
echo "<h2>🧪 Simple PHP Test</h2>";
echo "<div class='success'>✅ PHP is executing correctly</div>";
echo "<div class='info'>Current time: " . date('Y-m-d H:i:s') . "</div>";
echo "<div class='info'>Memory usage: " . memory_get_usage(true) . " bytes</div>";

echo "<h2>📋 Summary</h2>";
echo "<p>If you see any ❌ errors above, those need to be fixed for your site to work properly.</p>";
echo "<p>Common issues:</p>";
echo "<ul>";
echo "<li>File permissions should be 644 for files, 755 for directories</li>";
echo "<li>PHP extensions pdo and pdo_mysql are required</li>";
echo "<li>Database credentials must be correct</li>";
echo "<li>.htaccess file must be present and readable</li>";
echo "</ul>";
?>
