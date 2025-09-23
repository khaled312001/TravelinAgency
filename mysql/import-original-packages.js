import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const originalPackages = [
  {
    title_ar: 'رومانسية وثقافة باريس',
    title_en: 'Paris Romance & Culture',
    description_ar: 'اختبر سحر باريس مع زيارات لبرج إيفل، متحف اللوفر، كاتدرائية نوتردام، وحي مونمارتر الساحر.',
    description_en: 'Experience the charm of Paris with visits to the Eiffel Tower, Louvre Museum, Notre Dame Cathedral, and the charming Montmartre district.',
    price: 9999,
    duration_days: 8,
    travel_period: 'مارس',
    image_url: '/images/packages/paris-romance.jpg',
    featured: 1,
    hotel_grade: 5
  },
  {
    title_ar: 'مغامرة طوكيو العصرية',
    title_en: 'Tokyo Modern Adventure',
    description_ar: 'استكشف مدينة طوكيو النابضة بالحياة، من المعابد القديمة إلى الأحياء الحديثة مثل شيبويا وأكيهابارا. اختبر الثقافة اليابانية والمطبخ والتكنولوجيا.',
    description_en: 'Explore the vibrant city of Tokyo, from ancient temples to modern districts like Shibuya and Akihabara. Experience Japanese culture, cuisine, and technology.',
    price: 11499,
    duration_days: 12,
    travel_period: 'أبريل',
    image_url: '/images/packages/tokyo-modern.jpg',
    featured: 1,
    hotel_grade: 4
  },
  {
    title_ar: 'مستكشف مدينة نيويورك',
    title_en: 'New York City Explorer',
    description_ar: 'اكتشف معالم مدينة نيويورك الشهيرة بما في ذلك تايمز سكوير، سنترال بارك، مبنى إمباير ستيت، وعروض برودواي.',
    description_en: 'Discover famous New York City landmarks including Times Square, Central Park, Empire State Building, and Broadway shows.',
    price: 8999,
    duration_days: 7,
    travel_period: 'مايو',
    image_url: '/images/packages/new-york-explorer.jpg',
    featured: 1,
    hotel_grade: 5
  },
  {
    title_ar: 'دبي الفاخرة والصحراء',
    title_en: 'Dubai Luxury & Desert',
    description_ar: 'اختبر التسوق الفاخر، رحلات الصحراء، والهندسة المعمارية الحديثة بما في ذلك برج خليفة وجزيرة النخلة.',
    description_en: 'Experience luxury shopping, desert safaris, and modern architecture including Burj Khalifa and Palm Jumeirah.',
    price: 12999,
    duration_days: 9,
    travel_period: 'يونيو',
    image_url: '/images/packages/dubai-luxury.jpg',
    featured: 1,
    hotel_grade: 5
  },
  {
    title_ar: 'رحلة تاريخية إلى روما',
    title_en: 'Rome Historical Journey',
    description_ar: 'امش في التاريخ بزيارة الكولوسيوم، مدينة الفاتيكان، المنتدى الروماني، واستمتع بالمطبخ الإيطالي الأصيل.',
    description_en: 'Walk through history visiting the Colosseum, Vatican City, Roman Forum, and enjoy authentic Italian cuisine.',
    price: 9499,
    duration_days: 10,
    travel_period: 'يوليو',
    image_url: '/images/packages/rome-historical.jpg',
    featured: 1,
    hotel_grade: 5
  },
  {
    title_ar: 'هروب إلى جنة بالي',
    title_en: 'Bali Paradise Escape',
    description_ar: 'استرخ في الشواطئ النقية، قم بزيارة المعابد القديمة، استكشف الأراضي الزراعية، واختبر ثقافة بالي.',
    description_en: 'Relax on pristine beaches, visit ancient temples, explore rice terraces, and experience Balinese culture.',
    price: 7499,
    duration_days: 13,
    travel_period: 'أغسطس',
    image_url: '/images/packages/bali-paradise.jpg',
    featured: 1,
    hotel_grade: 5
  },
  {
    title_ar: 'تجربة لندن الملكية',
    title_en: 'London Royal Experience',
    description_ar: 'قم بزيارة قصر باكنغهام، برج لندن، بيغ بن، واستمتع بشاي بعد الظهر التقليدية.',
    description_en: 'Visit Buckingham Palace, Tower of London, Big Ben, and enjoy traditional afternoon tea.',
    price: 10499,
    duration_days: 8,
    travel_period: 'سبتمبر',
    image_url: '/images/packages/london-royal.jpg',
    featured: 1,
    hotel_grade: 5
  },
  {
    title_ar: 'جنة سانتوريني اليونانية',
    title_en: 'Santorini Greek Paradise',
    description_ar: 'اختبر غروب الشمس الرائع، المباني البيضاء، المطبخ المتوسطي، والشواطئ الجميلة.',
    description_en: 'Experience stunning sunsets, white buildings, Mediterranean cuisine, and beautiful beaches.',
    price: 13999,
    duration_days: 11,
    travel_period: 'أكتوبر',
    image_url: '/images/packages/santorini-paradise.jpg',
    featured: 1,
    hotel_grade: 5
  },
  {
    title_ar: 'مغامرة ماتشو بيتشو',
    title_en: 'Machu Picchu Adventure',
    description_ar: 'سافر عبر جبال الأنديز لاكتشاف الحصن القديم للإنكا واستكشف الهندسة المعمارية الاستعمارية في كوسكو.',
    description_en: 'Travel through the Andes to discover the ancient Inca fortress and explore colonial architecture in Cusco.',
    price: 14999,
    duration_days: 15,
    travel_period: 'نوفمبر',
    image_url: '/images/packages/machu-picchu.jpg',
    featured: 1,
    hotel_grade: 5
  },
  {
    title_ar: 'ملاذ مالي الفاخر',
    title_en: 'Maldives Luxury Retreat',
    description_ar: 'اقم في فيلات فوق الماء، استكشف الشواطئ النقية، واستمتع بعلاجات السبا العالمية.',
    description_en: 'Stay in overwater villas, explore pristine beaches, and enjoy world-class spa treatments.',
    price: 13499,
    duration_days: 14,
    travel_period: 'ديسمبر',
    image_url: '/images/packages/maldives-luxury.jpg',
    featured: 1,
    hotel_grade: 5
  }
]

async function importOriginalPackages() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🚀 Starting import of original packages...')
    
    // Clear existing packages first
    await connection.execute('DELETE FROM packages')
    console.log('🗑️ Cleared existing packages')
    
    // Insert new packages
    for (const pkg of originalPackages) {
      const [result] = await connection.execute(`
        INSERT INTO packages (
          id, title_ar, title_en, description_ar, description_en, 
          price, duration_days, travel_period, image_url, 
          featured, active, max_persons, category, views
        ) VALUES (
          UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 10, 'international', 0
        )
      `, [
        pkg.title_ar,
        pkg.title_en,
        pkg.description_ar,
        pkg.description_en,
        pkg.price,
        pkg.duration_days,
        pkg.travel_period,
        pkg.image_url,
        pkg.featured
      ])
      
      console.log(`✅ Added: ${pkg.title_ar}`)
    }
    
    // Verify import
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM packages')
    const [featured] = await connection.execute('SELECT COUNT(*) as count FROM packages WHERE featured = 1')
    
    console.log(`\n📊 Import completed:`)
    console.log(`   Total packages: ${count[0].count}`)
    console.log(`   Featured packages: ${featured[0].count}`)
    
    await connection.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

importOriginalPackages()
