# دليل إعداد لوحة تحكم الإدارة

## المتطلبات

1. **Node.js** (الإصدار 18 أو أحدث)
2. **MySQL** (الإصدار 5.7 أو أحدث)
3. **npm** أو **yarn**

## إعداد قاعدة البيانات

### الطريقة الأولى: استخدام ملف SQL

1. **تسجيل الدخول إلى MySQL**:
   ```bash
   mysql -u root -p
   ```

2. **تشغيل ملف الإعداد**:
   ```sql
   source scripts/setup-database.sql
   ```

### الطريقة الثانية: الإعداد اليدوي

1. **إنشاء قاعدة البيانات**:
   ```sql
   CREATE DATABASE wonderland_travel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **إنشاء مستخدم قاعدة البيانات**:
   ```sql
   CREATE USER 'wonderland_user'@'localhost' IDENTIFIED BY 'wonderland_pass';
   GRANT ALL PRIVILEGES ON wonderland_travel.* TO 'wonderland_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الجذر للمشروع:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=wonderland_user
DB_PASSWORD=wonderland_pass
DB_NAME=wonderland_travel

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone

# Site Configuration
PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

## تثبيت التبعيات

```bash
npm install
```

## إعداد لوحة التحكم

### 1. إنشاء جداول قاعدة البيانات

```bash
npm run create-tables
```

### 2. إنشاء حساب المدير

```bash
npm run create-admin
```

### 3. إعداد كامل (إنشاء الجداول + حساب المدير)

```bash
npm run setup-admin
```

## تشغيل المشروع

```bash
npm run dev
```

## الوصول إلى لوحة التحكم

1. افتح المتصفح وانتقل إلى: `http://localhost:3000/admin/login`
2. استخدم بيانات الدخول التالية:
   - **البريد الإلكتروني**: `admin@wonderland.com`
   - **كلمة المرور**: `admin123`

## صفحات لوحة التحكم

- **لوحة المعلومات**: `/admin/dashboard`
- **إدارة الباقات**: `/admin/packages`
- **إدارة الوجهات**: `/admin/destinations`
- **إدارة الرسائل**: `/admin/contacts`
- **إدارة المستخدمين**: `/admin/users`
- **التقارير**: `/admin/reports`
- **الإعدادات**: `/admin/settings`

## الميزات المتاحة

### لوحة المعلومات
- إحصائيات سريعة (عدد الباقات، الوجهات، الرسائل، المستخدمين)
- الأنشطة الحديثة
- الباقات الأكثر شعبية
- روابط سريعة

### إدارة الباقات
- عرض جميع الباقات السياحية
- إضافة باقة جديدة
- تحرير الباقات الموجودة
- حذف الباقات
- تغيير حالة الباقات (نشط/غير نشط)

### إدارة الوجهات
- عرض جميع الوجهات السياحية
- إضافة وجهة جديدة
- تحرير الوجهات الموجودة
- حذف الوجهات
- تصنيف الوجهات (سعودي/عالمي)

### إدارة الرسائل
- عرض رسائل العملاء
- تصفية الرسائل حسب النوع والحالة
- تعيين الرسائل كمقروءة
- حذف الرسائل
- تصدير البيانات

## استكشاف الأخطاء

### مشاكل قاعدة البيانات

1. **خطأ الاتصال بقاعدة البيانات**:
   - تأكد من تشغيل MySQL
   - تحقق من بيانات الاتصال في ملف `.env`
   - تأكد من وجود قاعدة البيانات والمستخدم

2. **خطأ في إنشاء الجداول**:
   - تأكد من صلاحيات المستخدم
   - تحقق من وجود قاعدة البيانات

### مشاكل المصادقة

1. **لا يمكن تسجيل الدخول**:
   - تأكد من تشغيل `npm run create-admin`
   - تحقق من بيانات الدخول الافتراضية

2. **خطأ في JWT**:
   - تأكد من وجود `JWT_SECRET` في ملف `.env`
   - استخدم مفتاح سري قوي في الإنتاج

## الأمان

### للإنتاج

1. **غيّر كلمة مرور المدير الافتراضية**
2. **استخدم مفتاح JWT قوي**
3. **فعّل HTTPS**
4. **اضبط جدار الحماية**
5. **راقب سجلات النشاط**

### صلاحيات المستخدمين

- **super_admin**: جميع الصلاحيات
- **admin**: إدارة المحتوى والباقات والوجهات
- **moderator**: إدارة الرسائل والمراجعات

## الدعم

إذا واجهت أي مشاكل، تحقق من:

1. سجلات الأخطاء في وحدة التحكم
2. سجلات قاعدة البيانات
3. ملف `.env` للتأكد من صحة الإعدادات

## التحديثات

لتحديث لوحة التحكم:

1. احفظ نسخة احتياطية من قاعدة البيانات
2. حدث الكود
3. شغل `npm run create-tables` إذا كانت هناك جداول جديدة
4. اختبر جميع الوظائف

---

**ملاحظة**: هذا الدليل مخصص للتطوير. للإنتاج، يرجى اتباع أفضل الممارسات الأمنية.
