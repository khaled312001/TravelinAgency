interface LocaleConfig {
  code: string
  name: string
  flag: string
}

import ar from './locales/ar-SA.json'
import en from './locales/en-US.json'

export default defineI18nConfig(() => ({
  legacy: false,
  // locale: 'ar',
  messages: {
    en,
    ar
  }
}))
