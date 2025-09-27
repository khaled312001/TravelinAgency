<?php
echo "🔍 Testing All API Endpoints...\n\n";

$baseUrl = "https://worldtripagency.com";
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
    echo "URL: $baseUrl$endpoint\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "❌ cURL Error: $error\n";
    } else {
        echo "✅ HTTP Code: $httpCode\n";
        
        if ($httpCode === 200) {
            $data = json_decode($response, true);
            if ($data) {
                if (is_array($data)) {
                    echo "📊 Response: Array with " . count($data) . " items\n";
                    if (count($data) > 0) {
                        echo "📝 Sample data: " . json_encode(array_slice($data, 0, 1), JSON_UNESCAPED_SLASHES) . "\n";
                    }
                } else {
                    echo "📝 Response: " . substr(json_encode($data, JSON_UNESCAPED_SLASHES), 0, 200) . "...\n";
                }
            } else {
                echo "📝 Response: " . substr($response, 0, 200) . "...\n";
            }
        } else {
            echo "❌ Error Response: " . substr($response, 0, 200) . "...\n";
        }
    }
    
    echo str_repeat("-", 50) . "\n\n";
}

// Test POST endpoints
echo "🔍 Testing POST Endpoints...\n\n";

// Test contact messages POST
echo "Testing POST: /api/contact-messages\n";
$contactData = [
    "name" => "Test User",
    "email" => "test@example.com", 
    "phone" => "+966501234567",
    "subject" => "Test Message",
    "message" => "This is a test message"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . "/api/contact-messages");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($contactData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "❌ cURL Error: $error\n";
} else {
    echo "✅ HTTP Code: $httpCode\n";
    echo "📝 Response: " . substr($response, 0, 200) . "...\n";
}

echo str_repeat("-", 50) . "\n\n";

// Test SEO POST
echo "Testing POST: /api/seo\n";
$seoData = [
    "site_title" => "Test Site Title",
    "site_description" => "Test site description",
    "site_keywords" => "test, keywords"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . "/api/seo");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($seoData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "❌ cURL Error: $error\n";
} else {
    echo "✅ HTTP Code: $httpCode\n";
    echo "📝 Response: " . substr($response, 0, 200) . "...\n";
}

echo str_repeat("-", 50) . "\n\n";

echo "🎉 API Endpoint Testing Complete!\n";
echo "📊 Summary:\n";
echo "- All GET endpoints should return 200 status\n";
echo "- POST endpoints should return 200 status for valid data\n";
echo "- Check the responses above for any errors\n";
?>
