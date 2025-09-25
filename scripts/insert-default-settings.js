import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wonderland_travel'
};

// Default settings data
const defaultSettings = [
  // إعدادات الموقع العامة
  { setting_key: 'site_name_ar', setting_value: 'Wonder Land', setting_type: 'text', category: 'general', description: 'اسم الموقع باللغة العربية', is_public: true },
  { setting_key: 'site_name_en', setting_value: 'Wonder Land', setting_type: 'text', category: 'general', description: 'اسم الموقع باللغة الإنجليزية', is_public: true },
  { setting_key: 'site_tagline_ar', setting_value: 'وكالة السفر الرائدة', setting_type: 'text', category: 'general', description: 'شعار الموقع باللغة العربية', is_public: true },
  { setting_key: 'site_tagline_en', setting_value: 'Leading Travel Agency', setting_type: 'text', category: 'general', description: 'شعار الموقع باللغة الإنجليزية', is_public: true },
  { setting_key: 'site_description_ar', setting_value: 'وكالة سفر رائدة في المملكة العربية السعودية', setting_type: 'textarea', category: 'general', description: 'وصف الموقع باللغة العربية', is_public: true },
  { setting_key: 'site_description_en', setting_value: 'Leading travel agency in Saudi Arabia', setting_type: 'textarea', category: 'general', description: 'وصف الموقع باللغة الإنجليزية', is_public: true },
  { setting_key: 'site_logo', setting_value: '/images/logo.png', setting_type: 'image', category: 'general', description: 'رابط شعار الموقع', is_public: true },
  
  // إعدادات التواصل
  { setting_key: 'contact_email', setting_value: 'info@wonderland.com', setting_type: 'text', category: 'contact', description: 'البريد الإلكتروني للتواصل', is_public: true },
  { setting_key: 'contact_phone', setting_value: '+966501234567', setting_type: 'text', category: 'contact', description: 'رقم الهاتف', is_public: true },
  { setting_key: 'contact_whatsapp', setting_value: '+966501234567', setting_type: 'text', category: 'contact', description: 'رقم الواتساب', is_public: true },
  { setting_key: 'contact_address', setting_value: 'الرياض، المملكة العربية السعودية', setting_type: 'textarea', category: 'contact', description: 'العنوان', is_public: true },
  { setting_key: 'website_url', setting_value: 'https://wonderland.com', setting_type: 'text', category: 'contact', description: 'الموقع الإلكتروني', is_public: true },
  
  // وسائل التواصل الاجتماعي
  { setting_key: 'social_facebook', setting_value: '', setting_type: 'text', category: 'social', description: 'رابط صفحة الفيسبوك', is_public: true },
  { setting_key: 'social_twitter', setting_value: '', setting_type: 'text', category: 'social', description: 'رابط حساب تويتر', is_public: true },
  { setting_key: 'social_instagram', setting_value: '', setting_type: 'text', category: 'social', description: 'رابط حساب الإنستغرام', is_public: true },
  { setting_key: 'social_youtube', setting_value: '', setting_type: 'text', category: 'social', description: 'رابط قناة اليوتيوب', is_public: true },
  { setting_key: 'social_linkedin', setting_value: '', setting_type: 'text', category: 'social', description: 'رابط حساب لينكد إن', is_public: true },
  { setting_key: 'social_snapchat', setting_value: '', setting_type: 'text', category: 'social', description: 'رابط حساب سناب شات', is_public: true },
  
  // إعدادات SEO
  { setting_key: 'seo_keywords', setting_value: 'سفر، سياحة، رحلات، السعودية، وكالة سفر', setting_type: 'text', category: 'seo', description: 'الكلمات المفتاحية الافتراضية', is_public: true },
  { setting_key: 'seo_description', setting_value: 'اكتشف أفضل الوجهات السياحية مع Wonder Land وكالة السفر الرائدة في المملكة العربية السعودية', setting_type: 'textarea', category: 'seo', description: 'الوصف الافتراضي للصفحات', is_public: true },
  { setting_key: 'google_analytics', setting_value: '', setting_type: 'text', category: 'seo', description: 'كود Google Analytics', is_public: true },
  { setting_key: 'google_tag_manager', setting_value: '', setting_type: 'text', category: 'seo', description: 'كود Google Tag Manager', is_public: true },
  { setting_key: 'facebook_pixel', setting_value: '', setting_type: 'text', category: 'seo', description: 'كود Facebook Pixel', is_public: true },
  
  // إعدادات النظام
  { setting_key: 'default_language', setting_value: 'ar', setting_type: 'text', category: 'system', description: 'اللغة الافتراضية للموقع', is_public: true },
  { setting_key: 'timezone', setting_value: 'Asia/Riyadh', setting_type: 'text', category: 'system', description: 'المنطقة الزمنية', is_public: true },
  { setting_key: 'default_currency', setting_value: 'SAR', setting_type: 'text', category: 'system', description: 'العملة الافتراضية', is_public: true },
  { setting_key: 'items_per_page', setting_value: '20', setting_type: 'number', category: 'system', description: 'عدد العناصر في الصفحة الواحدة', is_public: true },
  { setting_key: 'maintenance_mode', setting_value: 'false', setting_type: 'boolean', category: 'system', description: 'تفعيل وضع الصيانة', is_public: false },
  { setting_key: 'allow_registration', setting_value: 'true', setting_type: 'boolean', category: 'system', description: 'السماح بتسجيل المستخدمين الجدد', is_public: true },
  { setting_key: 'enable_notifications', setting_value: 'true', setting_type: 'boolean', category: 'system', description: 'تفعيل الإشعارات', is_public: true },
  { setting_key: 'enable_analytics', setting_value: 'true', setting_type: 'boolean', category: 'system', description: 'تفعيل التحليلات', is_public: true },
  
  // إعدادات الأمان
  { setting_key: 'session_timeout', setting_value: '60', setting_type: 'number', category: 'security', description: 'مدة انتهاء الجلسة بالدقائق', is_public: false },
  { setting_key: 'max_login_attempts', setting_value: '5', setting_type: 'number', category: 'security', description: 'عدد محاولات تسجيل الدخول المسموحة', is_public: false },
  { setting_key: 'require_2fa', setting_value: 'false', setting_type: 'boolean', category: 'security', description: 'تفعيل المصادقة الثنائية', is_public: false },
  { setting_key: 'enable_captcha', setting_value: 'false', setting_type: 'boolean', category: 'security', description: 'تفعيل CAPTCHA', is_public: false },
  { setting_key: 'log_activities', setting_value: 'true', setting_type: 'boolean', category: 'security', description: 'تسجيل أنشطة المستخدمين', is_public: false },
  { setting_key: 'force_https', setting_value: 'true', setting_type: 'boolean', category: 'security', description: 'فرض استخدام HTTPS', is_public: false }
];

