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

        <!-- Testimonials Grid -->
        <div v-if="section.content_blocks && section.content_blocks.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="block in section.content_blocks"
              :key="block.id"
              class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <!-- Quote -->
              <div class="mb-6">
                <Icon name="material-symbols:format-quote" class="h-8 w-8 text-blue-600 mb-4" />
                <blockquote class="text-gray-700 italic">
                  "{{ block.content }}"
                </blockquote>
              </div>

              <!-- Author -->
              <div class="flex items-center">
                <div v-if="block.image_url" class="ml-4">
                  <img
                    :src="block.image_url"
                    :alt="block.title || 'Customer'"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 
                    v-if="block.title"
                    class="font-semibold text-gray-900"
                  >
                    {{ block.title }}
                  </h4>
                  <p 
                    v-if="block.settings?.position"
                    class="text-sm text-gray-600"
                  >
                    {{ block.settings.position }}
                  </p>
                </div>
              </div>

              <!-- Rating -->
              <div v-if="block.settings?.rating" class="mt-4">
                <div class="flex items-center">
                  <div 
                    v-for="star in 5" 
                    :key="star"
                    class="text-yellow-400"
                  >
                    <Icon 
                      :name="star <= block.settings.rating ? 'material-symbols:star' : 'material-symbols:star-border'"
                      class="h-5 w-5"
                    />
                  </div>
                </div>
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
      section_type: 'testimonials',
      title: '',
      subtitle: '',
      background_color: '#f8fafc',
      text_color: '#000000',
      content_blocks: []
    })
  }
})
</script>
