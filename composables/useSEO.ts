export const useSEO = () => {
  // SEO data state
  const seoData = ref({
    siteTitleAr: '',
    siteTitleEn: '',
    siteDescriptionAr: '',
    siteDescriptionEn: '',
    keywords: '',
    siteUrl: '',
    ogImage: '',
    twitterHandle: '',
    googleAnalytics: '',
    googleSearchConsole: ''
  })

  const seoStats = ref({
    indexedPages: 0,
    performanceScore: 0,
    seoIssues: 0,
    internalLinks: 0
  })

  const seoPages = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Load SEO data
  const loadSeoData = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch('/api/seo')
      if (response.success) {
        const { seoData: apiSeoData, seoStats: apiSeoStats, seoPages: apiSeoPages } = response.data
        
        seoData.value = { ...seoData.value, ...apiSeoData }
        seoStats.value = { ...seoStats.value, ...apiSeoStats }
        seoPages.value = apiSeoPages
      }
    } catch (err) {
      error.value = err
      console.error('Error loading SEO data:', err)
    } finally {
      loading.value = false
    }
  }

  // Save SEO settings
  const saveSeoSettings = async (data: any) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch('/api/seo', {
        method: 'PUT',
        body: data
      })
      
      if (response.success) {
        seoData.value = { ...seoData.value, ...data.seoData }
        return { success: true, message: response.message }
      }
    } catch (err) {
      error.value = err
      console.error('Error saving SEO settings:', err)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  // Generate sitemap
  const generateSitemap = async (settings: any) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch('/api/seo/sitemap/generate', {
        method: 'POST',
        body: settings
      })
      
      if (response.success) {
        return { success: true, data: response.data }
      }
    } catch (err) {
      error.value = err
      console.error('Error generating sitemap:', err)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  // SEO page management
  const createSeoPage = async (pageData: any) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch('/api/seo/pages', {
        method: 'POST',
        body: pageData
      })
      
      if (response.success) {
        seoPages.value.push(response.data)
        return { success: true, data: response.data }
      }
    } catch (err) {
      error.value = err
      console.error('Error creating SEO page:', err)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  const updateSeoPage = async (id: number, pageData: any) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch(`/api/seo/pages/${id}`, {
        method: 'PUT',
        body: pageData
      })
      
      if (response.success) {
        const index = seoPages.value.findIndex(p => p.id === id)
        if (index !== -1) {
          seoPages.value[index] = { ...seoPages.value[index], ...response.data }
        }
        return { success: true, data: response.data }
      }
    } catch (err) {
      error.value = err
      console.error('Error updating SEO page:', err)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  const deleteSeoPage = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch(`/api/seo/pages/${id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        seoPages.value = seoPages.value.filter(p => p.id !== id)
        return { success: true, message: response.message }
      }
    } catch (err) {
      error.value = err
      console.error('Error deleting SEO page:', err)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  // SEO analysis helpers
  const analyzeSeoScore = (page: any) => {
    let score = 0
    const issues = []

    // Check title
    if (page.title && page.title.length > 0) {
      score += 20
    } else {
      issues.push('عنوان الصفحة مفقود')
    }

    // Check description
    if (page.description && page.description.length > 0) {
      score += 20
    } else {
      issues.push('وصف الصفحة مفقود')
    }

    // Check keywords
    if (page.keywords && page.keywords.length > 0) {
      score += 15
    } else {
      issues.push('الكلمات المفتاحية مفقودة')
    }

    // Check title length
    if (page.title && page.title.length >= 30 && page.title.length <= 60) {
      score += 15
    } else if (page.title) {
      issues.push('طول العنوان غير مناسب (يجب أن يكون بين 30-60 حرف)')
    }

    // Check description length
    if (page.description && page.description.length >= 120 && page.description.length <= 160) {
      score += 15
    } else if (page.description) {
      issues.push('طول الوصف غير مناسب (يجب أن يكون بين 120-160 حرف)')
    }

    // Check OG image
    if (page.ogImage && page.ogImage.length > 0) {
      score += 15
    } else {
      issues.push('صورة Open Graph مفقودة')
    }

    return {
      score: Math.min(score, 100),
      issues,
      status: score >= 80 ? 'optimized' : score >= 60 ? 'needs-work' : 'not-optimized'
    }
  }

  // SEO recommendations
  const getSeoRecommendations = () => {
    const recommendations = []

    if (!seoData.value.siteTitleAr) {
      recommendations.push('أضف عنوان الموقع باللغة العربية')
    }

    if (!seoData.value.siteDescriptionAr) {
      recommendations.push('أضف وصف الموقع باللغة العربية')
    }

    if (!seoData.value.keywords) {
      recommendations.push('أضف الكلمات المفتاحية للموقع')
    }

    if (!seoData.value.googleAnalytics) {
      recommendations.push('أضف كود Google Analytics لتتبع الزوار')
    }

    if (!seoData.value.googleSearchConsole) {
      recommendations.push('أضف كود Google Search Console لتحسين الفهرسة')
    }

    return recommendations
  }

  return {
    // State
    seoData: readonly(seoData),
    seoStats: readonly(seoStats),
    seoPages: readonly(seoPages),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    loadSeoData,
    saveSeoSettings,
    generateSitemap,
    createSeoPage,
    updateSeoPage,
    deleteSeoPage,

    // Helpers
    analyzeSeoScore,
    getSeoRecommendations
  }
}
