# Buzzy Architecture Documentation

**Last Updated**: December 2, 2025  
**Version**: 1.0.0-beta.1

---

## 🏗️ System Overview

Buzzy is a hyperlocal micro-events discovery platform built with a modern React Native frontend and Supabase backend, designed for real-time event discovery within a 5km radius.

###  High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (React Native)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     iOS      │  │   Android    │  │     Web      │      │
│  │  (Expo SDK)  │  │  (Expo SDK)  │  │    (PWA)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           │                                  │
│              ┌────────────┴────────────┐                     │
│              │   Expo Router (Nav)     │                     │
│              └────────────┬────────────┘                     │
│                           │                                  │
│        ┌──────────────────┼──────────────────┐              │
│        │                  │                  │              │
│  ┌─────▼─────┐   ┌────────▼────────┐  ┌─────▼──────┐      │
│  │ Components│   │     Services     │  │   Hooks    │      │
│  │    (UI)   │   │ (Business Logic) │  │  (State)   │      │
│  └───────────┘   └─────────┬────────┘  └────────────┘      │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Supabase API   │
                    │  (REST/Realtime)│
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼─────┐      ┌──────▼──────┐   ┌───────▼──────┐
    │PostgreSQL│      │Edge Functions│   │   Storage    │
    │ + PostGIS│      │    (Deno)    │   │ (S3-compat)  │
    └──────────┘      └──────────────┘   └──────────────┘
```

---

## 📱 Frontend Architecture

### Tech Stack

**Core**:
- React Native 0.81.4
- Expo SDK 54
- TypeScript 5.6.2
- Expo Router 6.0.10 (file-based routing)

**State Management**:
- React Hooks (useState, useEffect, useContext)
- Custom hooks for business logic
- AsyncStorage for persistence

**UI & Styling**:
- React Native StyleSheet
- Custom design system (COLORS, TYPOGRAPHY, SPACING constants)
- Platform-specific components (.native.tsx, .web.tsx)
- Dark/light mode support

**Key Libraries**:
- `react-native-maps` - Interactive maps
- `expo-location` - Geolocation
- `expo-notifications` - Push notifications
- `expo-image-picker` - Photo uploads
- `@supabase/supabase-js` - Backend client
- `react-native-shake` - Shake gesture detection
- `@react-native-community/netinfo` - Network status

### Application Structure

```
app/                      # Expo Router screens
├── _layout.tsx          # Root layout with providers
├── index.tsx            # Landing/home screen
├── (auth)/              # Authentication group
│   ├── _layout.tsx      # Auth layout
│   └── sign-in.tsx      # Sign in screen
├── (tabs)/              # Main app tabs
│   ├── _layout.tsx      # Tab navigation
│   ├── map.tsx          # Map view (main screen)
│   ├── map.native.tsx   # Native map implementation
│   ├── map.web.tsx      # Web map implementation
│   └── settings.tsx     # Settings screen
├── create.tsx           # Create event modal
├── event/[id].tsx       # Event detail (dynamic route)
└── feedback.tsx         # Beta feedback form

src/
├── components/          # Reusable UI components
│   ├── CategorySelector.tsx
│   ├── EventPin.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   ├── OfflineBanner.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication state
│   ├── useLocation.ts   # Location services
│   ├── useNearbyEvents.ts # Event fetching
│   └── useNotifications.ts # Push notifications
├── services/            # Business logic & API clients
│   ├── supabase.ts      # Supabase client
│   ├── LocationService.ts
│   ├── NotificationService.ts
│   ├── AnalyticsService.ts
│   ├── ErrorTrackingService.ts
│   └── FeedbackService.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── utils/               # Utility functions
    ├── constants.ts     # App constants
    ├── validation.ts    # Form validation
    ├── profanity.ts     # Content filtering
    ├── logger.ts        # Logging utility
    └── ...
```

### Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Custom Hook (useNearbyEvents, useAuth, etc.)
    ↓
Service Layer (supabase.ts, LocationService, etc.)
    ↓
Supabase API
    ↓
PostgreSQL / Edge Functions
    ↓
Response flows back up the chain
    ↓
State Update (React Hook)
    ↓
UI Re-renders
```

