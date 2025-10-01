-- Wonder Land Traveling Agency - MySQL Database Schema
-- Created: 2025

-- Create database
CREATE DATABASE IF NOT EXISTS wonderland_travel 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE wonderland_travel;

-- Create users table (replaces auth.users from Supabase)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admin_profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role ENUM('admin', 'super_admin', 'moderator') DEFAULT 'admin',
    permissions JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_profiles_user_id (user_id),
    INDEX idx_admin_profiles_role (role)
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    settings JSON NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id VARCHAR(36),
    title VARCHAR(255),
    type VARCHAR(50) DEFAULT 'general',
    details JSON DEFAULT '{}',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_logs_user_id (user_id),
    INDEX idx_activity_logs_created_at (created_at),
    INDEX idx_activity_logs_action (action)
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration_days INTEGER DEFAULT 1, -- in days
    travel_period VARCHAR(255),
    max_persons INTEGER DEFAULT 10,
    category ENUM('domestic', 'international', 'religious', 'adventure', 'cultural') DEFAULT 'domestic',
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    features JSON DEFAULT '[]', -- array of features
    itinerary JSON DEFAULT '[]', -- trip itinerary
    included JSON DEFAULT '[]', -- what's included in price
    excluded JSON DEFAULT '[]', -- what's not included
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_packages_active (active),
    INDEX idx_packages_category (category),
    INDEX idx_packages_created_at (created_at),
    INDEX idx_packages_featured (featured)
);

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    region VARCHAR(100),
    type ENUM('city', 'landmark', 'nature', 'beach', 'mountain') DEFAULT 'city',
    status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
    image TEXT,
    images JSON DEFAULT '[]',
    coordinates JSON, -- {lat, lng}
    climate_info JSON DEFAULT '{}',
    best_time_to_visit VARCHAR(100),
    attractions JSON DEFAULT '[]',
    activities JSON DEFAULT '[]',
    local_cuisine JSON DEFAULT '[]',
    transportation_info TEXT,
    accommodation_info TEXT,
    cultural_notes TEXT,
    safety_info TEXT,
    budget_info JSON DEFAULT '{}', -- {budget_range, currency}
    language VARCHAR(100),
    currency VARCHAR(10),
    timezone VARCHAR(50),
    visa_requirements TEXT,
    health_requirements TEXT,
    packing_suggestions JSON DEFAULT '[]',
    views INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_destinations_status (status),
    INDEX idx_destinations_type (type),
    INDEX idx_destinations_country (country),
    INDEX idx_destinations_is_featured (is_featured)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('general', 'booking', 'complaint', 'suggestion', 'support') DEFAULT 'general',
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    source VARCHAR(50) DEFAULT 'website', -- message source
    related_package_id VARCHAR(36),
    related_destination_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_contact_messages_status (status),
    INDEX idx_contact_messages_type (type),
    INDEX idx_contact_messages_created_at (created_at)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    package_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_details JSON DEFAULT '{}', -- additional customer info
    guests_count INTEGER NOT NULL DEFAULT 1,
    guests_details JSON DEFAULT '[]', -- travelers details
    departure_date DATE NOT NULL,
    return_date DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'SAR',
    payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
    booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    special_requests TEXT,
    notes TEXT,
    cancellation_reason TEXT,
    cancellation_date TIMESTAMP NULL,
    confirmed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bookings_status (booking_status),
    INDEX idx_bookings_payment_status (payment_status),
    INDEX idx_bookings_package_id (package_id),
    INDEX idx_bookings_departure_date (departure_date)
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(50),
    date_of_birth DATE,
    gender ENUM('male', 'female'),
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    emergency_contact JSON DEFAULT '{}',
    preferences JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_profiles_user_id (user_id)
);

-- Note: Stored procedures and triggers removed for compatibility
-- They can be added later if needed

