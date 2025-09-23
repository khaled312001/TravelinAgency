import { createConnection } from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    // إنشاء اتصال بقاعدة البيانات
    const connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'wonderland_travel'
    })

    // جلب جميع المستخدمين
    const [rows] = await connection.execute(`
      SELECT * FROM users 
      ORDER BY created_at DESC
    `)

    await connection.end()

    return {
      success: true,
      data: rows
    }

  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error)
    return {
      success: false,
      message: 'حدث خطأ في جلب المستخدمين',
      error: error.message
    }
  }
})