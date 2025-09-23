<template>
  <span 
    class="morphing-typewriter" 
    :class="[
      textClass, 
      { 'rtl-text': isRTL }
    ]"
    :style="{ 
      color: textColor,
      fontSize: fontSize,
      fontWeight: fontWeight,
      lineHeight: lineHeight,
      direction: isRTL ? 'rtl' : 'ltr'
    }"
  >
    {{ displayText }}
    <span 
      class="cursor" 
      :class="{ 
        'cursor-blink': isComplete && showCursor,
        'cursor-hidden': !showCursor
      }"
      :style="{ color: cursorColor || textColor }"
    >{{ cursorChar }}</span>
  </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  // Content props
  phrases: {
    type: Array,
    default: () => []
  },
  singlePhrase: {
    type: String,
    default: ''
  },
  
  // Animation timing props
  typeSpeed: {
    type: Number,
    default: 100
  },
  eraseSpeed: {
    type: Number,
    default: 50
  },
  delayBetweenPhrases: {
    type: Number,
    default: 2000
  },
  startDelay: {
    type: Number,
    default: 0
  },
  
  // Styling props
  textClass: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: 'inherit'
  },
  fontSize: {
    type: String,
    default: 'inherit'
  },
  fontWeight: {
    type: String,
    default: 'inherit'
  },
  lineHeight: {
    type: String,
    default: 'inherit'
  },
  
  // Cursor props
  showCursor: {
    type: Boolean,
    default: true
  },
  cursorChar: {
    type: String,
    default: '|'
  },
  cursorColor: {
    type: String,
    default: ''
  },
  
  // Behavior props
  loop: {
    type: Boolean,
    default: true
  },
  smartBackspace: {
    type: Boolean,
    default: true
  },
  autoStart: {
    type: Boolean,
    default: true
  },
  
  // Accessibility
  ariaLabel: {
    type: String,
    default: 'Animated text'
  }
})

const emit = defineEmits(['typingStart', 'typingEnd', 'eraseStart', 'eraseEnd', 'complete', 'cycleComplete'])

const { locale } = useI18n()
const displayText = ref('')
const currentPhraseIndex = ref(0)
const isComplete = ref(false)
const isTyping = ref(false)
const isErasing = ref(false)
let timeout = null

// Determine if the current language is RTL
const isRTL = computed(() => {
  return locale.value === 'ar-SA' || document.dir === 'rtl'
})

// Get the current list of phrases to type
const phrasesToType = computed(() => {
  if (props.phrases && props.phrases.length > 0) {
    return props.phrases
  } else if (props.singlePhrase) {
    return [props.singlePhrase]
  }
  return []
})

// Type a single phrase with animation
const typePhrase = (phrase, onComplete) => {
  let i = 0
  isComplete.value = false
  isTyping.value = true
  isErasing.value = false
  displayText.value = ''
  
  emit('typingStart', { phrase, index: currentPhraseIndex.value })
  
  const type = () => {
    if (i < phrase.length) {
      displayText.value += phrase.charAt(i)
      i++
      timeout = setTimeout(type, props.typeSpeed)
    } else {
      isComplete.value = true
      isTyping.value = false
      emit('typingEnd', { phrase, index: currentPhraseIndex.value })
      
      if (onComplete) {
        timeout = setTimeout(onComplete, props.delayBetweenPhrases)
      }
    }
  }
  
  type()
}

// Erase the current phrase with animation
const erasePhrase = (onComplete) => {
  isComplete.value = false
  isTyping.value = false
  isErasing.value = true
  
  emit('eraseStart', { phrase: displayText.value, index: currentPhraseIndex.value })
  
  const erase = () => {
    if (displayText.value.length > 0) {
      displayText.value = displayText.value.substring(0, displayText.value.length - 1)
      timeout = setTimeout(erase, props.eraseSpeed)
    } else {
      isErasing.value = false
      emit('eraseEnd', { index: currentPhraseIndex.value })
      
      if (onComplete) onComplete()
    }
  }
  
  erase()
}

// Start the morphing animation cycle
const startMorphing = () => {
  if (phrasesToType.value.length === 0) return
  
  const nextPhrase = () => {
    // Move to the next phrase
    const oldIndex = currentPhraseIndex.value
    currentPhraseIndex.value = (currentPhraseIndex.value + 1) % phrasesToType.value.length
    
    // If we've completed a full cycle
    if (currentPhraseIndex.value === 0) {
      emit('cycleComplete')
      
      // If not looping and we've gone through all phrases once, stop
      if (!props.loop && oldIndex > 0) {
        emit('complete')
        return
      }
    }
    
    // Type the next phrase
    setTimeout(() => {
      typePhrase(phrasesToType.value[currentPhraseIndex.value], () => {
        // Only erase if there's another phrase to show or if looping
        if (props.loop || currentPhraseIndex.value < phrasesToType.value.length - 1) {
          erasePhrase(nextPhrase)
        } else {
          emit('complete')
        }
      })
    }, 300) // Small pause before typing the next phrase
  }
  
  // Start with the first phrase
  typePhrase(phrasesToType.value[0], () => {
    // If only one phrase and not looping, we're done
    if (phrasesToType.value.length === 1 && !props.loop) {
      emit('complete')
      return
    }
    
    // Otherwise continue the cycle
    erasePhrase(nextPhrase)
  })
}

// Public method to start typing
const start = () => {
  if (timeout) clearTimeout(timeout)
  startMorphing()
}

// Public method to stop typing
const stop = () => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
}

// Expose methods to parent components
defineExpose({
  start,
  stop
})

// Start typing on mount if autoStart is true
onMounted(() => {
  if (props.autoStart) {
    setTimeout(startMorphing, props.startDelay)
  }
})

// Watch for changes to the phrases
watch(() => [...phrasesToType.value], () => {
  if (timeout) clearTimeout(timeout)
  if (props.autoStart) {
    setTimeout(startMorphing, props.startDelay)
  }
}, { deep: true })

// Clean up on unmount
onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.morphing-typewriter {
  display: inline-block;
  white-space: pre-wrap;
  word-break: break-word;
}

.rtl-text {
  text-align: right;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: bold;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

.cursor-hidden {
  opacity: 0;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 768px) {
  .morphing-typewriter {
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .morphing-typewriter {
    font-size: 0.8em;
  }
}
</style> 