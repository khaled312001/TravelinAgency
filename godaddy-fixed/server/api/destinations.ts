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

    // جلب جميع الوجهات
    const [rows] = await connection.execute(`
      SELECT * FROM destinations 
      ORDER BY created_at DESC
    `)

    await connection.end()

    return {
      success: true,
      data: rows
    }

  } catch (error) {
    console.error('خطأ في جلب الوجهات:', error)
    return {
      success: false,
      message: 'حدث خطأ في جلب الوجهات',
      error: error.message
    }
  }
})