#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Database Connection...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📋 Please create .env.local with your database configuration:');
  console.log('');
  console.log('DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"');
  console.log('NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
const envVars = {};

lines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim().replace(/"/g, '');
  }
});

console.log('📋 Environment Variables Found:');
console.log(`DATABASE_URL: ${envVars.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${envVars.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);

if (!envVars.DATABASE_URL) {
  console.log('\n❌ DATABASE_URL is missing!');
  console.log('📋 Please add your database URL to .env.local');
  process.exit(1);
}

// Test database connection
console.log('\n🔗 Testing database connection...');
try {
  // Use Prisma to test connection
  execSync('npx prisma db pull --print', { 
    stdio: 'pipe',
    env: { ...process.env, DATABASE_URL: envVars.DATABASE_URL }
  });
  console.log('✅ Database connection successful!');
} catch (error) {
  console.log('❌ Database connection failed!');
  console.log('Error:', error.message);
  
  // Provide troubleshooting steps
  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Check your Supabase project status at: https://supabase.com/dashboard');
  console.log('2. Verify your DATABASE_URL format:');
  console.log('   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
  console.log('3. Make sure your project is not paused');
  console.log('4. Check if your IP is allowed (if using IP restrictions)');
  console.log('5. Try regenerating your database password in Supabase dashboard');
  
  process.exit(1);
}

// Check if tables exist
console.log('\n📊 Checking for existing tables...');
try {
  const result = execSync('npx prisma db pull --print', { 
    stdio: 'pipe',
    env: { ...process.env, DATABASE_URL: envVars.DATABASE_URL }
  });
  
  if (result.toString().includes('model')) {
    console.log('✅ Tables found in database');
  } else {
    console.log('⚠️  No tables found in database');
    console.log('📋 You need to push your schema:');
    console.log('   npm run db:push');
  }
} catch (error) {
  console.log('❌ Could not check tables');
}

console.log('\n🎉 Database connection check completed!');

