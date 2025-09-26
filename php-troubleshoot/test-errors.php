<?php
// Error reporting test
error_reporting(E_ALL);
ini_set('display_errors', 1);
echo "Error reporting enabled";
echo "<br>Display errors: " . ini_get('display_errors');
echo "<br>Log errors: " . ini_get('log_errors');
echo "<br>Error log: " . ini_get('error_log');
?>