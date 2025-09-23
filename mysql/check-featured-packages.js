import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function checkFeaturedPackages() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🔍 Checking featured packages...')
    
    const [packages] = await connection.execute(`
      SELECT 
        id, 
        title_ar,
        title_en,
        description_ar,
        description_en,
        price,
        duration_days,
        image_url,
        travel_period,
        featured,
        active
      FROM packages 
      WHERE featured = 1 AND active = 1
      ORDER BY created_at DESC
    `)
    
    console.log(`📦 Found ${packages.length} featured packages:`)
    packages.forEach((pkg, index) => {
      console.log(`\n${index + 1}. ${pkg.title_ar} (${pkg.title_en})`)
      console.log(`   Price: ${pkg.price} SAR`)
      console.log(`   Duration: ${pkg.duration_days} days`)
      console.log(`   Travel Period: ${pkg.travel_period || 'N/A'}`)
      console.log(`   Image: ${pkg.image_url}`)
      console.log(`   Description AR: ${pkg.description_ar ? pkg.description_ar.substring(0, 100) + '...' : 'N/A'}`)
    })
    
    await connection.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkFeaturedPackages()
