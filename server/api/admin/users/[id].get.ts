import type { UserResponse, User } from '~/types/user'

export default defineEventHandler(async (event): Promise<UserResponse> => {
  try {
    // التحقق من صلاحيات الإدارة
    const session = await getServerSession(event)
    if (!session?.user?.role || !['admin', 'moderator'].includes(session.user.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'غير مصرح بالوصول'
      })
    }

    const userId = getRouterParam(event, 'id')
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'معرف المستخدم مطلوب'
      })
    }

    // محاكاة البيانات - في التطبيق الحقيقي ستأتي من قاعدة البيانات
    const mockUsers: User[] = [
      {
        id: 1,
        email: 'admin@wonderland.com',
        full_name: 'مدير النظام',
        phone: '+966501234567',
        role: 'admin',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        bio: 'مدير النظام الرئيسي',
        date_of_birth: '1985-01-15',
        gender: 'male',
        nationality: 'Saudi Arabia',
        address: 'الرياض، المملكة العربية السعودية',
        city: 'الرياض',
        country: 'Saudi Arabia',
        postal_code: '12345',
        preferences: {
          language: 'ar',
          timezone: 'Asia/Riyadh',
          notifications: {
            email: true,
            sms: true,
            push: true
          },
          privacy: {
            profile_visibility: 'public',
            show_email: false,
            show_phone: false
          }
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        last_login: '2024-01-15T10:30:00Z',
        login_count: 45
      },
      {
        id: 2,
        email: 'moderator@wonderland.com',
        full_name: 'مشرف المحتوى',
        phone: '+966507654321',
        role: 'moderator',
        status: 'active',
        email_verified: true,
        phone_verified: false,
        bio: 'مشرف المحتوى والمراجعة',
        date_of_birth: '1990-05-20',
        gender: 'female',
        nationality: 'Saudi Arabia',
        address: 'جدة، المملكة العربية السعودية',
        city: 'جدة',
        country: 'Saudi Arabia',
        postal_code: '21432',
        preferences: {
          language: 'ar',
          timezone: 'Asia/Riyadh',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          privacy: {
            profile_visibility: 'private',
            show_email: false,
            show_phone: false
          }
        },
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-10T00:00:00Z',
        last_login: '2024-01-14T15:45:00Z',
        login_count: 23
      }
    ]

    const user = mockUsers.find(u => u.id.toString() === userId)
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'المستخدم غير موجود'
      })
    }

    return {
      success: true,
      data: user
    }
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return {
      success: false,
      error: error.message || 'فشل في جلب بيانات المستخدم'
    }
  }
})


