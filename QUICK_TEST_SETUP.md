# 🚀 Quick Test Setup Guide

## ⚡ **1-Minute Setup**

### **Step 1: Enable Test Login**
```bash
# Create or edit .env.local
echo "NEXT_PUBLIC_ENABLE_TEST_LOGIN=true" >> .env.local
```

### **Step 2: Start Development Server**
```bash
npm run dev
```

### **Step 3: Access Test Login**
- **URL**: `http://localhost:3000/test-login`
- **Or**: Click "Test Login" in the footer of the landing page

### **Step 4: Choose Test Account**
Quick login options:
- **Admin** (`admin123`) - Full access
- **Captain** (`captain123`) - Executive control
- **Secretary** (`secretary123`) - Documentation
- **Treasurer** (`treasurer123`) - Financial
- **Councilor** (`councilor123`) - Committee work
- **Staff** (`staff123`) - Basic operations

---

## 🎯 **Navigation Features**

### **BarangayLink Logo Click**
- **Dashboard → Landing**: Click the "BarangayLink" logo in the sidebar
- **Smooth transition**: Returns to public landing page
- **Maintains test session**: Test mode indicators remain visible

### **Test Mode Indicators**
- **Yellow "TEST MODE" badge** in sidebar
- **Pulsing indicator** in header
- **Exit buttons** in multiple locations

---

## 🔧 **Troubleshooting**

### **Test Login Not Working?**
1. Check `.env.local` has `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true`
2. Restart development server: `npm run dev`
3. Clear browser cache and reload

### **Can't Access /test-login?**
1. Verify environment variable is set
2. Check for typos in URL
3. Try direct navigation: `localhost:3000/test-login`

### **Test Mode Not Showing?**
1. Ensure you clicked a test account login
2. Check browser sessionStorage for `testUser`
3. Try logging out and back in

---

## 🎉 **Ready to Test!**

Your test environment is now ready. You can:
- ✅ **Switch between roles** to test permissions
- ✅ **Click BarangayLink logo** to return to landing page
- ✅ **Navigate freely** between dashboard and public pages
- ✅ **Exit test mode** anytime with yellow buttons

**Enjoy exploring the complete BarrangayLink system!** 🏛️✨
