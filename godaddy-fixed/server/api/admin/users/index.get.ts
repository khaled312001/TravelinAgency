import { createConnection } from 'mysql2/promise'
import type { UsersResponse, User } from '~/types/user'

export default defineEventHandler(async (event): Promise<UsersResponse> => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const search = query.search as string || ''
    const status = query.status as string || ''
    const role = query.role as string || ''

    // إنشاء اتصال بقاعدة البيانات
    const connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'wonderland_travel'
    })

    // جلب المستخدمين من قاعدة البيانات
    const [rows] = await connection.execute(`
      SELECT * FROM users 
      ORDER BY created_at DESC
    `)

    await connection.end()

    // تحويل البيانات إلى تنسيق مطلوب
    const users: User[] = (rows as any[]).map(user => {
      // تحديد الدور بناءً على الإيميل
      let role = 'user'
      if (user.email === 'admin@wonderland.com') {
        role = 'admin'
      } else if (user.email === 'moderator@wonderland.com') {
        role = 'moderator'
      }

      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name || user.name,
        phone: user.phone,
        role: role,
        status: user.status || 'active',
        email_verified: user.email_verified || false,
        phone_verified: user.phone_verified || false,
        bio: user.bio,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        nationality: user.nationality,
        address: user.address,
        city: user.city,
        country: user.country,
        postal_code: user.postal_code,
        preferences: user.preferences ? JSON.parse(user.preferences) : {},
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
        login_count: user.login_count || 0
      }
    })

    // تطبيق الفلاتر
    let filteredUsers = users

    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status)
    }

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }

    // تطبيق التصفح
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      success: true,
      data: {
        users: paginatedUsers,
        total: filteredUsers.length,
        page,
        limit
      }
    }
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return {
      success: false,
      error: error.message || 'فشل في جلب المستخدمين'
    }
  }
})