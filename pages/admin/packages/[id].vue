<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">عرض الحزمة السياحية</h1>
        <p class="mt-1 text-sm text-gray-600">تفاصيل الحزمة السياحية</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
        <NuxtLink
          :to="`/admin/packages/${packageId}/edit`"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Icon name="material-symbols:edit" class="h-5 w-5 ml-2" />
          تحرير
        </NuxtLink>
        <NuxtLink
          to="/admin/packages"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة
        </NuxtLink>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
      <span class="mr-3 text-gray-600">جارٍ تحميل الحزمة...</span>
    </div>

    <!-- تفاصيل الحزمة -->
    <div v-else-if="packageData" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- صورة الحزمة -->
      <div class="h-64 bg-gray-200 relative">
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

      <!-- محتوى الحزمة -->
      <div class="p-6">
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
                حذف الحزمة
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

    <!-- حالة عدم وجود الحزمة -->
    <div v-else class="text-center py-12">
      <Icon name="material-symbols:package-2-outline" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">الحزمة غير موجودة</h3>
      <p class="text-gray-500 mb-6">لم يتم العثور على الحزمة المطلوبة</p>
      <NuxtLink
        to="/admin/packages"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
        العودة إلى الحزم
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// الحصول على معرف الحزمة من الرابط
const route = useRoute()
const packageId = route.params.id

// المتغيرات التفاعلية
const packageData = ref(null)
const loading = ref(true)

// تحميل بيانات الحزمة
const loadPackage = async () => {
  try {
    loading.value = true
    const result = await $fetch(`/api/packages/${packageId}`)
    packageData.value = result?.package || result
  } catch (error) {
    console.error('خطأ في تحميل الحزمة:', error)
    packageData.value = null
  } finally {
    loading.value = false
  }
}

// تغيير حالة الحزمة
const togglePackageStatus = async () => {
  if (!packageData.value) return
  
  try {
    const newStatus = packageData.value.status === 'active' ? 'inactive' : 'active'
    
    // TODO: Add API endpoint for updating package status
    packageData.value.status = newStatus
    
    console.log(`تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} الحزمة بنجاح`)
  } catch (error) {
    console.error('خطأ في تغيير حالة الحزمة:', error)
  }
}

// حذف الحزمة
const deletePackage = async () => {
  if (!confirm('هل أنت متأكد من حذف هذه الحزمة؟ لا يمكن التراجع عن هذا الإجراء.')) return

  try {
    // TODO: Add API endpoint for deleting packages
    await $fetch(`/api/packages/${packageId}`, { method: 'DELETE' })
    
    console.log('تم حذف الحزمة بنجاح')
    await navigateTo('/admin/packages')
  } catch (error) {
    console.error('خطأ في حذف الحزمة:', error)
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
  title: `عرض الحزمة - Wonder Land Admin`,
  meta: [
    { name: 'description', content: 'عرض تفاصيل الحزمة السياحية' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
