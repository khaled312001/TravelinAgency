-- DANGER: This will delete ALL data in your database!
-- Use this only if you want a completely fresh start
-- Run this BEFORE importing travel.sql

SET FOREIGN_KEY_CHECKS = 0;

-- Drop all views
DROP VIEW IF EXISTS `destination_statistics`;
DROP VIEW IF EXISTS `monthly_inquiry_statistics`;
DROP VIEW IF EXISTS `package_statistics`;

-- Drop all tables (in reverse order of dependencies)
DROP TABLE IF EXISTS `admin_activity_logs`;
DROP TABLE IF EXISTS `package_dates`;
DROP TABLE IF EXISTS `package_inquiries`;
DROP TABLE IF EXISTS `package_options`;
DROP TABLE IF EXISTS `destination_inquiries`;
DROP TABLE IF EXISTS `sales_leads`;
DROP TABLE IF EXISTS `import_history`;
DROP TABLE IF EXISTS `marketing_campaigns`;
DROP TABLE IF EXISTS `analytics_events`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `cms_content_blocks`;
DROP TABLE IF EXISTS `cms_sections`;
DROP TABLE IF EXISTS `cms_navigation`;
DROP TABLE IF EXISTS `cms_pages`;
DROP TABLE IF EXISTS `cms_media`;
DROP TABLE IF EXISTS `cms_site_settings`;
DROP TABLE IF EXISTS `content_pages`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `destinations`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `admin_profiles`;
DROP TABLE IF EXISTS `admin_settings`;
DROP TABLE IF EXISTS `admin_users`;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `site_settings`;

SET FOREIGN_KEY_CHECKS = 1;

-- Success message
SELECT 'Database cleaned! Now import travel.sql' AS Status;

