# MySQL Migration Guide - Wonder Land Traveling Agency

This guide will help you migrate from Supabase to MySQL for your travel agency project.

## 🚀 Quick Setup Steps

### 1. Install MySQL Database

Follow the MySQL setup instructions in the `mysql/` directory:

```bash
cd mysql
npm install
cp env.example .env
# Edit .env with your MySQL credentials
npm run setup
```

### 2. Update Environment Variables

Copy the environment template and configure your database:

```bash
cp env.example .env
```

Edit `.env` file:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=wonderland_user
DB_PASSWORD=your_secure_password
DB_NAME=wonderland_travel

# JWT Configuration (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Other configurations...
```

### 3. Install Additional Dependencies

The project now uses these additional packages (already in package.json):

- `mysql2` - MySQL database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

If you need to install them manually:

```bash
npm install mysql2 bcryptjs jsonwebtoken
```

### 4. Remove Supabase Dependencies (Optional)

You can remove Supabase-related packages if no longer needed:

```bash
npm uninstall @nuxtjs/supabase @supabase/supabase-js
```

### 5. Start the Application

```bash
npm run dev
```

## 🔐 Default Admin Login

After setup, you can login with:

- **Email**: `admin@wonderland.com`
- **Password**: `admin123`

⚠️ **Important**: Change this password after first login!

## 📋 What Changed

### ✅ Completed Migrations

1. **Database Schema**: Converted all Supabase tables to MySQL format
2. **Authentication System**: Replaced Supabase Auth with JWT-based authentication
3. **Admin System**: Updated admin middleware and login system
4. **API Routes**: Created new authentication API endpoints
5. **Configuration**: Updated Nuxt config to remove Supabase module

### 🔧 New Files Created

- `utils/database.ts` - MySQL database utilities and authentication functions
- `composables/useAuth.ts` - Authentication composable (replaces Supabase auth)
- `server/api/auth/login.post.ts` - Login API endpoint
- `server/api/auth/logout.post.ts` - Logout API endpoint
- `server/api/auth/me.get.ts` - Current user API endpoint
- `mysql/` directory - Complete MySQL database setup

### 📝 Updated Files

- `nuxt.config.ts` - Removed Supabase module, added MySQL config
- `middleware/admin.ts` - Updated to use new auth system
- `pages/admin/login.vue` - Updated to use new authentication
- `package.json` - Added MySQL dependencies

## 🔍 Testing the Migration

### 1. Test Database Connection

```bash
cd mysql
npm run test-connection
```

### 2. Test Admin Login

1. Go to `/admin/login`
2. Use the default credentials:
   - Email: `admin@wonderland.com`
   - Password: `admin123`
3. You should be redirected to `/admin/dashboard`

### 3. Test Admin Features

- Access admin dashboard
- Check user permissions
- Test logout functionality

## 🛠 Troubleshooting

### Database Connection Issues

**Error**: `connect ECONNREFUSED`
```bash
# Check if MySQL is running
sudo systemctl status mysql
# or
brew services list | grep mysql
```

**Error**: `Access denied for user`
```bash
# Create MySQL user and database
mysql -u root -p
CREATE DATABASE wonderland_travel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wonderland_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON wonderland_travel.* TO 'wonderland_user'@'localhost';
FLUSH PRIVILEGES;
```

### Authentication Issues

**Error**: `Invalid token`
- Check JWT_SECRET in environment variables
- Clear browser cookies and try again

**Error**: `User not found`
- Verify the admin user was created during setup
- Run the MySQL setup script again if needed

### Development vs Production

**Development**:
- Uses HTTP cookies (secure: false)
- Default admin credentials work
- Debug logging enabled

**Production**:
- Requires HTTPS for secure cookies
- Change default admin password
- Set strong JWT_SECRET
- Configure proper database credentials

## 🔐 Security Considerations

### 1. Change Default Credentials

```bash
# Create new admin user
cd mysql
node create-admin.js create
```

### 2. Secure JWT Secret

Generate a strong JWT secret:

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Database Security

- Use strong database passwords
- Limit database user privileges
- Enable SSL for database connections in production
- Regular security updates

## 📊 Database Schema

The MySQL database includes all the tables from your Supabase setup:

### Core Tables
- `users` - User accounts and authentication
- `admin_profiles` - Admin roles and permissions
- `packages` - Travel packages
- `destinations` - Travel destinations
- `bookings` - Customer bookings
- `contact_messages` - Customer inquiries
- `activity_logs` - System activity tracking
- `admin_settings` - Application settings

### Key Features
- **UUID Primary Keys** - All tables use UUID for better security
- **JSON Support** - Flexible data storage for complex fields
- **Automatic Timestamps** - Created/updated timestamps on all records
- **Activity Logging** - Complete audit trail of all actions
- **Role-based Access** - Flexible permission system

## 🚀 Next Steps

1. **Test thoroughly** - Verify all admin functions work
2. **Update other components** - Update any remaining Supabase references
3. **Configure production** - Set up production database and environment
4. **Backup strategy** - Implement regular database backups
5. **Monitoring** - Set up database monitoring and alerts

## 📞 Support

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Review MySQL error logs
3. Verify environment configuration
4. Test with minimal setup first

## ✅ Migration Checklist

- [ ] MySQL database installed and running
- [ ] Database schema created successfully
- [ ] Admin user created with proper credentials
- [ ] Environment variables configured
- [ ] Application starts without errors
- [ ] Admin login works correctly
- [ ] Admin dashboard accessible
- [ ] User permissions working
- [ ] Activity logging functional
- [ ] Default admin password changed
- [ ] JWT secret configured securely
- [ ] Production environment prepared

---

© 2025 Wonder Land Traveling Agency. Database migration completed successfully!
