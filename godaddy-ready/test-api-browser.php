<?php
// Test API endpoints - visit this directly in your browser
// https://worldtripagency.com/test-api-browser.php

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Test - World Trip Agency</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .test { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .test h3 { margin-top: 0; color: #333; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>🧪 API Endpoint Tests</h1>
    <p><strong>Testing all API endpoints without browser cache...</strong></p>

    <div class="test">
        <h3>1️⃣ Test /api/packages</h3>
        <button class="btn" onclick="testEndpoint('/api/packages', 'result1')">Test Packages API</button>
        <div id="result1"></div>
    </div>

    <div class="test">
        <h3>2️⃣ Test /api/cms/site-settings</h3>
        <button class="btn" onclick="testEndpoint('/api/cms/site-settings?public_only=true', 'result2')">Test Settings API</button>
        <div id="result2"></div>
    </div>

    <div class="test">
        <h3>3️⃣ Test /api/public/navigation</h3>
        <button class="btn" onclick="testEndpoint('/api/public/navigation', 'result3')">Test Navigation API</button>
        <div id="result3"></div>
    </div>

    <div class="test">
        <h3>4️⃣ Test POST /api/auth/login</h3>
        <button class="btn" onclick="testLogin('result4')">Test Login API</button>
        <div id="result4"></div>
    </div>

    <div class="test">
        <h3>5️⃣ Test /api/destinations</h3>
        <button class="btn" onclick="testEndpoint('/api/destinations', 'result5')">Test Destinations API</button>
        <div id="result5"></div>
    </div>

    <script>
        async function testEndpoint(endpoint, resultId) {
            const resultDiv = document.getElementById(resultId);
            resultDiv.innerHTML = '<p>⏳ Testing...</p>';
            
            try {
                // Add timestamp to bypass cache
                const url = endpoint + (endpoint.includes('?') ? '&' : '?') + '_t=' + Date.now();
                const response = await fetch(url, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `
                        <p class="success">✅ Success! Status: ${response.status}</p>
                        <pre>${JSON.stringify(data, null, 2).substring(0, 500)}...</pre>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <p class="error">❌ Error: ${response.status}</p>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <p class="error">❌ Error: ${error.message}</p>
                `;
            }
        }

        async function testLogin(resultId) {
            const resultDiv = document.getElementById(resultId);
            resultDiv.innerHTML = '<p>⏳ Testing login...</p>';
            
            try {
                const response = await fetch('/api/auth/login?_t=' + Date.now(), {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify({
                        email: 'admin@wonderland.com',
                        password: 'admin123'
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `
                        <p class="success">✅ Success! Status: ${response.status}</p>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <p class="error">❌ Error: ${response.status}</p>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <p class="error">❌ Error: ${error.message}</p>
                `;
            }
        }
    </script>

    <hr>
    <h2>🔧 If APIs work here but not on your site:</h2>
    <ol>
        <li><strong>Clear Browser Cache:</strong> Press Ctrl+Shift+Delete → Clear cache</li>
        <li><strong>Hard Refresh:</strong> Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)</li>
        <li><strong>Disable Cache in DevTools:</strong> F12 → Network tab → Check "Disable cache"</li>
        <li><strong>Clear Cloudflare Cache:</strong> If using Cloudflare, purge all cache</li>
    </ol>
</body>
</html>

