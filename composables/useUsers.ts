import type { User, CreateUserRequest, UpdateUserRequest, UsersResponse, UserResponse } from '~/types/user'

export const useUsers = () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * جلب جميع المستخدمين
   */
  const fetchUsers = async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    role?: string
  }) => {
    try {
      isLoading.value = true
      error.value = null

      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.role) queryParams.append('role', params.role)

      const response = await $fetch<UsersResponse>(`/api/admin/users?${queryParams.toString()}`)
      
      if (response.success && response.data) {
        users.value = response.data.users
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch users')
      }
    } catch (err: any) {
      console.error('Error fetching users:', err)
      error.value = err.message || 'Failed to fetch users'
      users.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * جلب مستخدم واحد
   */
  const fetchUser = async (userId: string | number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<UserResponse>(`/api/admin/users/${userId}`)
      
      if (response.success && response.data) {
        currentUser.value = response.data
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch user')
      }
    } catch (err: any) {
      console.error('Error fetching user:', err)
      error.value = err.message || 'Failed to fetch user'
      currentUser.value = null
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * إنشاء مستخدم جديد
   */
  const createUser = async (userData: CreateUserRequest) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<UserResponse>('/api/admin/users', {
        method: 'POST',
        body: userData
      })

      if (response.success && response.data) {
        // إضافة المستخدم الجديد إلى القائمة
        users.value.unshift(response.data)
        return response.data
      } else {
        throw new Error(response.error || 'Failed to create user')
      }
    } catch (err: any) {
      console.error('Error creating user:', err)
      error.value = err.message || 'Failed to create user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * تحديث مستخدم
   */
  const updateUser = async (userId: string | number, userData: UpdateUserRequest) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<UserResponse>(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: userData
      })

      if (response.success && response.data) {
        // تحديث المستخدم في القائمة
        const index = users.value.findIndex(u => u.id.toString() === userId.toString())
        if (index !== -1) {
          users.value[index] = response.data
        }
        
        // تحديث المستخدم الحالي إذا كان هو نفسه
        if (currentUser.value?.id.toString() === userId.toString()) {
          currentUser.value = response.data
        }
        
        return response.data
      } else {
        throw new Error(response.error || 'Failed to update user')
      }
    } catch (err: any) {
      console.error('Error updating user:', err)
      error.value = err.message || 'Failed to update user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * حذف مستخدم
   */
  const deleteUser = async (userId: string | number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<UserResponse>(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        // إزالة المستخدم من القائمة
        users.value = users.value.filter(u => u.id.toString() !== userId.toString())
        
        // مسح المستخدم الحالي إذا كان هو نفسه
        if (currentUser.value?.id.toString() === userId.toString()) {
          currentUser.value = null
        }
        
        return true
      } else {
        throw new Error(response.error || 'Failed to delete user')
      }
    } catch (err: any) {
      console.error('Error deleting user:', err)
      error.value = err.message || 'Failed to delete user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * تغيير حالة المستخدم
   */
  const toggleUserStatus = async (userId: string | number, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      return await updateUser(userId, { status: newStatus })
    } catch (err: any) {
      console.error('Error toggling user status:', err)
      throw err
    }
  }

  /**
   * تغيير دور المستخدم
   */
  const changeUserRole = async (userId: string | number, newRole: 'admin' | 'moderator' | 'user') => {
    try {
      return await updateUser(userId, { role: newRole })
    } catch (err: any) {
      console.error('Error changing user role:', err)
      throw err
    }
  }

  /**
   * البحث في المستخدمين
   */
  const searchUsers = async (query: string) => {
    try {
      return await fetchUsers({ search: query })
    } catch (err: any) {
      console.error('Error searching users:', err)
      throw err
    }
  }

  /**
   * تصفية المستخدمين
   */
  const filterUsers = async (filters: {
    status?: string
    role?: string
    page?: number
    limit?: number
  }) => {
    try {
      return await fetchUsers(filters)
    } catch (err: any) {
      console.error('Error filtering users:', err)
      throw err
    }
  }

  /**
   * إحصائيات المستخدمين
   */
  const getUserStats = computed(() => {
    const total = users.value.length
    const active = users.value.filter(u => u.status === 'active').length
    const inactive = users.value.filter(u => u.status === 'inactive').length
    const suspended = users.value.filter(u => u.status === 'suspended').length
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const newToday = users.value.filter(u => new Date(u.created_at) >= today).length
    
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const newThisWeek = users.value.filter(u => new Date(u.created_at) >= weekAgo).length
    
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const newThisMonth = users.value.filter(u => new Date(u.created_at) >= monthAgo).length

    return {
      total,
      active,
      inactive,
      suspended,
      newToday,
      newThisWeek,
      newThisMonth
    }
  })

  /**
   * دوال المساعدة
   */
  const getRoleName = (role: string) => {
    const roles = {
      admin: 'مدير',
      moderator: 'مشرف',
      user: 'مستخدم'
    }
    return roles[role as keyof typeof roles] || role
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusName = (status: string) => {
    const statuses = {
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'معلق'
    }
    return statuses[status as keyof typeof statuses] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      suspended: 'bg-orange-100 text-orange-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    // البيانات
    users: readonly(users),
    currentUser: readonly(currentUser),
    isLoading: readonly(isLoading),
    error: readonly(error),
    userStats: getUserStats,

    // العمليات
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    changeUserRole,
    searchUsers,
    filterUsers,

    // دوال المساعدة
    getRoleName,
    getRoleColor,
    getStatusName,
    getStatusColor,
    formatDate
  }
}


