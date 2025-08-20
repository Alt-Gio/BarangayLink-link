# 🗄️ Database Setup Guide - BarangayLink

## 📋 Prerequisites

- **PostgreSQL 14+** installed and running
- **Node.js 18+** installed
- **npm** or **yarn** package manager

## 🚀 Quick Setup

### 1. Database Creation

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database and user
CREATE DATABASE barangaylink;
CREATE USER barangaylink_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE barangaylink TO barangaylink_user;

# Exit PostgreSQL
\q
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your database credentials
nano .env.local
```

**Update these variables in `.env.local`:**
```env
DATABASE_URL="postgresql://barangaylink_user:your_secure_password@localhost:5432/barangaylink?schema=public"
```

### 3. Database Schema Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

## 🏗️ Database Schema Overview

### **Core Entities**

#### **👥 Users** (Role-Based Hierarchy)
- **ADMIN** (Level 6) - Full system control
- **BARANGAY_CAPTAIN** (Level 5) - Executive authority
- **SECRETARY** (Level 4) - Documentation authority
- **TREASURER** (Level 4) - Financial authority
- **COUNCILOR** (Level 3) - Legislative authority
- **STAFF** (Level 1) - Administrative support

#### **🏗️ Projects** 
- Complete project lifecycle management
- Budget tracking and expenditure monitoring
- Team assignment and collaboration
- Progress tracking with milestones
- Public visibility controls

#### **✅ Tasks**
- Kanban-style task management
- Assignee management
- Priority and status tracking
- Dependencies and checklists
- Time tracking (estimated vs actual)

#### **📅 Events**
- Community event management
- Registration and attendance tracking
- Public calendar integration
- Project-linked events

#### **📢 Announcements**
- Public and internal announcements
- Priority-based notifications
- Landing page featured content
- Project/event linked announcements

#### **📄 Documents**
- Role-based access control
- Version management
- File metadata and tagging
- Project/task/event attachments

#### **📊 Activity Logs**
- Comprehensive audit trail
- User action tracking
- Entity change logging
- System transparency

## 🔐 Security & Permissions

### **Access Levels**
- **PUBLIC** - Available to all citizens
- **OFFICIALS** - Barangay officials only
- **MANAGEMENT** - Secretary/Treasurer level+
- **ADMIN_ONLY** - Admin access only
- **INTERNAL** - Internal system use

### **Permission Matrix**
```typescript
Module Access Requirements:
┌─────────────────────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Module              │ ADM │ CAP │ SEC │ TRE │ COU │ STA │
├─────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Project Management  │  ✅  │  ✅  │  ✅  │  ✅  │  ✅  │  ✅  │
│ Financial System    │  ✅  │  ✅  │  ❌  │  ✅  │  ❌  │  ❌  │
│ User Management     │  ✅  │  ✅  │  ❌  │  ❌  │  ❌  │  ❌  │
│ System Settings     │  ✅  │  ✅  │  ❌  │  ❌  │  ❌  │  ❌  │
│ Document System     │  ✅  │  ✅  │  ✅  │  ✅  │  ✅  │  ✅  │
│ Event Management    │  ✅  │  ✅  │  ✅  │  ❌  │  ✅  │  ✅  │
└─────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

## 🌱 Sample Data

The seed script creates realistic sample data:

### **👥 Users Created**
- **Juan de la Cruz** - Barangay Captain
- **Maria Santos** - Secretary  
- **Roberto Garcia** - Treasurer
- **Ana Reyes** - Councilor (Health Committee)
- **Miguel Torres** - Councilor (Infrastructure)
- **Elena Villanueva** - Administrative Assistant
- **Carlos Mendoza** - Field Coordinator

### **🏗️ Projects Created**
1. **New Health Center Construction** (₱8.5M, 38% complete)
2. **Senior Citizens Digital Literacy** (₱450K, planning)
3. **Solid Waste Management Enhancement** (₱1.2M, completed)
4. **Youth Leadership Development** (₱650K, planning)
5. **Community Sports Complex** (₱2.8M, approved)

### **✅ Tasks Created**
- Site surveys and planning tasks
- Construction and implementation tasks
- Training and development tasks
- Procurement and logistics tasks

### **📅 Events Created**
- Community Clean-up Drive
- Senior Citizens Day Celebration
- Monthly Barangay Assembly
- Youth Leadership Training Workshop

### **📢 Announcements Created**
- Project updates and milestones
- Event registrations and invitations
- Achievement celebrations
- Service announcements

## 🔧 Database Management Commands

### **Development**
```bash
# Reset database with fresh data
npm run db:reset

# View database in browser
npm run db:studio

# Generate Prisma client after schema changes
npm run db:generate

# Apply schema changes
npm run db:push
```

### **Production**
```bash
# Run migrations
npx prisma migrate deploy

# Generate production client
npx prisma generate
```

## 📊 Database Monitoring

### **Key Metrics to Monitor**
- **User Activity**: Login frequency, active users
- **Project Progress**: Completion rates, budget utilization
- **Task Performance**: Assignment patterns, completion times
- **Document Usage**: Access patterns, download counts
- **Event Participation**: Registration and attendance rates

### **Performance Optimization**
- **Indexing**: Critical fields are indexed for fast queries
- **Caching**: API responses cached for public endpoints
- **Pagination**: Large datasets paginated for performance
- **Connection Pooling**: Efficient database connection management

## 🚨 Backup & Recovery

### **Daily Backups**
```bash
# Create backup
pg_dump -U barangaylink_user -h localhost barangaylink > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U barangaylink_user -h localhost barangaylink < backup_20240825.sql
```

### **Migration Strategy**
1. **Development**: Use `db:push` for rapid iteration
2. **Staging**: Use `migrate dev` for tracked changes
3. **Production**: Use `migrate deploy` for safe deployments

## ✅ Verification Steps

After setup, verify everything works:

1. **Database Connection**
   ```bash
   npm run db:studio
   # Should open Prisma Studio in browser
   ```

2. **Sample Data**
   ```bash
   # Check if data was seeded properly
   psql -U barangaylink_user -h localhost barangaylink -c "SELECT COUNT(*) FROM users;"
   # Should return 8 users
   ```

3. **API Endpoints**
   ```bash
   # Start development server
   npm run dev
   
   # Test public API
   curl http://localhost:3000/api/public/stats
   # Should return community statistics
   ```

## 🎯 Next Steps

1. **Authentication Setup**: Configure Clerk for user authentication
2. **File Upload**: Set up document and image upload system
3. **Real-time Features**: Integrate Liveblocks for collaboration
4. **Notifications**: Implement push notifications
5. **PWA Setup**: Configure progressive web app features

---

**🎉 Your database is now ready for the complete BarangayLink system!**

The database provides a solid foundation for:
- ✅ Role-based access control
- ✅ Comprehensive project management
- ✅ Community engagement features
- ✅ Transparent governance
- ✅ Real-time collaboration
- ✅ Audit trails and accountability
