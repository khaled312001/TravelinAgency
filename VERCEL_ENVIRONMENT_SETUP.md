# Vercel Environment Variables Setup

## Required Environment Variables

You need to set these environment variables in your Vercel project settings to fix the 500 error:

### 1. Database Configuration
```
DB_HOST=sg2plzcpnl508590.prod.sin2.secureserver.net
DB_PORT=3306
DB_USER=travel
DB_PASSWORD=support@Passord123
DB_NAME=travel
```

### 2. JWT Configuration
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
```

### 3. Site Configuration
```
PUBLIC_SITE_URL=https://travelin-agency.vercel.app
NODE_ENV=production
```

### 4. Twilio Configuration (Optional - for WhatsApp notifications)
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone
```

## How to Set Environment Variables in Vercel

1. **Go to your Vercel Dashboard**
2. **Select your project** (travelin-agency)
3. **Go to Settings** → **Environment Variables**
4. **Add each variable** with the values above
5. **Redeploy** your application

## Testing the Fix

After setting the environment variables:

1. **Visit the health check endpoint**: `https://travelin-agency.vercel.app/api/health`
2. **Check the response** - it should show `"status": "healthy"` and `"database": "connected"`
3. **If still failing**, check the Vercel function logs for specific error messages

## Common Issues and Solutions

### Issue: Database Connection Refused
- **Cause**: Wrong DB_HOST or DB_PORT
- **Solution**: Verify the GoDaddy MySQL host and port

### Issue: Access Denied
- **Cause**: Wrong DB_USER or DB_PASSWORD
- **Solution**: Verify the database credentials

### Issue: Database Not Found
- **Cause**: Wrong DB_NAME
- **Solution**: Verify the database name is "travel"

### Issue: Function Timeout
- **Cause**: Database connection taking too long
- **Solution**: The updated configuration includes timeout settings

## Database Connection Details

Based on your GoDaddy setup:
- **Host**: sg2plzcpnl508590.prod.sin2.secureserver.net
- **Port**: 3306 (default MySQL port)
- **User**: travel
- **Password**: support@Passord123
- **Database**: travel

## Next Steps

1. Set all environment variables in Vercel
2. Redeploy the application
3. Test the health endpoint
4. Check if the main site loads properly

If you continue to have issues, check the Vercel function logs for specific error messages.
