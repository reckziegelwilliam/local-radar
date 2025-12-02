# Deployment Guide for Buzzy

This guide covers deploying Buzzy to production, including Supabase setup, edge functions deployment, and app store builds.

## Prerequisites

Before deploying, ensure you have:
- [ ] Supabase account (free tier works for testing, Pro recommended for production)
- [ ] Expo account
- [ ] Apple Developer account ($99/year, for iOS)
- [ ] Google Play Developer account ($25 one-time, for Android)
- [ ] Node.js 20.19.4 or higher
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] EAS CLI installed: `npm install -g eas-cli`

## Part 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `buzzy-production`
   - Database Password: (use a strong password, save it securely)
   - Region: Choose closest to your target users
5. Wait for project creation (~2 minutes)

### 1.2 Enable PostGIS Extension

1. Go to SQL Editor in your Supabase dashboard
2. Run this command:

```sql
create extension if not exists postgis;
```

3. Click "Run" to execute

### 1.3 Run Database Migrations

Execute the SQL files in this order:

1. **Schema** - Creates tables and indexes
```bash
# In Supabase SQL Editor, copy and paste content from:
supabase/schema.sql
```

2. **RLS Policies** - Sets up security
```bash
# Copy and paste content from:
supabase/rls.sql
```

3. **Functions** - Creates database functions
```bash
# Copy and paste content from:
supabase/functions.sql
```

4. **Notifications** - Sets up notification tables (if applicable)
```bash
# Copy and paste content from:
supabase/notifications.sql
```

### 1.4 Set Up Storage Bucket

**Option A: Using SQL (Recommended)**

Run the SQL script:
```bash
# In Supabase SQL Editor, copy and paste content from:
supabase/storage-policies.sql
```

**Option B: Using Dashboard**

1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Name: `event-photos`
4. Public bucket: Yes (checked)
5. File size limit: 5 MB
6. Allowed MIME types: `image/jpeg,image/png,image/jpg,image/webp`
7. Click "Create bucket"

**Set Storage Policies:**

1. Click on the `event-photos` bucket
2. Go to "Policies" tab
3. Add policy for upload:
   - Policy name: `Authenticated users can upload`
   - Target roles: `authenticated`
   - Policy definition: `(bucket_id = 'event-photos')`
   - Check: `INSERT`
4. Add policy for public read:
   - Policy name: `Public read access`
   - Target roles: `public`
   - Policy definition: `(bucket_id = 'event-photos')`
   - Check: `SELECT`

### 1.5 Deploy Edge Functions

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy create-event
supabase functions deploy cleanup-expired-events
supabase functions deploy send-nearby-notification

# Set secrets for functions (if needed)
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 1.6 Set Up Cron Jobs (Requires Supabase Pro)

**Note**: Cron jobs require the Supabase Pro plan ($25/month).

1. Go to Database → Functions in Supabase dashboard
2. Enable the `pg_cron` extension
3. Run the cron job setup:

```bash
# In Supabase SQL Editor, copy and paste content from:
supabase/cron-jobs.sql
```

**Important**: Update the hardcoded URL in `cron-jobs.sql` to match your project URL:
- Find: `https://immjhwxgisuoxzwkxvnz.supabase.co`
- Replace with: `https://YOUR-PROJECT-REF.supabase.co`

**Alternative Without Pro Plan:**

Set up external cron service (e.g., GitHub Actions, cron-job.org) to call the cleanup function hourly:

```bash
curl -X POST \
  'https://YOUR-PROJECT-REF.supabase.co/functions/v1/cleanup-expired-events' \
  -H 'Authorization: Bearer YOUR-ANON-KEY' \
  -H 'Content-Type: application/json'
```

### 1.7 Configure Authentication

1. Go to Authentication → Providers in Supabase dashboard
2. Enable Email provider
3. Configure email templates:
   - Go to Authentication → Email Templates
   - Customize "Magic Link" template if needed
