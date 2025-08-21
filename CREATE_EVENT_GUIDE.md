# Create Event Page Guide

## Overview
The new Create Event page provides a user-friendly, two-step process for creating events with a calendar-based date picker and comprehensive form fields that match the Prisma schema.

## Features

### 1. Calendar-Based Date Selection
- **Interactive Calendar**: Full-month calendar view with navigation
- **Date Highlighting**: Today's date is highlighted with a blue ring
- **Selected Date Display**: Clear visual feedback for selected dates
- **Month Navigation**: Easy navigation between months with arrow buttons

### 2. Two-Step Process
- **Step 1**: Select Event Date from Calendar
- **Step 2**: Fill in Event Details

### 3. Comprehensive Form Fields
The form includes all fields from the Prisma Event schema:

#### Basic Information
- Event Title (required)
- Short Description
- Description (required)
- Event Type (required) - Community, Meeting, Program, Emergency, Celebration, Training, Ceremony, Sports, Cultural, Health, Education, Consultation
- Category (required) - General, Government, Health, Education, Sports, Cultural, Emergency, Environment, Infrastructure, Social

#### Location & Time
- Location (required)
- Venue
- Start Date (required)
- End Date
- All Day Event toggle
- Start Time
- End Time

#### Additional Details
- Agenda
- Requirements
- Contact Information
- Target Audience
- Expected Attendees
- Budget (₱)
- Related Project (dropdown from existing projects)

#### Event Settings
- Public Event toggle
- Feature on landing page toggle
- Registration required toggle
- Max Attendees (if registration required)
- Registration Deadline (if registration required)

## Usage

### Accessing the Page
1. Navigate to `/dashboard/events`
2. Click the "New Event" button
3. Or directly visit `/dashboard/events/create`

### Creating an Event
1. **Select Date**: 
   - Browse the calendar and click on your desired date
   - The selected date will be highlighted in blue
   - Click "Next: Event Details" to proceed

2. **Fill Details**:
   - Complete the required fields (marked with *)
   - Add optional information as needed
   - Use the "Back to Calendar" button to change the date
   - Click "Create Event" to save

### Permissions
- Users with EVENT_MANAGEMENT.CREATE permission can access this page
- Staff members cannot create events (redirected to events list)

## Technical Implementation

### Files Created/Modified
- `src/app/dashboard/events/create/page.tsx` - Main page component
- `src/components/dashboard/forms/CreateEventForm.tsx` - Form component with calendar

### Key Features
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Consistent with the application's dark theme
- **Form Validation**: Required field validation and error handling
- **API Integration**: Connects to `/api/events` for event creation
- **Project Integration**: Fetches projects from `/api/projects` for dropdown
- **Permission Checking**: Validates user permissions before allowing access

### Calendar Implementation
- Custom calendar component with month navigation
- Date selection with visual feedback
- Proper date formatting and validation
- Integration with form data

### Form Features
- Real-time form validation
- Conditional fields (registration fields only show when registration is required)
- Time picker integration
- Project relationship support
- Comprehensive error handling

## Database Schema Compatibility
The form is fully compatible with the Prisma Event schema:
- All required fields are included
- Optional fields are properly handled
- Data types match the schema definitions
- Relationships (projects) are properly linked

## Error Handling
- Network errors are displayed to the user
- Form validation errors are shown inline
- Permission errors redirect appropriately
- Loading states are shown during API calls

## Future Enhancements
- Image upload for featured images
- Gallery image upload
- Tag management
- Recurring event support
- Event templates
- Bulk event creation
