import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function checkTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🔍 Checking users table structure...')
    
    const [rows] = await connection.execute('DESCRIBE users')
    console.log('📋 Users table structure:')
    console.table(rows)
    
    await connection.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkTable()
