# Buzzy

Buzzy is a hyperlocal micro-events app that helps you discover and create spontaneous events happening right around you.

## Features

- **Real-time Map**: See nearby events on an interactive map within 5km radius
- **Quick Event Creation**: Post events in under 20 seconds with photos and categories
- **Smart Categories**: 🎵 Music, ☕ Café meetups, 🛍️ Yard sales, 🍔 Food trucks, and more
- **RSVP System**: Show interest in events and see who else is going
- **Auto-Expiry**: Events automatically disappear after they end (+ 6 hour grace period)
- **Push Notifications**: Get notified when new events are created nearby
- **Content Moderation**: Report inappropriate content with automatic hiding
- **Location-Based**: Uses PostGIS for precise geographical queries

## Tech Stack

### Frontend
- **React Native** with Expo SDK 54
- **Expo Router** for file-based navigation
- **Expo Maps** for interactive mapping
- **TypeScript** for type safety
- **Expo Notifications** for push notifications

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** with PostGIS extension for geospatial queries
- **Row Level Security (RLS)** for data protection
- **Edge Functions** for server-side validation and cleanup
- **Supabase Storage** for photo uploads

## Getting Started

### Prerequisites
- Node.js 20.19.4 or higher
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd local-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Enable PostGIS extension in SQL Editor:
     ```sql
     create extension if not exists postgis;
     ```
   - Run the database schema:
     ```bash
     # Execute the SQL files in order:
     # 1. supabase/schema.sql
     # 2. supabase/rls.sql  
     # 3. supabase/functions.sql
     # 4. supabase/notifications.sql
     ```
   - Deploy Edge Functions:
     ```bash
     supabase functions deploy create-event
     supabase functions deploy cleanup-expired-events
     supabase functions deploy send-nearby-notification
     ```
   - Set up Storage Bucket for event photos:
     ```bash
     # Execute supabase/storage-policies.sql in Supabase SQL Editor
     # Or manually create bucket named 'event-photos' with public read access
     ```
   - Set up cron jobs (requires Supabase Pro):
     ```bash
     # Execute supabase/cron-jobs.sql
     # Note: Update the hardcoded URL to match your project
     ```

4. **Configure environment**
   
   Copy the environment template and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your Supabase project details:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   Get these values from: Supabase Dashboard → Project Settings → API

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android  
   npm run android
   
   # Web (for testing)
   npm run web
   ```

## App Structure

```
src/
├── components/          # Reusable UI components
│   ├── EventPin.tsx    # Map marker for events
│   ├── CategorySelector.tsx
│   ├── LoadingSpinner.tsx
│   ├── EmptyState.tsx
│   └── OnboardingTooltip.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication state
│   ├── useLocation.ts  # Location services
│   ├── useNearbyEvents.ts
│   └── useNotifications.ts
├── services/           # External service integrations
│   ├── supabase.ts     # Database client
│   ├── LocationService.ts
│   └── NotificationService.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── constants.ts    # App constants and styling
│   ├── validation.ts   # Form validation
│   └── profanity.ts    # Content filtering
app/
├── (auth)/             # Authentication screens
├── (tabs)/             # Main tab navigation
├── create.tsx          # Event creation modal
└── event/[id].tsx      # Event detail screen
```

## Database Schema

### Core Tables
- `profiles` - User profiles with auto-generated handles
- `events` - Events with PostGIS geography for location
- `event_rsvps` - Many-to-many relationship for RSVPs
- `event_reports` - Content moderation reports

### Key Features
- **PostGIS Integration**: Precise geographic queries with `ST_DWithin`
- **Auto-cleanup**: Cron jobs remove expired events
- **Rate Limiting**: Max 5 events per user per hour
- **Content Moderation**: Auto-hide events with 3+ reports

## Security

- Row Level Security (RLS) on all tables
- Magic link authentication (passwordless)
- Client and server-side content validation
- Rate limiting to prevent spam
- Automatic content moderation

## App Store Readiness

### iOS
- Bundle identifier: `com.localradar.app`
- Required permissions: Location, Camera, Photo Library
- Push notification certificates configured
- Privacy policy included

### Android
- Package name: `com.localradar.app`
- Required permissions defined in app.json
- Adaptive icon configured
- Edge-to-edge display support

## Deployment

1. **Build for production**
   ```bash
   eas build --platform all
   ```

2. **Submit to stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.
