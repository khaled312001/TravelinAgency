# GoDaddy MySQL Remote Access Configuration

## 🚨 Issue Identified

Your Vercel deployment is failing because GoDaddy's MySQL server is not allowing external connections. The error message is:

```
Host '45.241.131.174' is not allowed to connect to this MariaDB server
```

## 🛠️ Solution: Configure Remote Access in GoDaddy

### Step 1: Access GoDaddy cPanel

1. **Log into your GoDaddy account**
2. **Go to your hosting control panel**
3. **Click on "cPanel"**

### Step 2: Configure Remote MySQL Access

#### Option A: Using Remote MySQL (Recommended)

1. **In cPanel, find "Remote MySQL"**
2. **Click on "Remote MySQL"**
3. **Add these IP addresses:**
   - `0.0.0.0` (allows all IPs - works but less secure)
   - Or add specific Vercel IP ranges (more secure)

#### Option B: Using MySQL Databases

1. **In cPanel, find "MySQL Databases"**
2. **Find your database user (`travel`)**
3. **Look for "Remote Access" or "Host Access" settings**
4. **Add the same IP addresses as above**

### Step 3: Vercel IP Ranges (More Secure Option)

If you want to be more secure, you can whitelist only Vercel's IP ranges:

```
76.76.19.0/24
76.76.20.0/24
76.76.21.0/24
76.76.22.0/24
```

### Step 4: Test the Connection

After configuring remote access:

1. **Wait 5-10 minutes** for changes to propagate
2. **Test locally**: `node test-db-connection.js`
3. **Redeploy on Vercel**
4. **Test the health endpoint**: `https://worldtripagency.com/api/health`

## 🔧 Alternative Solutions

### Option 1: Use a Different Database Provider

If GoDaddy's remote access is too restrictive, consider:

#### PlanetScale (Recommended)
- MySQL-compatible
- Serverless-friendly
- Free tier available
- Easy external access

#### Railway
- MySQL with easy external access
- Good for serverless applications
- Reasonable pricing

#### Supabase
- PostgreSQL (would require some code changes)
- Excellent for serverless
- Free tier available

### Option 2: Use GoDaddy's API

Some GoDaddy hosting plans offer API access that might work better with serverless functions.

## 📋 Environment Variables for Vercel

Once remote access is configured, set these in Vercel:

```
DB_HOST=sg2plzcpnl508590.prod.sin2.secureserver.net
DB_PORT=3306
DB_USER=travel
DB_PASSWORD=support@Passord123
DB_NAME=travel
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
PUBLIC_SITE_URL=https://travelin-agency.vercel.app
NODE_ENV=production
```

## 🚨 Important Notes

1. **Security**: Using `0.0.0.0` allows connections from any IP address. This is convenient but less secure.

2. **Propagation**: Changes to MySQL access can take 5-10 minutes to take effect.

3. **Testing**: Always test the connection locally before redeploying to Vercel.

4. **Backup**: Make sure you have a backup of your database before making changes.

## 🔍 Troubleshooting

### Still Getting Connection Errors?

1. **Check GoDaddy's documentation** for your specific hosting plan
2. **Contact GoDaddy support** if remote access options aren't available
3. **Consider migrating to a more serverless-friendly database**

### Alternative: Use a Database Proxy

You could also set up a database proxy service that handles the connection complexity.

## 📞 Next Steps

1. **Configure remote access in GoDaddy cPanel**
2. **Test the connection locally**
3. **Redeploy to Vercel**
4. **Test the health endpoint**

If you continue to have issues, consider migrating to a more serverless-friendly database provider.
