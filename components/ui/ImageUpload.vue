<template>
  <div class="space-y-4">
    <!-- معاينة الصورة الحالية -->
    <div v-if="currentImageUrl" class="relative">
      <img
        :src="currentImageUrl"
        :alt="alt"
        class="w-full h-48 object-cover rounded-lg border border-gray-200"
      />
      <button
        @click="removeImage"
        class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        title="حذف الصورة"
      >
        <Icon name="material-symbols:close" class="h-4 w-4" />
      </button>
    </div>

    <!-- منطقة رفع الصورة -->
    <div
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer min-h-[120px] bg-gray-50"
      :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
      style="border: 2px dashed #d1d5db; background-color: #f9fafb;"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div v-if="!currentImageUrl" class="space-y-2">
        <Icon name="material-symbols:cloud-upload" class="h-12 w-12 text-gray-400 mx-auto" />
        <div class="text-sm text-gray-600">
          <p class="font-medium">اضغط لرفع صورة أو اسحبها هنا</p>
          <p class="text-xs text-gray-500 mt-1">PNG, JPG, JPEG حتى 5MB</p>
        </div>
      </div>
      
      <div v-else class="space-y-2">
        <Icon name="material-symbols:edit" class="h-8 w-8 text-blue-500 mx-auto" />
        <p class="text-sm text-blue-600 font-medium">اضغط لتغيير الصورة</p>
      </div>
    </div>

    <!-- شريط التقدم -->
    <div v-if="uploading" class="space-y-2">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>جاري رفع الصورة...</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- رسائل الخطأ -->
    <div v-if="error" class="p-3 bg-red-100 border border-red-300 rounded-lg">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <!-- معاينة الصورة الجديدة -->
    <div v-if="previewUrl && previewUrl !== currentImageUrl" class="space-y-2">
      <p class="text-sm font-medium text-gray-700">معاينة الصورة الجديدة:</p>
      <img
        :src="previewUrl"
        alt="معاينة الصورة"
        class="w-full h-32 object-cover rounded-lg border border-gray-200"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'صورة'
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  uploadType: {
    type: String,
    default: 'destination', // 'destination' or 'package'
    validator: (value) => ['destination', 'package'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'upload-complete', 'upload-error'])


// المتغيرات التفاعلية
const fileInput = ref(null)
const isDragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const previewUrl = ref('')
const currentImageUrl = ref(props.modelValue)

// مراقبة تغيير القيمة الخارجية
watch(() => props.modelValue, (newValue) => {
  currentImageUrl.value = newValue
})

// مراقبة تغيير الصورة الحالية
watch(currentImageUrl, (newValue) => {
  emit('update:modelValue', newValue)
})

// تفعيل اختيار الملف
const triggerFileInput = () => {
  fileInput.value?.click()
}

// التعامل مع اختيار الملف
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

// التعامل مع السحب والإفلات
const handleDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

// معالجة الملف
const processFile = async (file) => {
  // التحقق من نوع الملف
  if (!file.type.startsWith('image/')) {
    error.value = 'يرجى اختيار ملف صورة صالح'
    return
  }

  // التحقق من حجم الملف
  if (file.size > props.maxSize) {
    error.value = `حجم الملف كبير جداً. الحد الأقصى ${props.maxSize / (1024 * 1024)}MB`
    return
  }

  // إخفاء رسالة الخطأ
  error.value = ''

  // إنشاء معاينة
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)

  // رفع الصورة
  await uploadImage(file)
}

// رفع الصورة
const uploadImage = async (file) => {
  try {
    uploading.value = true
    uploadProgress.value = 0

    // إنشاء FormData
    const formData = new FormData()
    formData.append('image', file)

    // محاكاة شريط التقدم
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 10
      }
    }, 200)

    // رفع الصورة
    const apiEndpoint = props.uploadType === 'package' 
      ? '/api/images/upload-package' 
      : '/api/images/upload-destination'
    
    const response = await $fetch(apiEndpoint, {
      method: 'POST',
      body: formData
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.success && response.data?.url) {
      currentImageUrl.value = response.data.url
      previewUrl.value = ''
      emit('upload-complete', response.data)
    } else {
      throw new Error(response.message || 'فشل في رفع الصورة')
    }
  } catch (err) {
    console.error('خطأ في رفع الصورة:', err)
    error.value = err.message || 'حدث خطأ في رفع الصورة'
    emit('upload-error', err)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// حذف الصورة
const removeImage = () => {
  currentImageUrl.value = ''
  previewUrl.value = ''
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// مراقبة السحب
const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

// إضافة مستمعي الأحداث للسحب
onMounted(() => {
  document.addEventListener('dragover', handleDragOver)
  document.addEventListener('dragleave', handleDragLeave)
})

onUnmounted(() => {
  document.removeEventListener('dragover', handleDragOver)
  document.removeEventListener('dragleave', handleDragLeave)
})
</script>
