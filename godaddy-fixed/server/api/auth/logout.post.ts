export default defineEventHandler(async (event) => {
  try {
    // Clear the auth token cookie
    setCookie(event, 'auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })

    return {
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    }

  } catch (error: any) {
    console.error('Logout API error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'حدث خطأ أثناء تسجيل الخروج'
    })
  }
})