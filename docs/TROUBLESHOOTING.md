# Troubleshooting Guide

Common issues and solutions for Buzzy.

## Table of Contents

- [Development Issues](#development-issues)
- [Build Issues](#build-issues)
- [Authentication Issues](#authentication-issues)
- [Database Issues](#database-issues)
- [Storage/Upload Issues](#storage-upload-issues)
- [Performance Issues](#performance-issues)
- [Production Issues](#production-issues)

## Development Issues

### App won't start

**Problem**: `npm start` fails or app won't load

**Solutions**:
```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm start -- --clear
```

### TypeScript errors

**Problem**: Type errors in editor or during build

**Solutions**:
```bash
# Run type checking
npm run type-check

# Common fix: restart TypeScript server in your editor
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Expo Go won't connect

**Problem**: Can't scan QR code or connection fails

**Solutions**:
- Ensure phone and computer are on same WiFi network
- Try tunnel mode: `npm start -- --tunnel`
- Update Expo Go app on phone
- Restart Expo Dev Server

## Build Issues

### EAS Build fails

**Problem**: `eas build` fails with errors

**Common causes & solutions**:

1. **Missing credentials**
```bash
# Configure credentials
eas credentials
```

2. **Node modules issue**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

3. **iOS build fails**
- Check bundle identifier matches Apple Developer account
- Verify provisioning profiles are valid
- Check `eas.json` configuration

4. **Android build fails**
- Verify package name in `app.json`
- Check Android permissions
- Ensure Java/Gradle versions are compatible

### Build succeeds but app crashes on launch

**Solutions**:
```bash
# Check build logs for errors
eas build:list

# Create development build for better debugging
eas build --profile development --platform ios
```

## Authentication Issues

### Magic links not working

**Problem**: Clicking email link doesn't open app

**Solutions**:

1. **Check deep linking configuration**
```json
// app.json
"linking": {
  "prefixes": ["localradar://", "https://localradar.app"]
}
```

2. **Test deep link manually**
```bash
# iOS
xcrun simctl openurl booted "localradar://"

# Android
adb shell am start -W -a android.intent.action.VIEW -d "localradar://" com.localradar.app
```

3. **Check Supabase email template**
- Verify redirect URL is set to `localradar://`
- Check email delivery logs in Supabase dashboard

### "Invalid or expired token"

**Problem**: Magic link shows error when clicked

**Solutions**:
- Magic links expire after 1 hour - request new one
- Check system time is correct
- Verify Supabase project is active
- Check auth logs in Supabase dashboard

### Session doesn't persist

**Problem**: User has to sign in every time app opens

**Solutions**:
```typescript
// Check AsyncStorage is working
import AsyncStorage from '@react-native-async-storage/async-storage';

const testStorage = async () => {
  await AsyncStorage.setItem('test', 'value');
  const value = await AsyncStorage.getItem('test');
  console.log('Storage works:', value === 'value');
};
```

## Database Issues

### "Permission denied" errors

**Problem**: RLS policies blocking legitimate requests

**Solutions**:

1. **Check if user is authenticated**
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
```

2. **Review RLS policies**
```sql
-- Check policies for events table
SELECT * FROM pg_policies WHERE tablename = 'events';
```

3. **Test with RLS disabled (development only)**
```sql
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
```

### Queries are slow

**Problem**: Map takes long to load events

**Solutions**:

1. **Check indexes**
```sql
-- Verify indexes exist
SELECT * FROM pg_indexes WHERE tablename = 'events';
```

2. **Optimize query**
```sql
-- Add composite index if needed
CREATE INDEX events_location_time_idx 
ON events USING GIST (location) 
WHERE ends_at > now() - interval '6 hours';
```

3. **Limit results**
```typescript
// Already implemented in events_nearby function
// Returns max 200 events, ordered by distance
```

### PostGIS errors

**Problem**: "function st_dwithin does not exist"

**Solution**:
```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify it's enabled
SELECT * FROM pg_extension WHERE extname = 'postgis';
```

## Storage/Upload Issues

### Image upload fails

**Problem**: "Failed to upload image" error

**Solutions**:

1. **Check storage bucket exists**
```sql
SELECT * FROM storage.buckets WHERE id = 'event-photos';
```

2. **Verify storage policies**
```sql
-- Check insert policy for authenticated users
SELECT * FROM storage.policies WHERE bucket_id = 'event-photos';
```

3. **Check file size**
- Maximum: 5 MB
- App compresses to max 1920px width
- Verify compression is working

4. **Test with smaller image**
```typescript
// Debug image size
console.log('Image size:', blob.size / 1024 / 1024, 'MB');
```

### Images don't display

**Problem**: Broken image placeholders in app

**Solutions**:

1. **Check public access**
```sql
-- Verify public read policy exists
SELECT * FROM storage.policies 
WHERE bucket_id = 'event-photos' 
AND operation = 'SELECT';
```

2. **Verify URL format**
```typescript
// Should look like:
// https://PROJECT.supabase.co/storage/v1/object/public/event-photos/filename.jpg
console.log('Image URL:', photoUrl);
```

3. **Check CORS settings** (for web)
- Supabase storage has CORS enabled by default
- If issues persist, check Supabase storage settings

## Performance Issues

### Map is laggy

**Problem**: Map stutters or freezes

**Solutions**:

1. **Reduce pin density**
```typescript
// Cluster nearby pins or limit visible pins
const MAX_VISIBLE_PINS = 50;
```

2. **Optimize image sizes**
```typescript
// Ensure thumbnails are used, not full images
```

3. **Check for memory leaks**
```typescript
// Use useEffect cleanup
useEffect(() => {
  const subscription = ...;
  return () => subscription.unsubscribe();
}, []);
```

### App uses too much data

**Problem**: High data usage complaints

**Solutions**:

1. **Implement caching**
```typescript
// Cache nearby events for 30 seconds
const CACHE_DURATION = 30000;
```

2. **Reduce polling frequency**
```typescript
// Don't refresh events too often
const REFRESH_INTERVAL = 30000; // 30 seconds
```

3. **Compress images more aggressively**
```typescript
manipulateAsync(uri, [], { compress: 0.5 }); // 50% quality
```

## Production Issues

### High error rate

**Problem**: Many users experiencing crashes

**Steps**:

1. **Check error tracking dashboard** (Sentry/Bugsnag)
2. **Identify most common errors**
3. **Push hotfix** if critical:

```bash
# For Expo managed workflow, use OTA updates
expo publish

# For bare workflow, submit new build
eas build --platform all --profile production
eas submit --latest
```

### Database overload

**Problem**: Supabase hitting connection limits

**Solutions**:

1. **Check active connections**
```sql
SELECT count(*) FROM pg_stat_activity;
```

2. **Optimize queries**
- Use connection pooling
- Close connections properly
- Add indexes to slow queries

3. **Upgrade Supabase plan** if needed

### Storage filling up

**Problem**: Running out of storage space

**Solutions**:

1. **Check storage usage**
```sql
SELECT pg_size_pretty(pg_database_size('postgres'));
```

2. **Clean up old images**
```sql
-- Delete photos for expired events
DELETE FROM storage.objects 
WHERE bucket_id = 'event-photos' 
AND created_at < now() - interval '7 days';
```

3. **Implement automatic cleanup**
- Already implemented in cron jobs
- Verify cron is running

### App Store rejection

**Problem**: App rejected by Apple/Google

**Common reasons & fixes**:

1. **Missing privacy policy**
- Add URL to app.json
- Host on accessible domain

2. **Permission descriptions unclear**
```json
// Update in app.json
"NSLocationWhenInUseUsageDescription": "Buzzy needs your location to show events near you."
```

3. **Crashy or incomplete**
- Fix all crashes
- Test thoroughly on real devices
- Ensure all features work

4. **Spam or misleading**
- Verify app description is accurate
- Remove any misleading claims
- Follow store guidelines

## Getting Help

If you can't resolve an issue:

1. **Check logs**
   - Expo: `expo logs`
   - Supabase: Dashboard → Logs
   - Device: Xcode Console / Android Logcat

2. **Search documentation**
   - Expo Docs: https://docs.expo.dev
   - Supabase Docs: https://supabase.com/docs

3. **Community support**
   - Expo Forums: https://forums.expo.dev
   - Supabase Discord: https://discord.supabase.com

4. **Contact support**
   - App Support: support@yourdomain.com
   - Emergency: [your-phone-number]

---

**Last Updated**: December 2, 2025

