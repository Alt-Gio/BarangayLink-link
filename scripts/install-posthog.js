#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 Installing PostHog Analytics...\n');

// Check if PostHog is already installed
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (packageJson.dependencies && packageJson.dependencies['posthog-js']) {
  console.log('✅ PostHog is already installed');
  console.log('📋 To configure PostHog:');
  console.log('1. Get your PostHog API key from: https://app.posthog.com/project/settings');
  console.log('2. Add to your .env.local:');
  console.log('   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key');
  console.log('   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com');
  process.exit(0);
}

// Install PostHog
try {
  console.log('📦 Installing posthog-js...');
  execSync('npm install posthog-js --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ PostHog installed successfully');
  
  console.log('\n📋 Next steps:');
  console.log('1. Get your PostHog API key from: https://app.posthog.com/project/settings');
  console.log('2. Add to your .env.local:');
  console.log('   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key');
  console.log('   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com');
  console.log('3. Import and initialize PostHog in your app');
  
} catch (error) {
  console.log('❌ Failed to install PostHog');
  console.log('Error:', error.message);
  console.log('\n📋 Manual installation:');
  console.log('npm install posthog-js --legacy-peer-deps');
  process.exit(1);
}