-- Insert default admin settings
INSERT INTO admin_settings (settings) VALUES (
    JSON_OBJECT(
        'siteName', 'Wonder Land Traveling Agency',
        'siteDescription', 'وكالة سفر موثوقة لتجارب لا تُنسى',
        'siteKeywords', 'سفر، سياحة، رحلات، عمرة، حج',
        'contactEmail', 'info@wonderland.com',
        'contactPhone', '+966501234567',
        'whatsappNumber', '+966501234567',
        'address', 'الرياض، المملكة العربية السعودية',
        'twoFactorEnabled', false,
        'activityLogging', true,
        'securityNotifications', true,
        'emailNotifications', JSON_OBJECT(
            'newMessages', true,
            'newBookings', true,
            'dailyReports', false
        ),
        'whatsappNotifications', JSON_OBJECT(
            'enabled', false,
            'adminNumber', '+966501234567'
        ),
        'autoBackup', JSON_OBJECT(
            'enabled', false,
            'frequency', 'daily'
        )
    )
);

-- Create admin user with default credentials
-- Password: admin123 (hashed with bcrypt)
INSERT IGNORE INTO users (full_name, email, password, email_verified_at) VALUES (
    'System Administrator',
    'admin@wonderland.com',
    '$2b$12$MBczo9oAOYkNyxvn4Th.BubTtKJ..xOBkpAK5HBpRJWbRmL53McAm', -- admin123 hashed
    NOW()
);

-- Create admin profile (using a subquery to get user ID)
INSERT IGNORE INTO admin_profiles (user_id, role, permissions) 
SELECT id, 'super_admin', JSON_OBJECT(
    'manage_users', true,
    'manage_packages', true,
    'manage_destinations', true,
    'manage_bookings', true,
    'manage_messages', true,
    'view_analytics', true,
    'manage_settings', true,
    'manage_admins', true
) FROM users WHERE email = 'admin@wonderland.com';

-- Create some sample data for testing
-- Sample destinations
INSERT IGNORE INTO destinations (name, description, country, city, type, status, image, is_featured) VALUES
('الرياض', 'عاصمة المملكة العربية السعودية الحديثة', 'السعودية', 'الرياض', 'city', 'active', '/images/destinations/riyadh.jpg', TRUE),
('جدة', 'عروس البحر الأحمر وبوابة الحرمين الشريفين', 'السعودية', 'جدة', 'city', 'active', '/images/destinations/jeddah.jpg', TRUE),
('العلا', 'متحف طبيعي مفتوح يحتضن آثار الحضارات القديمة', 'السعودية', 'العلا', 'landmark', 'active', '/images/destinations/alula.jpg', TRUE);

-- Sample packages
INSERT IGNORE INTO packages (title_ar, title_en, description_ar, description_en, price, duration_days, travel_period, category, active, featured) VALUES
('رحلة العلا الاستكشافية', 'AlUla Exploration Trip', 'اكتشف عجائب العلا وآثارها التاريخية في رحلة لا تُنسى', 'Discover the wonders of AlUla and its historical monuments in an unforgettable trip', 2500.00, 3, 'العلا، السعودية', 'domestic', TRUE, TRUE),
('جولة الرياض الحضارية', 'Riyadh Cultural Tour', 'استكشف معالم الرياض الحديثة والتراثية', 'Explore the modern and heritage landmarks of Riyadh', 1800.00, 2, 'الرياض، السعودية', 'domestic', TRUE, TRUE),
('رحلة جدة التاريخية', 'Historic Jeddah Trip', 'تجول في أحياء جدة التاريخية واستمتع بجمال البحر الأحمر', 'Stroll through the historic neighborhoods of Jeddah and enjoy the beauty of the Red Sea', 2200.00, 3, 'جدة، السعودية', 'domestic', TRUE, FALSE);

-- =============================================
-- CMS Tables for Content Management
-- =============================================

-- Pages table for managing website pages
CREATE TABLE IF NOT EXISTS cms_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    template VARCHAR(100) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_template (template)
);

-- Sections table for page sections
CREATE TABLE IF NOT EXISTS cms_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    section_type VARCHAR(100) NOT NULL, -- hero, about, services, testimonials, etc.
    title VARCHAR(255),
    subtitle TEXT,
    content LONGTEXT,
    background_color VARCHAR(7),
    background_image VARCHAR(500),
    text_color VARCHAR(7),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE CASCADE,
    INDEX idx_page_id (page_id),
    INDEX idx_section_type (section_type),
    INDEX idx_order (order_index),
    INDEX idx_active (is_active)
);

