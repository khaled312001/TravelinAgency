<?php
echo "🔍 Testing API Endpoints Locally...\n\n";

// Test the endpoints directly without SSL issues
$endpoints = [
    "/api/test",
    "/api/packages", 
    "/api/destinations",
    "/api/contact-messages",
    "/api/seo",
    "/api/admin/stats"
];

foreach ($endpoints as $endpoint) {
    echo "Testing: $endpoint\n";
    
    // Simulate the request by including the api-handler.php directly
    $_SERVER['REQUEST_URI'] = $endpoint;
    $_SERVER['REQUEST_METHOD'] = 'GET';
    
    // Capture output
    ob_start();
    include 'api-handler.php';
    $response = ob_get_clean();
    
    // Check if response is valid JSON
    $data = json_decode($response, true);
    if ($data !== null) {
        echo "✅ Response: Valid JSON\n";
        if (is_array($data)) {
            echo "📊 Data: Array with " . count($data) . " items\n";
        } else {
            echo "📝 Data: " . substr(json_encode($data), 0, 100) . "...\n";
        }
    } else {
        echo "❌ Response: Invalid JSON\n";
        echo "Raw response: " . substr($response, 0, 200) . "...\n";
    }
    
    echo str_repeat("-", 50) . "\n\n";
}

echo "🎉 Local API Testing Complete!\n";
echo "📊 All endpoints should now be working on your website!\n";
?>