async function insertDefaultSettings() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    console.log('Database config:', { ...dbConfig, password: '***' });
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Check if settings table exists
    console.log('🔄 Checking cms_site_settings table...');
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'cms_site_settings'"
    );
    
    if (tables.length === 0) {
      console.log('❌ cms_site_settings table does not exist. Please run the CMS setup first.');
      return;
    }

    console.log('✅ cms_site_settings table exists');

    // Clear existing settings
    console.log('🔄 Clearing existing settings...');
    await connection.execute('DELETE FROM cms_site_settings');
    console.log('✅ Cleared existing settings');

    // Insert default settings
    console.log('🔄 Inserting default settings...');
    
    for (const setting of defaultSettings) {
      await connection.execute(`
        INSERT INTO cms_site_settings 
        (setting_key, setting_value, setting_type, category, description, is_public, updated_by, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
      `, [
        setting.setting_key,
        setting.setting_value,
        setting.setting_type,
        setting.category,
        setting.description,
        setting.is_public
      ]);
      
      console.log(`✅ Inserted: ${setting.setting_key}`);
    }

    console.log(`🎉 Successfully inserted ${defaultSettings.length} default settings!`);

  } catch (error) {
    console.error('❌ Error during settings insertion:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run insertion if this file is executed directly
console.log('Script started...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);

insertDefaultSettings()
  .then(() => {
    console.log('✅ Default settings insertion completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Default settings insertion failed:', error);
    process.exit(1);
  });

export { insertDefaultSettings };
