# دليل إعداد لوحة تحكم الإدارة مع XAMPP

## المتطلبات

1. **XAMPP** مثبت ومشغل
2. **Node.js** (الإصدار 18 أو أحدث)
3. **npm** أو **yarn**

## إعداد XAMPP

### 1. تشغيل XAMPP
- افتح XAMPP Control Panel
- شغّل **Apache** و **MySQL**
- تأكد من أن MySQL يعمل على المنفذ 3306

### 2. الوصول إلى PHPMyAdmin
- افتح المتصفح وانتقل إلى: `http://localhost/phpmyadmin`
- أو `http://127.0.0.1/phpmyadmin`

## إعداد قاعدة البيانات

### الطريقة الأولى: استخدام ملف SQL

1. **في PHPMyAdmin**:
   - انقر على "Import" (استيراد)
   - اختر ملف `scripts/setup-database.sql`
   - انقر "Go" (تنفيذ)

### الطريقة الثانية: الإعداد اليدوي

1. **إنشاء قاعدة البيانات**:
   ```sql
   CREATE DATABASE wonderland_travel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **اختيار قاعدة البيانات**:
   - انقر على `wonderland_travel` في القائمة الجانبية

3. **إنشاء الجداول** (انسخ والصق كل جدول):

   **جدول المستخدمين**:
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     full_name VARCHAR(255),
     phone VARCHAR(20),
     email_verified BOOLEAN DEFAULT FALSE,
     status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

   **جدول ملفات المديرين**:
   ```sql
   CREATE TABLE admin_profiles (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     role ENUM('admin', 'super_admin', 'moderator') DEFAULT 'admin',
     permissions JSON,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

   **جدول سجلات النشاط**:
   ```sql
   CREATE TABLE activity_logs (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     action VARCHAR(255) NOT NULL,
     table_name VARCHAR(100),
     record_id VARCHAR(100),
     title VARCHAR(255),
     type ENUM('general', 'package', 'destination', 'message', 'user', 'booking') DEFAULT 'general',
     details JSON,
     ip_address VARCHAR(45),
     user_agent TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

   **جدول رسائل التواصل**:
   ```sql
   CREATE TABLE contact_messages (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     phone VARCHAR(20),
     message TEXT NOT NULL,
     type ENUM('general', 'package', 'destination', 'complaint', 'suggestion') DEFAULT 'general',
     is_read BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

   **جدول الباقات السياحية**:
   ```sql
   CREATE TABLE packages (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title_ar VARCHAR(255),
     title_en VARCHAR(255),
     description_ar TEXT,
     description_en TEXT,
     price DECIMAL(10,2) NOT NULL,
     duration_days INT DEFAULT 1,
     image_url VARCHAR(500),
     travel_period VARCHAR(255),
     featured BOOLEAN DEFAULT FALSE,
     active BOOLEAN DEFAULT TRUE,
     category VARCHAR(100),
     views INT DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

   **جدول الوجهات السياحية**:
   ```sql
   CREATE TABLE destinations (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name_ar VARCHAR(255),
     name_en VARCHAR(255),
     description_ar TEXT,
     description_en TEXT,
     image_url VARCHAR(500),
     active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

## إدراج البيانات التجريبية

### 1. إدراج الباقات السياحية:
```sql
INSERT INTO packages (title_ar, title_en, description_ar, description_en, price, duration_days, image_url, travel_period, featured, active, category) VALUES
('رحلة إلى دبي', 'Dubai Trip', 'رحلة سياحية مميزة إلى دبي لمدة 5 أيام', 'Amazing 5-day trip to Dubai', 2500.00, 5, '/images/packages/dubai.jpg', '5 أيام', TRUE, TRUE, 'international'),
('عمرة رمضان', 'Ramadan Umrah', 'برنامج عمرة رمضان المبارك', 'Ramadan Umrah program', 1800.00, 7, '/images/packages/umrah.jpg', '7 أيام', TRUE, TRUE, 'religious'),
('رحلة إلى تركيا', 'Turkey Trip', 'رحلة سياحية شاملة إلى تركيا', 'Comprehensive trip to Turkey', 3200.00, 8, '/images/packages/turkey.jpg', '8 أيام', FALSE, TRUE, 'international'),
('رحلة إلى ماليزيا', 'Malaysia Trip', 'رحلة سياحية إلى ماليزيا', 'Trip to Malaysia', 2800.00, 6, '/images/packages/malaysia.jpg', '6 أيام', FALSE, TRUE, 'international');
```

### 2. إدراج الوجهات السياحية:
```sql
INSERT INTO destinations (name_ar, name_en, description_ar, description_en, image_url, active) VALUES
('الرياض', 'Riyadh', 'عاصمة المملكة العربية السعودية', 'Capital of Saudi Arabia', '/images/destinations/riyadh/main.jpg', TRUE),
('جدة', 'Jeddah', 'عروس البحر الأحمر', 'Bride of the Red Sea', '/images/destinations/jeddah/main.jpg', TRUE),
('الدمام', 'Dammam', 'مدينة الخليج العربي', 'Arabian Gulf City', '/images/destinations/dammam/main.jpg', TRUE),
('دبي', 'Dubai', 'مدينة الإمارات الرائعة', 'Amazing UAE city', '/images/destinations/dubai/main.jpg', TRUE),
('إسطنبول', 'Istanbul', 'مدينة الجسور بين القارات', 'City of bridges between continents', '/images/destinations/istanbul/main.jpg', TRUE);
```

### 3. إدراج رسائل تجريبية:
```sql
INSERT INTO contact_messages (name, email, phone, message, type, is_read) VALUES
('أحمد محمد', 'ahmed@example.com', '+966501234567', 'أريد الاستفسار عن الباقات السياحية المتاحة لتركيا', 'package', FALSE),
('فاطمة علي', 'fatima@example.com', '+966507654321', 'شكراً لكم على الخدمة الممتازة', 'general', TRUE),
('محمد السعد', 'mohammed@example.com', '+966509876543', 'هل لديكم حزم للعمرة في رمضان؟', 'package', FALSE),
('نورا أحمد', 'nora@example.com', '+966501112233', 'أريد اقتراح وجهة جديدة للعائلة', 'suggestion', FALSE);
```

### 4. إنشاء حساب المدير:
```sql
INSERT INTO users (email, password_hash, full_name, phone, email_verified, status) VALUES
('admin@wonderland.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'مدير النظام', '+966501234567', TRUE, 'active');

INSERT INTO admin_profiles (user_id, role, permissions) VALUES
(1, 'super_admin', '{"manage_users": true, "manage_packages": true, "manage_destinations": true, "manage_bookings": true, "manage_messages": true, "view_analytics": true, "manage_settings": true, "manage_admins": true}');
```

## إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الجذر للمشروع:

```env
# MySQL Database Configuration for XAMPP
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=wonderland_travel

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone

# Site Configuration
PUBLIC_SITE_URL=http://localhost:3001
NODE_ENV=development
```

## تثبيت التبعيات

```bash
npm install
```

## تشغيل المشروع

```bash
npm run dev
```

## الوصول إلى لوحة التحكم

1. افتح المتصفح وانتقل إلى: `http://localhost:3001/admin/login`
2. استخدم بيانات الدخول التالية:
   - **البريد الإلكتروني**: `admin@wonderland.com`
   - **كلمة المرور**: `admin123`

## استكشاف الأخطاء

### مشاكل XAMPP

1. **MySQL لا يعمل**:
   - تأكد من تشغيل MySQL في XAMPP Control Panel
   - تحقق من المنفذ 3306

2. **لا يمكن الوصول إلى PHPMyAdmin**:
   - تأكد من تشغيل Apache
   - جرب `http://127.0.0.1/phpmyadmin`

3. **خطأ في الاتصال بقاعدة البيانات**:
   - تأكد من وجود قاعدة البيانات `wonderland_travel`
   - تحقق من إعدادات `.env`

### مشاكل التطبيق

1. **المنفذ 3000 مشغول**:
   - التطبيق سيعمل تلقائياً على المنفذ 3001
   - تأكد من تحديث الرابط في `.env`

2. **خطأ في المصادقة**:
   - تأكد من إدراج بيانات المدير في قاعدة البيانات
   - تحقق من JWT_SECRET في `.env`

## الميزات المتاحة

- **لوحة المعلومات**: إحصائيات شاملة
- **إدارة الباقات**: عرض وإدارة الباقات السياحية
- **إدارة الوجهات**: عرض وإدارة الوجهات
- **إدارة الرسائل**: عرض وإدارة رسائل العملاء
- **نظام مصادقة آمن**: JWT مع cookies آمنة

---

**ملاحظة**: هذا الدليل مخصص للتطوير مع XAMPP. للإنتاج، يرجى اتباع أفضل الممارسات الأمنية.
