export interface User {
  id: number | string
  email: string
  full_name?: string
  name?: string
  phone?: string
  role: 'admin' | 'moderator' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  email_verified: boolean
  phone_verified?: boolean
  avatar_url?: string
  bio?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  nationality?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  preferences?: UserPreferences
  created_at: string
  updated_at: string
  last_login?: string
  login_count?: number
}

export interface UserPreferences {
  language: string
  timezone: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends'
    show_email: boolean
    show_phone: boolean
  }
}

export interface CreateUserRequest {
  email: string
  password: string
  full_name: string
  phone?: string
  role?: 'admin' | 'moderator' | 'user'
  status?: 'active' | 'inactive' | 'suspended'
  bio?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  nationality?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
}

export interface UpdateUserRequest {
  email?: string
  full_name?: string
  phone?: string
  role?: 'admin' | 'moderator' | 'user'
  status?: 'active' | 'inactive' | 'suspended'
  bio?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  nationality?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  preferences?: Partial<UserPreferences>
}

export interface UserResponse {
  success: boolean
  data?: User
  message?: string
  error?: string
}

export interface UsersResponse {
  success: boolean
  data?: {
    users: User[]
    total: number
    page: number
    limit: number
  }
  message?: string
  error?: string
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  new_today: number
  new_this_week: number
  new_this_month: number
}


