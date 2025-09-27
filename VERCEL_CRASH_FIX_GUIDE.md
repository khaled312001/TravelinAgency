# Vercel Serverless Function Crash Fix Guide

## Problem
Your website at https://worldtripagency.com/ is showing:
```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

## Root Cause Analysis
The crash is most likely caused by one of these issues:

1. **Missing Environment Variables** - Database connection failing
2. **Database Connection Issues** - MySQL database not accessible from Vercel
3. **Missing Dependencies** - Required packages not installed
4. **Runtime Configuration Issues** - Nuxt runtime config problems

## Immediate Fix Steps

### Step 1: Deploy Debug Endpoints
I've created two debug endpoints to help diagnose the issue:

1. **Basic Test**: `https://worldtripagency.com/api/test`
2. **Debug Info**: `https://worldtripagency.com/api/debug`

### Step 2: Check Environment Variables
Go to your Vercel dashboard and verify these environment variables are set:

#### Required Environment Variables:
```
NODE_ENV=production
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-super-secret-jwt-key
PUBLIC_SITE_URL=https://travelin-agency.vercel.app
```

#### Optional Environment Variables:
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone
```

### Step 3: Database Setup Options

Since Vercel doesn't provide MySQL hosting, you need an external database:

#### Option 1: PlanetScale (Recommended)
1. Go to [PlanetScale](https://planetscale.com)
2. Create a free account
3. Create a new database
4. Get connection details
5. Set environment variables in Vercel

#### Option 2: Railway
1. Go to [Railway](https://railway.app)
2. Create a MySQL database
3. Get connection details
4. Set environment variables in Vercel

#### Option 3: Use Existing GoDaddy MySQL
If you have GoDaddy hosting with MySQL:
1. Enable remote access in cPanel
2. Add Vercel's IP ranges to allowed hosts
3. Use your GoDaddy database credentials

### Step 4: Test the Fix

After setting environment variables:

1. **Test Basic API**: Visit `https://worldtripagency.com/api/test`
2. **Test Debug Info**: Visit `https://worldtripagency.com/api/debug`
3. **Test Health Check**: Visit `https://worldtripagency.com/api/health`

### Step 5: Deploy Changes

```bash
git add .
git commit -m "Add debug endpoints for Vercel crash diagnosis"
git push origin main
```

## Common Issues and Solutions

### Issue 1: Database Connection Refused
**Error**: `ECONNREFUSED`
**Solution**: 
- Check if database host allows external connections
- Verify database credentials
- Ensure database is running

### Issue 2: Access Denied
**Error**: `ER_ACCESS_DENIED_ERROR`
**Solution**:
- Verify database username and password
- Check if user has proper permissions
- Ensure database exists

### Issue 3: Host Not Privileged
**Error**: `ER_HOST_NOT_PRIVILEGED`
**Solution**:
- Enable remote access in database settings
- Add Vercel's IP ranges to allowed hosts
- Use a database that supports remote connections

### Issue 4: Missing Environment Variables
**Error**: Function crashes on startup
**Solution**:
- Set all required environment variables in Vercel
- Redeploy after adding variables
- Check variable names are correct (case-sensitive)

## Quick Test Without Database

If you want to test the site without a database temporarily, you can:

1. Comment out database calls in API routes
2. Return mock data instead
3. Deploy and test the basic functionality

## Next Steps After Fix

1. **Set up proper database** (PlanetScale recommended)
2. **Configure environment variables**
3. **Test all API endpoints**
4. **Set up database tables** using your existing setup scripts
5. **Import your data**

## Monitoring

After fixing, monitor your Vercel function logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Check logs for any errors

## Support

If the issue persists:
1. Check Vercel function logs for specific error messages
2. Test the debug endpoints I created
3. Verify all environment variables are set correctly
4. Consider using a different database provider

The debug endpoints will help identify exactly what's causing the crash.
