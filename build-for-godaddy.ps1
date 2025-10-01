# PowerShell Script to build Nuxt for GoDaddy

Write-Host "🚀 Starting GoDaddy Deployment Build..." -ForegroundColor Green
Write-Host ""

# Step 1: Build the project
Write-Host "🔨 Building Nuxt project..." -ForegroundColor Yellow
npm run generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Create deployment folder
Write-Host "📁 Creating deployment folder..." -ForegroundColor Yellow
if (Test-Path "godaddy-ready") {
    Remove-Item -Path "godaddy-ready" -Recurse -Force
}
New-Item -Path "godaddy-ready" -ItemType Directory | Out-Null

# Step 3: Copy built files
Write-Host "📋 Copying built files..." -ForegroundColor Yellow
Copy-Item -Path ".output\public\*" -Destination "godaddy-ready\" -Recurse -Force

# Step 4: Copy server files
Write-Host "📋 Copying server files..." -ForegroundColor Yellow
Copy-Item -Path "api-handler.php" -Destination "godaddy-ready\" -Force
Copy-Item -Path "page-statuses.json" -Destination "godaddy-ready\" -Force
Copy-Item -Path "clean-navigation.sql" -Destination "godaddy-ready\" -Force
Copy-Item -Path "public\.htaccess" -Destination "godaddy-ready\" -Force
Copy-Item -Path "mysql" -Destination "godaddy-ready\" -Recurse -Force

# Step 5: Update api-handler.php with production config
Write-Host "⚙️  Updating database config..." -ForegroundColor Yellow

$apiHandlerContent = @"
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if (`$_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ⚠️ تحديث بيانات قاعدة البيانات من cPanel
`$host = 'localhost';
`$dbname = 'YOUR_DATABASE_NAME';  // ⚠️ حدّث هذا
`$username = 'YOUR_DATABASE_USER';  // ⚠️ حدّث هذا
`$password = 'YOUR_DATABASE_PASSWORD';  // ⚠️ حدّث هذا

try {
    `$pdo = new PDO("mysql:host=`$host;dbname=`$dbname;charset=utf8mb4", `$username, `$password);
    `$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    `$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException `$e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// Get request path
`$path = isset(`$_GET['path']) ? `$_GET['path'] : (isset(`$_SERVER['PATH_INFO']) ? trim(`$_SERVER['PATH_INFO'], '/') : '');
`$method = `$_SERVER['REQUEST_METHOD'];

// Read JSON input for POST/PUT
`$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Router
if (strpos(`$path, 'packages') === 0) {
    if (`$method === 'GET' && !strpos(`$path, '/')) {
        // GET /api/packages
        `$stmt = `$pdo->query("SELECT * FROM packages WHERE status = 'published' ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'data' => `$stmt->fetchAll()]);
    }
} elseif (strpos(`$path, 'public/navigation') === 0) {
    // Navigation API
    `$stmt = `$pdo->query("SELECT * FROM cms_navigation WHERE menu_name = 'main' AND is_active = 1 ORDER BY order_index");
    `$navItems = `$stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => ['menus' => ['main' => `$navItems]]]);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Endpoint not found']);
}
?>
"@

Set-Content -Path "godaddy-ready\api-handler.php" -Value $apiHandlerContent -Encoding UTF8

# Step 6: Create README
Write-Host "📝 Creating instructions..." -ForegroundColor Yellow

$readmeContent = @"
==============================================
تعليمات النشر على GoDaddy
==============================================

📦 الملفات جاهزة للرفع!

🔧 خطوات النشر:

1. إعداد قاعدة البيانات في cPanel:
   ✓ MySQL Databases → أنشئ قاعدة بيانات
   ✓ أنشئ مستخدم وكلمة مرور
   ✓ أعط المستخدم جميع الصلاحيات
   ✓ phpMyAdmin → استورد mysql/schema.sql
   ✓ شغّل clean-navigation.sql

2. تحديث بيانات قاعدة البيانات:
   ✓ افتح api-handler.php
   ✓ حدّث:
     - YOUR_DATABASE_NAME
     - YOUR_DATABASE_USER
     - YOUR_DATABASE_PASSWORD

3. رفع الملفات:
   ✓ امسح كل شيء من public_html/
   ✓ ارفع كل محتويات مجلد godaddy-ready/
   ✓ تأكد من رفع .htaccess

4. اختبر الموقع:
   ✓ https://worldtripagency.com/
   ✓ https://worldtripagency.com/packages/
   ✓ https://worldtripagency.com/custom-package/
   ✓ https://worldtripagency.com/about/

5. إنشاء حساب المدير:
   ✓ ارفع الملف create-admin.php (موجود في mysql/)
   ✓ افتحه في المتصفح مرة واحدة
   ✓ احذفه بعد الاستخدام!

==============================================
"@

Set-Content -Path "godaddy-ready\README.txt" -Value $readmeContent -Encoding UTF8

Write-Host ""
Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 الملفات جاهزة في مجلد: godaddy-ready/" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "  1. افتح مجلد godaddy-ready/" -ForegroundColor White
Write-Host "  2. افتح api-handler.php وحدّث بيانات قاعدة البيانات" -ForegroundColor White
Write-Host "  3. ارفع كل الملفات إلى public_html/ في GoDaddy" -ForegroundColor White
Write-Host "  4. اتبع التعليمات في README.txt" -ForegroundColor White
Write-Host ""

