# Create necessary directories
$destinations = @(
    "saudi/alula",
    "saudi/red-sea",
    "saudi/riyadh",
    "global/maldives",
    "global/bali",
    "global/santorini"
)

foreach ($dest in $destinations) {
    $path = "public/images/destinations/$dest"
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force
    }
}

# Download sample images from Unsplash
$imageUrls = @{
    "saudi/alula/main.jpg" = "https://images.unsplash.com/photo-1578895101408-1bc89dfab096"
    "saudi/alula/hegra.jpg" = "https://images.unsplash.com/photo-1578895101408-1bc89dfab096"
    "saudi/alula/elephant-rock.jpg" = "https://images.unsplash.com/photo-1578895101408-1bc89dfab096"
    "saudi/alula/maraya.jpg" = "https://images.unsplash.com/photo-1578895101408-1bc89dfab096"
    
    "saudi/red-sea/main.jpg" = "https://images.unsplash.com/photo-1582531759785-8b7c6ac7a5c2"
    "saudi/red-sea/coral.jpg" = "https://images.unsplash.com/photo-1582531759785-8b7c6ac7a5c2"
    "saudi/red-sea/beach.jpg" = "https://images.unsplash.com/photo-1582531759785-8b7c6ac7a5c2"
    "saudi/red-sea/resort.jpg" = "https://images.unsplash.com/photo-1582531759785-8b7c6ac7a5c2"
    
    "saudi/riyadh/main.jpg" = "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6"
    "saudi/riyadh/kingdom-centre.jpg" = "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6"
    "saudi/riyadh/edge-of-world.jpg" = "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6"
    "saudi/riyadh/diriyah.jpg" = "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6"
    
    "global/maldives/main.jpg" = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8"
    "global/maldives/water-villas.jpg" = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8"
    "global/maldives/beach.jpg" = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8"
    "global/maldives/underwater.jpg" = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8"
    
    "global/bali/main.jpg" = "https://images.unsplash.com/photo-1537996194471-e657df975ab4"
    "global/bali/temples.jpg" = "https://images.unsplash.com/photo-1537996194471-e657df975ab4"
    "global/bali/rice-terraces.jpg" = "https://images.unsplash.com/photo-1537996194471-e657df975ab4"
    "global/bali/beach.jpg" = "https://images.unsplash.com/photo-1537996194471-e657df975ab4"
    
    "global/santorini/main.jpg" = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"
    "global/santorini/oia.jpg" = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"
    "global/santorini/caldera.jpg" = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"
    "global/santorini/sunset.jpg" = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"
}

foreach ($image in $imageUrls.GetEnumerator()) {
    $destination = "public/images/destinations/$($image.Key)"
    Write-Host "Downloading $($image.Value) to $destination"
    
    try {
        Invoke-WebRequest -Uri "$($image.Value)?w=800&h=600&fit=crop&q=90" -OutFile $destination
        Write-Host "Successfully downloaded $($image.Key)"
    }
    catch {
        Write-Host "Failed to download $($image.Key): $_"
    }
}

Write-Host "Image download complete!"
