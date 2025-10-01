#!/bin/bash

# Deploy Nuxt to GoDaddy
# This script prepares the project for GoDaddy hosting

echo "🚀 Starting GoDaddy Deployment Process..."
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build the project
echo "🔨 Building Nuxt project for production..."
npm run generate

# Step 3: Prepare deployment folder
echo "📁 Preparing deployment folder..."
rm -rf godaddy-deploy
mkdir -p godaddy-deploy

# Step 4: Copy built files
echo "📋 Copying built files..."
cp -r .output/public/* godaddy-deploy/

# Step 5: Copy server-side files
echo "📋 Copying server files..."
cp api-handler.php godaddy-deploy/
cp -r mysql godaddy-deploy/
cp -r server godaddy-deploy/ 2>/dev/null || true
cp page-statuses.json godaddy-deploy/
cp clean-navigation.sql godaddy-deploy/

# Step 6: Copy .htaccess
echo "📋 Copying .htaccess..."
cp public/.htaccess godaddy-deploy/

# Step 7: Create deployment instructions
echo "📝 Creating deployment instructions..."
cat > godaddy-deploy/DEPLOYMENT_INSTRUCTIONS.txt << 'EOF'
==============================================
GoDaddy Deployment Instructions
==============================================

1. DATABASE SETUP:
   - Log in to your GoDaddy cPanel
   - Go to MySQL Databases
   - Create a new database (note the name)
   - Create a new user with password
   - Grant ALL privileges to the user on the database
   - Import the schema from: mysql/schema.sql
   - Run the clean-navigation.sql to set up navigation

2. UPDATE DATABASE CREDENTIALS:
   - Open api-handler.php
   - Update the database credentials:
     $host = 'localhost';
     $dbname = 'your_database_name';
     $username = 'your_database_user';
     $password = 'your_database_password';

3. UPLOAD FILES:
   - Upload ALL files from this folder to public_html/
   - Make sure .htaccess is uploaded
   - Ensure file permissions are correct (644 for files, 755 for folders)

4. VERIFY:
   - Visit: https://worldtripagency.com/
   - Test all 4 pages:
     * https://worldtripagency.com/
     * https://worldtripagency.com/packages/
     * https://worldtripagency.com/custom-package/
     * https://worldtripagency.com/about/
   - Test admin: https://worldtripagency.com/admin/

5. ADMIN ACCESS:
   - Run the create-admin-user.php once to create admin account
   - Then delete it for security

==============================================
EOF

echo ""
echo "✅ Deployment package ready!"
echo ""
echo "📦 Next steps:"
echo "1. Upload everything from 'godaddy-deploy' folder to your GoDaddy public_html/"
echo "2. Follow instructions in DEPLOYMENT_INSTRUCTIONS.txt"
echo ""
echo "Files are ready in: ./godaddy-deploy/"

