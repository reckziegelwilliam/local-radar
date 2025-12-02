# Deep Linking Testing Guide

## Overview

Buzzy uses deep linking for magic link authentication. This guide explains how to test deep linking functionality on different platforms.

## Deep Link Configuration

### URL Schemes

The app supports two URL schemes:

1. **Custom Scheme**: `localradar://`
2. **Universal Links**: `https://localradar.app` (when domain is configured)

### Configuration Files

- **app.json**: Linking configuration
  ```json
  "linking": {
    "prefixes": [
      "localradar://",
      "https://localradar.app"
    ]
  }
  ```

- **src/utils/deepLinking.ts**: Deep link handler implementation

## Testing Magic Link Authentication

### Step 1: Enable Email Authentication in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Ensure "Enable email confirmations" is DISABLED (we use magic links)
4. Save changes

### Step 2: Configure Email Template

1. Go to Authentication → Email Templates → Magic Link
2. Verify the template contains the redirect URL: `localradar://`
3. The link should look like: `{{ .ConfirmationURL }}`

### Step 3: Test on iOS Simulator

#### Using Xcode Simulator

```bash
# 1. Start the app in iOS simulator
npm run ios

# 2. Trigger magic link sign-in from the app
# Enter your email and click "Send Magic Link"

# 3. Open the magic link email
# (Check your actual email inbox - simulator doesn't have mail app)

# 4. Get the magic link URL from email
# It will look like:
# https://YOUR-PROJECT.supabase.co/auth/v1/verify?token=...&type=magiclink&redirect_to=localradar://

# 5. Test the deep link in simulator
xcrun simctl openurl booted "localradar://"

# Or with the full magic link URL:
xcrun simctl openurl booted "https://YOUR-PROJECT.supabase.co/auth/v1/verify?token=...&type=magiclink&redirect_to=localradar://"
```

#### Using Physical iOS Device

```bash
# 1. Build and install on device
eas build --profile development --platform ios
# Or use: expo run:ios

# 2. Trigger magic link sign-in

# 3. Open email on device and click the magic link
# The app should open automatically

# 4. Alternative: Send link via Messages/Notes
# Tap the link to test deep linking
```

### Step 4: Test on Android Emulator

#### Using Android Studio Emulator

```bash
# 1. Start the app in Android emulator
npm run android

# 2. Trigger magic link sign-in

# 3. Test deep link using adb
adb shell am start -W -a android.intent.action.VIEW -d "localradar://" com.localradar.app

# Or with full magic link:
adb shell am start -W -a android.intent.action.VIEW -d "https://YOUR-PROJECT.supabase.co/auth/v1/verify?token=...&type=magiclink&redirect_to=localradar://" com.localradar.app
```

#### Using Physical Android Device

```bash
# 1. Build and install on device
eas build --profile development --platform android
# Or use: expo run:android

# 2. Trigger magic link sign-in

# 3. Open email on device and click the magic link
# Choose "Open with Buzzy" when prompted

# 4. Alternative: Test via Chrome
# Navigate to: localradar://
# Or paste the full magic link URL
```

### Step 5: Test on Web (Development)

```bash
# 1. Start web server
npm run web

# 2. Open browser to http://localhost:8081

# 3. Trigger magic link sign-in

# 4. Click the magic link in email
# It should redirect back to your app

# Note: Web uses standard HTTP redirects, not custom URL schemes
```

## Debugging Deep Links

### Check Deep Link Handler

Add logging to `src/utils/deepLinking.ts`:

```typescript
export const DeepLinkHandler = {
  initialize: () => {
    // Add debug logs
    Linking.addEventListener('url', (event) => {
      console.log('🔗 Deep link received:', event.url);
      // ... rest of handler
    });
  }
};
```

### Check Initial URL

```typescript
// In your app, check if launched via deep link
Linking.getInitialURL().then(url => {
  if (url) {
    console.log('🚀 App launched with URL:', url);
  }
});
```

### Common Issues and Solutions

#### Issue 1: "App doesn't open from email link"

**Symptoms**: Clicking magic link opens browser, doesn't open app

**Solutions**:
- **iOS**: Check `ios.bundleIdentifier` in app.json matches your Apple Developer account
- **Android**: Check `android.package` in app.json
- **Both**: Ensure app is installed on device
- **Both**: Try uninstalling and reinstalling the app

#### Issue 2: "Deep link opens app but doesn't sign in"

