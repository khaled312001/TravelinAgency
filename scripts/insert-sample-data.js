import mysql from 'mysql2/promise';

// Database configuration for XAMPP
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wonderland_travel'
};

async function insertSampleData() {
  let connection;
  
  try {
    console.log('🔧 Connecting to MySQL database...');
    connection = await mysql.createConnection(config);
    
    console.log('✅ Connected to database successfully');
    
    // Insert sample packages
    console.log('📦 Inserting sample packages...');
    const packages = [
      {
        title_ar: 'رحلة إلى دبي',
        title_en: 'Dubai Trip',
        description_ar: 'رحلة سياحية مميزة إلى دبي لمدة 5 أيام تشمل زيارة برج خليفة ودبي مول',
        description_en: 'Amazing 5-day trip to Dubai including Burj Khalifa and Dubai Mall',
        price: 2500.00,
        duration_days: 5,
        image_url: '/images/packages/dubai.jpg',
        travel_period: '5 أيام',
        featured: true,
        active: true,
        category: 'international',
        views: 150
      },
      {
        title_ar: 'عمرة رمضان',
        title_en: 'Ramadan Umrah',
        description_ar: 'برنامج عمرة رمضان المبارك مع إقامة فاخرة في مكة المكرمة',
        description_en: 'Ramadan Umrah program with luxury accommodation in Makkah',
        price: 1800.00,
        duration_days: 7,
        image_url: '/images/packages/umrah.jpg',
        travel_period: '7 أيام',
        featured: true,
        active: true,
        category: 'religious',
        views: 200
      },
      {
        title_ar: 'رحلة إلى تركيا',
        title_en: 'Turkey Trip',
        description_ar: 'رحلة سياحية شاملة إلى تركيا تشمل إسطنبول وأنطاليا',
        description_en: 'Comprehensive trip to Turkey including Istanbul and Antalya',
        price: 3200.00,
        duration_days: 8,
        image_url: '/images/packages/turkey.jpg',
        travel_period: '8 أيام',
        featured: false,
        active: true,
        category: 'international',
        views: 120
      },
      {
        title_ar: 'رحلة إلى ماليزيا',
        title_en: 'Malaysia Trip',
        description_ar: 'رحلة سياحية إلى ماليزيا تشمل كوالالمبور ولنكاوي',
        description_en: 'Trip to Malaysia including Kuala Lumpur and Langkawi',
        price: 2800.00,
        duration_days: 6,
        image_url: '/images/packages/malaysia.jpg',
        travel_period: '6 أيام',
        featured: false,
        active: true,
        category: 'international',
        views: 80
      }
    ];
    
    for (const pkg of packages) {
      try {
        await connection.execute(`
          INSERT INTO packages (title_ar, title_en, description_ar, description_en, price, duration_days, image_url, travel_period, featured, active, category, views)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [pkg.title_ar, pkg.title_en, pkg.description_ar, pkg.description_en, pkg.price, pkg.duration_days, pkg.image_url, pkg.travel_period, pkg.featured, pkg.active, pkg.category, pkg.views]);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Package "${pkg.title_ar}" already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting package "${pkg.title_ar}":`, error.message);
        }
      }
    }
    console.log('✅ Sample packages inserted');
    
    // Insert sample destinations
    console.log('🌍 Inserting sample destinations...');
    const destinations = [
      {
        name_ar: 'الرياض',
        name_en: 'Riyadh',
        description_ar: 'عاصمة المملكة العربية السعودية ومركزها السياسي والاقتصادي',
        description_en: 'Capital of Saudi Arabia and its political and economic center',
        image_url: '/images/destinations/riyadh/main.jpg',
        active: true
      },
      {
        name_ar: 'جدة',
        name_en: 'Jeddah',
        description_ar: 'عروس البحر الأحمر ومدينة التجارة والثقافة',
        description_en: 'Bride of the Red Sea and city of trade and culture',
        image_url: '/images/destinations/jeddah/main.jpg',
        active: true
      },
      {
        name_ar: 'الدمام',
        name_en: 'Dammam',
        description_ar: 'مدينة الخليج العربي ومركز النفط والصناعة',
        description_en: 'Arabian Gulf City and center of oil and industry',
        image_url: '/images/destinations/dammam/main.jpg',
        active: true
      },
      {
        name_ar: 'دبي',
        name_en: 'Dubai',
        description_ar: 'مدينة الإمارات الرائعة ومركز التجارة العالمية',
        description_en: 'Amazing UAE city and global trade center',
        image_url: '/images/destinations/dubai/main.jpg',
        active: true
      },
      {
        name_ar: 'إسطنبول',
        name_en: 'Istanbul',
        description_ar: 'مدينة الجسور بين القارات ومركز التاريخ والثقافة',
        description_en: 'City of bridges between continents and center of history and culture',
        image_url: '/images/destinations/istanbul/main.jpg',
        active: true
      }
    ];
    
    for (const dest of destinations) {
      try {
        await connection.execute(`
          INSERT INTO destinations (name_ar, name_en, description_ar, description_en, image_url, active)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [dest.name_ar, dest.name_en, dest.description_ar, dest.description_en, dest.image_url, dest.active]);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Destination "${dest.name_ar}" already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting destination "${dest.name_ar}":`, error.message);
        }
      }
    }
    console.log('✅ Sample destinations inserted');
    
    // Insert sample contact messages
    console.log('📧 Inserting sample contact messages...');
    const messages = [
      {
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        message: 'أريد الاستفسار عن الباقات السياحية المتاحة لتركيا في شهر رمضان',
        type: 'package',
        is_read: false
      },
      {
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+966507654321',
        message: 'شكراً لكم على الخدمة الممتازة في رحلة دبي الأخيرة',
        type: 'general',
        is_read: true
      },
      {
        name: 'محمد السعد',
        email: 'mohammed@example.com',
        phone: '+966509876543',
        message: 'هل لديكم حزم للعمرة في رمضان؟ وما هي الأسعار المتاحة؟',
        type: 'package',
        is_read: false
      },
      {
        name: 'نورا أحمد',
        email: 'nora@example.com',
        phone: '+966501112233',
        message: 'أريد اقتراح وجهة جديدة للعائلة مع الأطفال',
        type: 'suggestion',
        is_read: false
      },
      {
        name: 'خالد العتيبي',
        email: 'khalid@example.com',
        phone: '+966503334455',
        message: 'متى ستكون الرحلات إلى اليابان متاحة؟',
        type: 'package',
        is_read: false
      }
    ];
    
    for (const msg of messages) {
      try {
        await connection.execute(`
          INSERT INTO contact_messages (name, email, phone, message, type, is_read)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [msg.name, msg.email, msg.phone, msg.message, msg.type, msg.is_read]);
      } catch (error) {
        console.error(`❌ Error inserting message from "${msg.name}":`, error.message);
      }
    }
    console.log('✅ Sample contact messages inserted');
    
    // Create admin user if not exists
    console.log('👤 Creating admin user...');
    try {
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        ['admin@wonderland.com']
      );
      
      if (existingUsers.length === 0) {
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        
        const [userResult] = await connection.execute(`
          INSERT INTO users (email, password_hash, full_name, phone, email_verified, status)
          VALUES (?, ?, ?, ?, TRUE, 'active')
        `, ['admin@wonderland.com', hashedPassword, 'مدير النظام', '+966501234567']);
        
        const userId = userResult.insertId;
        
        const defaultPermissions = {
          manage_users: true,
          manage_packages: true,
          manage_destinations: true,
          manage_bookings: true,
          manage_messages: true,
          view_analytics: true,
          manage_settings: true,
          manage_admins: true
        };
        
        await connection.execute(`
          INSERT INTO admin_profiles (user_id, role, permissions)
          VALUES (?, ?, ?)
        `, [userId, 'super_admin', JSON.stringify(defaultPermissions)]);
        
        console.log('✅ Admin user created successfully');
      } else {
        console.log('⚠️  Admin user already exists');
      }
    } catch (error) {
      console.error('❌ Error creating admin user:', error.message);
    }
    
    console.log('\n🎉 Sample data inserted successfully!');
    console.log('\n📊 Summary:');
    console.log('  - Packages: 4 sample packages');
    console.log('  - Destinations: 5 sample destinations');
    console.log('  - Contact Messages: 5 sample messages');
    console.log('  - Admin User: admin@wonderland.com / admin123');
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
insertSampleData();
