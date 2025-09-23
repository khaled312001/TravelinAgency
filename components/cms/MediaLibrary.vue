<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
      <!-- رأس المكتبة -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">مكتبة الوسائط</h2>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="material-symbols:close" class="h-6 w-6" />
        </button>
      </div>

      <!-- شريط البحث والتصفية -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="flex-1 relative">
            <Icon name="material-symbols:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="البحث في الوسائط..."
              class="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            v-model="mediaType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع الأنواع</option>
            <option value="image">صور</option>
            <option value="video">فيديو</option>
            <option value="document">مستندات</option>
          </select>
          <button
            @click="uploadFile"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Icon name="material-symbols:upload" class="h-5 w-5 ml-2" />
            رفع ملف
          </button>
        </div>
      </div>

      <!-- قائمة الوسائط -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <Icon name="material-symbols:progress-activity" class="animate-spin h-8 w-8 text-blue-600" />
          <span class="mr-3 text-gray-600">جارٍ تحميل الوسائط...</span>
        </div>

        <div v-else-if="filteredMedia.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="media in filteredMedia"
            :key="media.id"
            @click="selectMedia(media)"
            class="relative group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
          >
            <!-- الصورة المصغرة -->
            <div class="aspect-square bg-gray-100 flex items-center justify-center">
              <img
                v-if="media.type === 'image'"
                :src="media.thumbnail || media.url"
                :alt="media.name"
                class="w-full h-full object-cover"
              />
              <Icon
                v-else-if="media.type === 'video'"
                name="material-symbols:play-circle"
                class="h-12 w-12 text-gray-400"
              />
              <Icon
                v-else
                name="material-symbols:description"
                class="h-12 w-12 text-gray-400"
              />
            </div>

            <!-- معلومات الملف -->
            <div class="p-2 bg-white">
              <p class="text-xs text-gray-600 truncate" :title="media.name">{{ media.name }}</p>
              <p class="text-xs text-gray-400">{{ formatFileSize(media.size) }}</p>
            </div>

            <!-- زر التحديد -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Icon name="material-symbols:check" class="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <Icon name="material-symbols:image" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد وسائط</h3>
          <p class="text-gray-500 mb-6">لم يتم العثور على أي وسائط</p>
          <button
            @click="uploadFile"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            رفع أول ملف
          </button>
        </div>
      </div>

      <!-- أزرار الإجراءات -->
      <div class="flex items-center justify-end space-x-3 space-x-reverse p-6 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          إلغاء
        </button>
        <button
          @click="confirmSelection"
          :disabled="!selectedMedia"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          اختيار
        </button>
      </div>
    </div>

    <!-- مدخل رفع الملفات -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*,video/*,.pdf,.doc,.docx"
      @change="handleFileUpload"
      class="hidden"
    />
  </div>
</template>

<script setup>
// المتغيرات التفاعلية
const media = ref([])
const loading = ref(false)
const searchQuery = ref('')
const mediaType = ref('')
const selectedMedia = ref(null)

// المدخل المخفي للملفات
const fileInput = ref(null)

// المتغيرات المحسوبة
const filteredMedia = computed(() => {
  let filtered = media.value

  // تصفية البحث
  if (searchQuery.value) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // تصفية النوع
  if (mediaType.value) {
    filtered = filtered.filter(item => item.type === mediaType.value)
  }

  return filtered
})

// دوال المساعدة
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const selectMedia = (item) => {
  selectedMedia.value = item
}

const confirmSelection = () => {
  if (selectedMedia.value) {
    emit('select', selectedMedia.value)
  }
}

const uploadFile = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files)
  
  for (const file of files) {
    try {
      // TODO: Implement actual file upload
      const newMedia = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
      
      media.value.unshift(newMedia)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }
  
  // Reset input
  event.target.value = ''
}

// تحميل الوسائط
const loadMedia = async () => {
  try {
    loading.value = true
    // TODO: Load media from API
    // Simulate loading with sample data
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    media.value = [
      {
        id: 1,
        name: 'hero-bg.jpg',
        type: 'image',
        url: '/images/hero-bg.jpg',
        thumbnail: '/images/hero-bg.jpg',
        size: 1024000,
        uploadedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'about.jpg',
        type: 'image',
        url: '/images/about.jpg',
        thumbnail: '/images/about.jpg',
        size: 856000,
        uploadedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'services.jpg',
        type: 'image',
        url: '/images/services.jpg',
        thumbnail: '/images/services.jpg',
        size: 1200000,
        uploadedAt: new Date().toISOString()
      }
    ]
  } catch (error) {
    console.error('Error loading media:', error)
  } finally {
    loading.value = false
  }
}

// Events
const emit = defineEmits(['close', 'select'])

// تحميل البيانات عند فتح المكتبة
onMounted(() => {
  loadMedia()
})
</script>
