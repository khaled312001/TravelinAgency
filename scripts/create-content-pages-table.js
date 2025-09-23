import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function createContentPagesTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wonderland_travel'
  });

  try {
    console.log('🔧 Creating content_pages table...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS content_pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        content_ar TEXT,
        content_en TEXT,
        slug_ar VARCHAR(255) UNIQUE,
        slug_en VARCHAR(255) UNIQUE,
        meta_title_ar VARCHAR(255),
        meta_title_en VARCHAR(255),
        meta_description_ar TEXT,
        meta_description_en TEXT,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createTableSQL);
    console.log('✅ content_pages table created successfully');

    // Insert sample content pages
    const insertSampleData = `
      INSERT INTO content_pages (title_ar, title_en, content_ar, content_en, slug_ar, slug_en, active) VALUES
      ('من نحن', 'About Us', 'نحن وكالة سفر رائدة في المملكة العربية السعودية، نقدم أفضل خدمات السفر والسياحة.', 'We are a leading travel agency in Saudi Arabia, providing the best travel and tourism services.', 'من-نحن', 'about-us', 1),
      ('اتصل بنا', 'Contact Us', 'تواصل معنا للحصول على أفضل عروض السفر والسياحة.', 'Contact us for the best travel and tourism offers.', 'اتصل-بنا', 'contact-us', 1),
      ('سياسة الخصوصية', 'Privacy Policy', 'سياسة الخصوصية الخاصة بموقعنا.', 'Our website privacy policy.', 'سياسة-الخصوصية', 'privacy-policy', 1),
      ('شروط الاستخدام', 'Terms of Service', 'شروط وأحكام استخدام الموقع.', 'Terms and conditions for using the website.', 'شروط-الاستخدام', 'terms-of-service', 1)
    `;

    await connection.execute(insertSampleData);
    console.log('✅ Sample content pages inserted');

    // Verify the table
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM content_pages');
    console.log(`📊 Total content pages: ${rows[0].count}`);

  } catch (error) {
    console.error('❌ Error creating content_pages table:', error.message);
  } finally {
    await connection.end();
  }
}

createContentPagesTable();
