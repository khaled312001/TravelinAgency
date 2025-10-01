import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function checkCMSTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🔍 Checking CMS tables...')
    
    const tables = [
      'cms_pages',
      'cms_sections', 
      'cms_content_blocks',
      'cms_media',
      'cms_navigation',
      'cms_site_settings'
    ]
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`)
        if (rows.length > 0) {
          console.log(`✅ ${table} - exists`)
          
          // Count records
          const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`)
          console.log(`   📊 Records: ${count[0].count}`)
        } else {
          console.log(`❌ ${table} - not found`)
        }
      } catch (error) {
        console.log(`❌ ${table} - error: ${error.message}`)
      }
    }
    
    await connection.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkCMSTables()
