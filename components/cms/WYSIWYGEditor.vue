<template>
  <div class="wysiwyg-editor border border-gray-300 rounded-lg overflow-hidden">
    <!-- شريط الأدوات -->
    <div class="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap items-center gap-2">
      <!-- تنسيق النص -->
      <div class="flex items-center space-x-1 space-x-reverse border-r border-gray-300 pr-2">
        <button
          @click="execCommand('bold')"
          :class="{ 'bg-blue-100 text-blue-700': isActive('bold') }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="عريض"
        >
          <Icon name="material-symbols:format-bold" class="h-4 w-4" />
        </button>
        <button
          @click="execCommand('italic')"
          :class="{ 'bg-blue-100 text-blue-700': isActive('italic') }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="مائل"
        >
          <Icon name="material-symbols:format-italic" class="h-4 w-4" />
        </button>
        <button
          @click="execCommand('underline')"
          :class="{ 'bg-blue-100 text-blue-700': isActive('underline') }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="تحته خط"
        >
          <Icon name="material-symbols:format-underlined" class="h-4 w-4" />
        </button>
      </div>

      <!-- محاذاة النص -->
      <div class="flex items-center space-x-1 space-x-reverse border-r border-gray-300 pr-2">
        <button
          @click="execCommand('justifyRight')"
          :class="{ 'bg-blue-100 text-blue-700': isActive('justifyRight') }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="محاذاة لليمين"
        >
          <Icon name="material-symbols:format-align-right" class="h-4 w-4" />
        </button>
        <button
          @click="execCommand('justifyCenter')"
          :class="{ 'bg-blue-100 text-blue-700': isActive('justifyCenter') }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="محاذاة للوسط"
        >
          <Icon name="material-symbols:format-align-center" class="h-4 w-4" />
        </button>
        <button
          @click="execCommand('justifyLeft')"
          :class="{ 'bg-blue-100 text-blue-700': isActive('justifyLeft') }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="محاذاة لليسار"
        >
          <Icon name="material-symbols:format-align-left" class="h-4 w-4" />
        </button>
      </div>

      <!-- قوائم -->
      <div class="flex items-center space-x-1 space-x-reverse border-r border-gray-300 pr-2">
        <button
          @click="execCommand('insertUnorderedList')"
          :class="{ 'bg-blue-100 text-blue-700': isActive('insertUnorderedList') }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="قائمة نقطية"
        >
          <Icon name="material-symbols:format-list-bulleted" class="h-4 w-4" />
        </button>
        <button
          @click="execCommand('insertOrderedList')"
          :class="{ 'bg-blue-100 text-blue-700': isActive('insertOrderedList') }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="قائمة مرقمة"
        >
          <Icon name="material-symbols:format-list-numbered" class="h-4 w-4" />
        </button>
      </div>

      <!-- روابط -->
      <div class="flex items-center space-x-1 space-x-reverse border-r border-gray-300 pr-2">
        <button
          @click="insertLink"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="إدراج رابط"
        >
          <Icon name="material-symbols:link" class="h-4 w-4" />
        </button>
        <button
          @click="insertImage"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="إدراج صورة"
        >
          <Icon name="material-symbols:image" class="h-4 w-4" />
        </button>
      </div>

      <!-- إزالة التنسيق -->
      <div class="flex items-center space-x-1 space-x-reverse">
        <button
          @click="execCommand('removeFormat')"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="إزالة التنسيق"
        >
          <Icon name="material-symbols:format-clear" class="h-4 w-4" />
        </button>
        <button
          @click="execCommand('undo')"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="تراجع"
        >
          <Icon name="material-symbols:undo" class="h-4 w-4" />
        </button>
        <button
          @click="execCommand('redo')"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="إعادة"
        >
          <Icon name="material-symbols:redo" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- منطقة التحرير -->
    <div
      ref="editor"
      :contenteditable="true"
      @input="handleInput"
      @keydown="handleKeydown"
      @paste="handlePaste"
      class="min-h-64 p-4 focus:outline-none prose max-w-none"
      :style="{ direction: 'rtl', textAlign: 'right' }"
      v-html="modelValue"
    ></div>

    <!-- نافذة إدراج رابط -->
    <div v-if="showLinkDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-96">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">إدراج رابط</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">النص</label>
            <input
              v-model="linkText"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="نص الرابط"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الرابط</label>
            <input
              v-model="linkUrl"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div class="flex items-center justify-end space-x-3 space-x-reverse mt-6">
          <button
            @click="showLinkDialog = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            @click="insertLinkConfirm"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إدراج
          </button>
        </div>
      </div>
    </div>

    <!-- نافذة إدراج صورة -->
    <div v-if="showImageDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-96">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">إدراج صورة</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رابط الصورة</label>
            <input
              v-model="imageUrl"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">النص البديل</label>
            <input
              v-model="imageAlt"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="وصف الصورة"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">العرض</label>
              <input
                v-model.number="imageWidth"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الارتفاع</label>
              <input
                v-model.number="imageHeight"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="300"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end space-x-3 space-x-reverse mt-6">
          <button
            @click="showImageDialog = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            @click="insertImageConfirm"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إدراج
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'ابدأ الكتابة...'
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// المتغيرات التفاعلية
const editor = ref(null)
const showLinkDialog = ref(false)
const showImageDialog = ref(false)
const linkText = ref('')
const linkUrl = ref('')
const imageUrl = ref('')
const imageAlt = ref('')
const imageWidth = ref(400)
const imageHeight = ref(300)