**Symptoms**: App opens but stays on sign-in screen

**Solutions**:
```typescript
// Check if deep link handler is initialized
// In app/_layout.tsx:
useEffect(() => {
  const subscription = DeepLinkHandler.initialize();
  console.log('✅ Deep link handler initialized');
  
  return () => {
    subscription?.then(sub => sub?.remove());
  };
}, []);
```

#### Issue 3: "Magic link says 'Invalid or expired'"

**Symptoms**: Clicking link shows error message

**Solutions**:
- Magic links expire after 1 hour
- Request a new magic link
- Check system time is correct
- Verify Supabase project is active

#### Issue 4: "Deep link works in development but not production"

**Symptoms**: Works in Expo Go but not in standalone build

**Solutions**:
- **iOS**: Configure Associated Domains in Apple Developer Portal
- **Android**: Configure App Links in Google Play Console
- **Both**: Update app.json with correct bundle IDs
- **Both**: Rebuild and reinstall the app

## Testing Checklist

### Pre-Test Setup
- [ ] Supabase email provider enabled
- [ ] Email template configured with `localradar://` redirect
- [ ] App installed on test device/simulator
- [ ] Deep link handler initialized in app

### iOS Testing
- [ ] Test in iOS simulator using `xcrun simctl openurl`
- [ ] Test on physical device by clicking email link
- [ ] Test with app in foreground
- [ ] Test with app in background
- [ ] Test with app closed (not running)
- [ ] Verify app opens and completes sign-in

### Android Testing
- [ ] Test in Android emulator using `adb shell am start`
- [ ] Test on physical device by clicking email link
- [ ] Test with app in foreground
- [ ] Test with app in background
- [ ] Test with app closed (not running)
- [ ] Verify app opens and completes sign-in
- [ ] Test "Open with" dialog shows Buzzy

### Web Testing
- [ ] Test in Chrome
- [ ] Test in Safari
- [ ] Test in Firefox
- [ ] Verify redirect completes
- [ ] Check localStorage persists session

## Advanced Testing

### Test Universal Links (iOS)

1. Configure Associated Domains in Xcode
2. Add `apple-app-site-association` file to your domain
3. Test with: `https://localradar.app/auth/callback?token=...`

### Test App Links (Android)

1. Configure intent filters in `app.json`
2. Add `assetlinks.json` to your domain
3. Test with: `https://localradar.app/auth/callback?token=...`

### Test Deep Link Routing

```bash
# Test different routes
localradar://                    # Home/Map screen
localradar://event/123          # Specific event
localradar://create             # Create event screen
localradar://auth/sign-in       # Sign in screen
```

## Automated Testing

### Unit Tests

```typescript
// __tests__/deepLinking.test.ts
import { Linking } from 'react-native';
import { DeepLinkHandler } from '../src/utils/deepLinking';

describe('Deep Linking', () => {
  it('should handle magic link URLs', async () => {
    const url = 'localradar://auth/callback?token=abc123';
    // ... test implementation
  });
});
```

### Integration Tests

```typescript
// Test full auth flow
describe('Magic Link Auth', () => {
  it('should complete sign-in via magic link', async () => {
    // 1. Trigger magic link send
    // 2. Simulate deep link open
    // 3. Verify user is signed in
  });
});
```

## Monitoring in Production

### Add Analytics

```typescript
// Track deep link usage
Linking.addEventListener('url', (event) => {
  Analytics.track('deep_link_opened', {
    url: event.url,
    source: 'magic_link',
  });
});
```

### Add Error Tracking

```typescript
// Track deep link errors
try {
  // Handle deep link
} catch (error) {
  ErrorTracking.captureException(error, {
    url: event.url,
    context: 'deep_link_handler',
  });
}
```

## Resources

- Expo Linking Docs: https://docs.expo.dev/guides/linking/
- iOS Universal Links: https://developer.apple.com/ios/universal-links/
- Android App Links: https://developer.android.com/training/app-links
- Supabase Auth: https://supabase.com/docs/guides/auth

## Support

If deep linking isn't working:

1. Check logs for error messages
2. Verify URL scheme configuration
3. Test with simple URL first: `localradar://`
4. Ensure app is properly installed
5. Check Supabase auth logs
6. Contact support: support@yourdomain.com

---

**Last Updated**: December 2, 2025  
**Tested On**: iOS 17, Android 13, Expo SDK 54

