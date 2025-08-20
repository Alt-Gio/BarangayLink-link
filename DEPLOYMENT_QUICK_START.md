# 🚀 Netlify Deployment Quick Start Guide

## Prerequisites
- Netlify account
- GitHub/GitLab repository with your code
- Database setup (PostgreSQL recommended for production)

## Step 1: Database Setup

### Option A: Use Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL from Settings > Database
4. Add to Netlify environment variables

### Option B: Use Railway
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Get your database URL
4. Add to Netlify environment variables

## Step 2: Environment Variables

Add these environment variables in Netlify:

```bash
# Database
DATABASE_URL="your-database-url-here"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Pusher (for real-time features)
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-app-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"

# Resend (for email notifications)
RESEND_API_KEY="your-resend-api-key"

# OneSignal (for push notifications)
NEXT_PUBLIC_ONESIGNAL_APP_ID="your-onesignal-app-id"
ONESIGNAL_REST_API_KEY="your-onesignal-rest-api-key"

# PostHog (for analytics)
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# App URL
NEXT_PUBLIC_APP_URL="https://your-app-name.netlify.app"
```

## Step 3: Deploy to Netlify

### Method 1: Connect GitHub Repository
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose your repository
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Click "Deploy site"

### Method 2: Manual Deploy
1. Run `npm run build` locally
2. Drag the `.next` folder to Netlify

## Step 4: Configure Domain
1. Go to Site settings > Domain management
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` in environment variables

## Step 5: Database Migration
After deployment, run database migrations:
1. Go to Netlify Functions
2. Create a new function to run migrations
3. Or use the Netlify CLI: `netlify functions:invoke migrate`

## Troubleshooting

### Build Errors
- Check Node.js version (should be 18+)
- Ensure all environment variables are set
- Check for TypeScript errors

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database is accessible from Netlify
- Ensure SSL is enabled for production databases

### API Routes Not Working
- Check if @netlify/plugin-nextjs is installed
- Verify redirects in netlify.toml
- Check function timeout settings

## Performance Optimization

1. Enable Netlify Edge Functions
2. Configure caching headers
3. Use Netlify Image Optimization
4. Enable compression

## Monitoring

1. Set up Netlify Analytics
2. Configure error tracking (Sentry)
3. Monitor function execution times
4. Set up uptime monitoring

## Security Checklist

- [ ] Environment variables are set
- [ ] Database has proper access controls
- [ ] API keys are secured
- [ ] CORS is configured properly
- [ ] Rate limiting is in place
- [ ] SSL is enabled

## Support

If you encounter issues:
1. Check Netlify build logs
2. Review environment variables
3. Test locally with production settings
4. Contact support with build logs
