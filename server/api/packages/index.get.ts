import { defineEventHandler } from 'h3';
import { executeQuery } from '~/utils/database';

// GET /api/packages - Get all packages
export default defineEventHandler(async (event) => {
  try {
    // Get packages from MySQL database
    const packages = await executeQuery(`
      SELECT 
        id, 
        title_ar,
        title_en,
        description_ar,
        description_en,
        price,
        duration_days as duration,
        image_url as image,
        travel_period as location,
        max_persons,
        category,
        featured,
        active as status,
        features,
        itinerary,
        included,
        excluded,
        created_at,
        updated_at
      FROM packages 
      ORDER BY created_at DESC
    `);

    // If no packages from database, return demo data
    if (!packages || packages.length === 0) {
      const demoPackages = [
        {
          id: '1',
          title_ar: 'رحلة إلى دبي',
          title_en: 'Dubai Adventure',
          description_ar: 'رحلة رائعة إلى مدينة دبي الساحرة',
          description_en: 'Amazing trip to the beautiful city of Dubai',
          price: 2500,
          duration_days: 5,
          image_url: '/images/packages/dubai.jpg',
          travel_period: 'طوال السنة',
          max_persons: 8,
          category: 'international',
          featured: true,
          active: 1,
          features: JSON.stringify(['فندق 5 نجوم', 'وجبات كاملة', 'جولات سياحية']),
          itinerary: JSON.stringify(['اليوم 1: الوصول', 'اليوم 2: برج خليفة', 'اليوم 3: دبي مول']),
          included: JSON.stringify(['الإقامة', 'الوجبات', 'النقل']),
          excluded: JSON.stringify(['التأشيرة', 'التأمين']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2',
          title_ar: 'رحلة إلى تركيا',
          title_en: 'Turkey Experience',
          description_ar: 'اكتشف جمال تركيا وتاريخها العريق',
          description_en: 'Discover the beauty and rich history of Turkey',
          price: 1800,
          duration_days: 7,
          image_url: '/images/packages/turkey.jpg',
          travel_period: 'أبريل - أكتوبر',
          max_persons: 12,
          category: 'international',
          featured: false,
          active: 1,
          features: JSON.stringify(['فندق 4 نجوم', 'وجبات', 'جولات']),
          itinerary: JSON.stringify(['اليوم 1: اسطنبول', 'اليوم 2: آيا صوفيا', 'اليوم 3: كابادوكيا']),
          included: JSON.stringify(['الإقامة', 'الوجبات', 'النقل']),
          excluded: JSON.stringify(['التأشيرة', 'التأمين']),
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      const formattedDemoPackages = demoPackages.map(packageData => ({
        id: packageData.id,
        image_url: packageData.image_url,
        image: packageData.image_url,
        title_ar: packageData.title_ar,
        title_en: packageData.title_en,
        title: packageData.title_ar || packageData.title_en,
        description_ar: packageData.description_ar,
        description_en: packageData.description_en,
        description: packageData.description_ar || packageData.description_en,
        travel_period: packageData.travel_period,
        duration_days: packageData.duration_days,
        price: packageData.price,
        max_persons: packageData.max_persons,
        category: packageData.category,
        featured: packageData.featured,
        location: packageData.travel_period,
        status: packageData.active === 1 ? 'active' : 'inactive',
        features: JSON.parse(packageData.features),
        itinerary: JSON.parse(packageData.itinerary),
        included: JSON.parse(packageData.included),
        excluded: JSON.parse(packageData.excluded),
        created_at: packageData.created_at,
        updated_at: packageData.updated_at
      }));

      return {
        success: true,
        message: 'Demo packages loaded (database not available)',
        data: formattedDemoPackages
      };
    }

    // Helper function to get correct image path
    const getImagePath = (imageUrl: string | null) => {
      if (!imageUrl) return '/images/placeholder.svg';
      
      // If it's already a correct path, return as is
      if (imageUrl.startsWith('/images/packages/')) {
        return imageUrl;
      }
      
      // If it's an old path without /images/packages/, add the prefix
      if (!imageUrl.startsWith('/')) {
        return `/images/packages/${imageUrl}`;
      }
      
      return imageUrl;
    };

    // Format packages data
    const formattedPackages = packages.map(packageData => ({
      id: packageData.id,
      image_url: getImagePath(packageData.image),
      image: getImagePath(packageData.image),
      title_ar: packageData.title_ar,
      title_en: packageData.title_en,
      title: packageData.title_ar || packageData.title_en,
      description_ar: packageData.description_ar,
      description_en: packageData.description_en,
      description: packageData.description_ar || packageData.description_en,
      travel_period: packageData.location,
      duration_days: packageData.duration,
      price: packageData.price,
      max_persons: packageData.max_persons || 10,
      category: packageData.category || 'domestic',
      featured: packageData.featured,
      location: packageData.location,
      status: packageData.status === 1 ? 'active' : 'inactive',
      features: JSON.parse(packageData.features || '[]'),
      itinerary: JSON.parse(packageData.itinerary || '[]'),
      included: JSON.parse(packageData.included || '[]'),
      excluded: JSON.parse(packageData.excluded || '[]'),
      created_at: packageData.created_at,
      updated_at: packageData.updated_at
    }));

    return {
      success: true,
      message: 'Packages retrieved successfully',
      data: formattedPackages
    };

  } catch (error: any) {
    console.error('Error fetching packages:', error);
    
    // Return a more detailed error response
    return {
      success: false,
      message: 'Failed to fetch packages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      data: []
    };
  }
});
