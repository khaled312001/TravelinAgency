# Vercel Environment Variables Setup

## Required Environment Variables

You need to set these environment variables in your Vercel project settings:

### 1. Database Configuration
```
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

### 2. JWT Configuration
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Site Configuration
```
PUBLIC_SITE_URL=https://travelin-agency.vercel.app
NODE_ENV=production
```

### 4. Twilio Configuration (Optional)
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the correct value
5. Make sure to set them for "Production" environment
6. Redeploy your project

## Database Options for Vercel

Since Vercel doesn't provide MySQL hosting, you'll need an external database:

### Recommended Options:
1. **PlanetScale** (MySQL-compatible, serverless)
2. **Railway** (MySQL hosting)
3. **AWS RDS** (MySQL hosting)
4. **DigitalOcean Managed Database**
5. **Supabase** (PostgreSQL, but can work with some modifications)

## Testing Your Setup

After setting up environment variables, test these endpoints:

1. **Basic Function Test**: `https://your-domain.vercel.app/api/test`
2. **Health Check**: `https://your-domain.vercel.app/api/health`
3. **Database Test**: `https://your-domain.vercel.app/api/packages`

## Common Issues

### 1. Database Connection Refused
- Check if your database host allows connections from Vercel's IP ranges
- Verify your database credentials
- Ensure your database is running and accessible

### 2. Function Timeout
- Database queries might be taking too long
- Consider optimizing your queries
- Check if your database is properly indexed

### 3. Environment Variables Not Loading
- Make sure variables are set for the correct environment (Production)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

## Quick Fix for Testing

If you want to test without a database, you can temporarily modify the API routes to return mock data instead of querying the database.