-- Content blocks for flexible content management
CREATE TABLE IF NOT EXISTS cms_content_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    block_type VARCHAR(100) NOT NULL, -- text, image, video, gallery, card, etc.
    title VARCHAR(255),
    content LONGTEXT,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    link_url VARCHAR(500),
    link_text VARCHAR(255),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES cms_sections(id) ON DELETE CASCADE,
    INDEX idx_section_id (section_id),
    INDEX idx_block_type (block_type),
    INDEX idx_order (order_index),
    INDEX idx_active (is_active)
);

-- Media library for managing images and files
CREATE TABLE IF NOT EXISTS cms_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    alt_text VARCHAR(255),
    caption TEXT,
    category VARCHAR(100),
    tags JSON,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_filename (filename),
    INDEX idx_category (category),
    INDEX idx_uploaded_by (uploaded_by)
);

-- Navigation menu management
CREATE TABLE IF NOT EXISTS cms_navigation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_name VARCHAR(100) NOT NULL, -- main, footer, mobile, etc.
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    page_id INT,
    parent_id INT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    target VARCHAR(20) DEFAULT '_self', -- _self, _blank
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES cms_navigation(id) ON DELETE CASCADE,
    INDEX idx_menu_name (menu_name),
    INDEX idx_parent_id (parent_id),
    INDEX idx_order (order_index),
    INDEX idx_active (is_active)
);

-- Site settings for global configuration
CREATE TABLE IF NOT EXISTS cms_site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value LONGTEXT,
    setting_type ENUM('text', 'textarea', 'number', 'boolean', 'json', 'image') DEFAULT 'text',
    category VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_category (category),
    INDEX idx_public (is_public)
);

-- =============================================
-- Sample CMS Data
-- =============================================

-- Sample pages
INSERT IGNORE INTO cms_pages (slug, title, meta_title, meta_description, status, template, created_by) VALUES
('home', 'الصفحة الرئيسية', 'Wonder Land - وكالة السفر الرائدة', 'اكتشف أفضل الوجهات السياحية مع Wonder Land وكالة السفر الرائدة في المملكة', 'published', 'home', 1),
('about', 'من نحن', 'من نحن - Wonder Land', 'تعرف على قصة Wonder Land وكيف نساعدك في تحقيق أحلامك السياحية', 'published', 'about', 1),
('services', 'خدماتنا', 'خدماتنا - Wonder Land', 'اكتشف مجموعة واسعة من الخدمات السياحية المتميزة', 'published', 'services', 1),
('contact', 'اتصل بنا', 'اتصل بنا - Wonder Land', 'تواصل معنا للحصول على أفضل العروض والاستشارات السياحية', 'published', 'contact', 1);

-- Sample site settings
INSERT IGNORE INTO cms_site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'Wonder Land', 'text', 'general', 'اسم الموقع', TRUE),
('site_tagline', 'وكالة السفر الرائدة', 'text', 'general', 'شعار الموقع', TRUE),
('site_logo', '/images/logo.png', 'image', 'general', 'شعار الموقع', TRUE),
('contact_email', 'info@wonderland.com', 'text', 'contact', 'البريد الإلكتروني للتواصل', TRUE),
('contact_phone', '+966 50 123 4567', 'text', 'contact', 'رقم الهاتف', TRUE),
('contact_address', 'الرياض، المملكة العربية السعودية', 'text', 'contact', 'العنوان', TRUE),
('social_facebook', 'https://facebook.com/wonderland', 'text', 'social', 'صفحة الفيسبوك', TRUE),
('social_twitter', 'https://twitter.com/wonderland', 'text', 'social', 'حساب تويتر', TRUE),
('social_instagram', 'https://instagram.com/wonderland', 'text', 'social', 'حساب الإنستغرام', TRUE);

-- Sample navigation
INSERT IGNORE INTO cms_navigation (menu_name, title, url, page_id, order_index, is_active) VALUES
('main', 'الرئيسية', '/', 1, 1, TRUE),
('main', 'الباقات', '/packages/', 2, 2, TRUE),
('main', 'صمم باقتك', '/custom-package/', 3, 3, TRUE),
('main', 'عن الشركة', '/about/', 4, 4, TRUE);
