import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function createHomepageContent() {
  let connection
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🚀 Creating homepage content...')
    
    // Check if homepage page exists
    const [existingPage] = await connection.execute(
      'SELECT id FROM cms_pages WHERE slug = "home"'
    )
    
    let pageId
    if (existingPage.length === 0) {
      // Create homepage page
      console.log('📄 Creating homepage page...')
      const [pageResult] = await connection.execute(`
        INSERT INTO cms_pages (slug, title, meta_title, meta_description, status, template, created_by, updated_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'home',
        'الصفحة الرئيسية',
        'Wonder Land - وكالة السفر الرائدة',
        'وكالة السفر الرائدة في المملكة العربية السعودية. اكتشف أفضل الوجهات السياحية معنا.',
        'published',
        'default',
        1,
        1
      ])
      pageId = pageResult.insertId
      console.log('✅ Homepage page created with ID:', pageId)
    } else {
      pageId = existingPage[0].id
      console.log('📄 Using existing homepage page with ID:', pageId)
    }
    
    // Clear existing sections for homepage
    await connection.execute('DELETE FROM cms_sections WHERE page_id = ?', [pageId])
    console.log('🧹 Cleared existing homepage sections')
    
    // Create Hero section with video background
    console.log('📝 Creating Hero section...')
    const [heroSection] = await connection.execute(`
      INSERT INTO cms_sections (page_id, section_type, title, subtitle, content, background_color, background_image, text_color, order_index, settings)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageId,
      'hero',
      'مرحباً بك في Wonder Land',
      'وكالة السفر الرائدة في المملكة العربية السعودية',
      '<p>اكتشف أجمل الوجهات السياحية معنا واستمتع برحلات لا تُنسى</p>',
      '#1e40af',
      '/videos/hero/desktop/hero-desktop.mp4',
      '#ffffff',
      1,
      JSON.stringify({
        video_background: true,
        desktop_video: '/videos/hero/desktop/hero-desktop.mp4',
        mobile_video: '/videos/hero/mobile/hero-mobile-center.mp4',
        poster_image: '/images/home/heroSection/hero-image.webp'
      })
    ])
    
    const heroSectionId = heroSection.insertId
    console.log('✅ Hero section created with ID:', heroSectionId)
    
    // Add buttons to hero section
    await connection.execute(`
      INSERT INTO cms_content_blocks (section_id, block_type, link_url, link_text, order_index)
      VALUES (?, 'button', '/packages', 'اكتشف رحلاتنا', 1)
    `, [heroSectionId])
    
    await connection.execute(`
      INSERT INTO cms_content_blocks (section_id, block_type, link_url, link_text, order_index)
      VALUES (?, 'button', '/about', 'تواصل معنا', 2)
    `, [heroSectionId])
    
    // Create Services section
    console.log('📝 Creating Services section...')
    const [servicesSection] = await connection.execute(`
      INSERT INTO cms_sections (page_id, section_type, title, subtitle, content, background_color, text_color, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageId,
      'services',
      'خدماتنا',
      'نقدم لك أفضل الخدمات السياحية',
      '<p>نحن نقدم مجموعة شاملة من الخدمات السياحية لضمان رحلة ممتعة ومريحة</p>',
      '#f8fafc',
      '#1f2937',
      2
    ])
    
    const servicesSectionId = servicesSection.insertId
    console.log('✅ Services section created with ID:', servicesSectionId)
    
    // Add service blocks
    const services = [
      {
        title: 'حجز الطيران',
        content: 'أفضل أسعار تذاكر الطيران',
        icon: 'material-symbols:flight',
        color: 'blue'
      },
      {
        title: 'حجز الفنادق',
        content: 'فنادق فاخرة بأسعار مناسبة',
        icon: 'material-symbols:hotel',
        color: 'green'
      },
      {
        title: 'جولات سياحية',
        content: 'جولات مميزة مع مرشدين محترفين',
        icon: 'material-symbols:map',
        color: 'purple'
      },
      {
        title: 'دعم 24/7',
        content: 'خدمة عملاء متاحة على مدار الساعة',
        icon: 'material-symbols:support-agent',
        color: 'orange'
      }
    ]
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i]
      await connection.execute(`
        INSERT INTO cms_content_blocks (section_id, block_type, title, content, order_index, settings)
        VALUES (?, 'service', ?, ?, ?, ?)
      `, [
        servicesSectionId,
        service.title,
        service.content,
        i + 1,
        JSON.stringify({
          icon: service.icon,
          color: service.color
        })
      ])
    }
    
    // Create About section
    console.log('📝 Creating About section...')
    const [aboutSection] = await connection.execute(`
      INSERT INTO cms_sections (page_id, section_type, title, subtitle, content, background_color, text_color, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageId,
      'about',
      'من نحن',
      'وكالة السفر الرائدة في المملكة',
      '<p>نحن وكالة سفر رائدة في المملكة العربية السعودية، نقدم خدمات سياحية متميزة منذ أكثر من 10 سنوات. نسعى لتوفير أفضل التجارب السياحية لعملائنا الكرام.</p>',
      '#ffffff',
      '#1f2937',
      3
    ])
    
    const aboutSectionId = aboutSection.insertId
    console.log('✅ About section created with ID:', aboutSectionId)
    
    // Add stats to about section
    const stats = [
      { number: '1000+', label: 'عميل سعيد' },
      { number: '50+', label: 'وجهة سياحية' },
      { number: '10+', label: 'سنوات خبرة' },
      { number: '24/7', label: 'دعم فني' }
    ]
    
    for (let i = 0; i < stats.length; i++) {
      const stat = stats[i]
      await connection.execute(`
        INSERT INTO cms_content_blocks (section_id, block_type, title, content, order_index, settings)
        VALUES (?, 'stat', ?, ?, ?, ?)
      `, [
        aboutSectionId,
        stat.number,
        stat.label,
        i + 1,
        JSON.stringify({})
      ])
    }
    
    // Create Contact section
    console.log('📝 Creating Contact section...')
    const [contactSection] = await connection.execute(`
      INSERT INTO cms_sections (page_id, section_type, title, subtitle, content, background_color, text_color, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageId,
      'contact',
      'تواصل معنا',
      'نحن هنا لخدمتك',
      '<p>هل لديك استفسار أو تريد حجز رحلة؟ تواصل معنا وسنكون سعداء لمساعدتك</p>',
      '#1e40af',
      '#ffffff',
      4
    ])
    
    console.log('✅ Contact section created')
    
    console.log('🎉 Homepage content created successfully!')
    console.log('📊 Summary:')
    console.log('   - Homepage page: ID', pageId)
    console.log('   - Hero section: ID', heroSectionId)
    console.log('   - Services section: ID', servicesSectionId)
    console.log('   - About section: ID', aboutSectionId)
    console.log('   - Contact section: Created')
    
  } catch (error) {
    console.error('❌ Error creating homepage content:', error)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run the script
createHomepageContent()
