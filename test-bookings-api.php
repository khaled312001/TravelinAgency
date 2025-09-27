<?php
echo "🧪 Testing Bookings API Endpoint...\n\n";

// Test the bookings endpoint
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://worldtripagency.com/api/bookings');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_VERBOSE, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "📤 Bookings API Test Results:\n";
echo "HTTP Code: $httpCode\n";

if ($error) {
    echo "❌ cURL Error: $error\n";
} else {
    echo "📝 Response: $response\n";
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        if ($data && is_array($data)) {
            echo "✅ Bookings API working! Found " . count($data) . " bookings\n";
            if (count($data) > 0) {
                echo "📋 Sample booking: " . json_encode($data[0], JSON_PRETTY_PRINT) . "\n";
            }
        } else {
            echo "❌ Invalid JSON response\n";
        }
    } else {
        echo "❌ API returned error code: $httpCode\n";
    }
}

echo "\n🔍 Testing with localhost...\n";

// Test with localhost
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/api/bookings');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "📤 Localhost Test Results:\n";
echo "HTTP Code: $httpCode\n";

if ($error) {
    echo "❌ cURL Error: $error\n";
} else {
    echo "📝 Response: $response\n";
}

echo "\n🎉 Bookings API test complete!\n";
?>
