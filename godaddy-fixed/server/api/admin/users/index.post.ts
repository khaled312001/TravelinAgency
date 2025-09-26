import type { UserResponse, CreateUserRequest, User } from '~/types/user'

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

    const body = await readBody<CreateUserRequest>(event)
    
    // التحقق من البيانات المطلوبة
    if (!body.email || !body.password || !body.full_name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'البريد الإلكتروني وكلمة المرور والاسم الكامل مطلوبة'
      })
    }

    // التحقق من صحة البيانات
    if (!isValidEmail(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'البريد الإلكتروني غير صحيح'
      })
    }

    if (body.password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
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

    // محاكاة إنشاء المستخدم - في التطبيق الحقيقي سيتم الحفظ في قاعدة البيانات
    const newUser: User = {
      id: Date.now(), // ID مؤقت
      email: body.email,
      full_name: body.full_name,
      phone: body.phone || '',
      role: body.role || 'user',
      status: body.status || 'active',
      email_verified: false,
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
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null,
      login_count: 0
    }

    return {
      success: true,
      data: newUser,
      message: 'تم إنشاء المستخدم بنجاح'
    }
  } catch (error: any) {
    console.error('Error creating user:', error)
    return {
      success: false,
      error: error.message || 'فشل في إنشاء المستخدم'
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


