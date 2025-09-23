import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function createCMSTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🚀 Creating CMS tables...')
    
    // Create cms_pages table
    console.log('📋 Creating cms_pages table...')
    await connection.execute(`
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
      )
    `)
    console.log('✅ cms_pages table created')
    
    // Create cms_sections table
    console.log('📋 Creating cms_sections table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cms_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id INT NOT NULL,
        section_type VARCHAR(100) NOT NULL,
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
      )
    `)
    console.log('✅ cms_sections table created')
    
    // Create cms_content_blocks table
    console.log('📋 Creating cms_content_blocks table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cms_content_blocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_id INT NOT NULL,
        block_type VARCHAR(100) NOT NULL,
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
      )
    `)
    console.log('✅ cms_content_blocks table created')
    
    // Create cms_media table
    console.log('📋 Creating cms_media table...')
    await connection.execute(`
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
      )
    `)
    console.log('✅ cms_media table created')
    
    // Create cms_navigation table
    console.log('📋 Creating cms_navigation table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cms_navigation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menu_name VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(500),
        page_id INT,
        parent_id INT,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        target VARCHAR(20) DEFAULT '_self',
        icon VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE SET NULL,
        FOREIGN KEY (parent_id) REFERENCES cms_navigation(id) ON DELETE CASCADE,
        INDEX idx_menu_name (menu_name),
        INDEX idx_parent_id (parent_id),
        INDEX idx_order (order_index),
        INDEX idx_active (is_active)
      )
    `)
    console.log('✅ cms_navigation table created')
    
    // Create cms_site_settings table
    console.log('📋 Creating cms_site_settings table...')
    await connection.execute(`
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
      )
    `)
    console.log('✅ cms_site_settings table created')
    
    // Insert sample data
    console.log('📝 Inserting sample data...')
    
    // Sample pages
    await connection.execute(`
      INSERT IGNORE INTO cms_pages (slug, title, meta_title, meta_description, status, template, created_by) VALUES
      ('home', 'الصفحة الرئيسية', 'Wonder Land - وكالة السفر الرائدة', 'اكتشف أفضل الوجهات السياحية مع Wonder Land وكالة السفر الرائدة في المملكة', 'published', 'home', 1),
      ('about', 'من نحن', 'من نحن - Wonder Land', 'تعرف على قصة Wonder Land وكيف نساعدك في تحقيق أحلامك السياحية', 'published', 'about', 1),
      ('services', 'خدماتنا', 'خدماتنا - Wonder Land', 'اكتشف مجموعة واسعة من الخدمات السياحية المتميزة', 'published', 'services', 1),
      ('contact', 'اتصل بنا', 'اتصل بنا - Wonder Land', 'تواصل معنا للحصول على أفضل العروض والاستشارات السياحية', 'published', 'contact', 1)
    `)
    console.log('✅ Sample pages inserted')
    
    // Sample site settings
    await connection.execute(`
      INSERT IGNORE INTO cms_site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
      ('site_name', 'Wonder Land', 'text', 'general', 'اسم الموقع', TRUE),
      ('site_tagline', 'وكالة السفر الرائدة', 'text', 'general', 'شعار الموقع', TRUE),
      ('site_logo', '/images/logo.png', 'image', 'general', 'شعار الموقع', TRUE),
      ('contact_email', 'info@wonderland.com', 'text', 'contact', 'البريد الإلكتروني للتواصل', TRUE),
      ('contact_phone', '+966 50 123 4567', 'text', 'contact', 'رقم الهاتف', TRUE),
      ('contact_address', 'الرياض، المملكة العربية السعودية', 'text', 'contact', 'العنوان', TRUE),
      ('social_facebook', 'https://facebook.com/wonderland', 'text', 'social', 'صفحة الفيسبوك', TRUE),
      ('social_twitter', 'https://twitter.com/wonderland', 'text', 'social', 'حساب تويتر', TRUE),
      ('social_instagram', 'https://instagram.com/wonderland', 'text', 'social', 'حساب الإنستغرام', TRUE)
    `)
    console.log('✅ Sample site settings inserted')
    
    // Sample navigation
    await connection.execute(`
      INSERT IGNORE INTO cms_navigation (menu_name, title, url, page_id, order_index, is_active) VALUES
      ('main', 'الرئيسية', '/', 1, 1, TRUE),
      ('main', 'من نحن', '/about', 2, 2, TRUE),
      ('main', 'خدماتنا', '/services', 3, 3, TRUE),
      ('main', 'الوجهات', '/destinations', NULL, 4, TRUE),
      ('main', 'الحزم', '/packages', NULL, 5, TRUE),
      ('main', 'اتصل بنا', '/contact', 4, 6, TRUE)
    `)
    console.log('✅ Sample navigation inserted')
    
    await connection.end()
    console.log('🎉 CMS tables and sample data created successfully!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createCMSTables()
