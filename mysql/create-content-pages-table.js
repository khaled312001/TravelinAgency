import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function createContentPagesTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🚀 Creating content_pages table...')
    
    // Create content_pages table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS content_pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_ar TEXT NOT NULL,
        title_en TEXT NOT NULL,
        content_ar LONGTEXT NOT NULL,
        content_en LONGTEXT NOT NULL,
        type ENUM('page', 'post', 'news') DEFAULT 'page',
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        meta_description_ar TEXT,
        meta_description_en TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    console.log('✅ content_pages table created successfully')
    
    // Insert sample content pages
    const samplePages = [
      {
        title_ar: 'من نحن',
        title_en: 'About Us',
        content_ar: 'نحن وكالة سفر رائدة في المملكة العربية السعودية، نقدم خدمات سفر متميزة لعملائنا الكرام.',
        content_en: 'We are a leading travel agency in Saudi Arabia, providing exceptional travel services to our valued customers.',
        type: 'page',
        status: 'published',
        meta_description_ar: 'تعرف على وكالة أرض العجائب للسفر وخدماتنا المتميزة',
        meta_description_en: 'Learn about Wonder Land Travel Agency and our exceptional services'
      },
      {
        title_ar: 'خدماتنا',
        title_en: 'Our Services',
        content_ar: 'نقدم مجموعة شاملة من خدمات السفر والسياحة تشمل حجوزات الطيران والفنادق والجولات السياحية.',
        content_en: 'We offer a comprehensive range of travel and tourism services including flight bookings, hotels, and tourist tours.',
        type: 'page',
        status: 'published',
        meta_description_ar: 'اكتشف خدمات السفر والسياحة المتنوعة التي نقدمها',
        meta_description_en: 'Discover the diverse travel and tourism services we offer'
      },
      {
        title_ar: 'اتصل بنا',
        title_en: 'Contact Us',
        content_ar: 'تواصل معنا للحصول على أفضل عروض السفر والاستفسارات. نحن هنا لخدمتكم على مدار الساعة.',
        content_en: 'Contact us for the best travel offers and inquiries. We are here to serve you 24/7.',
        type: 'page',
        status: 'published',
        meta_description_ar: 'تواصل مع وكالة أرض العجائب للسفر للحصول على أفضل الخدمات',
        meta_description_en: 'Contact Wonder Land Travel Agency for the best services'
      },
      {
        title_ar: 'أخبار السفر',
        title_en: 'Travel News',
        content_ar: 'تابع آخر أخبار السفر والسياحة حول العالم مع وكالة أرض العجائب.',
        content_en: 'Follow the latest travel and tourism news around the world with Wonder Land Travel Agency.',
        type: 'news',
        status: 'published',
        meta_description_ar: 'أحدث أخبار السفر والسياحة من حول العالم',
        meta_description_en: 'Latest travel and tourism news from around the world'
      }
    ]
    
    console.log('📝 Inserting sample content pages...')
    
    for (const page of samplePages) {
      await connection.execute(`
        INSERT INTO content_pages (
          title_ar, title_en, content_ar, content_en, 
          type, status, meta_description_ar, meta_description_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        page.title_ar,
        page.title_en,
        page.content_ar,
        page.content_en,
        page.type,
        page.status,
        page.meta_description_ar,
        page.meta_description_en
      ])
      
      console.log(`✅ Added: ${page.title_ar}`)
    }
    
    // Verify creation
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM content_pages')
    console.log(`\n📊 Total content pages: ${count[0].count}`)
    
    await connection.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createContentPagesTable()
