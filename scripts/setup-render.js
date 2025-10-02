// Setup script for Render deployment
import { initializeTables, testConnection } from '../utils/database.js';

async function setupRender() {
  console.log('🚀 Setting up Render deployment...');
  
  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    console.log('✅ Database connected successfully');
    
    // Initialize tables
    console.log('🗄️ Initializing database tables...');
    const tablesInitialized = await initializeTables();
    
    if (!tablesInitialized) {
      console.error('❌ Failed to initialize database tables');
      process.exit(1);
    }
    
    console.log('✅ Database tables initialized successfully');
    console.log('🎉 Render setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupRender();
