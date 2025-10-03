<?php
/**
 * Laravel Migration Setup Script
 * 
 * This script sets up the Laravel project environment and runs the migration
 */

echo "🚀 Setting up Laravel migration...\n";

// Laravel project path
$laravelPath = 'F:\TravelinAgency\travelin-agency-laravel';

// Create .env file for Laravel
$envContent = 'APP_NAME="Travelin Agency"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=travel2
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"';

// Write .env file
$envFile = $laravelPath . '\.env';
if (file_put_contents($envFile, $envContent)) {
    echo "✅ Created .env file for Laravel project\n";
} else {
    echo "❌ Failed to create .env file\n";
    exit(1);
}

// Generate application key
echo "🔑 Generating application key...\n";
$keyCommand = "cd \"$laravelPath\" && php artisan key:generate";
$output = shell_exec($keyCommand);
if ($output) {
    echo "✅ Application key generated\n";
} else {
    echo "⚠️  Could not generate application key automatically\n";
}

echo "\n🎉 Laravel environment setup completed!\n";
echo "📝 Next steps:\n";
echo "   1. Run the migration script: php migrate-to-laravel.php\n";
echo "   2. Run Laravel migrations: cd \"$laravelPath\" && php artisan migrate\n";
echo "   3. Test your Laravel application\n";
?>
