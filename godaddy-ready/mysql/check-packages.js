import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function checkPackages() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🔍 Checking packages table...')
    
    // Check if table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'packages'")
    if (tables.length === 0) {
      console.log('❌ Packages table does not exist!')
      await connection.end()
      return
    }

    // Check table structure
    const [structure] = await connection.execute('DESCRIBE packages')
    console.log('📋 Packages table structure:')
    console.table(structure)
    
    // Check data count
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM packages')
    console.log(`📊 Total packages: ${count[0].count}`)
    
    // Check featured packages
    const [featured] = await connection.execute('SELECT COUNT(*) as count FROM packages WHERE featured = 1')
    console.log(`⭐ Featured packages: ${featured[0].count}`)
    
    // Show sample data
    const [samples] = await connection.execute('SELECT id, title_ar, title_en, price, featured FROM packages LIMIT 5')
    console.log('📦 Sample packages:')
    console.table(samples)
    
    // Show image URLs
    const [images] = await connection.execute('SELECT id, title_en, image_url FROM packages LIMIT 10')
    console.log('🖼️ Image URLs:')
    images.forEach(pkg => {
      console.log(`ID: ${pkg.id}`)
      console.log(`Title: ${pkg.title_en}`)
      console.log(`Image: ${pkg.image_url}`)
      console.log('---')
    })
    
    await connection.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkPackages()
