import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function createSampleContent() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🚀 Creating sample content for home page...')
    
    // Get home page ID
    const [homePage] = await connection.execute(
      'SELECT id FROM cms_pages WHERE slug = "home"'
    )
    
    if (homePage.length === 0) {
      console.log('❌ Home page not found')
      return
    }
    
    const pageId = homePage[0].id
    console.log('📄 Home page ID:', pageId)
    
    // Create Hero section
    console.log('📝 Creating Hero section...')
    const [heroSection] = await connection.execute(`
      INSERT INTO cms_sections (page_id, section_type, title, subtitle, content, background_color, text_color, order_index)
      VALUES (?, 'hero', ?, ?, ?, ?, ?, ?)
    `, [
      pageId,
      'مرحباً بك في Wonder Land',
      'وكالة السفر الرائدة في المملكة العربية السعودية',
      '<p>اكتشف أجمل الوجهات السياحية معنا واستمتع برحلات لا تُنسى</p>',
      '#1e40af',
      '#ffffff',
      1
    ])
    
    const heroSectionId = heroSection.insertId
    console.log('✅ Hero section created with ID:', heroSectionId)
    
    // Add button to hero section
    await connection.execute(`
      INSERT INTO cms_content_blocks (section_id, block_type, link_url, link_text, order_index)
      VALUES (?, 'button', '/packages', 'اكتشف رحلاتنا', 1)
    `, [heroSectionId])
    
    // Create About section
    console.log('📝 Creating About section...')
    const [aboutSection] = await connection.execute(`
      INSERT INTO cms_sections (page_id, section_type, title, subtitle, content, order_index)
      VALUES (?, 'about', ?, ?, ?, ?)
    `, [
      pageId,
      'من نحن',
      'وكالة سفر متميزة بخبرة واسعة',
      '<p>نحن في Wonder Land نقدم أفضل الخدمات السياحية في المملكة العربية السعودية. مع سنوات من الخبرة والالتزام بالجودة، نساعدك في تحقيق أحلامك السياحية.</p>',
      2
    ])
    
    const aboutSectionId = aboutSection.insertId
    console.log('✅ About section created with ID:', aboutSectionId)
    
    // Add feature blocks to about section
    const features = [
      { title: 'خبرة واسعة', content: 'أكثر من 10 سنوات في مجال السياحة' },
      { title: 'خدمة متميزة', content: 'فريق محترف لخدمتك على مدار الساعة' },
      { title: 'أسعار تنافسية', content: 'أفضل الأسعار مع ضمان الجودة' }
    ]
    
    for (let i = 0; i < features.length; i++) {
      await connection.execute(`
        INSERT INTO cms_content_blocks (section_id, block_type, title, content, order_index)
        VALUES (?, 'feature', ?, ?, ?)
      `, [aboutSectionId, features[i].title, features[i].content, i + 1])
    }
    
    // Create Services section
    console.log('📝 Creating Services section...')
    const [servicesSection] = await connection.execute(`
      INSERT INTO cms_sections (page_id, section_type, title, subtitle, content, order_index)
      VALUES (?, 'services', ?, ?, ?, ?)
    `, [
      pageId,
      'خدماتنا',
      'نقدم لك أفضل الخدمات السياحية',
      '<p>اكتشف مجموعة واسعة من الخدمات المصممة خصيصاً لتلبية احتياجاتك</p>',
      3
    ])
    
    const servicesSectionId = servicesSection.insertId
    console.log('✅ Services section created with ID:', servicesSectionId)
    
    // Add service blocks
    const services = [
      { title: 'رحلات داخلية', content: 'اكتشف أجمل الوجهات داخل المملكة' },
      { title: 'رحلات خارجية', content: 'استمتع برحلات عالمية متميزة' },
      { title: 'حجوزات فندقية', content: 'أفضل الفنادق بأسعار تنافسية' }
    ]
    
    for (let i = 0; i < services.length; i++) {
      await connection.execute(`
        INSERT INTO cms_content_blocks (section_id, block_type, title, content, order_index)
        VALUES (?, 'service', ?, ?, ?)
      `, [servicesSectionId, services[i].title, services[i].content, i + 1])
    }
    
    // Create Contact section
    console.log('📝 Creating Contact section...')
    await connection.execute(`
      INSERT INTO cms_sections (page_id, section_type, title, subtitle, order_index)
      VALUES (?, 'contact', ?, ?, ?)
    `, [
      pageId,
      'تواصل معنا',
      'نحن هنا لخدمتك',
      4
    ])
    
    console.log('✅ Contact section created')
    
    await connection.end()
    console.log('🎉 Sample content created successfully!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createSampleContent()
