#!/bin/bash
# Script to create missing logo and services images

echo "🖼️ Creating missing logo and services images..."

# Create logo directory
mkdir -p public/images/home/logo

# Create a simple SVG logo
cat > public/images/home/logo/WonderlandLogoWhite.svg << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="60" fill="#1e40af"/>
  <text x="100" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">World Trip Agency</text>
</svg>
EOF

# Create services directory
mkdir -p public/images/home/services

# Create simple colored rectangle images for services using ImageMagick (if available)
if command -v convert &> /dev/null; then
    echo "Creating service images with ImageMagick..."
    
    # Flight Reservations
    convert -size 300x200 xc:"#1e40af" -pointsize 24 -fill white -gravity center -annotate +0+0 "Flight\nReservations" public/images/home/services/flight_reservations.jpg
    
    # Hotel Reservations
    convert -size 300x200 xc:"#059669" -pointsize 24 -fill white -gravity center -annotate +0+0 "Hotel\nReservations" public/images/home/services/hotel_reservations.jpg
    
    # Tourism Consultation
    convert -size 300x200 xc:"#dc2626" -pointsize 24 -fill white -gravity center -annotate +0+0 "Tourism\nConsultation" public/images/home/services/tourism_consultation.jpg
    
    # Visa Services
    convert -size 300x200 xc:"#7c3aed" -pointsize 24 -fill white -gravity center -annotate +0+0 "Visa\nServices" public/images/home/services/visa_services.jpg
    
    # Package Tours
    convert -size 300x200 xc:"#ea580c" -pointsize 24 -fill white -gravity center -annotate +0+0 "Package\nTours" public/images/home/services/package_tours.jpg
    
    # Transportation
    convert -size 300x200 xc:"#0891b2" -pointsize 24 -fill white -gravity center -annotate +0+0 "Transportation" public/images/home/services/transportation.jpg
    
else
    echo "ImageMagick not available. Creating simple HTML placeholders..."
    
    # Create simple HTML files as placeholders
    cat > public/images/home/services/flight_reservations.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Flight Reservations</title>
    <style>
        body { margin: 0; padding: 0; background: #1e40af; color: white; display: flex; align-items: center; justify-content: center; height: 200px; font-family: Arial, sans-serif; }
        h1 { text-align: center; }
    </style>
</head>
<body>
    <h1>Flight<br>Reservations</h1>
</body>
</html>
EOF

    cat > public/images/home/services/hotel_reservations.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Hotel Reservations</title>
    <style>
        body { margin: 0; padding: 0; background: #059669; color: white; display: flex; align-items: center; justify-content: center; height: 200px; font-family: Arial, sans-serif; }
        h1 { text-align: center; }
    </style>
</head>
<body>
    <h1>Hotel<br>Reservations</h1>
</body>
</html>
EOF

    cat > public/images/home/services/tourism_consultation.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Tourism Consultation</title>
    <style>
        body { margin: 0; padding: 0; background: #dc2626; color: white; display: flex; align-items: center; justify-content: center; height: 200px; font-family: Arial, sans-serif; }
        h1 { text-align: center; }
    </style>
</head>
<body>
    <h1>Tourism<br>Consultation</h1>
</body>
</html>
EOF
fi

# Set proper permissions
chmod -R 644 public/images/home/logo/
chmod -R 644 public/images/home/services/

echo "✅ Logo and services images created successfully!"
echo "📋 Created files:"
echo "  - public/images/home/logo/WonderlandLogoWhite.svg"
echo "  - public/images/home/services/*.jpg (or .html if ImageMagick not available)"
echo ""
echo "🎯 Test the logo: https://travelin-agency-nlcs.vercel.app/images/home/logo/WonderlandLogoWhite.svg"
echo "🎯 Test services: https://travelin-agency-nlcs.vercel.app/images/home/services/flight_reservations.jpg"