4. Configure email service (optional but recommended):
   - Supabase provides 4 emails/hour on free tier
   - For production, integrate SendGrid or similar:
     - Go to Project Settings → Auth
     - Add SMTP credentials

### 1.8 Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - `Project URL` → EXPO_PUBLIC_SUPABASE_URL
   - `anon/public key` → EXPO_PUBLIC_SUPABASE_ANON_KEY
   - `service_role key` → SUPABASE_SERVICE_ROLE_KEY (keep secret!)

## Part 2: App Configuration

### 2.1 Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Supabase credentials:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. For different environments, create:
   - `.env.development` - Local development
   - `.env.staging` - Staging environment
   - `.env.production` - Production environment

### 2.2 Update app.json

1. Update URLs in `app.json`:

```json
{
  "expo": {
    "privacyPolicyUrl": "https://yourdomain.com/privacy-policy",
    "supportUrl": "mailto:support@yourdomain.com"
  }
}
```

2. Host your privacy policy and terms:
   - Upload `legal/privacy-policy.md` to your website
   - Upload `legal/terms-of-service.md` to your website
   - Or use a service like GitHub Pages

### 2.3 Update EAS Configuration

Edit `eas.json` and fill in your Apple Developer credentials:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123XYZ"
      }
    }
  }
}
```

## Part 3: Building for Production

### 3.1 EAS Build Setup

```bash
# Login to EAS
eas login

# Configure EAS (if not already done)
eas build:configure
```

### 3.2 Build for iOS

```bash
# Production build
eas build --platform ios --profile production

# This will:
# - Build the app
# - Sign it with your Apple Developer credentials
# - Provide a download link when done (~20-30 minutes)
```

### 3.3 Build for Android

```bash
# Production build
eas build --platform android --profile production

# This will:
# - Build the app
# - Create an APK or AAB
# - Provide a download link when done (~15-20 minutes)
```

### 3.4 Build Both Platforms

```bash
eas build --platform all --profile production
```

## Part 4: Pre-Launch Testing

### 4.1 TestFlight (iOS)

```bash
# Submit to TestFlight for internal testing
eas submit --platform ios --latest

