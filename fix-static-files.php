<?php
// Script to fix static file permissions and check _nuxt directory
// Run this on your GoDaddy server

echo "<h1>🔧 Fixing Static Files</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

// Check if output directory exists
if (is_dir('output')) {
    echo "<div class='success'>✅ output/ directory exists</div>";
    
    if (is_dir('output/public')) {
        echo "<div class='success'>✅ output/public/ directory exists</div>";
        
        if (is_dir('output/public/_nuxt')) {
            echo "<div class='success'>✅ output/public/_nuxt/ directory exists</div>";
            
            // List files in _nuxt directory
            $files = scandir('output/public/_nuxt');
            echo "<div class='info'>📁 Files in _nuxt directory:</div>";
            foreach ($files as $file) {
                if ($file != '.' && $file != '..') {
                    $filePath = 'output/public/_nuxt/' . $file;
                    if (is_file($filePath)) {
                        $perms = substr(sprintf('%o', fileperms($filePath)), -4);
                        echo "<div class='info'>- $file (perms: $perms)</div>";
                    }
                }
            }
        } else {
            echo "<div class='error'>❌ output/public/_nuxt/ directory missing</div>";
            echo "<div class='info'>You need to run 'npm run build' on your local machine</div>";
        }
    } else {
        echo "<div class='error'>❌ output/public/ directory missing</div>";
    }
} else {
    echo "<div class='error'>❌ output/ directory missing</div>";
    echo "<div class='info'>You need to build your Nuxt.js app and upload the output directory</div>";
}

// Check if we can access a test file
if (file_exists('output/public/_nuxt/entry.Cjk20dY-.css')) {
    echo "<div class='success'>✅ Can access entry.Cjk20dY-.css</div>";
} else {
    echo "<div class='error'>❌ Cannot access entry.Cjk20dY-.css</div>";
}

// Check permissions
echo "<h3>🔧 Current Permissions</h3>";
if (is_dir('output')) {
    $perms = substr(sprintf('%o', fileperms('output')), -4);
    echo "<div class='info'>output/ directory: $perms</div>";
}

if (is_dir('output/public')) {
    $perms = substr(sprintf('%o', fileperms('output/public')), -4);
    echo "<div class='info'>output/public/ directory: $perms</div>";
}

if (is_dir('output/public/_nuxt')) {
    $perms = substr(sprintf('%o', fileperms('output/public/_nuxt')), -4);
    echo "<div class='info'>output/public/_nuxt/ directory: $perms</div>";
}

echo "<h3>📋 Next Steps</h3>";
echo "<div class='info'>1. If _nuxt directory is missing, run 'npm run build' locally</div>";
echo "<div class='info'>2. Upload the output directory to your server</div>";
echo "<div class='info'>3. Set proper permissions: chmod -R 755 output/public/_nuxt/</div>";
echo "<div class='info'>4. Replace .htaccess with the fixed version</div>";
?>
