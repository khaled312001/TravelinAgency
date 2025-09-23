<template>
  <div>
    <!-- Hero Section -->
    <CMSHero
      v-if="section.section_type === 'hero'"
      :section="section"
    />

    <!-- About Section -->
    <CMSAbout
      v-else-if="section.section_type === 'about'"
      :section="section"
    />

    <!-- Services Section -->
    <CMSServices
      v-else-if="section.section_type === 'services'"
      :section="section"
    />

    <!-- Testimonials Section -->
    <CMSTestimonials
      v-else-if="section.section_type === 'testimonials'"
      :section="section"
    />

    <!-- Contact Section -->
    <CMSContact
      v-else-if="section.section_type === 'contact'"
      :section="section"
    />

    <!-- Generic Section -->
    <CMSGeneric
      v-else
      :section="section"
    />
  </div>
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
      background_image: '',
      text_color: '#000000',
      order_index: 0,
      is_active: true,
      settings: {},
      content_blocks: []
    })
  }
})
</script>
