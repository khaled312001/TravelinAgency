#!/usr/bin/env node

/**
 * Create Additional Admin User Script
 * Use this script to create additional admin users for the system
 */

const { Auth, Database } = require('./config');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function createAdminUser() {
    try {
        console.log('🔐 Create New Admin User for Wonder Land Traveling Agency\n');
        
        const email = await askQuestion('Enter admin email: ');
        const password = await askQuestion('Enter admin password: ');
        const fullName = await askQuestion('Enter full name: ');
        const phone = await askQuestion('Enter phone number (optional): ');
        
        console.log('\nSelect admin role:');
        console.log('1. Super Admin (full access)');
        console.log('2. Admin (standard access)');
        console.log('3. Moderator (limited access)');
        
        const roleChoice = await askQuestion('Enter choice (1-3): ');
        
        let role;
        switch (roleChoice) {
            case '1':
                role = 'super_admin';
                break;
            case '2':
                role = 'admin';
                break;
            case '3':
                role = 'moderator';
                break;
            default:
                role = 'admin';
        }
        
        console.log('\n🔄 Creating admin user...');
        
        const userId = await Auth.createAdminUser({
            email: email,
            password: password,
            full_name: fullName,
            phone: phone || null
        }, role);
        
        console.log('✅ Admin user created successfully!');
        console.log(`👤 User ID: ${userId}`);
        console.log(`📧 Email: ${email}`);
        console.log(`🎭 Role: ${role}`);
        console.log(`👨‍💼 Name: ${fullName}`);
        
    } catch (error) {
        console.error('❌ Failed to create admin user:', error.message);
    } finally {
        rl.close();
        process.exit(0);
    }
}

async function listAdminUsers() {
    try {
        const db = new Database();
        
        const admins = await db.query(`
            SELECT u.id, u.email, u.full_name, u.phone, u.status, u.created_at,
                   ap.role, ap.permissions
            FROM users u
            JOIN admin_profiles ap ON u.id = ap.user_id
            ORDER BY ap.role, u.created_at
        `);
        
        console.log('\n👥 Current Admin Users:\n');
        console.log('ID'.padEnd(36), 'Email'.padEnd(30), 'Name'.padEnd(25), 'Role'.padEnd(15), 'Status');
        console.log('-'.repeat(120));
        
        admins.forEach(admin => {
            console.log(
                admin.id.padEnd(36),
                admin.email.padEnd(30),
                (admin.full_name || '').padEnd(25),
                admin.role.padEnd(15),
                admin.status
            );
        });
        
        console.log(`\nTotal admin users: ${admins.length}`);
        
    } catch (error) {
        console.error('❌ Failed to list admin users:', error.message);
    }
}

// Main execution
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'list':
            listAdminUsers().then(() => process.exit(0));
            break;
        case 'create':
        default:
            createAdminUser();
            break;
    }
}
