import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function createAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    })

    console.log('🔍 Checking if admin user exists...')
    
    // Check if admin user exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@wonderland.com']
    )
    
    if (existingUsers.length > 0) {
      console.log('✅ Admin user already exists')
      const userId = existingUsers[0].id
      
      // Check if admin profile exists
      const [existingProfiles] = await connection.execute(
        'SELECT id FROM admin_profiles WHERE user_id = ?',
        [userId]
      )
      
      if (existingProfiles.length === 0) {
        console.log('📝 Creating admin profile...')
        await connection.execute(
          `INSERT INTO admin_profiles (user_id, role, permissions) VALUES (?, 'super_admin', ?)`,
          [userId, JSON.stringify({
            manage_users: true,
            manage_packages: true,
            manage_destinations: true,
            manage_bookings: true,
            manage_contacts: true,
            manage_cms: true,
            view_analytics: true
          })]
        )
        console.log('✅ Admin profile created')
      } else {
        console.log('✅ Admin profile already exists')
      }
    } else {
      console.log('📝 Creating admin user...')
      const [result] = await connection.execute(
        `INSERT INTO users (name, email, password, email_verified_at) VALUES (?, ?, ?, NOW())`,
        [
          'System Administrator',
          'admin@wonderland.com',
          '$2b$12$MBczo9oAOYkNyxvn4Th.BubTtKJ..xOBkpAK5HBpRJWbRmL53McAm' // admin123 hashed
        ]
      )
      
      const userId = result.insertId
      console.log('✅ Admin user created with ID:', userId)
      
      // Create admin profile
      console.log('📝 Creating admin profile...')
      await connection.execute(
        `INSERT INTO admin_profiles (user_id, role, permissions) VALUES (?, 'super_admin', ?)`,
        [userId, JSON.stringify({
          manage_users: true,
          manage_packages: true,
          manage_destinations: true,
          manage_bookings: true,
          manage_contacts: true,
          manage_cms: true,
          view_analytics: true
        })]
      )
      console.log('✅ Admin profile created')
    }
    
    await connection.end()
    console.log('🎉 Admin setup completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createAdmin()
