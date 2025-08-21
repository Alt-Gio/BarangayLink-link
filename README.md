# BarangayLink - Barangay Bitano Management System

A modern, responsive, and PWA-optimized digital platform for Barangay Bitano community services and governance.

## 🚀 New: Supabase Integration

This project now includes **Supabase** integration for enhanced performance, real-time features, and better scalability. The database has been optimized with:

- **Real-time subscriptions** for live updates
- **Performance indexes** for faster queries
- **Connection pooling** for better resource management
- **Type-safe operations** with comprehensive TypeScript support

### Quick Start with Supabase

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the automated setup:**
   ```bash
   npm run supabase:setup
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

For detailed migration instructions, see [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md).

## 🚀 Features

- **✨ Modern Landing Page** - Beautiful, responsive design with dark/light mode
- **🏆 Achievements Showcase** - Display completed projects and community impact
- **📅 Interactive Events Calendar** - Month navigation, category filtering, and dual view modes
- **🗺️ Interactive Community Map** - Visual representation of important locations
- **📱 PWA Ready** - Progressive Web App with offline capabilities
- **🌙 Dark Mode** - Seamless theme switching with system preference detection
- **📊 Real-time Statistics** - Community metrics and performance indicators
- **🔐 Authentication Pages** - Login and registration with modern design
- **📞 Emergency Services** - Quick access to emergency contacts and services

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.4.6 with React 19
- **Styling**: Tailwind CSS 4.0 with custom animations
- **Icons**: Lucide React
- **Fonts**: Inter & JetBrains Mono
- **TypeScript**: Full type safety
- **PWA**: Manifest and service worker ready

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd barangay-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   ├── register/
│   ├── layout.tsx        # Root layout with PWA config
│   ├── page.tsx          # Main landing page
│   └── globals.css       # Global styles and animations
├── components/
│   ├── landing/          # Landing page specific components
│   │   ├── AchievementsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── QuickInfoCards.tsx
│   │   ├── ServicesSection.tsx
│   │   └── StatsSection.tsx
│   ├── layout/           # Layout components
│   │   └── Navigation.tsx
│   └── ui/              # Reusable UI components
│       ├── EventCalendar.tsx
│       ├── FloatingNavigation.tsx
│       ├── InteractiveMap.tsx
│       └── ThemeProvider.tsx
├── context/             # React context providers
├── hooks/              # Custom React hooks
└── lib/               # Utility functions
```

## 🎨 Key Components

### Landing Page Sections (in order)
1. **Hero Section** - Welcome message and main CTAs
2. **Achievements Section** - Completed projects and impact metrics
3. **Events Calendar** - Interactive calendar with filtering
4. **Quick Info & Stats** - Community statistics and info cards
5. **Community Map** - Interactive location map
6. **Services** - Available government services
7. **Contact** - Contact information and form

### Interactive Features
- **Enhanced Calendar**: Month navigation, category filtering, list/calendar views
- **Theme System**: Light/dark mode with system preference detection
- **PWA Support**: App installation prompt and offline functionality
- **Responsive Design**: Mobile-first approach with desktop enhancements

## 🔧 Configuration

### Environment Variables
Check `env.example` for all available configuration options:

- **NEXT_PUBLIC_APP_URL**: Application base URL
- **NEXT_PUBLIC_BARANGAY_NAME**: Barangay name
- **NEXT_PUBLIC_CONTACT_PHONE**: Main contact number
- **NEXT_PUBLIC_EMERGENCY_HOTLINE**: Emergency contact

### PWA Configuration
The PWA is configured in:
- `public/manifest.json` - App manifest
- `src/app/layout.tsx` - Metadata and icons
- `next.config.ts` - Build optimization

## 📱 PWA Setup

1. **Create Icons** (place in `public/icons/`):
   - icon-72x72.png through icon-512x512.png
   - Maskable and regular versions

2. **Test PWA Features**:
   - Install prompt after 3 seconds
   - Offline functionality
   - App shortcuts

## 🎯 Deployment

### Local Network Access
```bash
npm run dev -- --hostname 0.0.0.0
```
Access from other devices: `http://YOUR_IP:3000`

### Production Deployment
```bash
npm run build
npm start
```

### Environment-Specific Builds
- Development: `npm run dev`
- Production: `npm run build && npm start`
- Linting: `npm run lint`

## 🚨 Troubleshooting

### Common Issues

1. **Font compilation error**: Fixed by switching from Geist to Inter/JetBrains Mono
2. **Dark mode not working**: Ensure ThemeProvider is properly wrapped in layout
3. **PWA not installing**: Check manifest.json and ensure icons exist

### Development Tips
- Use `npm run lint` to check for issues
- Enable dark mode to test both themes
- Test responsive design on multiple screen sizes
- Verify PWA features in Chrome DevTools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- **Email**: office@barangaybitano.gov.ph
- **Phone**: (052) 742-0123
- **Emergency**: (052) 742-0124

---

Built with ❤️ for Barangay Bitano Community