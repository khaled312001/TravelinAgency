# PowerShell script to download package images from the original website
$baseUrl = "https://wonderland1.com"
$imageUrls = @(
    "/images/packages/paris-romance.jpg",
    "/images/packages/tokyo-modern.jpg", 
    "/images/packages/new-york-explorer.jpg",
    "/images/packages/dubai-luxury.jpg",
    "/images/packages/rome-historical.jpg",
    "/images/packages/bali-paradise.jpg",
    "/images/packages/london-royal.jpg",
    "/images/packages/santorini-paradise.jpg",
    "/images/packages/machu-picchu.jpg",
    "/images/packages/maldives-luxury.jpg"
)

$outputDir = "public/images/packages"

# Create directory if it doesn't exist
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

Write-Host "🖼️ Downloading package images..." -ForegroundColor Green

foreach ($imageUrl in $imageUrls) {
    $fileName = Split-Path $imageUrl -Leaf
    $outputPath = Join-Path $outputDir $fileName
    $fullUrl = $baseUrl + $imageUrl
    
    try {
        Write-Host "📥 Downloading: $fileName" -ForegroundColor Yellow
        Invoke-WebRequest -Uri $fullUrl -OutFile $outputPath -ErrorAction Stop
        Write-Host "✅ Downloaded: $fileName" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to download: $fileName - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "🎉 Image download completed!" -ForegroundColor Green
