import type { UserResponse, UpdateUserRequest, User } from '~/types/user'

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

    const body = await readBody<UpdateUserRequest>(event)
    
    // التحقق من صحة البيانات
    if (body.email && !isValidEmail(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'البريد الإلكتروني غير صحيح'
      })
    }

    if (body.phone && !isValidPhone(body.phone)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'رقم الهاتف غير صحيح'
      })
    }

    if (body.role && !['admin', 'moderator', 'user'].includes(body.role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'الدور غير صحيح'
      })
    }

    if (body.status && !['active', 'inactive', 'suspended'].includes(body.status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'الحالة غير صحيحة'
      })
    }

    // محاكاة تحديث المستخدم - في التطبيق الحقيقي سيتم التحديث في قاعدة البيانات
    const mockUser: User = {
      id: parseInt(userId),
      email: body.email || 'user@example.com',
      full_name: body.full_name || 'مستخدم',
      phone: body.phone || '+966501234567',
      role: body.role || 'user',
      status: body.status || 'active',
      email_verified: true,
      phone_verified: false,
      bio: body.bio || '',
      date_of_birth: body.date_of_birth || '',
      gender: body.gender || 'male',
      nationality: body.nationality || 'Saudi Arabia',
      address: body.address || '',
      city: body.city || '',
      country: body.country || 'Saudi Arabia',
      postal_code: body.postal_code || '',
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
        },
        ...body.preferences
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
      last_login: '2024-01-15T10:30:00Z',
      login_count: 1
    }

    return {
      success: true,
      data: mockUser,
      message: 'تم تحديث بيانات المستخدم بنجاح'
    }
  } catch (error: any) {
    console.error('Error updating user:', error)
    return {
      success: false,
      error: error.message || 'فشل في تحديث بيانات المستخدم'
    }
  }
})

// دالة التحقق من صحة البريد الإلكتروني
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// دالة التحقق من صحة رقم الهاتف
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+966[0-9]{9}$/
  return phoneRegex.test(phone)
}


