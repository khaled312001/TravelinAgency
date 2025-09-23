<template>
  <div v-if="sent" class="text-green-600 text-sm mt-2">
    <span class="inline-flex items-center">
      <Icon name="material-symbols:check-circle" class="mr-1" />
      {{ t('notification.sent') }}
    </span>
  </div>
  <div v-else-if="error" class="text-amber-600 text-sm mt-2">
    <span class="inline-flex items-center">
      <Icon name="material-symbols:info-outline" class="mr-1" />
      {{ t('notification.partial') }}
    </span>
  </div>
  <div v-else-if="failed" class="text-red-600 text-sm mt-2">
    <span class="inline-flex items-center">
      <Icon name="material-symbols:error-outline" class="mr-1" />
      {{ t('notification.error') }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sent: boolean;
  error?: string;
  failed?: boolean;
}>();

const { t } = useI18n();
</script>
