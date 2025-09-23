import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Database connection configuration
let pool: mysql.Pool | null = null

export function createDatabasePool() {
  if (!pool) {
    // Use environment variables directly for server-side
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonderland_travel'
    }
    
    // Debug logging
    console.log('🔧 MySQL Config:', {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password ? '[SET]' : '[EMPTY]',
      database: config.database
    })
    
    pool = mysql.createPool({
      ...config,
      charset: 'utf8mb4',
      timezone: '+00:00',
      connectionLimit: 10,
      queueLimit: 0,
      waitForConnections: true
    })
  }
  
  return pool
}

export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const pool = createDatabasePool()
  
  try {
    const [rows] = await pool.execute(sql, params)
    return rows as T[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function findOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await executeQuery<T>(sql, params)
  return rows.length > 0 ? rows[0] : null
}

// Authentication utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function generateJWT(payload: any, expiresIn: string = '24h'): string {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, { expiresIn })
}

export function verifyJWT(token: string): any {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// User and admin management
export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  status?: string
  created_at: Date
  updated_at: Date
}

export interface AdminProfile {
  id?: string
  user_id?: string
  role?: 'admin' | 'super_admin' | 'moderator'
  permissions?: Record<string, boolean>
  created_at?: Date
  updated_at?: Date
}

export async function authenticateUser(email: string, password: string): Promise<{ user: User & AdminProfile } | null> {
  try {
    // Get user with password for verification
    const userWithPassword = await findOne<User & { password: string }>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    
    if (!userWithPassword) {
      return null
    }
    
    // Verify password
    const isValid = await verifyPassword(password, userWithPassword.password)
    if (!isValid) {
      return null
    }
    
    // Get admin profile
    const adminProfile = await findOne<AdminProfile>(
      'SELECT * FROM admin_profiles WHERE user_id = ?',
      [userWithPassword.id]
    )
    
    const user = {
      ...userWithPassword,
      role: adminProfile?.role || 'admin',
      permissions: adminProfile?.permissions ? JSON.parse(adminProfile.permissions) : {}
    }
    
    return { user }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function getUserById(id: string): Promise<(User & AdminProfile) | null> {
  const sql = `
    SELECT u.id, u.email, u.full_name, u.phone, u.status, u.created_at, u.updated_at,
           ap.role, ap.permissions
    FROM users u
    LEFT JOIN admin_profiles ap ON u.id = ap.user_id
    WHERE u.id = ?
  `
  
  const result = await findOne<User & AdminProfile>(sql, [id])
  
  if (result) {
    // Handle permissions field - it might be a string or already parsed JSON
    if (result.permissions && typeof result.permissions === 'string') {
      try {
        result.permissions = JSON.parse(result.permissions)
      } catch (error) {
        console.error('Error parsing permissions JSON:', error)
        result.permissions = {}
      }
    } else if (!result.permissions) {
      result.permissions = {}
    }
    
    // Set default role if not present
    if (!result.role) {
      result.role = 'admin'
    }
  }
  
  return result
}

export async function createUser(userData: {
  email: string
  password: string
  full_name?: string
  phone?: string
}): Promise<string> {
  const hashedPassword = await hashPassword(userData.password)
  
  const sql = `
    INSERT INTO users (email, password, full_name, phone, email_verified, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, TRUE, 'active', NOW(), NOW())
  `
  
  const params = [
    userData.email,
    hashedPassword,
    userData.full_name || null,
    userData.phone || null
  ]

  const result = await executeQuery(sql, params) as any
  return result.insertId
}

export async function createAdminProfile(userId: string, role: 'admin' | 'super_admin' | 'moderator' = 'admin'): Promise<void> {
  const defaultPermissions = {
    manage_users: role === 'super_admin',
    manage_packages: true,
    manage_destinations: true,
    manage_bookings: true,
    manage_messages: true,
    view_analytics: true,
    manage_settings: role === 'super_admin',
    manage_admins: role === 'super_admin'
  }
  
  const sql = `
    INSERT INTO admin_profiles (user_id, role, permissions, created_at, updated_at)
    VALUES (?, ?, ?, NOW(), NOW())
  `
  
  await executeQuery(sql, [userId, role, JSON.stringify(defaultPermissions)])
}

export async function logActivity(
  userId: string,
  action: string,
  tableName?: string,
  recordId?: string,
  title?: string,
  type: string = 'general',
  details: Record<string, any> = {},
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const sql = `
    INSERT INTO activity_logs (user_id, action, table_name, record_id, title, type, details, ip_address, user_agent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `
  
  const params = [
    userId,
    action,
    tableName || null,
    recordId || null,
    title || null,
    type,
    JSON.stringify(details),
    ipAddress || null,
    userAgent || null
  ]
  
  await executeQuery(sql, params)
}
