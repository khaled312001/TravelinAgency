import type { UserResponse } from '~/types/user'

export default defineEventHandler(async (event): Promise<UserResponse> => {
  try {
    // التحقق من صلاحيات الإدارة
    const session = await getServerSession(event)
    if (!session?.user?.role || !['admin'].includes(session.user.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'غير مصرح بالوصول - صلاحيات المدير مطلوبة'
      })
    }

    const userId = getRouterParam(event, 'id')
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'معرف المستخدم مطلوب'
      })
    }

    // منع حذف المدير الرئيسي
    if (userId === '1') {
      throw createError({
        statusCode: 400,
        statusMessage: 'لا يمكن حذف المدير الرئيسي'
      })
    }

    // منع حذف المستخدم الحالي
    if (session.user.id?.toString() === userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'لا يمكن حذف حسابك الخاص'
      })
    }

    // محاكاة حذف المستخدم - في التطبيق الحقيقي سيتم الحذف من قاعدة البيانات
    console.log(`Deleting user with ID: ${userId}`)

    return {
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      error: error.message || 'فشل في حذف المستخدم'
    }
  }
})


