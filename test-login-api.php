<?php
// Test the login API endpoint directly
// Run this on your server: php test-login-api.php

echo "🔍 Testing Login API Endpoint...\n\n";

// Test data
$loginData = [
    'email' => 'admin@wonderland.com',
    'password' => 'admin123'
];

echo "1. Testing login API endpoint...\n";
echo "   URL: https://worldtripagency.com/api/auth/login\n";
echo "   Email: {$loginData['email']}\n";
echo "   Password: {$loginData['password']}\n\n";

// Make API request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://worldtripagency.com/api/auth/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "2. API Response:\n";
echo "   HTTP Code: $httpCode\n";

if ($error) {
    echo "   cURL Error: $error\n";
} else {
    echo "   Response: $response\n";
    
    if ($response) {
        $data = json_decode($response, true);
        if ($data) {
            echo "\n3. Parsed Response:\n";
            echo "   Success: " . ($data['success'] ? 'true' : 'false') . "\n";
            
            if (isset($data['data']['user'])) {
                echo "   User ID: " . $data['data']['user']['id'] . "\n";
                echo "   User Email: " . $data['data']['user']['email'] . "\n";
                echo "   User Role: " . $data['data']['user']['role'] . "\n";
                echo "   User Name: " . $data['data']['user']['full_name'] . "\n";
                echo "✅ Login API is working correctly!\n";
            } else {
                echo "❌ User data not found in response\n";
                echo "   Available keys: " . implode(', ', array_keys($data)) . "\n";
            }
            
            if (isset($data['data']['token'])) {
                echo "   Token: " . substr($data['data']['token'], 0, 20) . "...\n";
            }
        } else {
            echo "❌ Failed to parse JSON response\n";
        }
    }
}

echo "\n4. Testing with localhost (if available)...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/api/auth/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "   Localhost HTTP Code: $httpCode\n";
if ($error) {
    echo "   Localhost Error: $error\n";
} else {
    echo "   Localhost Response: " . substr($response, 0, 200) . "...\n";
}

echo "\n🎯 Summary:\n";
if ($httpCode == 200 && $response && json_decode($response, true)['success']) {
    echo "✅ Login API is working correctly!\n";
    echo "✅ Admin user authentication is successful!\n";
    echo "✅ The frontend error might be a different issue.\n";
} else {
    echo "❌ Login API has issues.\n";
    echo "💡 Check the database and admin user setup.\n";
}
?>
