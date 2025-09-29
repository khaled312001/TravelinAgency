<?php
/**
 * Insert imported packages into database
 */

// Database connection function
function getDatabaseConnection() {
    // Load environment variables
    if (file_exists(__DIR__ . '/.env')) {
        $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                list($key, $value) = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
                putenv(trim($key) . '=' . trim($value));
            }
        }
    }
    
    // Database configuration
    $dbHost = getenv('DB_HOST') ?: 'localhost';
    $dbUser = getenv('DB_USER') ?: 'travel';
    $dbPassword = getenv('DB_PASSWORD') ?: 'support@Passord123';
    $dbName = getenv('DB_NAME') ?: 'travel';
    $dbPort = getenv('DB_PORT') ?: '3306';
    
    try {
        $conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName, $dbPort);
        
        if ($conn->connect_error) {
            error_log("Database connection failed: " . $conn->connect_error);
            return null;
        }
        
        $conn->set_charset("utf8");
        return $conn;
    } catch (Exception $e) {
        error_log("Database connection error: " . $e->getMessage());
        return null;
    }
}

// Function to create packages table if it doesn't exist
function createPackagesTable($conn) {
    $sql = "CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        duration VARCHAR(50),
        image VARCHAR(500),
        featured BOOLEAN DEFAULT FALSE,
        destination VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    if ($conn->query($sql) === TRUE) {
        echo "Packages table created or already exists\n";
    } else {
        echo "Error creating packages table: " . $conn->error . "\n";
        return false;
    }
    
    return true;
}

// Function to insert package into database
function insertPackage($conn, $package) {
    // Check if package already exists
    $stmt = $conn->prepare("SELECT id FROM packages WHERE id = ?");
    $stmt->bind_param("i", $package['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo "Package ID " . $package['id'] . " already exists, updating...\n";
        $stmt->close();
        
        // Update existing package
        $updateStmt = $conn->prepare("UPDATE packages SET title = ?, description = ?, price = ?, duration = ?, image = ?, featured = ?, destination = ?, status = ?, updated_at = ? WHERE id = ?");
        $updateStmt->bind_param("ssdssisssi", 
            $package['title'],
            $package['description'],
            $package['price'],
            $package['duration'],
            $package['image'],
            $package['featured'],
            $package['destination'],
            $package['status'],
            $package['updated_at'],
            $package['id']
        );
        
        if ($updateStmt->execute()) {
            echo "Package updated: " . $package['title'] . "\n";
            $updateStmt->close();
            return true;
        } else {
            echo "Error updating package: " . $updateStmt->error . "\n";
            $updateStmt->close();
            return false;
        }
    } else {
        $stmt->close();
        
        // Insert new package
        $insertStmt = $conn->prepare("INSERT INTO packages (id, title, description, price, duration, image, featured, destination, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $insertStmt->bind_param("issdssissss", 
            $package['id'],
            $package['title'],
            $package['description'],
            $package['price'],
            $package['duration'],
            $package['image'],
            $package['featured'],
            $package['destination'],
            $package['status'],
            $package['created_at'],
            $package['updated_at']
        );
        
        if ($insertStmt->execute()) {
            echo "Package inserted: " . $package['title'] . "\n";
            $insertStmt->close();
            return true;
        } else {
            echo "Error inserting package: " . $insertStmt->error . "\n";
            $insertStmt->close();
            return false;
        }
    }
}

// Main execution
echo "Starting database insertion process...\n\n";

// Load imported packages data
$packagesData = json_decode(file_get_contents('packages-with-local-images.json'), true);

if (!$packagesData) {
    echo "Error: Could not load packages data from packages-with-local-images.json\n";
    exit(1);
}

echo "Loaded " . count($packagesData) . " packages from packages-with-local-images.json\n\n";

// Connect to database
$conn = getDatabaseConnection();
if (!$conn) {
    echo "Error: Could not connect to database\n";
    echo "Please check your database configuration in .env file\n";
    exit(1);
}

// Create packages table
if (!createPackagesTable($conn)) {
    echo "Error: Could not create packages table\n";
    exit(1);
}

// Process each package
$successCount = 0;
$errorCount = 0;

foreach ($packagesData as $package) {
    echo "\nProcessing package: " . $package['title'] . "\n";
    
    // Update image path to include /output/public prefix
    $package['image'] = '/output/public' . $package['image'];
    
    // Insert/update package in database
    if (insertPackage($conn, $package)) {
        $successCount++;
    } else {
        $errorCount++;
    }
}

// Close database connection
$conn->close();

echo "\n=== Database Insertion Summary ===\n";
echo "Successfully processed: $successCount packages\n";
echo "Failed to process: $errorCount packages\n";
echo "Total processed: " . count($packagesData) . " packages\n";

if ($successCount > 0) {
    echo "\nPackages have been stored in the database!\n";
    echo "You can now use the database API handler to serve the packages.\n";
} else {
    echo "\nDatabase insertion failed - no packages were processed.\n";
}
?>
