<?php
// Check database table structure
echo "<h1>🗄️ Database Table Structure Check</h1>";
echo "<style>body{font-family:Arial,sans-serif;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} .warning{color:orange;}</style>";

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel', 'travel', 'support@Passord123');
    
    // Get all tables
    echo "<h3>📋 All Tables in Database</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li><strong>$table</strong></li>";
    }
    echo "</ul>";
    
    // Check structure of each table
    foreach ($tables as $table) {
        echo "<h4>🔍 Table: $table</h4>";
        $stmt = $pdo->query("DESCRIBE `$table`");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<table border='1' style='border-collapse:collapse;width:100%;'>";
        echo "<tr style='background:#f0f0f0;'><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        
        foreach ($columns as $column) {
            echo "<tr>";
            echo "<td>{$column['Field']}</td>";
            echo "<td>{$column['Type']}</td>";
            echo "<td>{$column['Null']}</td>";
            echo "<td>{$column['Key']}</td>";
            echo "<td>{$column['Default']}</td>";
            echo "<td>{$column['Extra']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Check for image-related columns
        $imageColumns = [];
        foreach ($columns as $column) {
            if (stripos($column['Field'], 'image') !== false || 
                stripos($column['Field'], 'photo') !== false || 
                stripos($column['Field'], 'picture') !== false ||
                stripos($column['Field'], 'url') !== false) {
                $imageColumns[] = $column['Field'];
            }
        }
        
        if (count($imageColumns) > 0) {
            echo "<div class='info'>🖼️ Image-related columns: " . implode(', ', $imageColumns) . "</div>";
        }
        
        echo "<br>";
    }
    
    // Sample data from each table
    echo "<h3>📊 Sample Data from Each Table</h3>";
    foreach ($tables as $table) {
        echo "<h4>📋 Sample from: $table</h4>";
        $stmt = $pdo->query("SELECT * FROM `$table` LIMIT 3");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($rows) > 0) {
            echo "<table border='1' style='border-collapse:collapse;width:100%;'>";
            // Header row
            echo "<tr style='background:#f0f0f0;'>";
            foreach (array_keys($rows[0]) as $header) {
                echo "<th>$header</th>";
            }
            echo "</tr>";
            
            // Data rows
            foreach ($rows as $row) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>" . htmlspecialchars($value ?? 'NULL') . "</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<div class='warning'>⚠️ No data found in table: $table</div>";
        }
        echo "<br>";
    }
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Database error: " . $e->getMessage() . "</div>";
}
?>
