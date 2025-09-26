# Vercel Deployment Guide

## Issue Fixed
The build was failing because Vercel was looking for a `dist` directory, but Nuxt 3 with Nitro generates files in `.output/public` and `.output/server`.

## Solution
Created `vercel.json` configuration file to specify the correct output directory and routing.

## Environment Variables Required

You need to set these environment variables in your Vercel project settings:

### Database Configuration
```
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

### JWT Configuration
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Twilio Configuration (Optional - for WhatsApp notifications)
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone
```

### Site Configuration
```
PUBLIC_SITE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## Deployment Steps

1. **Push your code to GitHub** (if not already done)
2. **Connect your repository to Vercel**
3. **Set environment variables** in Vercel project settings
4. **Deploy** - Vercel will now use the `vercel.json` configuration

## Vercel Configuration Details

The `vercel.json` file includes:
- **outputDirectory**: `.output/public` (where Nuxt generates static files)
- **functions**: Serverless function configuration for API routes
- **routes**: Proper routing for both API and page routes
- **framework**: Set to `nuxtjs` for optimal Nuxt support

## Database Setup

Since this is a Nuxt app with MySQL, you'll need:
1. A MySQL database (can use PlanetScale, Railway, or any MySQL provider)
2. Set the database environment variables in Vercel
3. Run your database setup scripts locally or create the tables manually

## Build Process

The build process will:
1. Install dependencies (`npm install`)
2. Run `nuxt prepare` (postinstall script)
3. Build the application (`npm run build`)
4. Generate static files in `.output/public`
5. Create serverless functions in `.output/server`

## Troubleshooting

If you encounter issues:
1. Check that all environment variables are set correctly
2. Verify your database connection
3. Check the Vercel function logs for any runtime errors
4. Ensure your MySQL database is accessible from Vercel's servers

## Performance Notes

- Static assets are served from `.output/public`
- API routes run as serverless functions
- Images are optimized through Nuxt Image
- Gzip and Brotli compression are enabled
