const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wonderland_travel'
};

// Data from the home page global destinations section
const globalDestinationsData = [
  {
    id: 'barcelona',
    name_ar: 'برشلونة',
    name_en: 'Barcelona',
    description_ar: 'مدينة متوسطية نابضة بالحياة تشتهر بهندستها المعمارية المذهلة وثقافتها الغنية ومزيج فريد من المعالم القوطية والحديثة',
    description_en: 'A vibrant Mediterranean city known for its stunning architecture, rich culture, and the unique blend of Gothic and Modernist landmarks',
    image_url: '/images/destinations/global/Barcelona/Barcelona1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'كتالونيا',
    region_en: 'Catalonia',
    location_type_ar: 'ساحلي',
    location_type_en: 'Coastal',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    coordinates: JSON.stringify({ latitude: 41.3851, longitude: 2.1734 })
  },
  {
    id: 'cairo',
    name_ar: 'القاهرة',
    name_en: 'Cairo',
    description_ar: 'عاصمة مصر، مدينة يلتقي فيها التاريخ القديم بالحياة العصرية، وموطن آخر عجائب العالم القديم المتبقية',
    description_en: 'The capital of Egypt, a city where ancient history meets modern life, home to the last remaining wonder of the ancient world',
    image_url: '/images/destinations/global/Cairo/Cairo1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'محافظة القاهرة',
    region_en: 'Cairo Governorate',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'تاريخي',
    destination_type_en: 'Historical',
    coordinates: JSON.stringify({ latitude: 30.0444, longitude: 31.2357 })
  },
  {
    id: 'georgia',
    name_ar: 'جورجيا',
    name_en: 'Georgia',
    description_ar: 'دولة في مفترق طرق أوروبا الشرقية وغرب آسيا، معروفة بمناظرها الطبيعية المتنوعة وتاريخها الغني وثقافة النبيذ الشهيرة',
    description_en: 'A country at the intersection of Eastern Europe and Western Asia, known for its diverse landscapes, rich history, and renowned wine culture',
    image_url: '/images/destinations/global/Georgia/Georgia1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'القوقاز',
    region_en: 'Caucasus',
    location_type_ar: 'متنوع',
    location_type_en: 'Diverse',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    coordinates: JSON.stringify({ latitude: 41.7151, longitude: 44.8271 })
  },
  {
    id: 'istanbul',
    name_ar: 'إسطنبول',
    name_en: 'Istanbul',
    description_ar: 'حيث يلتقي الشرق بالغرب، مدينة تمتد على قارتين بتاريخ غني',
    description_en: 'Where East meets West, a city straddling two continents with rich history',
    image_url: '/images/destinations/global/Istanbul/Istanbul1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'مرمرة',
    region_en: 'Marmara',
    location_type_ar: 'ساحلي',
    location_type_en: 'Coastal',
    destination_type_ar: 'تاريخي',
    destination_type_en: 'Historical',
    coordinates: JSON.stringify({ latitude: 41.0082, longitude: 28.9784 })
  },
  {
    id: 'london',
    name_ar: 'لندن',
    name_en: 'London',
    description_ar: 'مدينة متنوعة تمزج بين التاريخ والحداثة، معروفة بمعالمها الأيقونية ومتاحفها العالمية ومشهدها الثقافي النابض بالحياة',
    description_en: 'A diverse metropolis blending history and modernity, known for its iconic landmarks, world-class museums, and vibrant cultural scene',
    image_url: '/images/destinations/global/London/London1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'لندن الكبرى',
    region_en: 'Greater London',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    coordinates: JSON.stringify({ latitude: 51.5074, longitude: -0.1278 })
  },
  {
    id: 'madrid',
    name_ar: 'مدريد',
    name_en: 'Madrid',
    description_ar: 'عاصمة إسبانيا المركزية، مدينة الشوارع الأنيقة والحدائق الواسعة ومتاحف الفن المشهورة عالمياً',
    description_en: 'Spain\'s central capital, a city of elegant boulevards, expansive parks, and world-renowned art museums',
    image_url: '/images/destinations/global/Madrid/Madrid1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'مجتمع مدريد',
    region_en: 'Community of Madrid',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    coordinates: JSON.stringify({ latitude: 40.4168, longitude: -3.7038 })
  },
  {
    id: 'morocco',
    name_ar: 'المغرب',
    name_en: 'Morocco',
    description_ar: 'دولة في شمال أفريقيا تقدم مزيجاً من التأثيرات الثقافية العربية والأمازيغية والأوروبية، وتتميز بالمدن القديمة والصحاري الخلابة والأسواق النابضة بالحياة',
    description_en: 'A North African country offering a blend of Arab, Berber, and European cultural influences, featuring ancient medinas, stunning deserts, and vibrant markets',
    image_url: '/images/destinations/global/Morocco/Morocco1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'شمال أفريقيا',
    region_en: 'North Africa',
    location_type_ar: 'متنوع',
    location_type_en: 'Diverse',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    coordinates: JSON.stringify({ latitude: 31.7917, longitude: -7.0926 })
  },
  {
    id: 'paris',
    name_ar: 'باريس',
    name_en: 'Paris',
    description_ar: 'مدينة النور، مركز عالمي للفن والأزياء والطعام والثقافة، مشهورة بمعالمها الأيقونية وأجوائها الرومانسية',
    description_en: 'The City of Light, a global center for art, fashion, gastronomy, and culture, famous for its iconic landmarks and romantic atmosphere',
    image_url: '/images/destinations/global/Paris/Paris1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'إيل دو فرانس',
    region_en: 'Île-de-France',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    coordinates: JSON.stringify({ latitude: 48.8566, longitude: 2.3522 })
  },
  {
    id: 'sharm-el-sheikh',
    name_ar: 'شرم الشيخ',
    name_en: 'Sharm El Sheikh',
    description_ar: 'جنة ساحلية معروفة بشواطئها النقية والشعاب المرجانية النابضة بالحياة ومواقع الغوص العالمية',
    description_en: 'A coastal paradise known for its pristine beaches, vibrant coral reefs, and world-class diving spots',
    image_url: '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'جنوب سيناء',
    region_en: 'South Sinai',
    location_type_ar: 'ساحلي',
    location_type_en: 'Coastal',
    destination_type_ar: 'شاطئ',
    destination_type_en: 'Beach',
    coordinates: JSON.stringify({ latitude: 27.9158, longitude: 34.3300 })
  },
  {
    id: 'thailand',
    name_ar: 'تايلاند',
    name_en: 'Thailand',
    description_ar: 'دولة في جنوب شرق آسيا معروفة بشواطئها الاستوائية والقصور الملكية الفخمة والآثار القديمة والمعابد المزخرفة التي تعرض تماثيل بوذا',
    description_en: 'Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins, and ornate temples displaying figures of Buddha',
    image_url: '/images/destinations/global/Thailand/Thailand1.jpeg',
    category: 'international',
    featured: 1,
    active: 1,
    region_ar: 'جنوب شرق آسيا',
    region_en: 'Southeast Asia',
    location_type_ar: 'متنوع',
    location_type_en: 'Diverse',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    coordinates: JSON.stringify({ latitude: 15.8700, longitude: 100.9925 })
  }
];

