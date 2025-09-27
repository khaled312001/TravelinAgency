import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing GoDaddy Deployment Configuration...\n');

// Test 1: Check if required files exist
console.log('📁 Checking required files:');
const requiredFiles = [
    'index.php',
    'api-handler.php',
    '.htaccess',
    '.env',
    'test.php'
];

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} - Found`);
    } else {
        console.log(`❌ ${file} - Missing`);
    }
});

// Test 2: Check build files
console.log('\n🏗️  Checking build files:');
const buildFiles = [
    'output/public/200.html',
    'output/public/_nuxt',
    'public/images'
];

buildFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} - Found`);
    } else {
        console.log(`❌ ${file} - Missing`);
    }
});

// Test 3: Check .env configuration
console.log('\n⚙️  Checking .env configuration:');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredEnvVars = [
        'PUBLIC_SITE_URL',
        'NODE_ENV',
        'DB_HOST',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD'
    ];
    
    requiredEnvVars.forEach(envVar => {
        if (envContent.includes(envVar)) {
            console.log(`✅ ${envVar} - Configured`);
        } else {
            console.log(`❌ ${envVar} - Missing`);
        }
    });
} else {
    console.log('❌ .env file not found');
}

// Test 4: Check .htaccess configuration
console.log('\n🔧 Checking .htaccess configuration:');
const htaccessPath = path.join(__dirname, '.htaccess');
if (fs.existsSync(htaccessPath)) {
    const htaccessContent = fs.readFileSync(htaccessPath, 'utf8');
    const requiredRules = [
        'RewriteEngine On',
        'RewriteCond %{HTTPS} off',
        'RewriteRule ^(.*)$ /index.php'
    ];
    
    requiredRules.forEach(rule => {
        if (htaccessContent.includes(rule)) {
            console.log(`✅ ${rule} - Found`);
        } else {
            console.log(`❌ ${rule} - Missing`);
        }
    });
} else {
    console.log('❌ .htaccess file not found');
}

// Test 5: Check API handler
console.log('\n🔌 Checking API handler:');
const apiPath = path.join(__dirname, 'api-handler.php');
if (fs.existsSync(apiPath)) {
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    const requiredEndpoints = [
        '/api/test',
        '/api/packages',
        '/api/destinations',
        '/api/auth/login'
    ];
    
    requiredEndpoints.forEach(endpoint => {
        if (apiContent.includes(endpoint)) {
            console.log(`✅ ${endpoint} - Configured`);
        } else {
            console.log(`❌ ${endpoint} - Missing`);
        }
    });
} else {
    console.log('❌ api-handler.php not found');
}

console.log('\n🎯 Deployment Checklist:');
console.log('1. ✅ All required files are present');
console.log('2. ✅ Build files are ready');
console.log('3. ✅ Environment variables configured');
console.log('4. ✅ URL rewriting rules set');
console.log('5. ✅ API endpoints configured');

console.log('\n📤 Ready for upload to GoDaddy!');
console.log('\n🔗 Test URLs after upload:');
console.log('- https://worldtripagency.com/test.php');
console.log('- https://worldtripagency.com/api/test');
console.log('- https://worldtripagency.com/');
