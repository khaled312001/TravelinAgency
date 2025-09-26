// Migration script to help move from GoDaddy MySQL to PlanetScale
import mysql from 'mysql2/promise';

// GoDaddy connection (source)
const sourceConfig = {
  host: 'sg2plzcpnl508590.prod.sin2.secureserver.net',
  port: 3306,
  user: 'travel',
  password: 'support@Passord123',
  database: 'travel'
};

// PlanetScale connection (destination) - UPDATE THESE VALUES
const destinationConfig = {
  host: 'YOUR_PLANETSCALE_HOST', // e.g., aws.connect.psdb.cloud
  port: 3306,
  user: 'YOUR_PLANETSCALE_USER',
  password: 'YOUR_PLANETSCALE_PASSWORD',
  database: 'YOUR_PLANETSCALE_DATABASE',
  ssl: {
    rejectUnauthorized: true
  }
};

async function migrateDatabase() {
  console.log('🚀 Starting database migration from GoDaddy to PlanetScale...');
  
  try {
    // Test source connection
    console.log('📡 Testing GoDaddy connection...');
    const sourceConnection = await mysql.createConnection(sourceConfig);
    console.log('✅ GoDaddy connection successful');
    
    // Test destination connection
    console.log('📡 Testing PlanetScale connection...');
    const destConnection = await mysql.createConnection(destinationConfig);
    console.log('✅ PlanetScale connection successful');
    
    // Get list of tables
    const [tables] = await sourceConnection.execute('SHOW TABLES');
    console.log(`📋 Found ${tables.length} tables to migrate`);
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`📦 Migrating table: ${tableName}`);
      
      // Get table structure
      const [structure] = await sourceConnection.execute(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableSQL = structure[0]['Create Table'];
      
      // Create table in destination
      await destConnection.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
      await destConnection.execute(createTableSQL);
      
      // Get data
      const [rows] = await sourceConnection.execute(`SELECT * FROM \`${tableName}\``);
      console.log(`   📊 Found ${rows.length} rows`);
      
      if (rows.length > 0) {
        // Insert data
        const columns = Object.keys(rows[0]);
        const placeholders = columns.map(() => '?').join(', ');
        const insertSQL = `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${placeholders})`;
        
        for (const row of rows) {
          const values = columns.map(col => row[col]);
          await destConnection.execute(insertSQL, values);
        }
      }
      
      console.log(`   ✅ Table ${tableName} migrated successfully`);
    }
    
    await sourceConnection.end();
    await destConnection.end();
    
    console.log('🎉 Migration completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Update your Vercel environment variables with PlanetScale credentials');
    console.log('2. Redeploy your application');
    console.log('3. Test the health endpoint');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.code === 'ER_HOST_NOT_PRIVILEGED') {
      console.log('💡 GoDaddy is still blocking external connections.');
      console.log('   Please configure remote access in GoDaddy cPanel first.');
    }
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDatabase();
}

export { migrateDatabase };
