<?php
/**
 * Enhanced API Handler for GoDaddy Hosting
 * This file handles all API requests and returns appropriate data
 */

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the request URI and method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$cleanUri = strtok($requestUri, '?');

// Remove /api prefix
$apiPath = str_replace('/api', '', $cleanUri);

// Route API requests
switch ($apiPath) {
    case '/packages':
        if ($requestMethod === 'GET') {
            echo json_encode(getPackages());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/destinations':
        if ($requestMethod === 'GET') {
            echo json_encode(getDestinations());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/contact-messages':
        if ($requestMethod === 'POST') {
            echo json_encode(handleContactMessage());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/cms/site-settings':
        if ($requestMethod === 'GET') {
            echo json_encode(getSiteSettings());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/cms/pages/home':
        if ($requestMethod === 'GET') {
            echo json_encode(getHomePageContent());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/cms/navigation':
        if ($requestMethod === 'GET') {
            echo json_encode(getNavigation());
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'API endpoint not found', 'path' => $apiPath]);
        break;
}

function getPackages() {
    // Return sample packages data
    return [
        [
            'id' => 1,
            'title' => 'Dubai Luxury Package',
            'description' => 'Experience the luxury of Dubai with our premium package',
            'price' => 2500,
            'duration' => '7 days',
            'image' => '/output/public/images/packages/imported/dubai-luxury.jpg',
            'featured' => true,
            'destination' => 'Dubai, UAE'
        ],
        [
            'id' => 2,
            'title' => 'Bali Paradise',
            'description' => 'Discover the beauty of Bali with our tropical package',
            'price' => 1800,
            'duration' => '5 days',
            'image' => '/output/public/images/packages/imported/bali-paradise.jpg',
            'featured' => true,
            'destination' => 'Bali, Indonesia'
        ],
        [
            'id' => 3,
            'title' => 'London Royal Experience',
            'description' => 'Explore the royal heritage of London',
            'price' => 2200,
            'duration' => '6 days',
            'image' => '/output/public/images/packages/imported/london-royal.jpg',
            'featured' => true,
            'destination' => 'London, UK'
        ],
        [
            'id' => 4,
            'title' => 'Paris Romance',
            'description' => 'Romantic getaway in the city of love',
            'price' => 2000,
            'duration' => '5 days',
            'image' => '/output/public/images/packages/imported/paris-romance.jpg',
            'featured' => true,
            'destination' => 'Paris, France'
        ],
        [
            'id' => 5,
            'title' => 'Maldives Luxury',
            'description' => 'Ultimate luxury in the Maldives',
            'price' => 3500,
            'duration' => '7 days',
            'image' => '/output/public/images/packages/imported/maldives-luxury.jpg',
            'featured' => true,
            'destination' => 'Maldives'
        ],
        [
            'id' => 6,
            'title' => 'Tokyo Modern',
            'description' => 'Experience modern Japan in Tokyo',
            'price' => 2800,
            'duration' => '8 days',
            'image' => '/output/public/images/packages/imported/tokyo-modern.jpg',
            'featured' => true,
            'destination' => 'Tokyo, Japan'
        ]
    ];
}

function getDestinations() {
    // Return sample destinations data
    return [
        [
            'id' => 1,
            'name' => 'Barcelona',
            'country' => 'Spain',
            'description' => 'Beautiful city with amazing architecture',
            'image' => '/output/public/images/destinations/global/Barcelona/Barcelona1.jpeg',
            'featured' => true
        ],
        [
            'id' => 2,
            'name' => 'Cairo',
            'country' => 'Egypt',
            'description' => 'Ancient wonders and modern marvels',
            'image' => '/output/public/images/destinations/global/Cairo/Cairo1.jpeg',
            'featured' => true
        ],
        [
            'id' => 3,
            'name' => 'Georgia',
            'country' => 'Georgia',
            'description' => 'Stunning landscapes and rich culture',
            'image' => '/output/public/images/destinations/global/Georgia/Georgia1.jpeg',
            'featured' => true
        ],
        [
            'id' => 4,
            'name' => 'Istanbul',
            'country' => 'Turkey',
            'description' => 'Where East meets West',
            'image' => '/output/public/images/destinations/global/Istanbul/Istanbul1.jpeg',
            'featured' => true
        ],
        [
            'id' => 5,
            'name' => 'London',
            'country' => 'UK',
            'description' => 'Royal heritage and modern culture',
            'image' => '/output/public/images/destinations/global/London/London1.jpeg',
            'featured' => true
        ],
        [
            'id' => 6,
            'name' => 'Madrid',
            'country' => 'Spain',
            'description' => 'Vibrant capital with rich history',
            'image' => '/output/public/images/destinations/global/Madrid/Madrid1.jpeg',
            'featured' => true
        ],
        [
            'id' => 7,
            'name' => 'Morocco',
            'country' => 'Morocco',
            'description' => 'Exotic beauty and ancient traditions',
            'image' => '/output/public/images/destinations/global/Morocco/Morocco1.jpeg',
            'featured' => true
        ],
        [
            'id' => 8,
            'name' => 'Paris',
            'country' => 'France',
            'description' => 'City of light and romance',
            'image' => '/output/public/images/destinations/global/Paris/Paris1.jpeg',
            'featured' => true
        ],
        [
            'id' => 9,
            'name' => 'Thailand',
            'country' => 'Thailand',
            'description' => 'Tropical paradise with rich culture',
            'image' => '/output/public/images/destinations/global/Thailand/Thailand1.jpeg',
            'featured' => true
        ],
        [
            'id' => 10,
            'name' => 'Riyadh',
            'country' => 'Saudi Arabia',
            'description' => 'Modern capital with traditional charm',
            'image' => '/output/public/images/destinations/saudi/riyadh/Ryiadh1.jpeg',
            'featured' => true
        ]
    ];
}

function getSiteSettings() {
    return [
        'siteName' => 'World Trip Agency',
        'siteDescription' => 'Your trusted travel partner for unforgettable experiences',
        'siteUrl' => 'https://worldtripagency.com',
        'contactEmail' => 'info@worldtripagency.com',
        'contactPhone' => '+966 50 123 4567',
        'socialMedia' => [
            'facebook' => 'https://facebook.com/worldtripagency',
            'instagram' => 'https://instagram.com/worldtripagency',
            'twitter' => 'https://twitter.com/worldtripagency'
        ],
        'hero' => [
            'title' => 'Discover Amazing Destinations',
            'subtitle' => 'Your journey to unforgettable experiences starts here',
            'backgroundImage' => '/output/public/images/home/heroSection/hero-image.webp'
        ],
        'features' => [
            [
                'title' => '24/7 Support',
                'description' => 'Round-the-clock assistance for your travel needs',
                'icon' => 'support'
            ],
            [
                'title' => 'Best Prices',
                'description' => 'Competitive rates for all our travel packages',
                'icon' => 'price'
            ],
            [
                'title' => 'Expert Guides',
                'description' => 'Professional guides for an authentic experience',
                'icon' => 'guide'
            ]
        ]
    ];
}

function getHomePageContent() {
    return [
        'hero' => [
            'title' => 'Discover Amazing Destinations',
            'subtitle' => 'Your journey to unforgettable experiences starts here',
            'backgroundImage' => '/output/public/images/home/heroSection/hero-image.webp',
            'ctaText' => 'Explore Packages',
            'ctaLink' => '/packages'
        ],
        'featuredDestinations' => [
            [
                'name' => 'Dubai',
                'image' => '/output/public/images/packages/imported/dubai-luxury.jpg',
                'description' => 'Experience luxury in the desert city'
            ],
            [
                'name' => 'Bali',
                'image' => '/output/public/images/packages/imported/bali-paradise.jpg',
                'description' => 'Tropical paradise awaits'
            ],
            [
                'name' => 'Paris',
                'image' => '/output/public/images/packages/imported/paris-romance.jpg',
                'description' => 'City of light and romance'
            ]
        ],
        'services' => [
            [
                'title' => 'Flight Reservations',
                'description' => 'Book flights to any destination worldwide',
                'image' => '/output/public/images/home/services/flight_reservations.jpg'
            ],
            [
                'title' => 'Hotel Bookings',
                'description' => 'Find the perfect accommodation for your stay',
                'image' => '/output/public/images/home/services/hotel_reservations.jpg'
            ],
            [
                'title' => 'Tour Packages',
                'description' => 'Curated travel experiences for every budget',
                'image' => '/output/public/images/home/services/tour_packages.jpg'
            ],
            [
                'title' => 'Visa Services',
                'description' => 'Complete visa assistance for all countries',
                'image' => '/output/public/images/home/services/visa_services.jpg'
            ]
        ]
    ];
}

function getNavigation() {
    return [
        [
            'label' => 'Home',
            'url' => '/',
            'active' => true
        ],
        [
            'label' => 'Packages',
            'url' => '/packages',
            'active' => false
        ],
        [
            'label' => 'Destinations',
            'url' => '/destinations',
            'active' => false
        ],
        [
            'label' => 'About',
            'url' => '/about',
            'active' => false
        ],
        [
            'label' => 'Contact',
            'url' => '/contact',
            'active' => false
        ]
    ];
}

function handleContactMessage() {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        return ['error' => 'Invalid JSON data'];
    }
    
    // Validate required fields
    $required = ['name', 'email', 'message'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            return ['error' => "Missing required field: $field"];
        }
    }
    
    // Here you would typically save to database
    // For now, just return success
    return [
        'success' => true,
        'message' => 'Contact message received successfully',
        'data' => [
            'name' => $input['name'],
            'email' => $input['email'],
            'message' => $input['message'],
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ];
}
?>
