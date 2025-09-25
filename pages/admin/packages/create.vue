<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إضافة باقة سياحية جديدة</h1>
        <p class="mt-1 text-sm text-gray-600">إنشاء حزمة سياحية جديدة</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/packages"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة
        </NuxtLink>
      </div>
    </div>

    <!-- نموذج الإنشاء -->
    <form @submit.prevent="createPackage" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- العمود الرئيسي -->
          <div class="lg:col-span-2 space-y-6">
            <!-- العنوان -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">العنوان (عربي) *</label>
                <input
                  v-model="form.title_ar"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل العنوان بالعربية"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">العنوان (إنجليزي) *</label>
                <input
                  v-model="form.title_en"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter title in English"
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
                  placeholder="أدخل الوصف بالعربية"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الوصف (إنجليزي) *</label>
                <textarea
                  v-model="form.description_en"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description in English"
                ></textarea>
              </div>
            </div>

            <!-- صورة الباقة -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">صورة الباقة</label>
              <ImageUpload
                v-model="form.image_url"
                alt="صورة الباقة"
                upload-type="package"
                @upload-complete="handleImageUploadComplete"
                @upload-error="handleImageUploadError"
              />
              <p class="mt-2 text-xs text-gray-500">
                يمكنك رفع صورة JPG, PNG, JPEG بحجم أقصى 5MB
              </p>
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

            <!-- البرنامج اليومي -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البرنامج اليومي</label>
              <div class="space-y-2">
                <div v-for="(day, index) in form.itinerary" :key="index" class="flex items-center space-x-2 space-x-reverse">
                  <span class="text-sm font-medium text-gray-600 w-16">اليوم {{ index + 1 }}:</span>
                  <input
                    v-model="form.itinerary[index]"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :placeholder="`نشاط اليوم ${index + 1}`"
                  />
                  <button
                    type="button"
                    @click="removeItineraryDay(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Icon name="material-symbols:delete" class="h-5 w-5" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="addItineraryDay"
                  class="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Icon name="material-symbols:add" class="h-4 w-4 ml-1" />
                  إضافة يوم
                </button>
              </div>
            </div>
          </div>

          <!-- العمود الجانبي -->
          <div class="space-y-6">
            <!-- السعر والمدة -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">التفاصيل الأساسية</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">السعر (ريال سعودي) *</label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">المدة (أيام) *</label>
                  <input
                    v-model.number="form.duration_days"
                    type="number"
                    min="1"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">الوجهة</label>
                  <input
                    v-model="form.travel_period"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: دبي، تركيا، ماليزيا"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للأشخاص</label>
                  <input
                    v-model.number="form.max_persons"
                    type="number"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- الفئة والحالة -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">التصنيف</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">الفئة *</label>
                  <select
                    v-model="form.category"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="domestic">محلي</option>
                    <option value="international">دولي</option>
                    <option value="religious">ديني</option>
                    <option value="adventure">مغامرة</option>
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
                    v-model="form.featured"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="mr-2 text-sm text-gray-700">حزمة مميزة</label>
                </div>
              </div>
            </div>

            <!-- ما يشمل وما لا يشمل -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">التفاصيل الإضافية</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ما يشمل</label>
                  <div class="space-y-2">
                    <div v-for="(item, index) in form.included" :key="index" class="flex items-center space-x-2 space-x-reverse">
                      <input
                        v-model="form.included[index]"
                        type="text"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        :placeholder="`البند ${index + 1}`"
                      />
                      <button
                        type="button"
                        @click="removeIncludedItem(index)"
                        class="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Icon name="material-symbols:delete" class="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addIncludedItem"
                      class="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Icon name="material-symbols:add" class="h-3 w-3 ml-1" />
                      إضافة
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ما لا يشمل</label>
                  <div class="space-y-2">
                    <div v-for="(item, index) in form.excluded" :key="index" class="flex items-center space-x-2 space-x-reverse">
                      <input
                        v-model="form.excluded[index]"
                        type="text"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        :placeholder="`البند ${index + 1}`"
                      />
                      <button
                        type="button"
                        @click="removeExcludedItem(index)"
                        class="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Icon name="material-symbols:delete" class="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addExcludedItem"
                      class="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Icon name="material-symbols:add" class="h-3 w-3 ml-1" />
                      إضافة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- أزرار الإجراءات -->
        <div class="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
          <NuxtLink
            to="/admin/packages"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </NuxtLink>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Icon v-if="saving" name="material-symbols:progress-activity" class="animate-spin h-4 w-4 ml-2 inline" />
            {{ saving ? 'جاري الإنشاء...' : 'إنشاء الباقة' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
// Import components
import ImageUpload from '~/components/ui/ImageUpload.vue'

// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const saving = ref(false)

// نموذج البيانات
const form = ref({
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  price: 0,
  duration_days: 1,
  travel_period: '',
  max_persons: 10,
  category: 'domestic',
  status: 'active',
  featured: false,
  image_url: '',
  features: [''],
  itinerary: [''],
  included: [''],
  excluded: ['']
})

// معالجة رفع الصورة بنجاح
const handleImageUploadComplete = (fileInfo) => {
  const { showSuccess } = useNotifications()
  showSuccess('تم رفع الصورة', 'تم رفع الصورة بنجاح!')
}

// معالجة خطأ رفع الصورة
const handleImageUploadError = (error) => {
  const { showError } = useNotifications()
  showError('خطأ في رفع الصورة', error.message || 'حدث خطأ في رفع الصورة')
}

// إنشاء الباقة
const createPackage = async () => {
  const { showSuccess, showError, showWarning } = useNotifications()
  
  try {
    saving.value = true
    
    // التحقق من صحة البيانات
    if (!form.value.title_ar || !form.value.title_en || !form.value.description_ar || !form.value.description_en) {
      showWarning('حقول مطلوبة', 'يرجى ملء جميع الحقول المطلوبة')
      return
    }
    
    // تنظيف البيانات
    const cleanData = {
      ...form.value,
      features: form.value.features.filter(f => f.trim()),
      itinerary: form.value.itinerary.filter(i => i.trim()),
      included: form.value.included.filter(i => i.trim()),
      excluded: form.value.excluded.filter(e => e.trim())
    }
    
    const result = await $fetch('/api/packages', {
      method: 'POST',
      body: cleanData
    })
    
    console.log('✅ Create package result:', result)
    
    if (result.success && result.package) {
      showSuccess('تم الإنشاء بنجاح', 'تم إنشاء الباقة بنجاح!')
      console.log('🚀 Navigating to:', `/admin/packages/${result.package.id}`)
      await navigateTo(`/admin/packages/${result.package.id}`)
    } else {
      showError('فشل في الإنشاء', 'فشل في إنشاء الباقة. يرجى المحاولة مرة أخرى.')
    }
  } catch (error) {
    console.error('خطأ في إنشاء الباقة:', error)
    showError('خطأ في الإنشاء', 'حدث خطأ في إنشاء الباقة. يرجى المحاولة مرة أخرى.')
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

// دوال إدارة البرنامج اليومي
const addItineraryDay = () => {
  form.value.itinerary.push('')
}

const removeItineraryDay = (index) => {
  if (form.value.itinerary.length > 1) {
    form.value.itinerary.splice(index, 1)
  }
}

// دوال إدارة ما يشمل
const addIncludedItem = () => {
  form.value.included.push('')
}

const removeIncludedItem = (index) => {
  if (form.value.included.length > 1) {
    form.value.included.splice(index, 1)
  }
}

// دوال إدارة ما لا يشمل
const addExcludedItem = () => {
  form.value.excluded.push('')
}

const removeExcludedItem = (index) => {
  if (form.value.excluded.length > 1) {
    form.value.excluded.splice(index, 1)
  }
}

// SEO والميتا
useHead({
  title: 'إضافة باقة جديدة - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'إنشاء حزمة سياحية جديدة' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
