# BarangayLink Setup Guide

## 🎯 What's New

### ✅ Completed Enhancements

1. **🚫 Removed Light/Dark Mode** - Optimized single theme for better performance
2. **🖼️ Interactive Image Carousel** - Clickable project galleries with navigation
3. **📁 Organized Image Structure** - Professional image management system
4. **🗄️ PostgreSQL Database Integration** - Complete Prisma setup with role hierarchy
5. **📊 Dynamic Content** - Database-driven projects and events
6. **👥 Role-Based Access** - Admin, Captain, Secretary, Treasurer, Councilor, Staff hierarchy

### 🎨 New Features

#### **Interactive Image Carousel**
- ✅ **Left/Right Navigation** - Click arrows to browse project images
- ✅ **Thumbnail Preview** - Click thumbnails to jump to specific images
- ✅ **Full-Screen Modal** - Click eye icon to view full-size images
- ✅ **Image Counter** - Shows current image position (1 of 5)
- ✅ **Fallback Handling** - Graceful handling of missing images

#### **Professional Image Organization**
```
public/images/
├── projects/           # Project galleries
│   ├── health-center/
│   ├── road-improvement/
│   ├── digital-literacy/
│   ├── street-lights/
│   ├── waste-management/
│   └── sports-complex/
├── events/             # Event photos
├── achievements/       # Achievement showcases
└── gallery/           # General community photos
```

#### **Database-Driven Content**
- ✅ **Projects** - Dynamic project loading from database
- ✅ **Events** - Real-time event management
- ✅ **Announcements** - Public announcements system
- ✅ **Role Hierarchy** - Complete officials management

## 🚀 Quick Setup

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Environment Setup**
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/barangaylink"
```

### 3. **Database Setup**
```bash
# Generate Prisma client
npm run db:generate

# Create database schema
npm run db:push

# Seed sample data
npm run db:seed
```

### 4. **Start Development**
```bash
npm run dev
```

## 🗄️ Database Configuration

### **PostgreSQL Setup**

1. **Install PostgreSQL** on your system
2. **Create Database**:
   ```sql
   CREATE DATABASE barangaylink;
   CREATE USER barangayuser WITH PASSWORD 'Access123';
   GRANT ALL PRIVILEGES ON DATABASE barangaylink TO barangayuser;
   ```

3. **Update .env.local**:
   ```env
   DATABASE_URL="postgresql://barangayuser:Access123@localhost:5432/barangaylink?schema=public"
   ```

### **Available Database Commands**
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed sample data
npm run db:studio      # Open Prisma Studio
npm run db:reset       # Reset and reseed database
```

## 👥 Role Hierarchy System

### **User Roles (In Order of Access)**
1. **ADMIN** - System administrator (full control)
2. **BARANGAY_CAPTAIN** - Barangay Captain (full project control)
3. **SECRETARY** - Barangay Secretary (same as Captain)
4. **TREASURER** - Barangay Treasurer (same as Captain)
5. **COUNCILOR** - Barangay Councilor (project access)
6. **STAFF** - Barangay Staff (limited access)

### **Access Levels**
- **PUBLIC** - Visible on landing page
- **OFFICIALS** - All barangay officials
- **MANAGEMENT** - Captain, Secretary, Treasurer only
- **ADMIN_ONLY** - System admin only
- **INTERNAL** - Internal use only

## 📊 Sample Data

The seed script creates:
- **3 Completed Projects** (Health Center, Road Improvement, Digital Literacy)
- **3 Upcoming Events** (Clean-up Drive, Health Seminar, Assembly Meeting)
- **2 Announcements** (Project completions)
- **1 Admin User** (admin@barangaybitano.gov.ph)

## 🖼️ Image Management

### **Adding Project Images**

1. **Create Project Folder**:
   ```
   public/images/projects/[project-name]/
   ```

2. **Add Images**:
   ```
   project-name-featured.jpg    # Main image
   project-name-before.jpg      # Before photo
   project-name-progress-1.jpg  # Progress photos
   project-name-after.jpg       # Completion photo
   project-name-impact.jpg      # Impact/community photo
   ```

3. **Update Database**:
   ```typescript
   // In the admin panel or directly in database
   featuredImage: "/images/projects/project-name/project-name-featured.jpg",
   galleryImages: [
     "/images/projects/project-name/project-name-before.jpg",
     "/images/projects/project-name/project-name-progress-1.jpg",
     "/images/projects/project-name/project-name-after.jpg"
   ]
   ```

### **Image Requirements**
- **Format**: JPG, PNG, WebP
- **Size**: Maximum 2MB per image
- **Dimensions**: 
  - Featured: 1200x800px (3:2 ratio)
  - Gallery: 800x600px (4:3 ratio)
  - Thumbnails: 300x200px

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:network      # Start with network access

# Building
npm run build           # Build for production
npm run start          # Start production server
npm run local-build    # Build and start locally

# Database
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:seed        # Seed sample data
npm run db:studio      # Open database manager

# Utilities
npm run lint           # Check code quality
npm run type-check     # TypeScript checking
npm run clean          # Clean build files
```

## 📱 PWA Features

- ✅ **App Installation** - Install as mobile/desktop app
- ✅ **Offline Support** - Basic offline functionality
- ✅ **Push Notifications** - Ready for notification system
- ✅ **App Shortcuts** - Quick access to services

## 🎯 Next Steps

### **For Production Use**
1. **Add Real Images** - Replace placeholder images with actual project photos
2. **Configure Database** - Set up production PostgreSQL database
3. **Authentication** - Implement Clerk or NextAuth for user login
4. **Admin Panel** - Build admin interface for content management
5. **Image Upload** - Add file upload functionality for officials

### **Optional Enhancements**
1. **Real Map Integration** - Google Maps or Mapbox for community map
2. **Payment Integration** - For service fees and permits
3. **Document Generation** - PDF generation for certificates
4. **Email Notifications** - Event and announcement notifications
5. **Mobile App** - React Native companion app

## 🆘 Troubleshooting

### **Common Issues**

1. **Database Connection Error**
   ```bash
   # Check PostgreSQL is running
   sudo service postgresql start
   
   # Verify database exists
   psql -U barangayuser -d barangaylink
   ```

2. **Images Not Loading**
   - Ensure images exist in `public/images/` directory
   - Check file permissions
   - Verify correct file paths in database

3. **Prisma Errors**
   ```bash
   # Regenerate client
   npm run db:generate
   
   # Reset database
   npm run db:reset
   ```

## 📞 Support

For technical support:
- **Email**: admin@barangaybitano.gov.ph
- **Phone**: (052) 742-0123
- **Documentation**: Check this SETUP.md file

---

**🎉 BarangayLink is now ready for use with full database integration, interactive image carousels, and optimized performance!**
