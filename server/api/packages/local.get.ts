import { defineEventHandler } from 'h3';

// GET /api/packages/local - Get packages from local JSON file
export default defineEventHandler(async (event) => {
  try {
    // Load packages from local JSON file
    const packagesData = await $fetch('/packages-with-local-images.json');
    
    if (!packagesData || !Array.isArray(packagesData)) {
      return {
        success: false,
        message: 'No packages found in local data',
        data: []
      };
    }

    // Format packages data to match expected structure
    const formattedPackages = packagesData.map(packageData => ({
      id: packageData.id,
      title: packageData.title,
      title_ar: packageData.title,
      title_en: packageData.title, // You can add English translations later
      description: packageData.description,
      description_ar: packageData.description,
      description_en: packageData.description, // You can add English translations later
      price: packageData.price,
      duration: packageData.duration,
      duration_days: 7, // Default to 7 days
      image: packageData.image,
      image_url: packageData.image,
      destination: packageData.destination,
      location: packageData.destination,
      travel_period: packageData.destination,
      max_persons: 10, // Default
      category: 'international', // Default category
      featured: packageData.featured,
      status: packageData.status,
      features: [], // Empty for now
      itinerary: [], // Empty for now
      included: [], // Empty for now
      excluded: [], // Empty for now
      created_at: packageData.created_at,
      updated_at: packageData.updated_at
    }));

    return {
      success: true,
      message: 'Packages retrieved successfully from local data',
      data: formattedPackages
    };

  } catch (error: any) {
    console.error('Error fetching local packages:', error);
    
    return {
      success: false,
      message: 'Failed to fetch local packages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      data: []
    };
  }
});
