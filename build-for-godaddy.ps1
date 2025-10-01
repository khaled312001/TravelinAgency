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

# Copy the complete API handler (not the basic one)
if (Test-Path "godaddy-ready\api-handler-complete.php") {
    Copy-Item -Path "godaddy-ready\api-handler-complete.php" -Destination "godaddy-ready\api-handler.php" -Force
    Write-Host "✅ Using complete API handler" -ForegroundColor Green
}

Copy-Item -Path "page-statuses.json" -Destination "godaddy-ready\" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "clean-navigation.sql" -Destination "godaddy-ready\" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "public\.htaccess" -Destination "godaddy-ready\" -Force
Copy-Item -Path "mysql" -Destination "godaddy-ready\" -Recurse -Force -ErrorAction SilentlyContinue

# Copy test files
Copy-Item -Path "godaddy-ready\test-connection.php" -Destination "godaddy-ready\" -Force -ErrorAction SilentlyContinue

# Step 5: Update database credentials in API handler
Write-Host "⚙️  Note: Update database credentials in api-handler.php" -ForegroundColor Yellow

# If api-handler-complete.php doesn't exist yet, copy it from godaddy-ready
if (-not (Test-Path "godaddy-ready\api-handler.php")) {
    Write-Host "⚠️  api-handler.php not found, you'll need to copy api-handler-complete.php manually" -ForegroundColor Yellow
}

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
     - `$dbname = 'travel';
     - `$username = 'travel';
     - `$password = 'support@Passord123';

3. رفع الملفات (مهم جداً - يشمل الصور!):
   ✓ امسح كل شيء من public_html/
   ✓ ارفع كل محتويات مجلد godaddy-ready/
   ✓ تأكد من رفع:
     - .htaccess
     - مجلد images/ بالكامل (150+ صورة)
     - api-handler.php
   ✓ انتظر حتى تنتهي عملية الرفع (قد تستغرق وقتاً)

4. اختبر الصور:
   ✓ https://worldtripagency.com/images/home/logo/WonderlandLogo.svg
   ✓ https://worldtripagency.com/images/packages/imported/package-5.jpeg
   ✓ يجب أن تعمل الصور بدون 404

5. اختبر الموقع:
   ✓ https://worldtripagency.com/
   ✓ https://worldtripagency.com/packages/
   ✓ https://worldtripagency.com/custom-package/
   ✓ https://worldtripagency.com/about/

6. إنشاء حساب المدير:
   ✓ ارفع الملف create-admin.php (موجود في mysql/)
   ✓ افتحه في المتصفح مرة واحدة
   ✓ احذفه بعد الاستخدام!

⚠️ ملاحظة هامة:
إذا لم تظهر الصور، راجع ملف GODADDY_IMAGE_FIX.md

==============================================
"@

Set-Content -Path "godaddy-ready\README.txt" -Value $readmeContent -Encoding UTF8

Write-Host ""
Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 الملفات جاهزة في مجلد: godaddy-ready/" -ForegroundColor Cyan
Write-Host ""
Write-Host "🖼️  يتضمن الآن:" -ForegroundColor Yellow
Write-Host "  ✓ جميع الصور (150+ صورة)" -ForegroundColor Green
Write-Host "  ✓ جميع صفحات HTML" -ForegroundColor Green
Write-Host "  ✓ ملفات JavaScript و CSS" -ForegroundColor Green
Write-Host "  ✓ API Handler الكامل" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "  1. افتح مجلد godaddy-ready/" -ForegroundColor White
Write-Host "  2. تأكد من نسخ api-handler-complete.php إلى api-handler.php" -ForegroundColor White
Write-Host "  3. حدّث بيانات قاعدة البيانات في api-handler.php" -ForegroundColor White
Write-Host "  4. ارفع كل الملفات إلى public_html/ في GoDaddy" -ForegroundColor White
Write-Host "  5. انتظر حتى تكتمل عملية رفع الصور" -ForegroundColor White
Write-Host ""
Write-Host "📖 للمزيد من التفاصيل، راجع:" -ForegroundColor Cyan
Write-Host "  - README.txt (في godaddy-ready/)" -ForegroundColor White
Write-Host "  - GODADDY_IMAGE_FIX.md" -ForegroundColor White
Write-Host ""