# Or manually:
# 1. Download the .ipa from EAS
# 2. Upload to App Store Connect via Transporter
# 3. Go to TestFlight tab
# 4. Add internal testers
```

### 4.2 Internal Testing (Android)

```bash
# Submit to Internal Testing track
eas submit --platform android --track internal --latest
```

### 4.3 Test Checklist

Before submitting to production:

- [ ] Test authentication (magic link or password)
- [ ] Test deep linking (click magic link in email)
- [ ] Test location permissions
- [ ] Test camera/photo permissions
- [ ] Create an event with photo
- [ ] View events on map
- [ ] RSVP to an event
- [ ] Report an event
- [ ] Test on multiple device sizes
- [ ] Test on slow network
- [ ] Test offline behavior
- [ ] Verify events auto-expire
- [ ] Test push notifications

## Part 5: App Store Submission

### 5.1 App Store Connect (iOS)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app:
   - Platform: iOS
   - Name: Buzzy
   - Bundle ID: `com.localradar.app`
   - SKU: `buzzy-ios`
   - Primary Language: English
3. Fill in app information:
   - Subtitle: "Discover hyperlocal events"
   - Category: Social Networking
   - Privacy Policy URL: (your hosted URL)
   - Support URL: (your support email/website)
4. Upload screenshots (see `app-store/ios/screenshots/`)
5. Write app description (see `app-store/APP_STORE_COPY.md`)
6. Complete age rating questionnaire
7. Submit for review

```bash
# Submit latest build
eas submit --platform ios --latest
```

### 5.2 Google Play Console (Android)

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app:
   - Name: Buzzy
   - Default language: English
   - App type: App
   - Free or Paid: Free
3. Fill in store listing:
   - Short description (80 chars)
   - Full description (see `app-store/APP_STORE_COPY.md`)
   - Screenshots (see `app-store/android/screenshots/`)
   - Feature graphic (see `app-store/android/feature-graphic/`)
4. Complete content rating questionnaire
5. Set up pricing & distribution
6. Create production release

```bash
# Submit latest build
eas submit --platform android --latest
```

## Part 6: Monitoring Production

### 6.1 Supabase Monitoring

1. Database dashboard:
   - Monitor query performance
   - Check disk usage
   - Review logs

2. Auth dashboard:
   - Monitor sign-ups
   - Check auth errors

3. Storage dashboard:
   - Monitor storage usage
   - Review upload errors

### 6.2 App Store Monitoring

**iOS:**
- App Store Connect → Analytics
- TestFlight → Crash Reports
- Users and Access → Ratings & Reviews

**Android:**
- Play Console → Dashboard
- Quality → Android vitals (crashes, ANRs)
- User feedback → Ratings & Reviews

### 6.3 Set Up Alerts

Create alerts for:
- Database CPU > 80%
- Storage > 90% capacity
- High error rates
- Unusual API usage

## Part 7: Post-Launch

### 7.1 Monitor First 24 Hours

- [ ] Check crash reports every hour
- [ ] Monitor user reviews
- [ ] Watch database performance
- [ ] Verify cron jobs running
- [ ] Check edge function logs
- [ ] Monitor API error rates

### 7.2 Week 1 Tasks

- [ ] Respond to user reviews
- [ ] Fix any critical bugs immediately
- [ ] Prepare hotfix process
- [ ] Document common support questions
- [ ] Review analytics data

### 7.3 Ongoing Maintenance

**Weekly:**
- Review crash reports
- Check user feedback
- Monitor database performance
- Review storage usage

**Monthly:**
- Update dependencies
- Review security advisories
- Analyze user metrics
- Plan feature updates

## Troubleshooting

### Build Errors

**"Build failed" on EAS:**
1. Check EAS build logs in terminal
2. Common issues:
   - Missing credentials
   - Dependency conflicts
   - Configuration errors
3. Run `eas build:configure` again

### Authentication Issues

**Magic links not working:**
1. Check email delivery in Supabase logs
2. Verify redirect URL in auth settings
3. Test deep linking configuration
4. Check spam folder

**"Invalid token" errors:**
1. Verify API keys in .env
2. Check token expiration settings
3. Review RLS policies

### Database Issues

**"Permission denied" errors:**
1. Review RLS policies
2. Check user authentication
3. Verify function permissions

**Slow queries:**
1. Check indexes (see `schema.sql`)
2. Review query complexity
3. Monitor active connections

### Storage Issues

**Image uploads failing:**
1. Verify storage bucket exists
2. Check storage policies
3. Review file size limits
4. Check MIME types

## Rollback Procedure

If you need to rollback a release:

### iOS
1. Go to App Store Connect
2. Select previous version
3. Submit for expedited review (if critical)

### Android
1. Go to Play Console
2. Production → Releases
3. Halt rollout or roll back

### Database
```bash
# Backup first!
pg_dump -h your-host -U postgres your-database > backup.sql

# Then apply rollback migrations if needed
```

## Support Resources

- Expo Documentation: https://docs.expo.dev
- Supabase Documentation: https://supabase.com/docs
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Apple App Review: https://developer.apple.com/app-store/review/
- Google Play Policies: https://play.google.com/about/developer-content-policy/

## Emergency Contacts

- Expo Support: https://expo.dev/support
- Supabase Support: support@supabase.io
- Apple Developer Support: https://developer.apple.com/contact/
- Google Play Support: https://support.google.com/googleplay/android-developer/

---

**Next Steps:**
1. Complete Supabase setup
2. Test locally with production database
3. Create staging build
4. Test staging thoroughly
5. Create production build
6. Submit to app stores

**Need Help?** Refer to `docs/TROUBLESHOOTING.md` for common issues and solutions.

