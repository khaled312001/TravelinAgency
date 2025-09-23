<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إضافة وجهة سياحية جديدة</h1>
        <p class="mt-1 text-sm text-gray-600">إنشاء وجهة سياحية جديدة</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/destinations"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة
        </NuxtLink>
      </div>
    </div>

    <!-- نموذج الإنشاء -->
    <form @submit.prevent="createDestination" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- العمود الرئيسي -->
          <div class="lg:col-span-2 space-y-6">
            <!-- المعلومات الأساسية -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">اسم الوجهة (عربي) *</label>
                <input
                  v-model="form.name_ar"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسم الوجهة بالعربية"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">اسم الوجهة (إنجليزي) *</label>
                <input
                  v-model="form.name_en"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter destination name in English"
                />
              </div>
            </div>

            <!-- الوصف -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الوصف (عربي) *</label>
                <textarea
                  v-model="form.description_ar"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل وصف الوجهة بالعربية"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الوصف (إنجليزي) *</label>
                <textarea
                  v-model="form.description_en"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter destination description in English"
                ></textarea>
              </div>
            </div>

            <!-- الموقع -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">البلد *</label>
                <input
                  v-model="form.country"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="البلد"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">المدينة *</label>
                <input
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="المدينة"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                <input
                  v-model="form.region"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="المنطقة"
                />
              </div>
            </div>

            <!-- صورة الوجهة -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">صورة الوجهة الرئيسية</label>
              <div class="space-y-4">
                <!-- رفع الصورة -->
                <div class="flex items-center justify-center w-full">
                  <label for="image-upload" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <Icon name="material-symbols:cloud-upload" class="w-8 h-8 mb-2 text-gray-500" />
                      <p class="mb-2 text-sm text-gray-500">
                        <span class="font-semibold">انقر لرفع صورة</span> أو اسحب وأفلت
                      </p>
                      <p class="text-xs text-gray-500">PNG, JPG أو JPEG (MAX. 10MB)</p>
                    </div>
                    <input 
                      id="image-upload" 
                      type="file" 
                      accept="image/*" 
                      @change="handleImageUpload"
                      class="hidden"
                    />
                  </label>
                </div>
                
                <!-- معاينة الصورة -->
                <div v-if="form.image_url || imagePreview" class="mt-4">
                  <img 
                    :src="imagePreview || form.image_url" 
                    alt="معاينة الصورة" 
                    class="h-32 w-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    @click="removeImage"
                    class="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    إزالة الصورة
                  </button>
                </div>
              </div>
            </div>

            <!-- المميزات -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">المميزات</label>
              <div class="space-y-2">
                <div v-for="(feature, index) in form.features" :key="index" class="flex items-center space-x-2 space-x-reverse">
                  <input
                    v-model="form.features[index]"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :placeholder="`الميزة ${index + 1}`"
                  />
                  <button
                    type="button"
                    @click="removeFeature(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Icon name="material-symbols:delete" class="h-5 w-5" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="addFeature"
                  class="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Icon name="material-symbols:add" class="h-4 w-4 ml-1" />
                  إضافة ميزة
                </button>
              </div>
            </div>

            <!-- معلومات إضافية -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">معلومات إضافية</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">أفضل وقت للزيارة</label>
                  <input
                    v-model="form.best_time_to_visit"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: من أكتوبر إلى مارس"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">متوسط درجة الحرارة</label>
                  <input
                    v-model="form.average_temperature"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 25-35 درجة مئوية"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">اللغة المحلية</label>
                  <input
                    v-model="form.local_language"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: العربية، الإنجليزية"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">العملة المحلية</label>
                  <input
                    v-model="form.local_currency"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: ريال سعودي"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- العمود الجانبي -->
          <div class="space-y-6">
            <!-- التصنيف والحالة -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">التصنيف والحالة</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نوع الوجهة *</label>
                  <select
                    v-model="form.type"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="city">مدينة</option>
                    <option value="landmark">معلم تاريخي</option>
                    <option value="nature">طبيعة</option>
                    <option value="beach">شاطئ</option>
                    <option value="mountain">جبل</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">الحالة *</label>
                  <select
                    v-model="form.status"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="draft">مسودة</option>
                  </select>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="form.is_featured"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="mr-2 text-sm text-gray-700">وجهة مميزة</label>
                </div>
              </div>
            </div>

            <!-- SEO -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">تحسين محركات البحث</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">عنوان SEO</label>
                  <input
                    v-model="form.seo_title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="عنوان محسن لمحركات البحث"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">وصف SEO</label>
                  <textarea
                    v-model="form.seo_description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="وصف محسن لمحركات البحث"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">كلمات مفتاحية</label>
                  <input
                    v-model="form.seo_keywords"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="كلمات مفتاحية مفصولة بفواصل"
                  />
                </div>
              </div>
            </div>

            <!-- ملخص المعلومات -->
            <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h3 class="text-lg font-semibold text-blue-900 mb-3">ملخص المعلومات</h3>
              <div class="space-y-2 text-sm text-blue-800">
                <div class="flex justify-between">
                  <span>الاسم:</span>
                  <span>{{ form.name_ar || 'غير محدد' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>البلد:</span>
                  <span>{{ form.country || 'غير محدد' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>المدينة:</span>
                  <span>{{ form.city || 'غير محدد' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>النوع:</span>
                  <span>{{ getTypeName(form.type) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>الحالة:</span>
                  <span>{{ getStatusName(form.status) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>مميزة:</span>
                  <span>{{ form.is_featured ? 'نعم' : 'لا' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- أزرار الإجراءات -->
        <div class="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
          <NuxtLink
            to="/admin/destinations"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </NuxtLink>
          <button
            type="submit"
            :disabled="saving || !isFormValid"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-4 w-4 ml-2 inline" />
            {{ saving ? 'جاري الإنشاء...' : 'إنشاء الوجهة' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const saving = ref(false)
const imagePreview = ref(null)

// نموذج البيانات
const form = ref({
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  country: '',
  city: '',
  region: '',
  type: 'city',
  status: 'active',
  is_featured: false,
  image_url: '',
  features: [''],
  best_time_to_visit: '',
  average_temperature: '',
  local_language: '',
  local_currency: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: ''
})

// التحقق من صحة النموذج
const isFormValid = computed(() => {
  return form.value.name_ar && 
         form.value.name_en && 
         form.value.description_ar &&
         form.value.description_en &&
         form.value.country &&
         form.value.city
})

// رفع الصورة
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // إنشاء معاينة للصورة
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // TODO: رفع الصورة إلى الخادم
    // form.value.image_url = uploadedImageUrl
  }
}

// إزالة الصورة
const removeImage = () => {
  form.value.image_url = ''
  imagePreview.value = null
  const fileInput = document.getElementById('image-upload')
  if (fileInput) {
    fileInput.value = ''
  }
}

// إنشاء الوجهة
const createDestination = async () => {
  try {
    saving.value = true
    
    // تنظيف البيانات
    const cleanData = {
      ...form.value,
      features: form.value.features.filter(f => f.trim()),
      // تحويل is_featured إلى رقم
      is_featured: form.value.is_featured ? 1 : 0
    }
    
    const result = await $fetch('/api/destinations', {
      method: 'POST',
      body: cleanData
    })
    
    console.log('تم إنشاء الوجهة بنجاح:', result)
    await navigateTo('/admin/destinations')
  } catch (error) {
    console.error('خطأ في إنشاء الوجهة:', error)
    // يمكن إضافة إشعار خطأ هنا
  } finally {
    saving.value = false
  }
}

// دوال إدارة المميزات
const addFeature = () => {
  form.value.features.push('')
}

const removeFeature = (index) => {
  if (form.value.features.length > 1) {
    form.value.features.splice(index, 1)
  }
}

// دوال المساعدة
const getTypeName = (type) => {
  const types = {
    city: 'مدينة',
    landmark: 'معلم تاريخي',
    nature: 'طبيعة',
    beach: 'شاطئ',
    mountain: 'جبل'
  }
  return types[type] || type
}

const getStatusName = (status) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط',
    draft: 'مسودة'
  }
  return statuses[status] || status
}

// SEO والميتا
useHead({
  title: 'إضافة وجهة جديدة - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إنشاء وجهة سياحية جديدة' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
