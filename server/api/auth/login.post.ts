import { authenticateUser, generateJWT } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Authenticate user
    const result = await authenticateUser(email, password)
    
    if (!result) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid login credentials'
      })
    }

    const { user } = result

    // Check if user has admin role
    if (!user.role || !['admin', 'super_admin', 'moderator'].includes(user.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'ليس لديك صلاحيات للوصول إلى لوحة التحكم'
      })
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }
    
    const token = generateJWT(tokenPayload, '7d') // Match cookie expiration

    // Set token in HTTP-only cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
      // Remove domain setting to work with localhost
    })

    // Log login activity (simplified)
    console.log('✅ Admin login successful:', {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: new Date().toISOString()
    })

    // Remove sensitive data from response
    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      permissions: user.permissions,
      status: user.status
    }

    return {
      success: true,
      data: {
        user: safeUser,
        token
      }
    }

  } catch (error: any) {
    console.error('Login API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during login'
    })
  }
})
