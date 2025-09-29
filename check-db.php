<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=wonderland_travel', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if table exists
    $stmt = $pdo->query('SHOW TABLES LIKE "cms_site_settings"');
    if ($stmt->rowCount() > 0) {
        echo "Table cms_site_settings exists\n";
        
        // Check current site_logo setting
        $stmt = $pdo->query('SELECT setting_key, setting_value FROM cms_site_settings WHERE setting_key = "site_logo"');
        $result = $stmt->fetchAll();
        if (count($result) > 0) {
            echo "Current site_logo: " . $result[0]['setting_value'] . "\n";
        } else {
            echo "No site_logo setting found\n";
        }
        
        // Show all settings
        $stmt = $pdo->query('SELECT setting_key, setting_value FROM cms_site_settings ORDER BY setting_key');
        $allSettings = $stmt->fetchAll();
        echo "\nAll settings:\n";
        foreach ($allSettings as $setting) {
            echo "- " . $setting['setting_key'] . ": " . $setting['setting_value'] . "\n";
        }
    } else {
        echo "Table cms_site_settings does not exist\n";
        
        // Check if site_settings exists
        $stmt = $pdo->query('SHOW TABLES LIKE "site_settings"');
        if ($stmt->rowCount() > 0) {
            echo "But site_settings table exists\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
