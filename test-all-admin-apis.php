<?php
echo "🧪 Testing All Admin API Endpoints...\n\n";

$endpoints = [
    '/api/bookings' => 'GET',
    '/api/admin/users' => 'GET',
    '/api/cms/site-settings' => 'GET',
    '/api/content' => 'GET',
    '/api/contact-messages' => 'GET',
    '/api/seo' => 'GET',
    '/api/admin/stats' => 'GET'
];

$results = [];

foreach ($endpoints as $endpoint => $method) {
    echo "🔍 Testing $method $endpoint...\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://worldtripagency.com' . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    $results[$endpoint] = [
        'http_code' => $httpCode,
        'error' => $error,
        'response' => $response
    ];
    
    if ($error) {
        echo "❌ cURL Error: $error\n";
    } else {
        echo "📊 HTTP Code: $httpCode\n";
        if ($httpCode === 200) {
            $data = json_decode($response, true);
            if ($data) {
                if (is_array($data)) {
                    echo "✅ Success! Response contains " . count($data) . " items\n";
                } else {
                    echo "✅ Success! Response: " . substr($response, 0, 100) . "...\n";
                }
            } else {
                echo "⚠️ Warning: Invalid JSON response\n";
            }
        } else {
            echo "❌ Error: " . substr($response, 0, 200) . "\n";
        }
    }
    echo "\n";
}

echo "📋 Summary:\n";
echo "===========\n";

foreach ($results as $endpoint => $result) {
    $status = $result['http_code'] === 200 ? '✅' : '❌';
    echo "$status $endpoint - HTTP $result[http_code]\n";
}

echo "\n🎉 API testing complete!\n";
?>
