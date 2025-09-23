<template>
  <div class="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
    <!-- WhatsApp Button -->
    <a
      :href="getWhatsAppUrl()"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-full shadow-elevation-2 transition-all duration-300 hover:scale-110 group flex items-center justify-center"
      :aria-label="$t('buttons.whatsapp')"
    >
      <Icon name="mdi:whatsapp" class="h-6 w-6 m-auto" />
      <span class="sr-only">{{ $t('buttons.whatsapp') }}</span>
    </a>
  </div>
</template>

<script setup>
const { getWhatsAppUrl } = useWhatsApp()
</script>
