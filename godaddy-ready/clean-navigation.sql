-- تنظيف جدول التنقل من الصفحات القديمة (services و contact و home)
-- Clean navigation table from old pages (services, contact, and home)

-- حذف كل الروابط القديمة
DELETE FROM cms_navigation WHERE url IN ('/services', '/services/', '/contact', '/contact/', '/home', '/home/');

-- حذف أي صفحات للخدمات أو الاتصال من جدول الصفحات
DELETE FROM cms_pages WHERE slug IN ('services', 'contact', 'home');

-- إعادة إدراج القائمة الصحيحة فقط (4 صفحات)
DELETE FROM cms_navigation WHERE menu_name = 'main';

INSERT INTO cms_navigation (menu_name, title, url, page_id, order_index, is_active) VALUES
('main', 'الرئيسية', '/', 1, 1, TRUE),
('main', 'الباقات', '/packages/', 2, 2, TRUE),
('main', 'صمم باقتك', '/custom-package/', 3, 3, TRUE),
('main', 'عن الشركة', '/about/', 4, 4, TRUE);

-- تحديث أي روابط /home/ متبقية إلى /
UPDATE cms_navigation SET url = '/' WHERE url IN ('/home', '/home/');

-- التحقق من النتيجة
SELECT * FROM cms_navigation WHERE menu_name = 'main' ORDER BY order_index;

