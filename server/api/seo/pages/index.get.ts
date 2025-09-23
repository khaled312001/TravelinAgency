export default defineEventHandler(async (event) => {
  try {
    // TODO: Replace with actual database query
    // For now, return mock data
    const seoPages = [
      {
        id: 1,
        name: 'الصفحة الرئيسية',
        title: 'Wonder Land - وكالة السفر الرائدة',
        description: 'اكتشف أجمل الوجهات السياحية مع Wonder Land',
        keywords: 'سفر، سياحة، حجوزات',
        ogImage: '',
        seoStatus: 'optimized',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'من نحن',
        title: 'من نحن - Wonder Land',
        description: 'تعرف على قصة Wonder Land وخدماتنا المتميزة',
        keywords: 'من نحن، شركة، خدمات',
        ogImage: '',
        seoStatus: 'needs-work',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'الحزم السياحية',
        title: 'الحزم السياحية - Wonder Land',
        description: 'استكشف أفضل الحزم السياحية والعروض',
        keywords: 'حزم، عروض، رحلات',
        ogImage: '',
        seoStatus: 'optimized',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'الوجهات',
        title: 'الوجهات السياحية - Wonder Land',
        description: 'اكتشف أجمل الوجهات السياحية حول العالم',
        keywords: 'وجهات، سياحة، دول',
        ogImage: '',
        seoStatus: 'not-optimized',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'اتصل بنا',
        title: 'اتصل بنا - Wonder Land',
        description: 'تواصل معنا للحصول على أفضل عروض السفر',
        keywords: 'اتصال، تواصل، خدمة العملاء',
        ogImage: '',
        seoStatus: 'needs-work',
        createdAt: new Date().toISOString()
      }
    ]

    return {
      success: true,
      data: seoPages
    }
  } catch (error) {
    console.error('Error fetching SEO pages:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'خطأ في جلب صفحات SEO'
    })
  }
})
