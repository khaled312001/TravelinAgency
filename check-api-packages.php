<?php
// Check API packages
$url = 'http://localhost:3000/api/packages';
$response = file_get_contents($url);
$data = json_decode($response, true);

echo "API Response:\n";
echo "Success: " . ($data['success'] ? 'true' : 'false') . "\n";
echo "Message: " . $data['message'] . "\n";
echo "Total packages: " . count($data['data']) . "\n\n";

echo "First 5 packages:\n";
for ($i = 0; $i < min(5, count($data['data'])); $i++) {
    $package = $data['data'][$i];
    echo "ID: {$package['id']} | Title: {$package['title']} | Image: {$package['image']}\n";
}

echo "\nLast 5 packages:\n";
$start = max(0, count($data['data']) - 5);
for ($i = $start; $i < count($data['data']); $i++) {
    $package = $data['data'][$i];
    echo "ID: {$package['id']} | Title: {$package['title']} | Image: {$package['image']}\n";
}
?>
