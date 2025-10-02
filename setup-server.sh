#!/bin/bash

# دليل إعداد الخادم لموقع TravelinAgency
# DigitalOcean Ubuntu 22.04 LTS

echo "🚀 بدء إعداد الخادم لموقع TravelinAgency..."

# تحديث النظام
echo "📦 تحديث النظام..."
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 18
echo "📦 تثبيت Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت MySQL
echo "🗄️ تثبيت MySQL..."
sudo apt install mysql-server -y

# تثبيت Nginx
echo "🌐 تثبيت Nginx..."
sudo apt install nginx -y

# تثبيت PM2
echo "⚡ تثبيت PM2..."
sudo npm install -g pm2

# تثبيت Git
echo "📁 تثبيت Git..."
sudo apt install git -y

# إنشاء مجلد الموقع
echo "📂 إنشاء مجلد الموقع..."
sudo mkdir -p /var/www/travelin-agency
sudo chown $USER:$USER /var/www/travelin-agency

# إعداد MySQL
echo "🗄️ إعداد MySQL..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS travel;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'travel'@'localhost' IDENTIFIED BY 'TravelAgency2024!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON travel.* TO 'travel'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# إعداد MySQL للوصول الآمن
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'RootPassword2024!';"
sudo mysql -e "FLUSH PRIVILEGES;"

# تفعيل MySQL
sudo systemctl enable mysql
sudo systemctl start mysql

# تفعيل Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# إعداد Firewall
echo "🔥 إعداد Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ تم إعداد الخادم بنجاح!"
echo ""
echo "📋 معلومات الاتصال:"
echo "Database: travel"
echo "DB User: travel"
echo "DB Password: TravelAgency2024!"
echo "Root Password: RootPassword2024!"
echo ""
echo "📁 مجلد الموقع: /var/www/travelin-agency"
echo ""
echo "🔧 الخطوات التالية:"
echo "1. ارفع ملفات الموقع إلى /var/www/travelin-agency"
echo "2. شغل: cd /var/www/travelin-agency && npm install"
echo "3. شغل: npm run build"
echo "4. شغل: pm2 start ecosystem.config.js"
echo "5. اضبط Nginx باستخدام nginx-config.conf"
echo ""
echo "🌐 الموقع سيعمل على: http://your-server-ip"
