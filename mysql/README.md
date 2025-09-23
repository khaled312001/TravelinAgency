# Wonder Land Traveling Agency - MySQL Database Setup

This directory contains the MySQL database setup for the Wonder Land Traveling Agency project.

## 📋 Prerequisites

- MySQL 8.0 or higher
- Node.js 16.0 or higher
- npm or yarn package manager

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd mysql
npm install
```

### 2. Configure Environment

Copy the environment example file and update the values:

```bash
cp env.example .env
```

Edit `.env` file with your MySQL configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=wonderland_travel
```

### 3. Setup Database

Run the setup script to create the database and initial admin user:

```bash
npm run setup
```

This will:
- Create the `wonderland_travel` database
- Create all necessary tables
- Insert initial configuration
- Create a default admin user

### 4. Test Connection

Verify the setup was successful:

```bash
npm run test-connection
```

## 🔐 Default Admin Account

After setup, you can login with:
- **Email**: `admin@wonderland.com`
- **Password**: `admin123`
- **Role**: `super_admin`

⚠️ **Important**: Change the default password after first login!

## 📊 Database Structure

### Core Tables

- **users** - User accounts and authentication
- **admin_profiles** - Admin roles and permissions
- **packages** - Travel packages
- **destinations** - Travel destinations
- **bookings** - Customer bookings
- **contact_messages** - Customer inquiries
- **activity_logs** - System activity tracking
- **admin_settings** - Application settings

### Key Features

- **UUID Primary Keys** - All tables use UUID for better security
- **JSON Support** - Flexible data storage for complex fields
- **Automatic Timestamps** - Created/updated timestamps on all records
- **Activity Logging** - Complete audit trail of all actions
- **Role-based Access** - Flexible permission system

## 🛠 Management Scripts

### Create Additional Admin Users

```bash
node create-admin.js create
```

### List All Admin Users

```bash
node create-admin.js list
```

### Test Database Connection

```bash
node setup.js test
```

## 🔧 Manual Database Setup

If you prefer to set up the database manually:

### 1. Create Database

```sql
CREATE DATABASE wonderland_travel 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 2. Import Schema

```bash
mysql -u your_user -p wonderland_travel < schema.sql
```

### 3. Create MySQL User (Optional)

```sql
CREATE USER 'wonderland_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON wonderland_travel.* TO 'wonderland_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🔐 Security Considerations

### Password Security
- All passwords are hashed using bcrypt with 12 rounds
- Never store plain text passwords
- Default admin password should be changed immediately

### Database Security
- Use strong database passwords
- Limit database user privileges
- Enable SSL for database connections in production
- Regular security updates

### Admin Roles

1. **super_admin** - Full system access
   - Manage users and admins
   - System settings
   - All content management

2. **admin** - Standard administrative access
   - Content management
   - Customer support
   - Analytics viewing

3. **moderator** - Limited access
   - Basic content editing
   - Message handling

## 🔍 Troubleshooting

### Common Issues

**Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Ensure MySQL server is running
- Check host and port configuration
- Verify firewall settings

**Access Denied**
```
Error: Access denied for user
```
- Verify username and password
- Check user privileges
- Ensure database exists

**Table Doesn't Exist**
```
Error: Table 'wonderland_travel.users' doesn't exist
```
- Run the setup script again
- Check if schema was imported correctly

### Reset Database

To completely reset the database:

```bash
# Drop existing database
mysql -u root -p -e "DROP DATABASE IF EXISTS wonderland_travel;"

# Run setup again
npm run setup
```

## 📈 Performance Optimization

### Indexes
The schema includes optimized indexes for:
- User lookups
- Admin role queries
- Package searches
- Booking queries
- Activity log searches

### Connection Pooling
The configuration uses connection pooling for better performance:
- Maximum 10 concurrent connections
- Automatic reconnection
- Query timeout handling

## 🔄 Migration from Supabase

If migrating from the existing Supabase setup:

1. Export data from Supabase
2. Run MySQL setup
3. Import data using provided migration scripts
4. Update application configuration
5. Test thoroughly

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review MySQL error logs
3. Verify environment configuration
4. Test with minimal setup first

## 📝 License

This database setup is part of the Wonder Land Traveling Agency project.

---

© 2025 Wonder Land Traveling Agency. All rights reserved.
