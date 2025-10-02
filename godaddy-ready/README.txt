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
     - $dbname = 'travel';
     - $username = 'travel';
     - $password = 'support@Passord123';

3. رفع الملفات (مهم جداً - يشمل الصور!):
   ✓ امسح كل شيء من public_html/
   ✓ ارفع كل محتويات مجلد godaddy-ready/
   ✓ تأكد من رفع:
     - .htaccess
     - مجلد images/ بالكامل (150+ صورة)
     - api-handler.php
   ✓ انتظر حتى تنتهي عملية الرفع (قد تستغرق وقتاً)

4. اختبر الصور:
   ✓ https://worldtripagency.com/images/home/logo/WonderlandLogo.svg
   ✓ https://worldtripagency.com/images/packages/imported/package-5.jpeg
   ✓ يجب أن تعمل الصور بدون 404

5. اختبر الموقع:
   ✓ https://worldtripagency.com/
   ✓ https://worldtripagency.com/packages/
   ✓ https://worldtripagency.com/custom-package/
   ✓ https://worldtripagency.com/about/

6. إنشاء حساب المدير:
   ✓ ارفع الملف create-admin.php (موجود في mysql/)
   ✓ افتحه في المتصفح مرة واحدة
   ✓ احذفه بعد الاستخدام!

⚠️ ملاحظة هامة:
إذا لم تظهر الصور، راجع ملف GODADDY_IMAGE_FIX.md

==============================================
