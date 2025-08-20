# 🗄️ Database Setup Guide - Get Real Data Working

## 🚀 Quick Setup Steps

### 1. Create PostgreSQL Database

First, you need to create a PostgreSQL database. You can use:
- **Local PostgreSQL** (recommended for development)
- **Supabase** (free cloud option)
- **Railway** (another cloud option)

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL if you haven't already
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Ubuntu: sudo apt-get install postgresql postgresql-contrib

# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE barangay_management;
CREATE USER barangay_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE barangay_management TO barangay_user;

# Exit PostgreSQL
\q
```

#### Option B: Supabase (Free Cloud)
1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string

### 2. Create Environment File

Create a `.env.local` file in your project root:

```bash
# Copy the example file
cp env.example .env.local
```

Edit `.env.local` and update the DATABASE_URL:

```env
# For local PostgreSQL:
DATABASE_URL="postgresql://barangay_user:your_password_here@localhost:5432/barangay_management?schema=public"

# For Supabase:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Set Up Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Verify Setup

```bash
# Open Prisma Studio to view your data
npm run db:studio
```

This will open a web interface at http://localhost:5555 where you can see all your data.

## 📊 Sample Data You'll Get

After running the seed script, you'll have:

### 👥 Users (8 total)
- **Juan de la Cruz** - Barangay Captain
- **Maria Santos** - Secretary  
- **Roberto Garcia** - Treasurer
- **Ana Reyes** - Councilor (Health Committee)
- **Miguel Torres** - Councilor (Infrastructure)
- **Elena Villanueva** - Administrative Assistant
- **Carlos Mendoza** - Field Coordinator
- **Admin User** - System Administrator

### 🏗️ Projects (5 total)
1. **New Health Center Construction** (₱8.5M, 38% complete)
2. **Senior Citizens Digital Literacy** (₱450K, planning)
3. **Solid Waste Management Enhancement** (₱1.2M, completed)
4. **Youth Leadership Development** (₱650K, planning)
5. **Community Sports Complex** (₱2.8M, approved)

### ✅ Tasks (15+ total)
- Site surveys and planning tasks
- Construction and implementation tasks
- Training and development tasks
- Procurement and logistics tasks

### 📅 Events (4 total)
- Community Clean-up Drive
- Senior Citizens Day Celebration
- Monthly Barangay Assembly
- Youth Leadership Training Workshop

### 📢 Announcements (6+ total)
- Project updates and milestones
- Event registrations and invitations
- Achievement celebrations
- Service announcements

### 📄 Documents (8+ total)
- Official documents
- Project reports
- Event materials
- Public notices

## 🔧 Database Commands

```bash
# Generate Prisma client (run after schema changes)
npm run db:generate

# Push schema changes to database
npm run db:push

# Open database viewer
npm run db:studio

# Seed with sample data
npm run db:seed

# Reset database (clear all data and reseed)
npm run db:reset

# Create migration (for production)
npm run db:migrate

# Deploy migrations (production)
npm run db:deploy
```

## 🎯 Dashboard Data Sources

Once your database is set up, the dashboard will show real data from these API endpoints:

### Public Data (No Authentication Required)
- `/api/public/stats` - Community statistics
- `/api/public/projects` - Public projects
- `/api/public/events` - Public events
- `/api/public/announcements` - Public announcements

### Dashboard Data (Authentication Required)
- `/api/dashboard/stats` - User-specific statistics
- `/api/dashboard/activity` - Recent activity
- `/api/projects` - All projects
- `/api/tasks` - All tasks
- `/api/events` - All events
- `/api/goals` - All goals

## 🚨 Troubleshooting

### Connection Issues
```bash
# Test database connection
npx prisma db pull

# If it fails, check your DATABASE_URL in .env.local
```

### Schema Issues
```bash
# Reset everything and start fresh
npm run db:reset
```

### Permission Issues
```bash
# Make sure your database user has proper permissions
GRANT ALL PRIVILEGES ON DATABASE barangay_management TO barangay_user;
GRANT ALL ON SCHEMA public TO barangay_user;
```

## 🎉 Next Steps

1. **Set up your database** using the steps above
2. **Run the seed script** to get sample data
3. **Start your development server**: `npm run dev`
4. **Visit your dashboard** at `http://localhost:3000/dashboard`
5. **Use test login** to access the system (see TEST_LOGIN_GUIDE.md)

## 📱 Test Login Credentials

After seeding, you can use these test accounts:

- **Admin**: admin@barangay.com / password123
- **Captain**: captain@barangay.com / password123
- **Secretary**: secretary@barangay.com / password123

Or use the test login page at `/test-login` for quick access.

---

**🎯 Your dashboard will now show real data from your PostgreSQL database!**
