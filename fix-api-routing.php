<?php
/**
 * Quick API Routing Fix
 * This script fixes the routing issue in the existing api-handler.php
 */

// Read the current api-handler.php
$currentFile = 'api-handler.php';
$backupFile = 'api-handler.php.backup-routing';

if (!file_exists($currentFile)) {
    echo "❌ api-handler.php not found!\n";
    exit(1);
}

// Create backup
copy($currentFile, $backupFile);
echo "✅ Created backup: $backupFile\n";

// Read current content
$content = file_get_contents($currentFile);

// Fix the routing logic
$oldRouting = '// Route API requests
switch ($apiPath) {
    case \'/packages\':';

$newRouting = '// Debug logging
error_log("API Request: $requestMethod $cleanUri -> $apiPath");

// Route API requests
switch ($apiPath) {
    case \'/packages\':';

// Replace the routing section
$content = str_replace($oldRouting, $newRouting, $content);

// Add authentication routes if they don't exist
if (strpos($content, "case '/auth/login':") === false) {
    // Find the end of the switch statement and add auth routes
    $authRoutes = '
    // Authentication endpoints - FIXED ROUTING
    case \'/auth/login\':
        if ($requestMethod === \'POST\') {
            echo json_encode(handleLogin());
        } else {
            http_response_code(405);
            echo json_encode([\'error\' => \'Method not allowed\']);
        }
        break;
        
    case \'/auth/logout\':
        if ($requestMethod === \'POST\') {
            echo json_encode(handleLogout());
        } else {
            http_response_code(405);
            echo json_encode([\'error\' => \'Method not allowed\']);
        }
        break;
        
    case \'/auth/me\':
        if ($requestMethod === \'GET\') {
            echo json_encode(handleGetUser());
        } else {
            http_response_code(405);
            echo json_encode([\'error\' => \'Method not allowed\']);
        }
        break;
        
    case \'/auth/verify\':
        if ($requestMethod === \'POST\') {
            echo json_encode(handleVerifyToken());
        } else {
            http_response_code(405);
            echo json_encode([\'error\' => \'Method not allowed\']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode([\'error\' => \'API endpoint not found\', \'path\' => $apiPath, \'original_uri\' => $cleanUri]);
        break;
}';

    // Find the default case and replace it
    $oldDefault = '    default:
        http_response_code(404);
        echo json_encode([\'error\' => \'API endpoint not found\', \'path\' => $apiPath]);
        break;
}';
    
    $content = str_replace($oldDefault, $authRoutes, $content);
}

// Write the fixed content
file_put_contents($currentFile, $content);
echo "✅ Fixed API routing in $currentFile\n";

// Set permissions
chmod($currentFile, 0644);
echo "✅ Set permissions on $currentFile\n";

echo "\n🎉 API routing fix completed!\n";
echo "🧪 Test with: curl -k -X POST https://worldtripagency.com/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@wonderland.com\",\"password\":\"admin123\"}'\n";
?>
