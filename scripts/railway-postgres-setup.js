#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Railway PostgreSQL Setup Guide...\n');

console.log('📋 **Step-by-Step Railway PostgreSQL Setup**\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📋 Creating new .env.local file...');
  
  const template = `# Database Configuration (Railway PostgreSQL)
DATABASE_URL="postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway"

# Supabase Configuration (for client features)
NEXT_PUBLIC_SUPABASE_URL="https://tnjxomgdnkkrjqboxquc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# Pusher (Real-time)
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_APP_ID=your_pusher_app_id

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# OneSignal (Push Notifications)
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_API_KEY=your_onesignal_rest_api_key

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Liveblocks (Real-time Collaboration)
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
NEXT_PUBLIC_LIVEBLOCKS_PUBLISHABLE_KEY=your_liveblocks_publishable_key
`;

  fs.writeFileSync(envPath, template);
  console.log('✅ Created .env.local template');
} else {
  console.log('📋 .env.local file exists');
}

console.log('\n🔧 **Railway PostgreSQL Setup Steps:**\n');

console.log('1️⃣ **Create Railway Account:**');
console.log('   - Go to https://railway.app');
console.log('   - Sign up with GitHub');
console.log('');

console.log('2️⃣ **Create New Project:**');
console.log('   - Click "New Project"');
console.log('   - Select "Provision PostgreSQL"');
console.log('   - This creates a PostgreSQL database');
console.log('');

console.log('3️⃣ **Get Database Connection String:**');
console.log('   - Click on your PostgreSQL database');
console.log('   - Go to "Connect" tab');
console.log('   - Copy the "Postgres Connection URL"');
console.log('   - It looks like: postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway');
console.log('');

console.log('4️⃣ **Update Your .env.local:**');
console.log('   - Replace the DATABASE_URL with your Railway connection string');
console.log('   - Keep the format: DATABASE_URL="your_railway_connection_string"');
console.log('');

console.log('5️⃣ **Test Local Connection:**');
console.log('   npm run db:check');
console.log('   npm run db:push');
console.log('   npm run db:seed');
console.log('');

console.log('6️⃣ **Deploy to Railway:**');
console.log('   - Connect your GitHub repo to Railway');
console.log('   - Railway will auto-detect your Next.js app');
console.log('   - Add the PostgreSQL database as a service');
console.log('   - Railway will set DATABASE_URL automatically');
console.log('');

console.log('🎯 **Railway Deployment Benefits:**');
console.log('✅ Database runs 24/7 even when your computer is off');
console.log('✅ Automatic environment variable injection');
console.log('✅ Built-in monitoring and backups');
console.log('✅ Automatic scaling');
console.log('✅ Perfect Prisma integration');
console.log('✅ No external service management');
console.log('');

console.log('📋 **Railway Commands (after setup):**');
console.log('railway login          # Login to Railway CLI');
console.log('railway link           # Link to your Railway project');
console.log('railway up             # Deploy your app');
console.log('railway logs           # View deployment logs');
console.log('');

console.log('💡 **Alternative: Use Railway Dashboard**');
console.log('You can also deploy directly from Railway dashboard:');
console.log('1. Connect your GitHub repo');
console.log('2. Railway will auto-detect Next.js');
console.log('3. Add PostgreSQL database service');
console.log('4. Deploy with one click');
console.log('');

console.log('🚀 **Ready to start?**');
console.log('1. Go to https://railway.app');
console.log('2. Create PostgreSQL database');
console.log('3. Copy connection string');
console.log('4. Update .env.local');
console.log('5. Test with: npm run db:check');

