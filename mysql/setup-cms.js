import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

async function setupCMS() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🚀 Starting CMS tables setup...')
    
    // Read schema file and extract CMS tables only
    const schemaContent = fs.readFileSync('schema.sql', 'utf8')
    
    // Split by sections and get CMS section
    const sections = schemaContent.split('-- =============================================')
    const cmsSection = sections.find(section => section.includes('CMS Tables for Content Management'))
    
    if (!cmsSection) {
      throw new Error('CMS section not found in schema.sql')
    }
    
    // Extract SQL statements for CMS tables
    const cmsSQL = cmsSection.split('\n').filter(line => 
      line.trim().startsWith('CREATE TABLE') || 
      line.trim().startsWith('INSERT IGNORE INTO cms_') ||
      line.trim().startsWith('INSERT IGNORE INTO cms_pages') ||
      line.trim().startsWith('INSERT IGNORE INTO cms_site_settings') ||
      line.trim().startsWith('INSERT IGNORE INTO cms_navigation')
    ).join('\n')
    
    console.log('📋 Creating CMS tables...')
    
    // Execute CMS SQL
    const statements = cmsSQL.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement.trim() + ';')
          console.log('✅ Executed:', statement.trim().substring(0, 50) + '...')
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log('⚠️  Table already exists, skipping...')
          } else {
            console.error('❌ Error executing statement:', error.message)
          }
        }
      }
    }
    
    await connection.end()
    console.log('🎉 CMS setup completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

setupCMS()
