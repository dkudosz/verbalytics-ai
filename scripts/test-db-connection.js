// Quick script to test database connection
// Run with: node scripts/test-db-connection.js

import { Client } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('🔍 Testing database connection...');
console.log('Connection string format:', connectionString.replace(/:[^:@]+@/, ':****@'));

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to database!');
    return client.query('SELECT version()');
  })
  .then((result) => {
    console.log('📊 Database version:', result.rows[0].version);
    client.end();
  })
  .catch((error) => {
    console.error('❌ Connection failed:');
    console.error(error.message);
    console.log('\n💡 Common fixes:');
    console.log('1. Check that your password doesn\'t contain special characters');
    console.log('2. URL encode special characters in password (e.g., @ = %40, # = %23, / = %2F)');
    console.log('3. Verify you\'re using DIRECT connection format (port 5432, not 6543)');
    console.log('4. Make sure your Supabase project is active and not paused');
    console.log('5. Check your .env.local file has correct format:');
    console.log('   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
    client.end();
    process.exit(1);
  });

