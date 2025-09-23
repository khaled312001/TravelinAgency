<template>
  <div class="inline-flex flex-col overflow-hidden">
    <transition
      name="slide-fade"
      mode="out-in"
    >
      <div 
        :key="currentPhrase"
        class="text-3xl sm:text-5xl md:text-6xl lg:text-6xl text-center leading-normal sm:leading-normal md:leading-normal lg:leading-normal whitespace-pre-line"
        :style="{ color: textColor, fontWeight: fontWeight }"
      >
        {{ currentPhrase }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, defineProps, withDefaults } from 'vue';

interface Props {
  phrases: string[];
  textColor?: string;
  fontWeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  textColor: 'currentColor',
  fontWeight: 'inherit'
});

const currentIndex = ref(0);
const intervalId = ref<number | null>(null);

const currentPhrase = computed(() => {
  if (!props.phrases.length) return '';
  return props.phrases[currentIndex.value];
});

const nextPhrase = () => {
  currentIndex.value = (currentIndex.value + 1) % props.phrases.length;
};

onMounted(() => {
  intervalId.value = window.setInterval(nextPhrase, 3000);
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
