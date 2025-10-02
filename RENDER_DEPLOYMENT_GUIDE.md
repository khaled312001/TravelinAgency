# 🚀 دليل رفع الموقع على Render (مجاني)

## 🎯 لماذا Render؟

- ✅ **مجاني تماماً** - مع قيود بسيطة
- ✅ **دعم كامل** - Node.js, PostgreSQL
- ✅ **ربط دومين** - مجاني مع SSL
- ✅ **قاعدة بيانات** - PostgreSQL مجاني
- ✅ **رفع ملفات** - يعمل
- ✅ **سهولة الاستخدام** - مثل Vercel
- ✅ **أداء جيد** - سريع وموثوق

## 📋 خطوات الرفع:

### 1. إنشاء حساب Render
1. اذهب إلى: https://render.com
2. اضغط "Get Started for Free"
3. سجل دخول بحساب GitHub

### 2. ربط المشروع
1. اضغط "New" → "Web Service"
2. اختر "Build and deploy from a Git repository"
3. اختر مشروع `TravelinAgency`
4. اضغط "Connect"

### 3. إعداد المشروع
1. **Name:** `travelin-agency`
2. **Environment:** `Node`
3. **Plan:** `Free`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm run start`

### 4. إضافة متغيرات البيئة
1. في قسم "Environment Variables"، أضف:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
PUBLIC_SITE_URL=https://travelinagency.onrender.com
PORT=3000
```

### 5. إضافة قاعدة البيانات
1. اضغط "New" → "PostgreSQL"
2. **Name:** `travelin-agency-db`
3. **Plan:** `Free`
4. اضغط "Create Database"

### 6. ربط قاعدة البيانات
1. في مشروعك، اذهب إلى "Environment"
2. أضف متغير:
   ```
   DATABASE_URL=[Database URL من PostgreSQL]
   ```

### 7. ربط الدومين (اختياري)
1. اذهب إلى "Settings" → "Custom Domains"
2. اضغط "Add Custom Domain"
3. أدخل دومينك
4. اتبع تعليمات DNS

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
- ✅ موقعك سيعمل على: `https://travelinagency.onrender.com`
- ✅ قاعدة بيانات PostgreSQL مجانية
- ✅ SSL تلقائي
- ✅ رفع الملفات يعمل
- ✅ جميع الميزات تعمل
- ✅ **مجاني تماماً!**

## ⚠️ قيود الخطة المجانية:

- **Sleep Mode:** الخادم ينام بعد 15 دقيقة من عدم النشاط
- **Build Time:** 90 دقيقة شهرياً
- **Bandwidth:** 100GB شهرياً
- **Memory:** 512MB

## 🆘 استكشاف الأخطاء:

### خطأ "Permission denied":
- تأكد من أن `buildCommand` هو: `npm install && npm run build`
- تأكد من أن `startCommand` هو: `npm run start`

### خطأ قاعدة البيانات:
- تأكد من إضافة `DATABASE_URL` في Environment Variables
- تأكد من أن قاعدة البيانات PostgreSQL تم إنشاؤها

### خطأ البناء:
- تحقق من logs في Render dashboard
- تأكد من أن جميع dependencies مثبتة

## 💡 نصائح إضافية:

- **Keep Alive:** استخدم خدمة مثل UptimeRobot لإبقاء الخادم نشطاً
- **النسخ الاحتياطي:** Render يحفظ نسخ احتياطية تلقائياً
- **المراقبة:** استخدم Render dashboard لمراقبة الأداء
- **التوسع:** يمكنك الترقية لاحقاً إذا احتجت موارد أكثر

## 🔄 بدائل أخرى مجانية:

### Railway:
- $5 رصيد شهري مجاني
- لا يوجد sleep mode
- أداء ممتاز

### Fly.io:
- $5 رصيد شهري مجاني
- أداء ممتاز
- دعم جميع التقنيات

### Netlify:
- مجاني للمواقع الثابتة
- يمكن ربطه بـ serverless functions

## 🎯 التوصية:

**Render جيد** لكن **Railway أفضل** لأنه:
- لا يوجد sleep mode
- أداء أفضل
- $5 رصيد شهري مجاني
