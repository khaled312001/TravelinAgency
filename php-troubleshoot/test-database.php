<?php
// Database connection test
header('Content-Type: application/json');

try {
  // Try to connect to database
  $host = 'localhost';
  $dbname = 'u123456789_worldtrip';
  $username = 'u123456789_admin';
  $password = 'Admin123!';
  
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  echo json_encode([
    'status' => 'success',
    'message' => 'Database connection successful',
    'database' => $dbname
  ]);
} catch (Exception $e) {
  echo json_encode([
    'status' => 'error',
    'message' => 'Database connection failed',
    'error' => $e->getMessage()
  ]);
}
?>