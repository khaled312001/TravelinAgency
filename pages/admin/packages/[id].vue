<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">عرض الباقة السياحية</h1>
        <p class="mt-1 text-sm text-gray-600">تفاصيل الباقة السياحية</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <!-- أزرار وضع العرض -->
        <template v-if="!isEditing">
          <button
            @click="enableEditMode"
            class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon name="material-symbols:edit" class="h-5 w-5 ml-2" />
            تحرير
          </button>
          <NuxtLink
            to="/admin/packages"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
            العودة للقائمة
          </NuxtLink>
        </template>
        
        <!-- أزرار وضع التعديل -->
        <template v-else>
          <button
            @click="saveChanges"
            :disabled="updateLoading"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon v-if="updateLoading" name="material-symbols:progress-activity" class="animate-spin h-5 w-5 ml-2" />
            <Icon v-else name="material-symbols:save" class="h-5 w-5 ml-2" />
            {{ updateLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
          </button>
          <button
            @click="cancelEdit"
            :disabled="updateLoading"
            class="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="material-symbols:close" class="h-5 w-5 ml-2" />
            إلغاء
          </button>
        </template>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل الباقة...</span>
    </div>

    <!-- تفاصيل الباقة -->
    <div v-else-if="packageData" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- صورة الباقة -->
      <div v-if="!isEditing" class="h-64 bg-gray-200 relative">
        <img 
          v-if="packageData.image || packageData.image_url"
          :src="packageData.image || packageData.image_url" 
          :alt="packageData.title_ar || packageData.title_en"
          class="w-full h-full object-cover"
        />
        <div v-else class="flex items-center justify-center h-full">
          <Icon name="material-symbols:image" class="h-16 w-16 text-gray-400" />
        </div>
      </div>
      
      <!-- نموذج التعديل -->
      <div v-if="isEditing" class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- العمود الرئيسي -->
          <div class="lg:col-span-2 space-y-6">
            <!-- العنوان -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">العنوان (عربي)</label>
                <input
                  v-model="form.title_ar"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل العنوان بالعربية"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">العنوان (إنجليزي)</label>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">الوصف (عربي)</label>
                <textarea
                  v-model="form.description_ar"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل الوصف بالعربية"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الوصف (إنجليزي)</label>
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

            <!-- السعر والمدة -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">السعر (ريال)</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">عدد الأيام</label>
                <input
                  v-model.number="form.duration_days"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>

            <!-- الفترة والعدد الأقصى -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">فترة السفر</label>
                <input
                  v-model="form.travel_period"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="يناير 2024"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">العدد الأقصى للأشخاص</label>
                <input
                  v-model.number="form.max_persons"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>

            <!-- الفئة والحالة -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  v-model="form.category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="domestic">محلي</option>
                  <option value="international">عالمي</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>

            <!-- مميز -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="form.featured"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="mr-2 text-sm font-medium text-gray-700">باقة مميزة</span>
              </label>
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
                    placeholder="أدخل الميزة"
                  />
                  <button
                    v-if="form.features.length > 1"
                    @click="removeFeature(index)"
                    type="button"
                    class="p-2 text-red-600 hover:text-red-800"
                  >
                    <Icon name="material-symbols:delete" class="h-5 w-5" />
                  </button>
                </div>
                <button
                  @click="addFeature"
                  type="button"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + إضافة ميزة
                </button>
              </div>
            </div>

            <!-- البرنامج -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البرنامج</label>
              <div class="space-y-2">
                <div v-for="(item, index) in form.itinerary" :key="index" class="flex items-center space-x-2 space-x-reverse">
                  <input
                    v-model="form.itinerary[index]"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل عنصر البرنامج"
                  />
                  <button
                    v-if="form.itinerary.length > 1"
                    @click="removeItinerary(index)"
                    type="button"
                    class="p-2 text-red-600 hover:text-red-800"
                  >
                    <Icon name="material-symbols:delete" class="h-5 w-5" />
                  </button>
                </div>
                <button
                  @click="addItinerary"
                  type="button"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + إضافة عنصر برنامج
                </button>
              </div>
            </div>

            <!-- ما هو شامل -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ما هو شامل</label>
              <div class="space-y-2">
                <div v-for="(item, index) in form.included" :key="index" class="flex items-center space-x-2 space-x-reverse">
                  <input
                    v-model="form.included[index]"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل ما هو شامل"
                  />
                  <button
                    v-if="form.included.length > 1"
                    @click="removeIncluded(index)"
                    type="button"
                    class="p-2 text-red-600 hover:text-red-800"
                  >
                    <Icon name="material-symbols:delete" class="h-5 w-5" />
                  </button>
                </div>
                <button
                  @click="addIncluded"
                  type="button"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + إضافة عنصر شامل
                </button>
              </div>
            </div>

            <!-- ما هو غير شامل -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ما هو غير شامل</label>
              <div class="space-y-2">
                <div v-for="(item, index) in form.excluded" :key="index" class="flex items-center space-x-2 space-x-reverse">
                  <input
                    v-model="form.excluded[index]"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل ما هو غير شامل"
                  />
                  <button
                    v-if="form.excluded.length > 1"
                    @click="removeExcluded(index)"
                    type="button"
                    class="p-2 text-red-600 hover:text-red-800"
                  >
                    <Icon name="material-symbols:delete" class="h-5 w-5" />
                  </button>
                </div>
                <button
                  @click="addExcluded"
                  type="button"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + إضافة عنصر غير شامل
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- محتوى الباقة (وضع العرض فقط) -->
      <div v-if="!isEditing" class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- المعلومات الأساسية -->
          <div class="lg:col-span-2 space-y-6">
            <!-- العنوان -->
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">
                {{ packageData.title_ar || packageData.title_en || packageData.title }}
              </h2>
              <p v-if="packageData.title_en && packageData.title_ar" class="text-lg text-gray-600">
                {{ packageData.title_en }}
              </p>
            </div>

            <!-- الوصف -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">الوصف</h3>
              <div class="prose max-w-none">
                <p class="text-gray-700 leading-relaxed">
                  {{ packageData.description_ar || packageData.description_en || packageData.description }}
                </p>
              </div>
            </div>

            <!-- المميزات -->
            <div v-if="packageData.features && packageData.features.length > 0">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">المميزات</h3>
              <ul class="space-y-2">
                <li v-for="feature in packageData.features" :key="feature" class="flex items-center">
                  <Icon name="material-symbols:check-circle" class="h-5 w-5 text-green-500 ml-2" />
                  <span class="text-gray-700">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- المعلومات الجانبية -->
          <div class="space-y-6">
            <!-- السعر -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">السعر</h3>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatPrice(packageData.price) }}
              </p>
              <p class="text-sm text-blue-700 mt-1">للشخص الواحد</p>
            </div>

            <!-- التفاصيل -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">تفاصيل الرحلة</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">المدة:</span>
                  <span class="font-medium">{{ packageData.duration || packageData.duration_days }} أيام</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">الوجهة:</span>
                  <span class="font-medium">{{ packageData.location || packageData.travel_period }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">الفئة:</span>
                  <span :class="getCategoryColor(packageData.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getCategoryName(packageData.category) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">الحالة:</span>
                  <span :class="getStatusColor(packageData.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusName(packageData.status) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">الحد الأقصى:</span>
                  <span class="font-medium">{{ packageData.max_persons || packageData.max_guests || 10 }} أشخاص</span>
                </div>
              </div>
            </div>

            <!-- الإجراءات -->
            <div class="space-y-3">
              <button
                @click="togglePackageStatus"
                :class="packageData.status === 'active' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'"
                class="w-full px-4 py-2 text-white rounded-lg transition-colors"
              >
                <Icon :name="packageData.status === 'active' ? 'material-symbols:pause' : 'material-symbols:play-arrow'" class="h-5 w-5 ml-2 inline" />
                {{ packageData.status === 'active' ? 'إلغاء التفعيل' : 'تفعيل' }}
              </button>
              
              <button
                @click="deletePackage"
                class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Icon name="material-symbols:delete" class="h-5 w-5 ml-2 inline" />
                حذف الباقة
              </button>
            </div>
          </div>
        </div>

        <!-- البرنامج اليومي -->
        <div v-if="packageData.itinerary && packageData.itinerary.length > 0" class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">البرنامج اليومي</h3>
          <div class="space-y-4">
            <div v-for="(day, index) in packageData.itinerary" :key="index" class="border-l-4 border-blue-500 pl-4">
              <h4 class="font-medium text-gray-900">اليوم {{ index + 1 }}</h4>
              <p class="text-gray-700 mt-1">{{ day }}</p>
            </div>
          </div>
        </div>

        <!-- ما يشمل وما لا يشمل -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <!-- ما يشمل -->
          <div v-if="packageData.included && packageData.included.length > 0">
            <h3 class="text-lg font-semibold text-green-900 mb-3">ما يشمل</h3>
            <ul class="space-y-2">
              <li v-for="item in packageData.included" :key="item" class="flex items-center">
                <Icon name="material-symbols:check-circle" class="h-5 w-5 text-green-500 ml-2" />
                <span class="text-gray-700">{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- ما لا يشمل -->
          <div v-if="packageData.excluded && packageData.excluded.length > 0">
            <h3 class="text-lg font-semibold text-red-900 mb-3">ما لا يشمل</h3>
            <ul class="space-y-2">
              <li v-for="item in packageData.excluded" :key="item" class="flex items-center">
                <Icon name="material-symbols:cancel" class="h-5 w-5 text-red-500 ml-2" />
                <span class="text-gray-700">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- حالة عدم وجود الباقة -->
    <div v-else class="text-center py-12">
      <Icon name="material-symbols:package-2-outline" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">الباقة غير موجودة</h3>
      <p class="text-gray-500 mb-6">لم يتم العثور على الباقة المطلوبة</p>
      <NuxtLink
        to="/admin/packages"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
        العودة إلى الباقات
      </NuxtLink>
    </div>
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

// الحصول على معرف الباقة من الرابط
const route = useRoute()
const packageId = route.params.id

// المتغيرات التفاعلية
const packageData = ref(null)
const loading = ref(true)
const isEditing = ref(false)
const updateLoading = ref(false)
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

// تحميل بيانات الباقة
const loadPackage = async () => {
  try {
    loading.value = true
    console.log('🔄 Loading package with ID:', packageId)
    const result = await $fetch(`/api/packages/${packageId}`)
    console.log('✅ Package data loaded:', result)
    packageData.value = result?.package || result
    
    // تعبئة النموذج للتحرير
    if (packageData.value) {
      form.value = {
        title_ar: packageData.value.title_ar || '',
        title_en: packageData.value.title_en || '',
        description_ar: packageData.value.description_ar || '',
        description_en: packageData.value.description_en || '',
        price: packageData.value.price || 0,
        duration_days: packageData.value.duration_days || 1,
        travel_period: packageData.value.travel_period || packageData.value.location || '',
        max_persons: packageData.value.max_persons || 10,
        category: packageData.value.category || 'domestic',
        status: packageData.value.status || 'active',
        featured: packageData.value.featured || false,
        image_url: packageData.value.image_url || packageData.value.image || '',
        features: packageData.value.features && packageData.value.features.length > 0 ? packageData.value.features : [''],
        itinerary: packageData.value.itinerary && packageData.value.itinerary.length > 0 ? packageData.value.itinerary : [''],
        included: packageData.value.included && packageData.value.included.length > 0 ? packageData.value.included : [''],
        excluded: packageData.value.excluded && packageData.value.excluded.length > 0 ? packageData.value.excluded : ['']
      }
    }
  } catch (error) {
    console.error('❌ خطأ في تحميل الباقة:', error)
    packageData.value = null
  } finally {
    loading.value = false
  }
}

// تفعيل وضع التعديل
const enableEditMode = () => {
  isEditing.value = true
}

// إلغاء التعديل
const cancelEdit = () => {
  isEditing.value = false
  // إعادة تعبئة النموذج من البيانات الأصلية
  if (packageData.value) {
    form.value = {
      title_ar: packageData.value.title_ar || '',
      title_en: packageData.value.title_en || '',
      description_ar: packageData.value.description_ar || '',
      description_en: packageData.value.description_en || '',
      price: packageData.value.price || 0,
      duration_days: packageData.value.duration_days || 1,
      travel_period: packageData.value.travel_period || packageData.value.location || '',
      max_persons: packageData.value.max_persons || 10,
      category: packageData.value.category || 'domestic',
      status: packageData.value.status || 'active',
      featured: packageData.value.featured || false,
      image_url: packageData.value.image_url || packageData.value.image || '',
      features: packageData.value.features && packageData.value.features.length > 0 ? packageData.value.features : [''],
      itinerary: packageData.value.itinerary && packageData.value.itinerary.length > 0 ? packageData.value.itinerary : [''],
      included: packageData.value.included && packageData.value.included.length > 0 ? packageData.value.included : [''],
      excluded: packageData.value.excluded && packageData.value.excluded.length > 0 ? packageData.value.excluded : ['']
    }
  }
}

// حفظ التغييرات
const saveChanges = async () => {
  const { showSuccess, showError, showWarning } = useNotifications()
  
  try {
    updateLoading.value = true
    
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
    
    const result = await $fetch(`/api/packages/${packageId}`, {
      method: 'PUT',
      body: cleanData
    })
    
    if (result.success) {
      showSuccess('تم التحديث بنجاح', 'تم تحديث الباقة بنجاح!')
      // تحديث البيانات المحلية
      packageData.value = { ...packageData.value, ...cleanData }
      isEditing.value = false
    } else {
      showError('فشل في التحديث', 'فشل في تحديث الباقة. يرجى المحاولة مرة أخرى.')
    }
  } catch (error) {
    console.error('خطأ في تحديث الباقة:', error)
    showError('خطأ في التحديث', 'حدث خطأ في تحديث الباقة. يرجى المحاولة مرة أخرى.')
  } finally {
    updateLoading.value = false
  }
}

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

// دوال إدارة المميزات
const addFeature = () => {
  form.value.features.push('')
}

const removeFeature = (index) => {
  if (form.value.features.length > 1) {
    form.value.features.splice(index, 1)
  }
}

// دوال إدارة البرنامج
const addItinerary = () => {
  form.value.itinerary.push('')
}

const removeItinerary = (index) => {
  if (form.value.itinerary.length > 1) {
    form.value.itinerary.splice(index, 1)
  }
}

// دوال إدارة ما هو شامل
const addIncluded = () => {
  form.value.included.push('')
}

const removeIncluded = (index) => {
  if (form.value.included.length > 1) {
    form.value.included.splice(index, 1)
  }
}

// دوال إدارة ما هو غير شامل
const addExcluded = () => {
  form.value.excluded.push('')
}

const removeExcluded = (index) => {
  if (form.value.excluded.length > 1) {
    form.value.excluded.splice(index, 1)
  }
}

// تغيير حالة الباقة
const togglePackageStatus = async () => {
  if (!packageData.value) return
  
  try {
    const newStatus = packageData.value.status === 'active' ? 'inactive' : 'active'
    
    // TODO: Add API endpoint for updating package status
    packageData.value.status = newStatus
    
    console.log(`تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} الباقة بنجاح`)
  } catch (error) {
    console.error('خطأ في تغيير حالة الباقة:', error)
  }
}

// حذف الباقة
const deletePackage = async () => {
  if (!confirm('هل أنت متأكد من حذف هذه الباقة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    // TODO: Add API endpoint for deleting packages
    await $fetch(`/api/packages/${packageId}`, { method: 'DELETE' })
    
    console.log('تم حذف الباقة بنجاح')
    await navigateTo('/admin/packages')
  } catch (error) {
    console.error('خطأ في حذف الباقة:', error)
  }
}

// دوال المساعدة
const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price)
}

const getCategoryName = (category) => {
  const categories = {
    domestic: 'محلي',
    international: 'دولي',
    religious: 'ديني',
    adventure: 'مغامرة'
  }
  return categories[category] || category
}

const getCategoryColor = (category) => {
  const colors = {
    domestic: 'bg-blue-100 text-blue-800',
    international: 'bg-green-100 text-green-800',
    religious: 'bg-purple-100 text-purple-800',
    adventure: 'bg-orange-100 text-orange-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const getStatusName = (status) => {
  const statuses = {
    active: 'نشط',
    inactive: 'غير نشط',
    draft: 'مسودة'
  }
  return statuses[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    draft: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadPackage()
})

// SEO والميتا
useHead({
  title: `عرض الباقة - Wonder Land Admin`,
  meta: [
    { name: 'description', content: 'عرض تفاصيل الباقة السياحية' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
