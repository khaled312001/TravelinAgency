# دليل رفع الموقع على DigitalOcean

## 🎯 لماذا DigitalOcean؟

- ✅ **سهولة الاستخدام** - واجهة بسيطة
- ✅ **سعر مناسب** - $6/شهر فقط
- ✅ **دعم كامل** - Node.js, MySQL, PHP
- ✅ **أداء ممتاز** - خوادم سريعة
- ✅ **دعم عربي** - وثائق بالعربية

## 📋 خطوات الرفع:

### 1. إنشاء حساب DigitalOcean
1. اذهب إلى: https://www.digitalocean.com
2. سجل حساب جديد
3. أضف بطاقة ائتمان (مطلوبة للتحقق)

### 2. إنشاء Droplet (خادم)
1. اضغط "Create" → "Droplets"
2. اختر:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** Basic $6/شهر (1GB RAM)
   - **Region:** أقرب منطقة لك
   - **Authentication:** SSH Key (أو Password)

### 3. إعداد الخادم
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت MySQL
sudo apt install mysql-server -y

# تثبيت Nginx
sudo apt install nginx -y

# تثبيت PM2 لإدارة التطبيقات
sudo npm install -g pm2
```

### 4. رفع الملفات
```bash
# إنشاء مجلد للموقع
sudo mkdir -p /var/www/travelin-agency
sudo chown $USER:$USER /var/www/travelin-agency

# رفع الملفات (استخدم FileZilla أو SCP)
# أو استخدم Git:
cd /var/www/travelin-agency
git clone https://github.com/khaled312001/TravelinAgency.git .
```

### 5. إعداد قاعدة البيانات
```bash
# تسجيل الدخول لـ MySQL
sudo mysql

# إنشاء قاعدة بيانات
CREATE DATABASE travel;
CREATE USER 'travel'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON travel.* TO 'travel'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 6. إعداد متغيرات البيئة
```bash
# إنشاء ملف .env
nano /var/www/travelin-agency/.env
```

أضف المحتوى التالي:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=travel
DB_PASSWORD=your_password
DB_NAME=travel

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Site
PUBLIC_SITE_URL=http://your-server-ip
NODE_ENV=production
```

### 7. بناء وتشغيل الموقع
```bash
cd /var/www/travelin-agency

# تثبيت المتطلبات
npm install

# بناء الموقع
npm run build

# تشغيل الموقع
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 8. إعداد Nginx
```bash
# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/travelin-agency
```

أضف المحتوى التالي:
```nginx
server {
    listen 80;
    server_name your-domain.com your-server-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/travelin-agency /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 ملف PM2 (ecosystem.config.js)

```javascript
module.exports = {
  apps: [{
    name: 'travelin-agency',
    script: '.output/server/index.mjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

## 🎉 النتيجة النهائية

بعد اتباع هذه الخطوات:
- ✅ موقعك سيعمل على: http://your-server-ip
- ✅ قاعدة بيانات MySQL محلية
- ✅ رفع الملفات يعمل
- ✅ جميع الميزات تعمل
- ✅ تكلفة $6/شهر فقط

## 🆘 الدعم

إذا واجهت أي مشاكل:
1. تحقق من logs: `pm2 logs travelin-agency`
2. تحقق من حالة Nginx: `sudo systemctl status nginx`
3. تحقق من قاعدة البيانات: `sudo systemctl status mysql`

## 💡 نصائح إضافية

- **النسخ الاحتياطي:** استخدم `mysqldump` لنسخ قاعدة البيانات
- **SSL:** أضف شهادة SSL مجانية من Let's Encrypt
- **النطاق:** اربط نطاقك بالخادم
- **المراقبة:** استخدم `htop` لمراقبة الأداء
