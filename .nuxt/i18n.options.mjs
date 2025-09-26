
// @ts-nocheck


export const localeCodes =  [
  "en-US",
  "ar-SA"
]

export const localeLoaders = {
  "en-US": [],
  "ar-SA": []
}

export const vueI18nConfigs = [
  () => import("../i18n.config.ts?hash=bffaebcb&config=1" /* webpackChunkName: "__i18n_config_ts_bffaebcb" */)
]

export const nuxtI18nOptions = {
  "experimental": {
    "localeDetector": "",
    "switchLocalePathLinkSSR": false,
    "autoImportTranslationFunctions": false
  },
  "bundle": {
    "compositionOnly": true,
    "runtimeOnly": false,
    "fullInstall": true,
    "dropMessageCompiler": false
  },
  "compilation": {
    "jit": true,
    "strictMessage": true,
    "escapeHtml": false
  },
  "customBlocks": {
    "defaultSFCLang": "json",
    "globalSFCScope": false
  },
  "vueI18n": "./i18n.config.ts",
  "locales": [
    {
      "code": "en-US",
      "language": "en-US",
      "name": "English",
      "dir": "ltr"
    },
    {
      "code": "ar-SA",
      "language": "ar-SA",
      "name": "العربية",
      "dir": "rtl"
    }
  ],
  "defaultLocale": "ar-SA",
  "defaultDirection": "ltr",
  "routesNameSeparator": "___",
  "trailingSlash": true,
  "defaultLocaleRouteNameSuffix": "default",
  "strategy": "prefix_except_default",
  "lazy": true,
  "langDir": null,
  "detectBrowserLanguage": false,
  "differentDomains": false,
  "baseUrl": "",
  "dynamicRouteParams": false,
  "customRoutes": "page",
  "pages": {},
  "skipSettingLocaleOnNavigate": false,
  "types": "composition",
  "debug": false,
  "parallelPlugin": false,
  "multiDomainLocales": false,
  "i18nModules": []
}

export const normalizedLocales = [
  {
    "code": "en-US",
    "language": "en-US",
    "name": "English",
    "dir": "ltr",
    "files": []
  },
  {
    "code": "ar-SA",
    "language": "ar-SA",
    "name": "العربية",
    "dir": "rtl",
    "files": []
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = true

export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18n"
export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
