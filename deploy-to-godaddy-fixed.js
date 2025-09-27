import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting GoDaddy deployment fix...');

// Ensure the output directory structure exists
const outputDir = path.join(__dirname, 'output');
const publicDir = path.join(outputDir, 'public');

if (!fs.existsSync(outputDir)) {
    console.log('❌ Output directory not found. Please run "npm run build" first.');
    process.exit(1);
}

if (!fs.existsSync(publicDir)) {
    console.log('❌ Public directory not found in output. Please run "npm run build" first.');
    process.exit(1);
}

// Check if 200.html exists
const htmlFile = path.join(publicDir, '200.html');
if (!fs.existsSync(htmlFile)) {
    console.log('❌ 200.html not found. Please run "npm run build" first.');
    process.exit(1);
}

console.log('✅ Build files found');

// Copy essential files to root for GoDaddy
const filesToCopy = [
    { src: 'index.php', dest: 'index.php' },
    { src: 'api-handler.php', dest: 'api-handler.php' },
    { src: '.htaccess', dest: '.htaccess' },
    { src: '.env', dest: '.env' }
];

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file.src);
    const destPath = path.join(__dirname, file.dest);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${file.src} to root`);
    } else {
        console.log(`⚠️  ${file.src} not found, skipping`);
    }
});

// Ensure .env file exists with correct values
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    const envContent = `# Site Configuration
PUBLIC_SITE_URL=https://travelin-agency-nlcs.vercel.app/
NODE_ENV=production

# MySQL Database Configuration (GoDaddy)
DB_HOST=localhost
DB_NAME=travel
DB_USER=travel
DB_PASSWORD=support@Passord123

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file');
}

// Create a simple test file
const testContent = `<?php
echo "PHP is working!<br>";
echo "Current time: " . date('Y-m-d H:i:s') . "<br>";
echo "PHP version: " . phpversion() . "<br>";

// Test database connection
try {
    $host = "localhost";
    $dbname = "travel";
    $username = "travel";
    $password = "support@Passord123";
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    
    echo "✅ Database connection successful!<br>";
    
    // Test if packages table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'packages'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Packages table exists<br>";
        
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM packages");
        $result = $stmt->fetch();
        echo "📦 Packages count: " . $result['count'] . "<br>";
    } else {
        echo "⚠️  Packages table not found<br>";
    }
    
} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "<br>";
}
?>`;

fs.writeFileSync(path.join(__dirname, 'test.php'), testContent);
console.log('✅ Created test.php file');

console.log('\n🎉 Deployment fix completed!');
console.log('\n📋 Next steps:');
console.log('1. Upload all files to your GoDaddy hosting');
console.log('2. Ensure file permissions: folders 755, files 644');
console.log('3. Test your site at https://travelin-agency-nlcs.vercel.app/test.php');
console.log('4. Test your main site at https://travelin-agency-nlcs.vercel.app/');
console.log('5. Test API at https://travelin-agency-nlcs.vercel.app/api/test');
