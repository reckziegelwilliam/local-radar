# Quick Reference: App Store Assets

## Required Asset Sizes

### iOS App Store
| Asset | Size | Format | Required |
|-------|------|--------|----------|
| App Icon | 1024 x 1024 px | PNG (no transparency) | ✅ Yes |
| iPhone Screenshots | 1290 x 2796 px | PNG/JPG | ✅ Yes (min 3) |
| iPad Screenshots | 2048 x 2732 px | PNG/JPG | If supporting iPad |
| App Preview | 1290 x 2796 px | .mov/.m4v/.mp4 | Optional |

### Google Play Store
| Asset | Size | Format | Required |
|-------|------|--------|----------|
| App Icon | 512 x 512 px | PNG (32-bit) | ✅ Yes |
| Phone Screenshots | 1080 x 1920 px | PNG/JPG | ✅ Yes (min 2) |
| Tablet Screenshots | 1920 x 1200 px | PNG/JPG | Optional |
| Feature Graphic | 1024 x 500 px | PNG/JPG | ✅ Yes |

## Current Asset Status

### In `/assets/` (App Icons)
- ✅ `icon.png` - Main app icon (1024x1024 for iOS)
- ✅ `adaptive-icon.png` - Android adaptive icon
- ✅ `splash-icon.png` - Splash screen
- ✅ `favicon.png` - Web favicon
- ⚠️ `notification-icon.png` - **MISSING** (referenced in app.json)

### In `/app-store/`
- ✅ `APP_STORE_COPY.md` - All text content ready
- 📁 `ios/screenshots/` - Empty (need to add)
- 📁 `android/screenshots/` - Empty (need to add)
- 📁 `android/feature-graphic/` - Empty (need to create)

## Action Items

### Immediate
1. ⚠️ Create `notification-icon.png` (96x96px, transparent PNG) for Android
2. 📸 Take iOS screenshots (minimum 3)
3. 📸 Take Android screenshots (minimum 2)
4. 🎨 Create Android feature graphic (1024x500px)

### Before Submission
5. ✅ Verify privacy policy URL is live
6. ✅ Set up support email
7. ✅ Test app on physical devices
8. ✅ Complete submission checklists

## Screenshot Workflow

### Option 1: Simulator/Emulator (Quick)
```bash
# iOS
npx expo start
# Press 'i', then Cmd+S to screenshot

# Android  
npx expo start
# Press 'a', use emulator camera button
```

### Option 2: Physical Device (Best Quality)
- Use Expo Go or development build
- iOS: Screenshot with Side+Volume buttons
- Android: Screenshot with Power+Volume Down

### Option 3: Use Expo Screenshot Tool
```bash
# If available in your Expo version
npx expo export --platform ios
# Then use simulator
```

## Text Content Character Limits

| Field | iOS Limit | Android Limit |
|-------|-----------|---------------|
| App Name | 30 chars | 50 chars |
| Subtitle | 30 chars | 80 chars (short desc) |
| Description | 4000 chars | 4000 chars |
| Keywords | 100 chars | N/A (uses tags) |
| Promotional Text | 170 chars | N/A |
| What's New | 4000 chars | 500 chars |

## URLs You'll Need

- **Privacy Policy**: ________________________________
- **Support URL**: ________________________________
- **Marketing URL** (optional): ________________________________
- **YouTube Preview** (optional): ________________________________

## Developer Accounts

- **Apple Developer**: $99/year - https://developer.apple.com/programs/
- **Google Play Console**: $25 one-time - https://play.google.com/console/

## Build Commands

### iOS (via EAS)
```bash
eas build --platform ios --profile production
```

### Android (via EAS)
```bash
eas build --platform android --profile production
```

### Local iOS (requires Mac)
```bash
npx expo run:ios --configuration Release
```

### Local Android
```bash
npx expo run:android --variant release
```

## Common Issues & Solutions

### Issue: Notification icon missing
**Solution**: Create a 96x96px transparent PNG and place at `/assets/notification-icon.png`

### Issue: App crashes on real device
**Solution**: Test with development build first, check logs with `adb logcat` (Android) or Xcode console (iOS)

### Issue: Screenshots wrong size
**Solution**: Use exact device simulator/emulator specified in requirements, don't resize manually

### Issue: Feature graphic doesn't look good
**Solution**: Keep important content in center, test on mobile view in Play Console

## Resources

- **Screenshot Tools**: Figma, Canva, Shotbot.io
- **Icon Generator**: https://easyappicon.com/
- **Mockup Generator**: https://mockuphone.com/
- **App Preview Specs**: https://developer.apple.com/app-store/app-previews/

## Contact & Support

For app-specific questions:
- Check `/app-store/README.md`
- Check `/app-store/SCREENSHOT_GUIDE.md`
- Check `/app-store/SUBMISSION_CHECKLIST.md`

For Expo questions:
- https://docs.expo.dev/
- https://forums.expo.dev/

For store submission:
- iOS: https://developer.apple.com/support/
- Android: https://support.google.com/googleplay/android-developer/

---

**TIP**: Start with iOS - it has stricter requirements. If it passes iOS review, Android is usually easier.

