==============================================
تعليمات النشر على GoDaddy
==============================================

📦 الملفات جاهزة للرفع!

🔧 خطوات النشر:

1. إعداد قاعدة البيانات في cPanel:
   ✓ MySQL Databases → أنشئ قاعدة بيانات
   ✓ أنشئ مستخدم وكلمة مرور
   ✓ أعط المستخدم جميع الصلاحيات
   ✓ phpMyAdmin → استورد mysql/schema.sql
   ✓ شغّل clean-navigation.sql

2. تحديث بيانات قاعدة البيانات:
   ✓ افتح api-handler.php
   ✓ حدّث:
     - YOUR_DATABASE_NAME
     - YOUR_DATABASE_USER
     - YOUR_DATABASE_PASSWORD

3. رفع الملفات:
   ✓ امسح كل شيء من public_html/
   ✓ ارفع كل محتويات مجلد godaddy-ready/
   ✓ تأكد من رفع .htaccess

4. اختبر الموقع:
   ✓ https://worldtripagency.com/
   ✓ https://worldtripagency.com/packages/
   ✓ https://worldtripagency.com/custom-package/
   ✓ https://worldtripagency.com/about/

5. إنشاء حساب المدير:
   ✓ ارفع الملف create-admin.php (موجود في mysql/)
   ✓ افتحه في المتصفح مرة واحدة
   ✓ احذفه بعد الاستخدام!

==============================================
