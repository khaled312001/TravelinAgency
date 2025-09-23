<template>
  <section 
    class="py-16 md:py-24"
    :style="{
      backgroundColor: section.background_color || '#f8fafc'
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

        <!-- Services Grid -->
        <div v-if="section.content_blocks && section.content_blocks.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="block in section.content_blocks"
              :key="block.id"
              class="group"
            >
              <!-- Service Card -->
              <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <!-- Icon/Image -->
                <div v-if="block.image_url" class="mb-6">
                  <div class="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                    <img
                      :src="block.image_url"
                      :alt="block.title || 'Service'"
                      class="w-10 h-10"
                    />
                  </div>
                </div>

                <!-- Title -->
                <h3 
                  v-if="block.title"
                  class="text-xl font-semibold mb-4 text-gray-900 text-center"
                >
                  {{ block.title }}
                </h3>

                <!-- Content -->
                <div 
                  v-if="block.content"
                  class="text-gray-600 text-center mb-6"
                  v-html="block.content"
                ></div>

                <!-- Link -->
                <div v-if="block.link_url" class="text-center">
                  <NuxtLink
                    :to="block.link_url"
                    class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {{ block.link_text || 'اكتشف المزيد' }}
                    <Icon name="material-symbols:arrow-forward" class="h-4 w-4 mr-1" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div v-if="section.settings?.cta" class="text-center mt-16">
          <div class="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold mb-4 text-gray-900">
              {{ section.settings.cta.title || 'هل تريد معرفة المزيد؟' }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ section.settings.cta.description || 'تواصل معنا للحصول على أفضل الخدمات' }}
            </p>
            <NuxtLink
              :to="section.settings.cta.link || '/contact'"
              class="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ section.settings.cta.button_text || 'تواصل معنا' }}
              <Icon name="material-symbols:arrow-forward" class="h-5 w-5 mr-2" />
            </NuxtLink>
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
      section_type: 'services',
      title: '',
      subtitle: '',
      content: '',
      background_color: '#f8fafc',
      text_color: '#000000',
      settings: {},
      content_blocks: []
    })
  }
})
</script>
