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
            class="prose prose-lg max-w-none text-center"
            :style="{ color: section.text_color || '#374151' }"
            v-html="section.content"
          ></div>
        </div>

        <!-- Content Blocks -->
        <div v-if="section.content_blocks && section.content_blocks.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="block in section.content_blocks"
              :key="block.id"
              class="text-center"
            >
              <!-- Feature Card -->
              <div v-if="block.block_type === 'feature'" class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div v-if="block.image_url" class="mb-6">
                  <img
                    :src="block.image_url"
                    :alt="block.title || 'Feature'"
                    class="w-16 h-16 mx-auto rounded-lg"
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
                  class="text-gray-600"
                  v-html="block.content"
                ></div>
              </div>

              <!-- Stats Card -->
              <div v-else-if="block.block_type === 'stat'" class="text-center">
                <div 
                  v-if="block.title"
                  class="text-4xl md:text-5xl font-bold mb-2"
                  :style="{ color: section.text_color || '#1e40af' }"
                >
                  {{ block.title }}
                </div>
                <div 
                  v-if="block.content"
                  class="text-lg text-gray-600"
                >
                  {{ block.content }}
                </div>
              </div>

              <!-- Image Block -->
              <div v-else-if="block.block_type === 'image'" class="rounded-xl overflow-hidden shadow-lg">
                <img
                  :src="block.image_url"
                  :alt="block.title || 'About Image'"
                  class="w-full h-64 object-cover"
                />
                <div v-if="block.content" class="p-6">
                  <p class="text-gray-600">{{ block.content }}</p>
                </div>
              </div>

              <!-- Text Block -->
              <div v-else-if="block.block_type === 'text'" class="bg-gray-50 rounded-xl p-8">
                <h3 
                  v-if="block.title"
                  class="text-xl font-semibold mb-4 text-gray-900"
                >
                  {{ block.title }}
                </h3>
                <div 
                  v-if="block.content"
                  class="text-gray-600"
                  v-html="block.content"
                ></div>
              </div>

              <!-- Button Block -->
              <div v-else-if="block.block_type === 'button'" class="flex justify-center">
                <NuxtLink
                  v-if="block.link_url"
                  :to="block.link_url"
                  class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {{ block.link_text || 'اكتشف المزيد' }}
                  <Icon name="material-symbols:arrow-forward" class="h-5 w-5 mr-2" />
                </NuxtLink>
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
      section_type: 'about',
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