---

## 🔧 Backend Architecture

### Supabase Services

**PostgreSQL Database**:
- Version: 15.x
- Extensions: PostGIS (geospatial queries)
- Connection pooling via PgBouncer

**Key Tables**:
- `profiles` - User profiles
- `events` - Event listings
- `event_rsvps` - RSVP relationships
- `event_reports` - Content moderation
- `beta_feedback` - Beta tester feedback
- `event_spotting` - Event spotting feature

**Storage**:
- S3-compatible object storage
- Bucket: `event-photos`
- Public read, authenticated write
- 5MB file size limit
- Image compression on upload

**Edge Functions** (Deno):
1. `create-event` - Server-side event validation
2. `cleanup-expired-events` - Auto-delete old events
3. `send-nearby-notification` - Push notifications to nearby users

**Real-time**:
- WebSocket connections for live updates
- Subscriptions to event changes
- Automatic UI updates on data changes

---

## 🔐 Security Architecture

### Authentication

**Magic Link (Primary)**:
1. User enters email
2. Supabase sends magic link email
3. User clicks link (deep link)
4. App authenticates via Supabase
5. JWT token stored securely

**Password (Backup)**:
- Available for development/testing
- BCrypt hashed passwords
- Minimum 8 characters

### Authorization (Row Level Security)

**RLS Policies**:
```sql
-- Users can read all profiles
profiles: SELECT for public

-- Users can only update their own profile
profiles: UPDATE where auth.uid() = id

-- Anyone can read non-hidden events
events: SELECT where is_hidden = false

-- Only authenticated users can create events
events: INSERT for authenticated

-- Users can only delete their own events
events: DELETE where creator = auth.uid()

-- Users can RSVP to any event
event_rsvps: INSERT for authenticated

-- Users can only delete their own RSVPs
event_rsvps: DELETE where profile_id = auth.uid()
```

### Data Protection

**In Transit**:
- All API calls over HTTPS/TLS 1.3
- WebSocket connections encrypted
- No sensitive data in URLs/query params

**At Rest**:
- Database encryption at rest (AES-256)
- Storage buckets encrypted
- No plaintext passwords (BCrypt hashed)

**Client-Side**:
- Secure storage for tokens (Expo SecureStore)
- Environment variables for API keys
- No sensitive data in logs

---

## 🗺️ Geospatial Architecture

### PostGIS Integration

**Location Storage**:
```sql
-- Events table uses PostGIS geography type
location geography(point, 4326)  -- WGS84 coordinate system
```

**Spatial Queries**:
```sql
-- Find events within 5km
SELECT * FROM events
WHERE ST_DWithin(
  location,
  ST_GeographyFromText('POINT(lon lat)'),
  5000  -- meters
)
AND NOT is_hidden
ORDER BY location <-> ST_GeographyFromText('POINT(lon lat)')
LIMIT 50;
```

**Indexing**:
- GIST index on `location` column
- Enables fast spatial queries
- Sub-100ms query times for typical loads

### Map Implementation

**Native (iOS/Android)**:
- `react-native-maps` library
- Native map views (MapKit, Google Maps)
- Custom markers for events
- Clustering for performance

**Web**:
- Simplified list view
- No interactive map (web fallback)
- Still shows nearby events

---

## 📊 Performance Architecture

### Frontend Optimization

**Code Splitting**:
- Route-based splitting via Expo Router
- Lazy loading of heavy components
- Dynamic imports for optional features

**Image Optimization**:
- Compression on upload (expo-image-manipulator)
- Responsive image sizing
- Lazy loading of images
- CDN delivery (via Supabase Storage)

**Caching Strategy**:
- AsyncStorage for user preferences
- In-memory cache for recent events
- Stale-while-revalidate pattern

### Backend Optimization

**Database**:
- Indexes on all foreign keys
- Composite indexes for common queries
- Connection pooling (PgBouncer)
- Read replicas (planned)

