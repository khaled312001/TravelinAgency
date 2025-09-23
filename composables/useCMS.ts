export const useCMS = () => {
  // Site settings
  const siteSettings = useState('cms.siteSettings', () => ({}))
  
  // Navigation
  const navigation = useState('cms.navigation', () => ({}))
  
  // Current page data
  const currentPage = useState('cms.currentPage', () => null)

  // Load site settings
  const loadSiteSettings = async () => {
    try {
      const response = await $fetch('/api/public/site-settings')
      siteSettings.value = response.data.settings
      return response.data.settings
    } catch (error) {
      console.error('Error loading site settings:', error)
      return {}
    }
  }

  // Load navigation
  const loadNavigation = async (menuName?: string) => {
    try {
      const url = menuName ? `/api/public/navigation?menu_name=${menuName}` : '/api/public/navigation'
      const response = await $fetch(url)
      navigation.value = response.data.menus
      return response.data.menus
    } catch (error) {
      console.error('Error loading navigation:', error)
      return {}
    }
  }

  // Load page by slug
  const loadPage = async (slug: string) => {
    try {
      const response = await $fetch(`/api/public/pages/${slug}`)
      currentPage.value = response.data
      return response.data
    } catch (error) {
      console.error('Error loading page:', error)
      return null
    }
  }

  // Get setting value
  const getSetting = (category: string, key: string, defaultValue: any = '') => {
    return siteSettings.value[category]?.[key] || defaultValue
  }

  // Get navigation menu
  const getMenu = (menuName: string) => {
    return navigation.value[menuName] || []
  }

  // Get current page data
  const getCurrentPage = () => {
    return currentPage.value
  }

  // Get page section by type
  const getPageSection = (sectionType: string) => {
    if (!currentPage.value?.sections) return null
    return currentPage.value.sections.find((section: any) => section.section_type === sectionType)
  }

  // Get page sections by type
  const getPageSections = (sectionType: string) => {
    if (!currentPage.value?.sections) return []
    return currentPage.value.sections.filter((section: any) => section.section_type === sectionType)
  }

  // Get content blocks from section
  const getSectionBlocks = (sectionId: number, blockType?: string) => {
    if (!currentPage.value?.sections) return []
    
    const section = currentPage.value.sections.find((s: any) => s.id === sectionId)
    if (!section?.content_blocks) return []
    
    if (blockType) {
      return section.content_blocks.filter((block: any) => block.block_type === blockType)
    }
    
    return section.content_blocks
  }

  // Initialize CMS data
  const initializeCMS = async () => {
    await Promise.all([
      loadSiteSettings(),
      loadNavigation()
    ])
  }

  return {
    // State
    siteSettings: readonly(siteSettings),
    navigation: readonly(navigation),
    currentPage: readonly(currentPage),
    
    // Methods
    loadSiteSettings,
    loadNavigation,
    loadPage,
    getSetting,
    getMenu,
    getCurrentPage,
    getPageSection,
    getPageSections,
    getSectionBlocks,
    initializeCMS
  }
}
