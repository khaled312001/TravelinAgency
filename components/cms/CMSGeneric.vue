<template>
  <section 
    class="py-16 md:py-24"
    :style="{
      backgroundColor: section.background_color || '#ffffff'
    }"
  >
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div v-if="section.title || section.subtitle" class="text-center mb-16">
          <h2 
            v-if="section.title"
            class="text-3xl md:text-4xl font-bold mb-4"
            :style="{ color: section.text_color || '#1f2937' }"
          >
            {{ section.title }}
          </h2>
          <p 
            v-if="section.subtitle"
            class="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {{ section.subtitle }}
          </p>
        </div>

        <!-- Content -->
        <div v-if="section.content" class="mb-12">
          <div 
            class="prose prose-lg max-w-none"
            :style="{ color: section.text_color || '#374151' }"
            v-html="section.content"
          ></div>
        </div>

        <!-- Content Blocks -->
        <div v-if="section.content_blocks && section.content_blocks.length > 0">
          <div class="space-y-8">
            <div
              v-for="block in section.content_blocks"
              :key="block.id"
            >
              <!-- Text Block -->
              <div v-if="block.block_type === 'text'" class="bg-white rounded-xl p-8 shadow-lg">
                <h3 
                  v-if="block.title"
                  class="text-2xl font-semibold mb-4 text-gray-900"
                >
                  {{ block.title }}
                </h3>
                <div 
                  v-if="block.content"
                  class="prose prose-lg max-w-none text-gray-600"
                  v-html="block.content"
                ></div>
              </div>

              <!-- Image Block -->
              <div v-else-if="block.block_type === 'image'" class="text-center">
                <img
                  :src="block.image_url"
                  :alt="block.title || 'Image'"
                  class="w-full max-w-4xl mx-auto rounded-xl shadow-lg"
                />
                <div v-if="block.content" class="mt-4">
                  <p class="text-gray-600 italic">{{ block.content }}</p>
                </div>
              </div>

              <!-- Gallery Block -->
              <div v-else-if="block.block_type === 'gallery'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(image, index) in block.settings?.images || []"
                  :key="index"
                  class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <img
                    :src="image.url"
                    :alt="image.alt || `Gallery Image ${index + 1}`"
                    class="w-full h-64 object-cover"
                  />
                  <div v-if="image.caption" class="p-4">
                    <p class="text-gray-600 text-sm">{{ image.caption }}</p>
                  </div>
                </div>
              </div>

              <!-- Video Block -->
              <div v-else-if="block.block_type === 'video'" class="text-center">
                <div class="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    :src="block.video_url"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
                <div v-if="block.content" class="mt-4">
                  <p class="text-gray-600">{{ block.content }}</p>
                </div>
              </div>

              <!-- Button Block -->
              <div v-else-if="block.block_type === 'button'" class="text-center">
                <NuxtLink
                  v-if="block.link_url"
                  :to="block.link_url"
                  class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {{ block.link_text || 'اكتشف المزيد' }}
                  <Icon name="material-symbols:arrow-forward" class="h-5 w-5 mr-2" />
                </NuxtLink>
              </div>

              <!-- Card Block -->
              <div v-else-if="block.block_type === 'card'" class="bg-white rounded-xl p-8 shadow-lg">
                <div v-if="block.image_url" class="mb-6">
                  <img
                    :src="block.image_url"
                    :alt="block.title || 'Card Image'"
                    class="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 
                  v-if="block.title"
                  class="text-xl font-semibold mb-4 text-gray-900"
                >
                  {{ block.title }}
                </h3>
                <div 
                  v-if="block.content"
                  class="text-gray-600 mb-6"
                  v-html="block.content"
                ></div>
                <div v-if="block.link_url" class="text-center">
                  <NuxtLink
                    :to="block.link_url"
                    class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {{ block.link_text || 'اقرأ المزيد' }}
                    <Icon name="material-symbols:arrow-forward" class="h-4 w-4 mr-1" />
                  </NuxtLink>
                </div>
              </div>

              <!-- Quote Block -->
              <div v-else-if="block.block_type === 'quote'" class="bg-gray-50 rounded-xl p-8 text-center">
                <blockquote class="text-xl italic text-gray-700 mb-4">
                  "{{ block.content }}"
                </blockquote>
                <cite v-if="block.title" class="text-gray-600 font-medium">
                  — {{ block.title }}
                </cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      section_type: 'generic',
      title: '',
      subtitle: '',
      content: '',
      background_color: '#ffffff',
      text_color: '#000000',
      content_blocks: []
    })
  }
})
</script>
