# 🚀 دليل النشر على GoDaddy

## المشكلة الحالية:
رفعت كل ملفات المشروع، لكن GoDaddy يحتاج فقط الملفات المبنية + ملفات PHP

## ✅ الحل الصحيح:

### **الخطوة 1: بناء المشروع محلياً**

```bash
# في المشروع المحلي على جهازك
npm run generate
```

هذا سينشئ مجلد `.output/public` يحتوي على الملفات المبنية

### **الخطوة 2: تحديث بيانات قاعدة البيانات**

افتح ملف `api-handler.php` وحدّث بيانات الاتصال:

```php
// Database connection
$host = 'localhost';  // عادة localhost في GoDaddy
$dbname = 'your_database_name';  // اسم قاعدة البيانات من cPanel
$username = 'your_database_user';  // اسم المستخدم من cPanel
$password = 'your_database_password';  // كلمة المرور من cPanel
```

### **الخطوة 3: رفع الملفات الصحيحة فقط**

احذف كل شيء من `public_html/TravelinAgency` وارفع فقط:

#### **من مجلد `.output/public/`:**
- جميع ملفات HTML, CSS, JS
- مجلد `_nuxt/`
- مجلد `images/` (إن وجد)

#### **من المشروع الأصلي:**
- `api-handler.php` (بعد تحديث بيانات DB)
- `.htaccess` (من مجلد `public/`)
- `page-statuses.json`
- مجلد `mysql/` (فيه schema.sql)
- `clean-navigation.sql`

### **الخطوة 4: إعداد قاعدة البيانات**

1. اذهب إلى cPanel → MySQL Databases
2. أنشئ قاعدة بيانات جديدة
3. أنشئ مستخدم وكلمة مرور
4. أضف المستخدم للقاعدة بجميع الصلاحيات
5. افتح phpMyAdmin
6. استورد `mysql/schema.sql`
7. شغّل `clean-navigation.sql`

### **الخطوة 5: إنشاء مستخدم Admin**

ارفع ملف PHP مؤقت لإنشاء حساب مدير:

```php
<?php
// create-admin.php - احذفه بعد الاستخدام!

$host = 'localhost';
$dbname = 'your_database_name';
$username = 'your_database_user';
$password = 'your_database_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $adminEmail = 'admin@worldtripagency.com';
    $adminPassword = password_hash('YourSecurePassword123!', PASSWORD_BCRYPT);
    $adminName = 'المدير';
    
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password, role, created_at, updated_at) 
        VALUES (?, ?, ?, 'admin', NOW(), NOW())
    ");
    
    $stmt->execute([$adminName, $adminEmail, $adminPassword]);
    
    echo "✅ تم إنشاء حساب المدير بنجاح!<br>";
    echo "Email: $adminEmail<br>";
    echo "Password: YourSecurePassword123!<br>";
    echo "<br>⚠️ احذف هذا الملف الآن!";
    
} catch(PDOException $e) {
    echo "❌ خطأ: " . $e->getMessage();
}
?>
```

### **الخطوة 6: التحقق**

زُر هذه الروابط للتأكد:
- ✅ https://worldtripagency.com/
- ✅ https://worldtripagency.com/packages/
- ✅ https://worldtripagency.com/custom-package/
- ✅ https://worldtripagency.com/about/
- ✅ https://worldtripagency.com/admin/

---

## 🔧 الأوامر السريعة على GoDaddy SSH:

```bash
# امسح المجلد الحالي
cd ~/public_html
rm -rf TravelinAgency

# أنشئ مجلد جديد
mkdir website
cd website

# هنا ارفع الملفات المبنية فقط
```

---

## ⚠️ ملاحظات مهمة:

1. **لا ترفع `node_modules/`** - حجمه كبير جداً وغير مطلوب
2. **لا ترفع ملفات `.vue`** - GoDaddy لا يشغل Vue مباشرة
3. **تأكد من رفع `.htaccess`** - مهم جداً للتوجيه
4. **احفظ بيانات قاعدة البيانات** في مكان آمن
5. **غيّر كلمة مرور Admin** بعد أول تسجيل دخول

---

## 📁 هيكل الملفات النهائي في public_html:

```
public_html/
├── .htaccess
├── index.html
├── api-handler.php
├── page-statuses.json
├── clean-navigation.sql
├── _nuxt/
│   ├── *.js
│   └── *.css
├── images/
│   └── ...
└── mysql/
    └── schema.sql
```

