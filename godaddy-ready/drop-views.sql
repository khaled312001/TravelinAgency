-- Force drop all views before importing
-- Run this in phpMyAdmin first, then import travel.sql

SET FOREIGN_KEY_CHECKS = 0;

-- Drop views if they exist
DROP VIEW IF EXISTS `destination_statistics`;
DROP VIEW IF EXISTS `monthly_inquiry_statistics`;
DROP VIEW IF EXISTS `package_statistics`;

SET FOREIGN_KEY_CHECKS = 1;

-- Success message
SELECT 'All views dropped successfully!' AS Status;

