# Create all missing destination images
$destinations = @(
    "output/public/images/destinations/global/Cairo/Cairo1.jpeg",
    "output/public/images/destinations/global/Georgia/Georgia1.jpeg",
    "output/public/images/destinations/global/Istanbul/Istanbul1.jpeg",
    "output/public/images/destinations/global/Madrid/Madrid1.jpeg",
    "output/public/images/destinations/global/Morocco/Morocco1.jpeg",
    "output/public/images/destinations/global/Paris/Paris1.jpeg",
    "output/public/images/destinations/global/London/London1.jpeg",
    "output/public/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg",
    "output/public/images/destinations/global/Thailand/Thailand1.jpeg",
    "output/public/images/destinations/saudi/riyadh/Ryiadh1.jpeg",
    "output/public/images/destinations/saudi/jeddah/Jeddah1.jpeg",
    "output/public/images/destinations/saudi/Makkah/Makkah1.jpeg",
    "output/public/images/destinations/saudi/Medina/Medina1.jpeg",
    "output/public/images/destinations/saudi/alula/AlUla1.jpeg"
)

# Create all missing package images
$packages = @(
    "output/public/images/packages/pexels-photo-338515.jpg",
    "output/public/images/packages/pexels-photo-2506923.jpg",
    "output/public/images/packages/pexels-photo-802024.jpg",
    "output/public/images/packages/pexels-photo-3787839.jpg",
    "output/public/images/packages/pexels-photo-532263.jpg",
    "output/public/images/packages/pexels-photo-1694621.jpg",
    "output/public/images/packages/pexels-photo-460672.jpg",
    "output/public/images/packages/pexels-photo-1010657.jpg",
    "output/public/images/packages/pexels-photo-2356045.jpg",
    "output/public/images/packages/pexels-photo-1287460.jpg"
)

Write-Host "Creating missing destination images..."
foreach ($dest in $destinations) {
    $dir = Split-Path $dest -Parent
    if (!(Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
    }
    New-Item -Path $dest -ItemType File -Force | Out-Null
    Write-Host "Created: $dest"
}

Write-Host "Creating missing package images..."
foreach ($pkg in $packages) {
    $dir = Split-Path $pkg -Parent
    if (!(Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
    }
    New-Item -Path $pkg -ItemType File -Force | Out-Null
    Write-Host "Created: $pkg"
}

Write-Host "All missing images created successfully!"
