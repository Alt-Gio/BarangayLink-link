# 🚀 Netlify Deployment Guide

## 📋 **Prerequisites**

Before deploying to Netlify, make sure you have:

1. **GitHub/GitLab/Bitbucket repository** with your code
2. **Netlify account** (free tier available)
3. **Database setup** (Supabase recommended for PostgreSQL)
4. **Environment variables** configured

## 🔧 **Step 1: Prepare Your Repository**

### 1.1 **Update Next.js Configuration**
Your `next.config.ts` is already configured for static export.

### 1.2 **Environment Variables**
Create a `.env.local` file with all required variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OneSignal Push Notifications
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id
NEXT_PUBLIC_ONESIGNAL_REST_API_KEY=your_onesignal_rest_api_key

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# UploadThing File Upload
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Pusher Real-time
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_ID=your_pusher_app_id
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster

# Resend Email
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
CUSTOM_KEY=your_custom_key

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🌐 **Step 2: Deploy to Netlify**

### 2.1 **Connect Repository**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, Bitbucket)
4. Select your repository

### 2.2 **Build Settings**
Configure these settings in Netlify:

```
Build command: npm run build
Publish directory: out
Node version: 18
NPM version: 9
```

### 2.3 **Environment Variables**
Add all environment variables from your `.env.local` file to Netlify:
1. Go to Site settings > Environment variables
2. Add each variable from the list above

## 🔗 **Step 3: Configure Services**

### 3.1 **Database Setup (Supabase)**
1. Create a Supabase project
2. Get your database URL
3. Add to Netlify environment variables
4. Run database migrations:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### 3.2 **Authentication (Clerk)**
1. Create a Clerk application
2. Configure sign-in/sign-up URLs
3. Add Clerk keys to Netlify

### 3.3 **File Upload (UploadThing)**
1. Create UploadThing account
2. Configure file upload settings
3. Add UploadThing keys to Netlify

### 3.4 **Push Notifications (OneSignal)**
1. Create OneSignal app
2. Configure web push settings
3. Add OneSignal keys to Netlify

### 3.5 **Real-time (Pusher)**
1. Create Pusher app
2. Configure channels
3. Add Pusher keys to Netlify

### 3.6 **Email (Resend)**
1. Create Resend account
2. Verify domain
3. Add Resend API key to Netlify

## 🚀 **Step 4: Deploy**

### 4.1 **Trigger Deployment**
1. Push changes to your repository
2. Netlify will automatically build and deploy
3. Monitor build logs for any errors

### 4.2 **Custom Domain (Optional)**
1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings

## 🔍 **Step 5: Post-Deployment**

### 5.1 **Verify Deployment**
- ✅ Check all pages load correctly
- ✅ Test authentication flow
- ✅ Verify database connections
- ✅ Test file uploads
- ✅ Check push notifications
- ✅ Verify email functionality

### 5.2 **Performance Optimization**
- ✅ Enable Netlify Analytics
- ✅ Configure CDN settings
- ✅ Set up form handling
- ✅ Enable asset optimization

## 🛠 **Troubleshooting**

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check environment variables

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase connection settings
   - Ensure database is accessible from Netlify

3. **Authentication Issues**
   - Verify Clerk configuration
   - Check redirect URLs
   - Ensure environment variables are set

4. **API Route Issues**
   - Check Netlify redirects configuration
   - Verify API routes are properly configured
   - Check CORS settings

## 📞 **Support**

If you encounter issues:
1. Check Netlify build logs
2. Verify all environment variables
3. Test locally with production settings
4. Contact support with specific error messages

## 🎉 **Success!**

Your barangay management system is now deployed on Netlify with:
- ✅ Static site generation
- ✅ PWA capabilities
- ✅ Real-time features
- ✅ File upload functionality
- ✅ Push notifications
- ✅ Email system
- ✅ Authentication
- ✅ Database integration
