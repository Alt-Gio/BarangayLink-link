#!/bin/bash

# Barangay Management System - Netlify Deployment Script
# This script helps prepare and deploy the application to Netlify

set -e

echo "🚀 Barangay Management System - Netlify Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting deployment preparation..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm ci

# Step 2: Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Step 3: Build the application
print_status "Building application..."
npm run build

print_success "Build completed successfully!"

# Step 4: Check for common issues
print_status "Running deployment checks..."

# Check if .next directory exists
if [ ! -d ".next" ]; then
    print_error ".next directory not found. Build may have failed."
    exit 1
fi

# Check if netlify.toml exists
if [ ! -f "netlify.toml" ]; then
    print_error "netlify.toml not found. Please ensure it exists."
    exit 1
fi

print_success "All checks passed!"

# Step 5: Display next steps
echo ""
echo "🎉 Deployment preparation completed!"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for Netlify deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Click 'New site from Git'"
echo "   - Choose your repository"
echo "   - Build command: npm run build"
echo "   - Publish directory: .next"
echo ""
echo "3. Configure environment variables in Netlify dashboard:"
echo "   - DATABASE_URL"
echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   - CLERK_SECRET_KEY"
echo "   - NEXT_PUBLIC_APP_URL"
echo ""
echo "4. Test your deployment:"
echo "   - Visit your Netlify URL"
echo "   - Test authentication"
echo "   - Test API endpoints"
echo ""
print_success "Ready for deployment! 🚀"

