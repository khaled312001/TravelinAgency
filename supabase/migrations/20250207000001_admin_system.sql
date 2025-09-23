-- إنشاء جداول نظام الإدارة

-- جدول ملفات الإدارة
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'moderator')),
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول إعدادات الإدارة
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول سجل الأنشطة
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    title VARCHAR(255),
    type VARCHAR(50) DEFAULT 'general',
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول الباقات السياحية (إذا لم يكن موجوداً)
CREATE TABLE IF NOT EXISTS packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER, -- بالأيام
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('domestic', 'international', 'religious', 'adventure', 'cultural')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    image TEXT,
    images JSONB DEFAULT '[]', -- مصفوفة من الصور
    features JSONB DEFAULT '[]', -- مصفوفة من المميزات
    itinerary JSONB DEFAULT '[]', -- برنامج الرحلة
    included JSONB DEFAULT '[]', -- ما يشمله السعر
    excluded JSONB DEFAULT '[]', -- ما لا يشمله السعر
    location VARCHAR(255),
    coordinates JSONB, -- {lat, lng}
    max_guests INTEGER DEFAULT 1,
    min_guests INTEGER DEFAULT 1,
    departure_dates JSONB DEFAULT '[]', -- تواريخ المغادرة
    booking_deadline INTEGER DEFAULT 7, -- الموعد النهائي للحجز بالأيام
    cancellation_policy TEXT,
    views INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول الوجهات السياحية (إذا لم يكن موجوداً)
CREATE TABLE IF NOT EXISTS destinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    region VARCHAR(100),
    type VARCHAR(50) DEFAULT 'city' CHECK (type IN ('city', 'landmark', 'nature', 'beach', 'mountain')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    image TEXT,
    images JSONB DEFAULT '[]',
    coordinates JSONB, -- {lat, lng}
    climate_info JSONB DEFAULT '{}',
    best_time_to_visit VARCHAR(100),
    attractions JSONB DEFAULT '[]',
    activities JSONB DEFAULT '[]',
    local_cuisine JSONB DEFAULT '[]',
    transportation_info TEXT,
    accommodation_info TEXT,
    cultural_notes TEXT,
    safety_info TEXT,
    budget_info JSONB DEFAULT '{}', -- {budget_range, currency}
    language VARCHAR(100),
    currency VARCHAR(10),
    timezone VARCHAR(50),
    visa_requirements TEXT,
    health_requirements TEXT,
    packing_suggestions JSONB DEFAULT '[]',
    views INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول رسائل التواصل (إذا لم يكن موجوداً)
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'booking', 'complaint', 'suggestion', 'support')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    source VARCHAR(50) DEFAULT 'website', -- مصدر الرسالة
    related_package_id UUID REFERENCES packages(id),
    related_destination_id UUID REFERENCES destinations(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول الحجوزات
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_details JSONB DEFAULT '{}', -- معلومات إضافية عن العميل
    guests_count INTEGER NOT NULL DEFAULT 1,
    guests_details JSONB DEFAULT '[]', -- تفاصيل المسافرين
    departure_date DATE NOT NULL,
    return_date DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'SAR',
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    booking_status VARCHAR(20) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    special_requests TEXT,
    notes TEXT,
    cancellation_reason TEXT,
    cancellation_date TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول ملفات المستخدمين (إذا لم يكن موجوداً)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    emergency_contact JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- إنشاء الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON admin_profiles(role);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages(created_at);
CREATE INDEX IF NOT EXISTS idx_packages_is_featured ON packages(is_featured);

CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status);
CREATE INDEX IF NOT EXISTS idx_destinations_type ON destinations(type);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);
CREATE INDEX IF NOT EXISTS idx_destinations_is_featured ON destinations(is_featured);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON contact_messages(type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_departure_date ON bookings(departure_date);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء المحفزات لتحديث updated_at
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إنشاء دالة لتسجيل الأنشطة
CREATE OR REPLACE FUNCTION log_activity(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_table_name VARCHAR(100) DEFAULT NULL,
    p_record_id UUID DEFAULT NULL,
    p_title VARCHAR(255) DEFAULT NULL,
    p_type VARCHAR(50) DEFAULT 'general',
    p_details JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO activity_logs (
        user_id, action, table_name, record_id, title, type, details, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action, p_table_name, p_record_id, p_title, p_type, p_details, p_ip_address, p_user_agent
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء دالة لتوليد رقم الحجز
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
DECLARE
    booking_num TEXT;
    year_part TEXT;
    sequence_part TEXT;
    counter INTEGER;
BEGIN
    -- الحصول على السنة الحالية
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- الحصول على العداد للسنة الحالية
    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_number FROM 5) AS INTEGER)), 0) + 1
    INTO counter
    FROM bookings
    WHERE booking_number LIKE year_part || '%';
    
    -- تنسيق العداد ليكون 6 أرقام
    sequence_part := LPAD(counter::TEXT, 6, '0');
    
    -- تكوين رقم الحجز النهائي
    booking_num := year_part || sequence_part;
    
    RETURN booking_num;
