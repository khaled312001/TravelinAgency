import { verifyJWT, getUserById } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'auth-token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No authentication token found'
      })
    }

    // Verify JWT token
    let payload
    try {
      payload = verifyJWT(token)
    } catch (tokenError) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }

    // Get current user data from database
    const user = await getUserById(payload.userId.toString())
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found or inactive'
      })
    }

    // Note: Admin role checking is now handled in middleware, not here
    // This endpoint should return user info for any authenticated user

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
        user: safeUser
      }
    }

  } catch (error: any) {
    console.error('Auth me API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
