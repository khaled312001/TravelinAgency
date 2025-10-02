module.exports = {
  apps: [{
    name: 'travelin-agency',
    script: '.output/server/index.mjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DB_HOST: 'localhost',
      DB_PORT: 3306,
      DB_USER: 'travel',
      DB_PASSWORD: 'your_password_here',
      DB_NAME: 'travel',
      JWT_SECRET: 'your-super-secret-jwt-key-here',
      PUBLIC_SITE_URL: 'http://your-server-ip'
    }
  }]
}
