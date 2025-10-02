# 🚀 دليل رفع الموقع على Railway (مجاني)

## 🎯 لماذا Railway؟

- ✅ **مجاني تماماً** - $5 رصيد شهري
- ✅ **دعم كامل** - Node.js, MySQL, PostgreSQL
- ✅ **ربط دومين** - مجاني مع SSL
- ✅ **قاعدة بيانات** - PostgreSQL مجاني
- ✅ **رفع ملفات** - يعمل بدون مشاكل
- ✅ **سهولة الاستخدام** - مثل Vercel تماماً
- ✅ **أداء ممتاز** - سريع وموثوق

## 📋 خطوات الرفع:

### 1. إنشاء حساب Railway
1. اذهب إلى: https://railway.app
2. اضغط "Login" → "GitHub"
3. سجل دخول بحساب GitHub

### 2. ربط المشروع
1. اضغط "New Project"
2. اختر "Deploy from GitHub repo"
3. اختر مشروع `TravelinAgency`
4. اضغط "Deploy"

### 3. إضافة قاعدة البيانات
1. في المشروع، اضغط "+ New"
2. اختر "Database" → "PostgreSQL"
3. انتظر حتى يتم إنشاء قاعدة البيانات

### 4. إعداد متغيرات البيئة
1. اضغط على المشروع الرئيسي
2. اذهب إلى "Variables" tab
3. أضف المتغيرات التالية:

```env
# Database (PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# أو استخدم متغيرات منفصلة:
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Site
PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
PORT=3000
```

### 5. ربط الدومين
1. اذهب إلى "Settings" → "Domains"
2. اضغط "Custom Domain"
3. أدخل دومينك (مثل: `yourdomain.com`)
4. اتبع التعليمات لإعداد DNS

### 6. إعداد DNS
في لوحة تحكم دومينك، أضف:
```
Type: CNAME
Name: www
Value: your-project.railway.app

Type: A
Name: @
Value: [IP Address من Railway]
```

## 🔧 إعداد قاعدة البيانات:

### تحويل من MySQL إلى PostgreSQL:

1. **تثبيت pg:**
```bash
npm install pg
```

2. **تحديث ملف database utility:**
```javascript
// utils/database.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const executeQuery = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
};
```

## 🎉 النتيجة النهائية:

بعد اتباع هذه الخطوات:
- ✅ موقعك سيعمل على: `https://your-domain.com`
- ✅ قاعدة بيانات PostgreSQL مجانية
- ✅ SSL تلقائي
- ✅ رفع الملفات يعمل
- ✅ جميع الميزات تعمل
- ✅ **مجاني تماماً!**

## 🆘 الدعم:

إذا واجهت أي مشاكل:
1. تحقق من logs في Railway dashboard
2. تحقق من متغيرات البيئة
3. تأكد من إعداد DNS بشكل صحيح

## 💡 نصائح إضافية:

- **النسخ الاحتياطي:** Railway يحفظ نسخ احتياطية تلقائياً
- **المراقبة:** استخدم Railway dashboard لمراقبة الأداء
- **التوسع:** يمكنك الترقية لاحقاً إذا احتجت موارد أكثر

## 🔄 بدائل أخرى مجانية:

### Render.com:
- مجاني مع قيود بسيطة
- دعم Node.js كامل
- PostgreSQL مجاني

### Fly.io:
- $5 رصيد شهري مجاني
- أداء ممتاز
- دعم جميع التقنيات

### Netlify:
- مجاني للمواقع الثابتة
- يمكن ربطه بـ serverless functions

## 🎯 التوصية:

**Railway هو الأفضل** لأنه:
- مجاني تماماً
- سهل الاستخدام مثل Vercel
- يدعم كل ما تحتاجه
- أداء ممتاز