// دوال التحرير
const execCommand = (command, value = null) => {
  document.execCommand(command, false, value)
  editor.value?.focus()
  emitContent()
}

const isActive = (command) => {
  return document.queryCommandState(command)
}

const handleInput = () => {
  emitContent()
}

const handleKeydown = (event) => {
  // Ctrl+B for bold
  if (event.ctrlKey && event.key === 'b') {
    event.preventDefault()
    execCommand('bold')
  }
  // Ctrl+I for italic
  if (event.ctrlKey && event.key === 'i') {
    event.preventDefault()
    execCommand('italic')
  }
  // Ctrl+U for underline
  if (event.ctrlKey && event.key === 'u') {
    event.preventDefault()
    execCommand('underline')
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const text = event.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

const emitContent = () => {
  if (editor.value) {
    emit('update:modelValue', editor.value.innerHTML)
  }
}

const insertLink = () => {
  const selection = window.getSelection()
  if (selection.toString()) {
    linkText.value = selection.toString()
  }
  showLinkDialog.value = true
}

const insertLinkConfirm = () => {
  if (linkUrl.value) {
    const linkHtml = `<a href="${linkUrl.value}" target="_blank" rel="noopener noreferrer">${linkText.value || linkUrl.value}</a>`
    document.execCommand('insertHTML', false, linkHtml)
    emitContent()
  }
  showLinkDialog.value = false
  linkText.value = ''
  linkUrl.value = ''
}

const insertImage = () => {
  showImageDialog.value = true
}

const insertImageConfirm = () => {
  if (imageUrl.value) {
    const imageHtml = `<img src="${imageUrl.value}" alt="${imageAlt.value}" width="${imageWidth.value}" height="${imageHeight.value}" style="max-width: 100%; height: auto;" />`
    document.execCommand('insertHTML', false, imageHtml)
    emitContent()
  }
  showImageDialog.value = false
  imageUrl.value = ''
  imageAlt.value = ''
  imageWidth.value = 400
  imageHeight.value = 300
}

// تحديث المحتوى عند تغيير modelValue
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.innerHTML !== newValue) {
    editor.value.innerHTML = newValue
  }
})

// إضافة placeholder
onMounted(() => {
  if (editor.value && !props.modelValue) {
    editor.value.innerHTML = `<p style="color: #9ca3af;">${props.placeholder}</p>`
  }
})
</script>

<style scoped>
.wysiwyg-editor :deep(.prose) {
  max-width: none;
}

.wysiwyg-editor :deep(.prose p) {
  margin-bottom: 1rem;
}

.wysiwyg-editor :deep(.prose h1),
.wysiwyg-editor :deep(.prose h2),
.wysiwyg-editor :deep(.prose h3),
.wysiwyg-editor :deep(.prose h4) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.wysiwyg-editor :deep(.prose ul),
.wysiwyg-editor :deep(.prose ol) {
  margin-bottom: 1rem;
  padding-right: 1.5rem;
}

.wysiwyg-editor :deep(.prose li) {
  margin-bottom: 0.5rem;
}

.wysiwyg-editor :deep(.prose a) {
  color: #3b82f6;
  text-decoration: underline;
}

.wysiwyg-editor :deep(.prose img) {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>
