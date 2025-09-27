/**
 * Centralized image management composable
 * Handles all image paths and provides consistent image loading across the application
 */

export const useImages = () => {
  // Base configuration
  const config = {
    baseUrl: process.client ? window.location.origin : '',
    defaultImagePath: '/images/placeholder.svg',
    uploadsPath: '/uploads/',
    imagesPath: '/images/'
  }

  /**
   * Get the full URL for an image
   * @param {string} imagePath - The image path (relative or absolute)
   * @param {string} fallback - Fallback image path if the main image is not available
   * @returns {string} Full image URL
   */
  const getImageUrl = (imagePath, fallback = null) => {
    if (!imagePath) {
      return fallback || config.defaultImagePath
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }

    // If it starts with /, it's already a relative path from root
    if (imagePath.startsWith('/')) {
      return config.baseUrl + imagePath
    }

    // Otherwise, prepend the images path
    return config.baseUrl + config.imagesPath + imagePath
  }

  /**
   * Get site logo URL from settings or default
   * @param {object} settings - Site settings object
   * @returns {string} Logo URL
   */
  const getSiteLogo = (settings = null) => {
    if (settings?.site_logo) {
      return getImageUrl(settings.site_logo)
    }
    return getImageUrl('/images/logo.png')
  }

  /**
   * Get package image URL with fallback
   * @param {object} package - Package object
   * @returns {string} Package image URL
   */
  const getPackageImage = (pkg) => {
    if (!pkg) return config.defaultImagePath
    
    const imagePath = pkg.image || pkg.image_url || pkg.thumbnail
    return getImageUrl(imagePath, '/images/packages/placeholder.jpg')
  }

  /**
   * Get destination image URL with fallback
   * @param {object} destination - Destination object
   * @returns {string} Destination image URL
   */
  const getDestinationImage = (destination) => {
    if (!destination) return config.defaultImagePath
    
    const imagePath = destination.image || destination.image_url || destination.thumbnail
    return getImageUrl(imagePath, '/images/destinations/placeholder.jpg')
  }

  /**
   * Get user avatar URL with fallback
   * @param {object} user - User object
   * @returns {string} Avatar URL
   */
  const getUserAvatar = (user) => {
    if (!user) return config.defaultImagePath
    
    const imagePath = user.avatar || user.profile_image || user.image
    return getImageUrl(imagePath, '/images/users/default-avatar.png')
  }

  /**
   * Get uploaded image URL
   * @param {string} filename - Uploaded filename
   * @returns {string} Full uploaded image URL
   */
  const getUploadedImage = (filename) => {
    if (!filename) return config.defaultImagePath
    
    // Remove leading slash if present
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename
    
    return config.baseUrl + '/' + cleanFilename
  }

  /**
   * Get hero section background image
   * @param {string} type - Type of hero (desktop, mobile, etc.)
   * @returns {string} Hero background URL
   */
  const getHeroBackground = (type = 'desktop') => {
    const heroImages = {
      desktop: '/images/home/heroSection/hero-image.webp',
      mobile: '/images/home/heroSection/hero-image.webp',
      fallback: '/images/home/heroSection/hero-image.webp'
    }
    
    return getImageUrl(heroImages[type] || heroImages.fallback)
  }

  /**
   * Get service icon URL
   * @param {string} serviceName - Service name/key
   * @returns {string} Service icon URL
   */
  const getServiceIcon = (serviceName) => {
    if (!serviceName) return config.defaultImagePath
    
    const serviceIcons = {
      'custom_package': '/images/home/services/custom_package.jpg',
      'flight_reservations': '/images/home/services/flight_reservations.jpg',
      'hotel_reservations': '/images/home/services/hotel_reservations.jpg',
      'international_driving_license': '/images/home/services/international_driving_license.jpg',
      'support_24_7': '/images/home/services/support_24_7.jpg',
      'tour_packages': '/images/home/services/tour_packages.jpg',
      'tourism_consultation': '/images/home/services/tourism_consultation.jpg',
      'travel_insurance': '/images/home/services/travel_insurance.jpg',
      'visa_services': '/images/home/services/visa_services.jpg'
    }
    
    return getImageUrl(serviceIcons[serviceName] || config.defaultImagePath)
  }

  /**
   * Get about page hero image
   * @returns {string} About hero image URL
   */
  const getAboutHeroImage = () => {
    return getImageUrl('/images/about/hero-bg.jpeg')
  }

  /**
   * Get packages page hero image
   * @returns {string} Packages hero image URL
   */
  const getPackagesHeroImage = () => {
    return getImageUrl('/images/packages/home/packages-hero-bg.jpeg')
  }

  /**
   * Get 404 error image
   * @returns {string} 404 error image URL
   */
  const get404Image = () => {
    return getImageUrl('/images/404/travel-lost.svg')
  }

  /**
   * Get footer logo (white version)
   * @returns {string} Footer logo URL
   */
  const getFooterLogo = () => {
    return getImageUrl('/images/home/logo/WonderlandLogoWhite.svg')
  }

  /**
   * Get main logo (dark version)
   * @returns {string} Main logo URL
   */
  const getMainLogo = () => {
    return getImageUrl('/images/home/logo/WonderlandLogo.svg')
  }

  /**
   * Check if an image exists
   * @param {string} imagePath - Image path to check
   * @returns {Promise<boolean>} Whether the image exists
   */
  const imageExists = async (imagePath) => {
    if (!imagePath) return false
    
    try {
      const response = await fetch(getImageUrl(imagePath), { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.warn('Error checking image existence:', error)
      return false
    }
  }

  /**
   * Preload an image
   * @param {string} imagePath - Image path to preload
   * @returns {Promise<HTMLImageElement>} Preloaded image element
   */
  const preloadImage = (imagePath) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = getImageUrl(imagePath)
    })
  }

  return {
    // Configuration
    config,
    
    // Core functions
    getImageUrl,
    imageExists,
    preloadImage,
    
    // Specific image getters
    getSiteLogo,
    getPackageImage,
    getDestinationImage,
    getUserAvatar,
    getUploadedImage,
    getHeroBackground,
    getServiceIcon,
    getAboutHeroImage,
    getPackagesHeroImage,
    get404Image,
    getFooterLogo,
    getMainLogo
  }
}
