# 🚀 Netlify Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [x] Build passes locally (`npm run build`)
- [x] No TypeScript errors
- [x] No linting errors
- [x] All dependencies are in package.json
- [x] Prisma client is generated

### 2. Configuration Files
- [x] `netlify.toml` is properly configured
- [x] `next.config.ts` is optimized for production
- [x] `package.json` has correct build scripts
- [x] Environment variables are documented

### 3. Database Setup
- [ ] Production database is created (Supabase/Railway)
- [ ] DATABASE_URL is ready for Netlify
- [ ] Database migrations are tested
- [ ] Seed data is prepared

### 4. External Services
- [ ] Clerk authentication is configured
- [ ] UploadThing is set up
- [ ] Pusher is configured for real-time features
- [ ] Resend is set up for emails
- [ ] OneSignal is configured for push notifications
- [ ] PostHog is set up for analytics

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### Step 2: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"

### Step 3: Configure Environment Variables
Add these in Netlify dashboard → Site settings → Environment variables:

#### Required Variables
```env
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

#### Optional Variables (for full functionality)
```env
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_ID=your_pusher_app_id
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_API_KEY=your_onesignal_rest_api_key
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Step 4: Database Migration
After deployment, run database setup:
1. Go to Netlify Functions
2. Create a migration function or use CLI
3. Run: `npx prisma db push`

### Step 5: Test Deployment
1. Visit your Netlify URL
2. Test authentication flow
3. Test API endpoints
4. Test file uploads
5. Test real-time features

## 🔧 Post-Deployment Configuration

### Domain Setup
1. Go to Site settings → Domain management
2. Add custom domain
3. Update `NEXT_PUBLIC_APP_URL` in environment variables
4. Configure DNS settings

### Performance Optimization
1. Enable Netlify Edge Functions
2. Configure caching headers
3. Enable compression
4. Set up CDN

### Monitoring Setup
1. Enable Netlify Analytics
2. Configure error tracking
3. Set up uptime monitoring
4. Monitor function execution times

## 🚨 Troubleshooting

### Common Issues

#### Build Fails
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Check for missing dependencies
- Review build logs for specific errors

#### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database is accessible from Netlify
- Ensure SSL is enabled for production
- Test connection locally with production URL

#### API Routes Not Working
- Check if @netlify/plugin-nextjs is installed
- Verify redirects in netlify.toml
- Check function timeout settings
- Review function logs

#### Authentication Issues
- Verify Clerk keys are correct
- Check redirect URLs in Clerk dashboard
- Ensure CORS is configured properly
- Test authentication flow

### Debug Commands
```bash
# Test build locally
npm run build

# Test production build
npm run build:netlify

# Check environment variables
echo $DATABASE_URL

# Test database connection
npx prisma db push

# Check Netlify CLI
netlify status
```

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Review environment variables
3. Test locally with production settings
4. Check function logs in Netlify dashboard
5. Contact support with detailed error logs

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Site loads at your Netlify URL
- ✅ Authentication works
- ✅ API endpoints respond
- ✅ Database operations work
- ✅ File uploads function
- ✅ Real-time features work
- ✅ All pages load correctly

## 🔄 Continuous Deployment

Once deployed:
- Every push to main branch triggers automatic deployment
- Preview deployments are created for pull requests
- Environment variables are automatically applied
- Database migrations can be automated

---

**🎯 Goal**: Get your barangay management system live on Netlify with full functionality!

