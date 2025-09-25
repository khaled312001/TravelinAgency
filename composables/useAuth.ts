import type { User, AdminProfile } from '~/utils/database'

// Cache-busting comment - v2.5
interface AuthUser extends User {
  role?: 'admin' | 'super_admin' | 'moderator'
  permissions?: Record<string, boolean>
}

export const useAuth = () => {
  // Use useCookie for persistent storage that survives page refreshes
  const userCookie = useCookie<AuthUser | null>('auth.user', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  
  const user = useState<AuthUser | null>('auth.user', () => userCookie.value)
  const loading = useState<boolean>('auth.loading', () => false)
  const error = useState<string>('auth.error', () => '')

  // Login function
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = ''

    try {
      const response = await $fetch<{ success: boolean; data: { user: AuthUser; token: string } }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success && response.data.user && response.data.token) {
        user.value = response.data.user
        userCookie.value = response.data.user // Store user data in cookie for persistence
        
        // Token is already stored in cookie by the server
        // No need to store it again on client side

        return { success: true }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Handle specific error messages
      if (err.data?.message) {
        error.value = err.data.message
      } else if (err.message === 'Invalid login credentials') {
        error.value = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      } else {
        error.value = 'حدث خطأ أثناء تسجيل الدخول'
      }
      
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      const response = await $fetch<{ success: boolean; message: string }>('/api/auth/logout', { method: 'POST' })
      console.log('Logout response:', response.message)
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      userCookie.value = null // Clear user data from cookie
      
      // Clear token cookie (server will handle this)
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = null
      
      await navigateTo('/admin/login')
    }
  }

  // Check authentication status
  const checkAuth = async (silent = false) => {
    if (user.value) {
      if (!silent) console.log('👤 User already in state:', user.value.email, 'role:', user.value.role)
      return user.value
    }

    // Check if token cookie exists first
    const tokenCookie = useCookie('auth-token')
    if (!tokenCookie.value) {
      if (!silent) console.log('🔍 No auth token found in cookie')
      user.value = null
      return null
    }

    try {
      if (!silent) console.log('🔍 Fetching user data from API...')
      const response = await $fetch<{ success: boolean; data: { user: AuthUser } }>('/api/auth/me')
      
      if (response.success && response.data.user) {
        user.value = response.data.user
        userCookie.value = response.data.user // Store user data in cookie for persistence
        if (!silent) console.log('✅ User authenticated:', user.value.email, 'role:', user.value.role)
        return user.value
      } else {
        if (!silent) console.log('❌ Invalid response from auth API')
        user.value = null
        userCookie.value = null // Clear user data from cookie
        return null
      }
    } catch (err: any) {
      // Only log errors if not silent mode and not a 401 (which is expected for unauthenticated users)
      if (!silent && err.statusCode !== 401) {
        console.error('❌ Auth check error:', err)
      }
      
      user.value = null
      userCookie.value = null // Clear user data from cookie
      
      // If it's a 401 error, clear any existing token silently
      if (err.statusCode === 401) {
        tokenCookie.value = null
        if (!silent) console.log('🔒 Cleared invalid token')
      }
      
      return null
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!user.value) return null

    try {
      const response = await $fetch<{ success: boolean; data: { user: AuthUser } }>('/api/auth/me')
      
      if (response.success && response.data.user) {
        user.value = response.data.user
        userCookie.value = response.data.user // Store user data in cookie for persistence
        return user.value
      } else {
        user.value = null
        userCookie.value = null // Clear user data from cookie
        return null
      }
    } catch (err) {
      console.error('Refresh user error:', err)
      user.value = null
      userCookie.value = null // Clear user data from cookie
      return null
    }
  }

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user.value || !user.value.permissions) return false
    return user.value.permissions[permission] === true
  }

  // Check if user has specific role
  const hasRole = (role: string | string[]): boolean => {
    if (!user.value || !user.value.role) return false
    
    if (Array.isArray(role)) {
      return role.includes(user.value.role)
    }
    
    return user.value.role === role
  }

  // Check if user is admin
  const isAdmin = computed(() => {
    return hasRole(['admin', 'super_admin', 'moderator'])
  })

  // Check if user is super admin
  const isSuperAdmin = computed(() => {
    return hasRole('super_admin')
  })

  // Get user initials for avatar
  const userInitials = computed(() => {
    if (!user.value?.full_name) return 'AD'
    return user.value.full_name
      .split(' ')
      .map(name => name.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })

  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    isAdmin,
    isSuperAdmin,
    userInitials,
    
    // Methods
    login,
    logout,
    checkAuth,
    refreshUser,
    hasPermission,
    hasRole
  }
}
