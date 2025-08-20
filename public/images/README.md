# Image Organization Structure

This directory contains all images used in the BarangayLink application.

## Directory Structure

```
public/images/
├── projects/           # Project-related images
│   ├── health-center/  # Health center construction project
│   ├── road-improvement/
│   ├── digital-literacy/
│   ├── street-lights/
│   ├── waste-management/
│   └── sports-complex/
├── events/             # Event photos
│   ├── community-events/
│   ├── government-meetings/
│   ├── celebrations/
│   └── training-sessions/
├── achievements/       # Achievement showcase images
│   ├── before-after/   # Before and after photos
│   ├── completion/     # Project completion photos
│   └── impact/         # Community impact photos
└── gallery/           # General gallery images
    ├── barangay-facilities/
    ├── community-members/
    └── officials/
```

## Image Naming Convention

### Projects
- `[project-id]-featured.jpg` - Main project image
- `[project-id]-before.jpg` - Before implementation
- `[project-id]-progress-[number].jpg` - Progress photos
- `[project-id]-after.jpg` - After completion
- `[project-id]-impact.jpg` - Community impact

### Events
- `[event-id]-[date]-[number].jpg` - Event photos
- `[event-id]-featured.jpg` - Main event image

### File Requirements
- **Format**: JPG, PNG, WebP preferred
- **Size**: Maximum 2MB per image
- **Dimensions**: 
  - Featured images: 1200x800px (3:2 aspect ratio)
  - Gallery images: 800x600px (4:3 aspect ratio)
  - Thumbnails: 300x200px

## Image Upload Guidelines

1. **Optimize images** before upload (compress and resize)
2. **Use descriptive filenames** following the naming convention
3. **Add alt text** for accessibility
4. **Maintain consistent quality** across all images
5. **Test on mobile devices** to ensure proper display

## Usage in Components

Images are referenced using the Next.js Image component:

```jsx
import Image from 'next/image';

<Image 
  src="/images/projects/health-center/health-center-featured.jpg"
  alt="New Health Center Construction"
  width={1200}
  height={800}
  className="rounded-lg"
/>
```
