// MySQL Database Configuration for Wonder Land Traveling Agency
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'wonderland_user',
    password: process.env.DB_PASSWORD || 'wonderland_pass',
    database: process.env.DB_NAME || 'wonderland_travel',
    charset: 'utf8mb4',
    timezone: '+00:00',
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Create connection pool
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Database connection class
class Database {
    constructor() {
        this.pool = pool;
    }

    // Execute query
    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    // Get single record
    async findOne(sql, params = []) {
        const rows = await this.query(sql, params);
        return rows.length > 0 ? rows[0] : null;
    }

    // Begin transaction
    async beginTransaction() {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();
        return connection;
    }

    // Commit transaction
    async commit(connection) {
        await connection.commit();
        connection.release();
    }

    // Rollback transaction
    async rollback(connection) {
        await connection.rollback();
        connection.release();
    }

    // Close connection pool
    async close() {
        await this.pool.end();
    }
}

// User authentication functions
class Auth {
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    static async verifyPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    static async createUser(userData) {
        const db = new Database();
        const hashedPassword = await this.hashPassword(userData.password);
        
        const sql = `
            INSERT INTO users (email, password_hash, full_name, phone, email_verified, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            userData.email,
            hashedPassword,
            userData.full_name || null,
            userData.phone || null,
            userData.email_verified || false,
            userData.status || 'active'
        ];

        const result = await db.query(sql, params);
        return result.insertId;
    }

    static async authenticateUser(email, password) {
        const db = new Database();
        
        const user = await db.findOne(
            'SELECT * FROM users WHERE email = ? AND status = "active"',
            [email]
        );

        if (!user) {
            return null;
        }

        const isValidPassword = await this.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            return null;
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        // Remove password hash from returned user object
        delete user.password_hash;
        return user;
    }

    static async getUserWithAdminProfile(userId) {
        const db = new Database();
        
        const sql = `
            SELECT u.*, ap.role, ap.permissions
            FROM users u
            LEFT JOIN admin_profiles ap ON u.id = ap.user_id
            WHERE u.id = ? AND u.status = 'active'
        `;

        return await db.findOne(sql, [userId]);
    }

    static async createAdminUser(userData, adminRole = 'admin') {
        const db = new Database();
        const connection = await db.beginTransaction();

        try {
            // Create user
            const hashedPassword = await this.hashPassword(userData.password);
            
            const userSql = `
                INSERT INTO users (email, password_hash, full_name, phone, email_verified, status)
                VALUES (?, ?, ?, ?, TRUE, 'active')
            `;
            
            const userParams = [
                userData.email,
                hashedPassword,
                userData.full_name,
                userData.phone || null
            ];

            const [userResult] = await connection.execute(userSql, userParams);
            const userId = userResult.insertId;

            // Create admin profile
            const adminSql = `
                INSERT INTO admin_profiles (user_id, role, permissions)
                VALUES (?, ?, ?)
            `;

            const defaultPermissions = {
                manage_users: adminRole === 'super_admin',
                manage_packages: true,
                manage_destinations: true,
                manage_bookings: true,
                manage_messages: true,
                view_analytics: true,
                manage_settings: adminRole === 'super_admin',
                manage_admins: adminRole === 'super_admin'
            };

            const adminParams = [userId, adminRole, JSON.stringify(defaultPermissions)];
            await connection.execute(adminSql, adminParams);

            // Log activity
            const logSql = `
                INSERT INTO activity_logs (user_id, action, table_name, record_id, title, type, details)
                VALUES (?, 'admin_created', 'admin_profiles', ?, ?, 'admin', ?)
            `;

            const logParams = [
                userId,
                userId,
                `Admin Account Created: ${userData.full_name}`,
                JSON.stringify({ role: adminRole, email: userData.email })
            ];

            await connection.execute(logSql, logParams);

            await db.commit(connection);
            return userId;

        } catch (error) {
            await db.rollback(connection);
            throw error;
        }
    }
}

// Activity logging function
async function logActivity(userId, action, tableName = null, recordId = null, title = null, type = 'general', details = {}, ipAddress = null, userAgent = null) {
    const db = new Database();
    
    const sql = `
        INSERT INTO activity_logs (user_id, action, table_name, record_id, title, type, details, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        userId,
        action,
        tableName,
        recordId,
        title,
        type,
        JSON.stringify(details),
        ipAddress,
        userAgent
    ];

    return await db.query(sql, params);
}

module.exports = {
    Database,
    Auth,
    logActivity,
    dbConfig
};
