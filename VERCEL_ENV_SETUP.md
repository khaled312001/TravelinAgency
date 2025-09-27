# Vercel Environment Variables Setup

## Required Environment Variables

To fix the 500 error on Vercel, you need to set these environment variables in your Vercel dashboard:

### 1. Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Select your project: `travelin-agency-nlcs`
3. Go to **Settings** → **Environment Variables**

### 2. Add These Variables

#### Basic Configuration
```
NODE_ENV=production
PUBLIC_SITE_URL=https://travelin-agency-nlcs.vercel.app
```

#### Database Configuration (Optional - for full functionality)
```
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-super-secret-jwt-key-here
```

#### Optional: Twilio Configuration (for WhatsApp notifications)
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone
```

### 3. Database Options

Since Vercel doesn't provide MySQL hosting, you have these options:

#### Option 1: Use Demo Mode (Recommended for testing)
- Don't set any database environment variables
- The site will work with demo data
- Perfect for testing the deployment

#### Option 2: Use PlanetScale (Recommended for production)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a free account
3. Create a new database
4. Get connection details
5. Set the database environment variables in Vercel

#### Option 3: Use Railway
1. Go to [railway.app](https://railway.app)
2. Create a MySQL database
3. Get connection details
4. Set the database environment variables in Vercel

#### Option 4: Use Your GoDaddy MySQL
1. Enable remote access in cPanel
2. Add Vercel's IP ranges to allowed hosts
3. Use your GoDaddy database credentials

### 4. After Setting Variables

1. **Redeploy** your project (Vercel will automatically redeploy when you add environment variables)
2. **Test the endpoints**:
   - `https://travelin-agency-nlcs.vercel.app/api/test`
   - `https://travelin-agency-nlcs.vercel.app/api/debug`
   - `https://travelin-agency-nlcs.vercel.app/api/health`

### 5. Quick Test

If you want to test immediately without setting up a database:

1. Set only these variables:
   ```
   NODE_ENV=production
   PUBLIC_SITE_URL=https://travelin-agency-nlcs.vercel.app
   ```

2. The site will work with demo data
3. You can set up the database later

## Troubleshooting

### If you still get 500 errors:
1. Check the Vercel function logs
2. Visit the debug endpoints to see what's missing
3. Make sure all environment variable names are correct (case-sensitive)

### If the site loads but shows no data:
1. Check if database environment variables are set correctly
2. Verify database connection details
3. Make sure the database is accessible from Vercel

## Next Steps

After the site is working:
1. Set up a proper database (PlanetScale recommended)
2. Import your data
3. Configure all environment variables
4. Test all functionality