END;
$$ LANGUAGE plpgsql;

-- إنشاء محفز لتوليد رقم الحجز تلقائياً
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
        NEW.booking_number := generate_booking_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_number
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_number();

-- إدراج إعدادات افتراضية
INSERT INTO admin_settings (settings) VALUES (
    '{
        "siteName": "Wonder Land Traveling Agency",
        "siteDescription": "وكالة سفر موثوقة لتجارب لا تُنسى",
        "siteKeywords": "سفر، سياحة، رحلات، عمرة، حج",
        "contactEmail": "info@wonderland.com",
        "contactPhone": "+966501234567",
        "whatsappNumber": "+966501234567",
        "address": "الرياض، المملكة العربية السعودية",
        "twoFactorEnabled": false,
        "activityLogging": true,
        "securityNotifications": true,
        "emailNotifications": {
            "newMessages": true,
            "newBookings": true,
            "dailyReports": false
        },
        "whatsappNotifications": {
            "enabled": false,
            "adminNumber": "+966501234567"
        },
        "autoBackup": {
            "enabled": false,
            "frequency": "daily"
        }
    }'
) ON CONFLICT DO NOTHING;

-- إنشاء سياسات الأمان (RLS)
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- سياسة للإدارة فقط
CREATE POLICY "Admin profiles are viewable by admins" ON admin_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_profiles ap
            WHERE ap.user_id = auth.uid() AND ap.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin profiles are editable by super admins" ON admin_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles ap
            WHERE ap.user_id = auth.uid() AND ap.role = 'super_admin'
        )
    );

CREATE POLICY "Admin settings are viewable by admins" ON admin_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_profiles ap
            WHERE ap.user_id = auth.uid() AND ap.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin settings are editable by admins" ON admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles ap
            WHERE ap.user_id = auth.uid() AND ap.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Activity logs are viewable by admins" ON activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_profiles ap
            WHERE ap.user_id = auth.uid() AND ap.role IN ('admin', 'super_admin')
        )
    );

-- تعليقات على الجداول
COMMENT ON TABLE admin_profiles IS 'ملفات المديرين وصلاحياتهم';
COMMENT ON TABLE admin_settings IS 'إعدادات النظام العامة';
COMMENT ON TABLE activity_logs IS 'سجل الأنشطة والعمليات';
COMMENT ON TABLE packages IS 'الباقات السياحية';
COMMENT ON TABLE destinations IS 'الوجهات السياحية';
COMMENT ON TABLE contact_messages IS 'رسائل التواصل من العملاء';
COMMENT ON TABLE bookings IS 'حجوزات العملاء';
COMMENT ON TABLE profiles IS 'ملفات المستخدمين';

-- منح الصلاحيات
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
