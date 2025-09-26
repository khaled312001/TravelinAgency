<?php
// JSON test
header('Content-Type: application/json');
echo json_encode([
  'status' => 'success',
  'message' => 'PHP JSON is working',
  'timestamp' => date('c'),
  'php_version' => phpversion()
]);
?>