**API Performance**:
- Edge function cold starts <500ms
- Database queries <100ms (P95)
- Total API response time <500ms (P95)

**Rate Limiting**:
- 5 events per user per hour
- 100 requests per minute per IP
- Exponential backoff on failures

---

## 🔄 Real-time Architecture

### Event Updates

**Subscription Pattern**:
```typescript
// Subscribe to nearby events
const subscription = supabase
  .channel('events')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'events'
  }, (payload) => {
    // Update UI in real-time
    handleEventChange(payload);
  })
  .subscribe();
```

**Use Cases**:
- New events appear automatically
- RSVP counts update live
- Event deletions remove from map
- Real-time collaborative experience

---

## 📱 Push Notification Architecture

**Flow**:
```
Event Created
    ↓
Edge Function: send-nearby-notification
    ↓
Query users within 5km with push tokens
    ↓
Send via Expo Push Notification Service
    ↓
Device receives notification
    ↓
User taps notification
    ↓
Deep link opens event detail screen
```

**Implementation**:
- Expo Push Notifications (unified iOS/Android)
- Background processing of notifications
- Batched sends for efficiency
- Delivery tracking and retry logic

---

## 🧪 Testing Architecture

**Unit Tests**:
- Jest + React Native Testing Library
- Component testing
- Service layer testing
- Utility function testing

**Integration Tests**:
- Supabase client tests
- API integration tests
- Mock Supabase for tests

**E2E Tests** (Planned):
- Detox or Maestro
- Critical user flows
- Run in CI/CD

---

## 🚀 Deployment Architecture

### Mobile App Deployment

**Build System**:
- EAS (Expo Application Services)
- Cloud-based builds
- Multiple profiles (dev, preview, production)

**Distribution**:
- iOS: TestFlight → App Store
- Android: Internal Testing → Production

### Backend Deployment

**Supabase**:
- Managed PostgreSQL
- Auto-scaling
- Automatic backups
- Multiple regions available

**Edge Functions**:
- Deployed via Supabase CLI
- Automatic versioning
- Instant rollback capability

---

## 📈 Monitoring & Observability

**Error Tracking**:
- Sentry integration (configured)
- Automatic crash reports
- Error boundaries for graceful failures
- Source maps for debugging

**Analytics** (Planned):
- Amplitude or Firebase
- User behavior tracking
- Funnel analysis
- Retention metrics

**Performance Monitoring**:
- API response times
- Database query performance
- Frontend render times
- Network request tracking

**Logs**:
- Centralized logging
- Structured logs (JSON)
- Log levels (debug, info, warn, error)
- Privacy-aware (no PII in logs)

---

## 🔮 Future Architecture Considerations

### Scaling Strategy

**Database**:
- Read replicas for heavy loads
- Sharding by geographic region (long-term)
- Caching layer (Redis)

**API**:
- GraphQL layer for flexible queries
- API gateway for rate limiting
- CDN for static assets

**Real-time**:
- Dedicated WebSocket servers
- Message queue for notifications (RabbitMQ/Redis)

### Platform Expansion

**Web App**:
- Progressive Web App (PWA)
- Service workers for offline
- Desktop-optimized UI

**Additional Platforms**:
- Apple Watch companion app
- Android Wear app
- Desktop apps (Electron)

---

## 📞 Architecture Decisions

See [docs/ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) for detailed ADRs (Architecture Decision Records).

**Key Decisions**:
1. **Why React Native?** - Code sharing, fast development, native performance
2. **Why Supabase?** - PostgreSQL, real-time, auth, storage in one platform
3. **Why PostGIS?** - Industry-standard geospatial queries, performance
4. **Why Expo?** - Simplified development, OTA updates, managed builds

---

**This architecture supports our goal of providing real-time, hyperlocal event discovery at scale.**

For implementation details, see:
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Database structure
- [API_REFERENCE.md](API_REFERENCE.md) - API documentation
- [CODE_STRUCTURE.md](CODE_STRUCTURE.md) - Code organization

