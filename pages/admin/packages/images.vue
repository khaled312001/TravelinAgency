<template>
  <div class="space-y-6">
    <!-- مساحة إضافية في الأعلى -->
    <div class="h-16"></div>
    
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة صور الباقات</h1>
        <p class="mt-1 text-sm text-gray-600">رفع وإدارة صور الباقات السياحية</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/packages"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:arrow-back" class="h-5 w-5 ml-2" />
          العودة للباقات
        </NuxtLink>
      </div>
    </div>

    <!-- رفع الصور -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">رفع صور جديدة</h2>
      
      <!-- منطقة رفع الملفات -->
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
        />
        
        <div v-if="!uploading" @click="$refs.fileInput.click()" class="cursor-pointer">
          <Icon name="material-symbols:cloud-upload" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-lg font-medium text-gray-900 mb-2">انقر لرفع الصور</p>
          <p class="text-sm text-gray-500">أو اسحب وأفلت الملفات هنا</p>
          <p class="text-xs text-gray-400 mt-2">PNG, JPG, JPEG (حد أقصى 10MB لكل صورة)</p>
        </div>
        
        <!-- حالة الرفع -->
        <div v-else class="space-y-4">
          <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600 mx-auto" />
          <p class="text-gray-600">جاري رفع {{ selectedFiles.length }} صورة...</p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>
      </div>
      
      <!-- معاينة الملفات المحددة -->
      <div v-if="selectedFiles.length > 0 && !uploading" class="mt-6">
        <h3 class="text-md font-medium text-gray-900 mb-3">الملفات المحددة ({{ selectedFiles.length }})</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="(file, index) in selectedFiles" :key="index" class="relative">
            <img
              :src="file.preview"
              :alt="file.name"
              class="w-full h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              @click="removeFile(index)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
            <p class="text-xs text-gray-600 mt-1 truncate">{{ file.name }}</p>
          </div>
        </div>
        
        <div class="mt-4 flex space-x-3 space-x-reverse">
          <button
            @click="uploadFiles"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon name="material-symbols:upload" class="h-5 w-5 ml-2" />
            رفع الصور
          </button>
          <button
            @click="clearFiles"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>

    <!-- معرض الصور المرفوعة -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">الصور المرفوعة</h2>
        <div class="flex space-x-2 space-x-reverse">
          <button
            @click="refreshImages"
            class="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Icon name="material-symbols:refresh" class="h-4 w-4 ml-1" />
            تحديث
          </button>
        </div>
      </div>
      
      <!-- حالة التحميل -->
      <div v-if="loadingImages" class="flex justify-center items-center py-12">
        <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
        <span class="mr-3 text-gray-600">جارٍ تحميل الصور...</span>
      </div>
      
      <!-- معرض الصور -->
      <div v-else-if="uploadedImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="image in uploadedImages" :key="image.filename" class="relative group">
          <img
            :src="image.path"
            :alt="image.originalName"
            class="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
          />
          
          <!-- معلومات الصورة -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
              <p class="text-xs font-medium truncate px-2">{{ image.originalName }}</p>
              <p class="text-xs opacity-75">{{ formatFileSize(image.size) }}</p>
            </div>
          </div>
          
          <!-- أزرار الإجراءات -->
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="flex space-x-1 space-x-reverse">
              <button
                @click="copyImagePath(image.path)"
                class="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="نسخ المسار"
              >
                <Icon name="material-symbols:content-copy" class="h-3 w-3" />
              </button>
              <button
                @click="deleteImage(image)"
                class="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="حذف"
              >
                <Icon name="material-symbols:delete" class="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- حالة عدم وجود صور -->
      <div v-else class="text-center py-12">
        <Icon name="material-symbols:image-outline" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد صور</h3>
        <p class="text-gray-500">لم يتم رفع أي صور بعد</p>
      </div>
    </div>

    <!-- إحصائيات -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <Icon name="material-symbols:image" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">إجمالي الصور</p>
            <p class="text-2xl font-bold text-gray-900">{{ uploadedImages.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <Icon name="material-symbols:storage" class="h-6 w-6 text-green-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">إجمالي الحجم</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatFileSize(totalSize) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <Icon name="material-symbols:folder" class="h-6 w-6 text-purple-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">المجلدات</p>
            <p class="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// إعداد الصفحة
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// المتغيرات التفاعلية
const selectedFiles = ref([])
const uploadedImages = ref([])
const uploading = ref(false)
const loadingImages = ref(false)
const uploadProgress = ref(0)

// المتغيرات المحسوبة
const totalSize = computed(() => {
  return uploadedImages.value.reduce((total, image) => total + image.size, 0)
})

// اختيار الملفات
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedFiles.value.push({
          file: file,
          name: file.name,
          size: file.size,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

// رفع الملفات
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return
  
  try {
    uploading.value = true
    uploadProgress.value = 0
    
    const formData = new FormData()
    selectedFiles.value.forEach((fileData, index) => {
      formData.append(`file_${index}`, fileData.file)
    })
    
    const response = await $fetch('/api/images/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      uploadedImages.value.unshift(...response.files)
      selectedFiles.value = []
      uploadProgress.value = 100
      
      // إشعار بالنجاح
      console.log('تم رفع الصور بنجاح')
    }
  } catch (error) {
    console.error('خطأ في رفع الصور:', error)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// حذف صورة
const deleteImage = async (image) => {
  if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return
  
  try {
    const response = await $fetch('/api/images/delete', {
      method: 'POST',
      body: { filename: image.filename }
    })
    
    if (response.success) {
      uploadedImages.value = uploadedImages.value.filter(img => img.filename !== image.filename)
      console.log('تم حذف الصورة')
    }
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error)
  }
}

// نسخ مسار الصورة
const copyImagePath = (path) => {
  navigator.clipboard.writeText(path).then(() => {
    console.log('تم نسخ مسار الصورة')
  })
}

// مسح الملفات المحددة
const clearFiles = () => {
  selectedFiles.value = []
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.value = ''
  }
}

// إزالة ملف من القائمة
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// تحديث قائمة الصور
const refreshImages = () => {
  loadUploadedImages()
}

// تحميل الصور المرفوعة
const loadUploadedImages = async () => {
  try {
    loadingImages.value = true
    const response = await $fetch('/api/images/list')
    
    if (response.success) {
      uploadedImages.value = response.images
    } else {
      uploadedImages.value = []
    }
  } catch (error) {
    console.error('خطأ في تحميل الصور:', error)
    uploadedImages.value = []
  } finally {
    loadingImages.value = false
  }
}

// تنسيق حجم الملف
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// تحميل البيانات عند تحميل الصفحة
onMounted(() => {
  loadUploadedImages()
})

// SEO والميتا
useHead({
  title: 'إدارة صور الباقات - Wonder Land Admin',
  meta: [
    { name: 'description', content: 'رفع وإدارة صور الباقات السياحية' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
