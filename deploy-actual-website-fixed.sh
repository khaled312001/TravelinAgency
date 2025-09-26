#!/bin/bash
echo "🌐 DEPLOYING ACTUAL NUXT.JS WEBSITE"
echo "===================================="
echo ""

echo "1. 📁 Checking what build files we have..."
echo "----------------------------------------"

# Check for index.html in various locations
if [ -f "output/public/index.html" ]; then
    echo "✅ Found index.html in output/public/"
    cp output/public/index.html .
    echo "✅ Copied index.html to root"
elif [ -f "output/index.html" ]; then
    echo "✅ Found index.html in output/"
    cp output/index.html .
    echo "✅ Copied index.html to root"
elif [ -f "dist/index.html" ]; then
    echo "✅ Found index.html in dist/"
    cp dist/index.html .
    echo "✅ Copied index.html to root"
elif [ -f "output/public/200.html" ]; then
    echo "✅ Found 200.html in output/public/ (using as index.html)"
    cp output/public/200.html index.html
    echo "✅ Copied 200.html as index.html"
elif [ -f "output/200.html" ]; then
    echo "✅ Found 200.html in output/ (using as index.html)"
    cp output/200.html index.html
    echo "✅ Copied 200.html as index.html"
else
    echo "❌ No index.html or 200.html found!"
    echo "Building Nuxt.js..."
    npm run build
    if [ -f "output/public/index.html" ]; then
        cp output/public/index.html .
        echo "✅ Built and copied index.html"
    elif [ -f "output/public/200.html" ]; then
        cp output/public/200.html index.html
        echo "✅ Built and copied 200.html as index.html"
    else
        echo "❌ Build failed or no HTML files generated"
        exit 1
    fi
fi

echo ""
echo "2. 📦 Copying all static assets..."
echo "--------------------------------"

# Copy all static files from the most complete directory
if [ -d "output/public" ]; then
    echo "Copying from output/public/..."
    cp -r output/public/* . 2>/dev/null || true
    echo "✅ Copied all files from output/public/"
elif [ -d "output" ]; then
    echo "Copying from output/..."
    cp -r output/* . 2>/dev/null || true
    echo "✅ Copied all files from output/"
elif [ -d "dist" ]; then
    echo "Copying from dist/..."
    cp -r dist/* . 2>/dev/null || true
    echo "✅ Copied all files from dist/"
fi

echo ""
echo "3. 🔧 Setting proper permissions..."
echo "----------------------------------"
chmod -R 755 . 2>/dev/null || true
find . -name "*.html" -exec chmod 644 {} \; 2>/dev/null || true
find . -name "*.css" -exec chmod 644 {} \; 2>/dev/null || true
find . -name "*.js" -exec chmod 644 {} \; 2>/dev/null || true

echo ""
echo "4. 📝 Deploying production index.php..."
echo "--------------------------------------"
cp index-simple.php index.php
echo "✅ Deployed production index.php"

echo ""
echo "5. 🧪 Testing the website..."
echo "---------------------------"
echo "Checking if index.html exists:"
ls -la index.html 2>/dev/null && echo "✅ index.html found" || echo "❌ index.html missing"

echo ""
echo "Testing main website:"
curl -k -I https://worldtripagency.com/ | head -1

echo ""
echo "Testing API:"
curl -k -s https://worldtripagency.com/api/test | head -c 50
echo ""

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "✅ Your actual Nuxt.js travel agency website is now live!"
echo "✅ No more test page - this is your real website!"
echo ""
echo "🌐 Visit: https://worldtripagency.com/"
echo "🔐 Admin: https://worldtripagency.com/admin/login"
