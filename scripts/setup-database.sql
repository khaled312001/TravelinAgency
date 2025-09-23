-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS wonderland_travel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- إنشاء مستخدم قاعدة البيانات (اختياري لـ XAMPP)
-- CREATE USER IF NOT EXISTS 'wonderland_user'@'localhost' IDENTIFIED BY 'wonderland_pass';
-- GRANT ALL PRIVILEGES ON wonderland_travel.* TO 'wonderland_user'@'localhost';
-- FLUSH PRIVILEGES;

-- استخدام قاعدة البيانات
USE wonderland_travel;

-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
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

-- إنشاء جدول ملفات المديرين
CREATE TABLE IF NOT EXISTS admin_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role ENUM('admin', 'super_admin', 'moderator') DEFAULT 'admin',
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إنشاء جدول سجلات النشاط
CREATE TABLE IF NOT EXISTS activity_logs (
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

-- إنشاء جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS contact_messages (
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

-- إنشاء جدول الباقات السياحية
CREATE TABLE IF NOT EXISTS packages (
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

-- إنشاء جدول الوجهات السياحية
CREATE TABLE IF NOT EXISTS destinations (
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

-- إدراج بيانات تجريبية للحزم
INSERT INTO packages (title_ar, title_en, description_ar, description_en, price, duration_days, image_url, travel_period, featured, active, category) VALUES
('رحلة إلى دبي', 'Dubai Trip', 'رحلة سياحية مميزة إلى دبي لمدة 5 أيام', 'Amazing 5-day trip to Dubai', 2500.00, 5, '/images/packages/dubai.jpg', '5 أيام', TRUE, TRUE, 'international'),
('عمرة رمضان', 'Ramadan Umrah', 'برنامج عمرة رمضان المبارك', 'Ramadan Umrah program', 1800.00, 7, '/images/packages/umrah.jpg', '7 أيام', TRUE, TRUE, 'religious'),
('رحلة إلى تركيا', 'Turkey Trip', 'رحلة سياحية شاملة إلى تركيا', 'Comprehensive trip to Turkey', 3200.00, 8, '/images/packages/turkey.jpg', '8 أيام', FALSE, TRUE, 'international'),
('رحلة إلى ماليزيا', 'Malaysia Trip', 'رحلة سياحية إلى ماليزيا', 'Trip to Malaysia', 2800.00, 6, '/images/packages/malaysia.jpg', '6 أيام', FALSE, TRUE, 'international');

-- إدراج بيانات تجريبية للوجهات
INSERT INTO destinations (name_ar, name_en, description_ar, description_en, image_url, active) VALUES
('الرياض', 'Riyadh', 'عاصمة المملكة العربية السعودية', 'Capital of Saudi Arabia', '/images/destinations/riyadh/main.jpg', TRUE),
('جدة', 'Jeddah', 'عروس البحر الأحمر', 'Bride of the Red Sea', '/images/destinations/jeddah/main.jpg', TRUE),
('الدمام', 'Dammam', 'مدينة الخليج العربي', 'Arabian Gulf City', '/images/destinations/dammam/main.jpg', TRUE),
('دبي', 'Dubai', 'مدينة الإمارات الرائعة', 'Amazing UAE city', '/images/destinations/dubai/main.jpg', TRUE),
('إسطنبول', 'Istanbul', 'مدينة الجسور بين القارات', 'City of bridges between continents', '/images/destinations/istanbul/main.jpg', TRUE);

-- إدراج بيانات تجريبية للرسائل
INSERT INTO contact_messages (name, email, phone, message, type, is_read) VALUES
('أحمد محمد', 'ahmed@example.com', '+966501234567', 'أريد الاستفسار عن الباقات السياحية المتاحة لتركيا', 'package', FALSE),
('فاطمة علي', 'fatima@example.com', '+966507654321', 'شكراً لكم على الخدمة الممتازة', 'general', TRUE),
('محمد السعد', 'mohammed@example.com', '+966509876543', 'هل لديكم حزم للعمرة في رمضان؟', 'package', FALSE),
('نورا أحمد', 'nora@example.com', '+966501112233', 'أريد اقتراح وجهة جديدة للعائلة', 'suggestion', FALSE);

-- إنشاء حساب المدير الافتراضي
INSERT INTO users (email, password_hash, full_name, phone, email_verified, status) VALUES
('admin@wonderland.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'مدير النظام', '+966501234567', TRUE, 'active');

-- إنشاء ملف المدير
INSERT INTO admin_profiles (user_id, role, permissions) VALUES
(1, 'super_admin', '{"manage_users": true, "manage_packages": true, "manage_destinations": true, "manage_bookings": true, "manage_messages": true, "view_analytics": true, "manage_settings": true, "manage_admins": true}');
