# 🛠️ Netlify Troubleshooting Guide

## ❌ **"No Functions Deployed" Error**

### **Problem:**
- Netlify shows "No functions deployed" in deploy log
- API routes return 404 errors
- Server-side features don't work

### **Solution:**
1. **Install Netlify Next.js Plugin:**
   ```bash
   npm install @netlify/plugin-nextjs
   ```

2. **Use Default Build Settings:**
   - Don't override build command or publish directory
   - Let Netlify auto-detect Next.js

3. **Check netlify.toml:**
   ```toml
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

## ❌ **"Skipped" Build Steps**

### **Problem:**
- Build steps show "Skipped" instead of "Complete"
- Changes not being deployed

### **Solution:**
1. **Force Rebuild:**
   - Go to Netlify dashboard
   - Click "Trigger deploy" → "Clear cache and deploy site"

2. **Check Git Commits:**
   - Ensure you pushed your latest changes
   - Check if Netlify is connected to the right branch

## ❌ **404 Errors on All Pages**

### **Problem:**
- Every page shows 404 error
- Only homepage works

### **Solution:**
1. **Remove Custom Redirects:**
   - Let the Netlify Next.js plugin handle routing
   - Don't override with custom redirects

2. **Check Next.js Config:**
   - Remove `output: "standalone"` from next.config.ts
   - Let the plugin handle the output

## ✅ **Correct Configuration**

### **netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Only add these if needed
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/___netlify-handler"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **next.config.ts:**
```typescript
const nextConfig: NextConfig = {
  // Remove output: "standalone"
  images: {
    unoptimized: true,
    domains: ['localhost', 'utfs.io', '*.netlify.app'],
  },
  // ... rest of config
};
```

## 🔍 **Verification Steps**

### **After Deployment:**
1. **Check Deploy Log:**
   - Should show "Functions deployed"
   - Build steps should be "Complete"

2. **Test API Routes:**
   - Visit `/api/dashboard/stats`
   - Should return JSON data, not 404

3. **Test Pages:**
   - Visit `/dashboard`
   - Should load dashboard, not 404

4. **Check Functions:**
   - Go to Netlify dashboard → Functions
   - Should see your API routes listed

## 🚀 **Quick Fix Commands**

```bash
# Install plugin
npm install @netlify/plugin-nextjs

# Push changes
git add .
git commit -m "Fix Netlify functions deployment"
git push origin main

# Force rebuild in Netlify dashboard
# Clear cache and deploy site
```

## 📞 **Still Having Issues?**

1. **Check Netlify Build Logs:**
   - Look for specific error messages
   - Check if plugin is being used

2. **Verify Environment Variables:**
   - All required variables are set
   - No typos in variable names

3. **Test Locally:**
   ```bash
   npm run build
   npm run start
   ```

4. **Contact Support:**
   - Include build logs
   - Include netlify.toml content
   - Include error screenshots