async function migrateDestinations() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // First, let's check if we need to update the schema
    console.log('🔄 Checking destinations table structure...');
    
    // Add new columns if they don't exist
    const alterQueries = [
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS region_ar VARCHAR(255)',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS region_en VARCHAR(255)',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS location_type_ar VARCHAR(100)',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS location_type_en VARCHAR(100)',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS destination_type_ar VARCHAR(100)',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS destination_type_en VARCHAR(100)',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS coordinates JSON',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS category ENUM("saudi", "international") DEFAULT "international"',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE',
      'ALTER TABLE destinations ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE'
    ];

    for (const query of alterQueries) {
      try {
        await connection.execute(query);
        console.log(`✅ Executed: ${query}`);
      } catch (error) {
        if (error.code !== 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Warning: ${error.message}`);
        }
      }
    }

    // Clear existing destinations data
    console.log('🔄 Clearing existing destinations data...');
    await connection.execute('DELETE FROM destinations');
    console.log('✅ Cleared existing destinations data');

    // Insert new destinations
    console.log('🔄 Inserting destinations data...');
    
    for (const destination of globalDestinationsData) {
      const insertQuery = `
        INSERT INTO destinations (
          id, name_ar, name_en, description_ar, description_en, image_url,
          category, featured, active, region_ar, region_en,
          location_type_ar, location_type_en, destination_type_ar, destination_type_en,
          coordinates, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      await connection.execute(insertQuery, [
        destination.id,
        destination.name_ar,
        destination.name_en,
        destination.description_ar,
        destination.description_en,
        destination.image_url,
        destination.category,
        destination.featured,
        destination.active,
        destination.region_ar,
        destination.region_en,
        destination.location_type_ar,
        destination.location_type_en,
        destination.destination_type_ar,
        destination.destination_type_en,
        destination.coordinates
      ]);

      console.log(`✅ Inserted: ${destination.name_ar} (${destination.name_en})`);
    }

    console.log(`🎉 Successfully migrated ${globalDestinationsData.length} destinations!`);

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDestinations()
    .then(() => {
      console.log('✅ Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateDestinations, globalDestinationsData };
