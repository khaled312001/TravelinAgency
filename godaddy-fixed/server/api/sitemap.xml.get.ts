export default defineEventHandler(async (event) => {
  try {
    // Set content type to XML
    setHeader(event, 'Content-Type', 'application/xml')
    
    // TODO: Replace with actual pages from database
    const pages = [
      {
        url: '/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: '/about',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/packages',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        url: '/destinations',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        url: '/contact',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.7'
      }
    ]

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>https://wonderland.com${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return sitemap
  } catch (error) {
    console.error('Error generating sitemap:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'خطأ في إنشاء خريطة الموقع'
    })
  }
})
