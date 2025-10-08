# App Store Assets Guide

This directory contains all assets and copy needed for submitting Buzzy to the App Store and Google Play Store.

## Directory Structure

```
app-store/
├── README.md                    # This file
├── APP_STORE_COPY.md           # All text content for store listings
├── ios/                         # iOS App Store assets
│   ├── screenshots/             # iPhone and iPad screenshots
│   └── app-preview/             # Optional preview videos
├── android/                     # Google Play Store assets
│   ├── screenshots/             # Phone and tablet screenshots
│   └── feature-graphic/         # Feature graphics
└── assets/                      # Shared promotional assets
    ├── app-icon/                # High-res app icon source files
    └── promotional/             # Marketing materials
```

## iOS App Store Requirements

### App Icon
- **1024x1024px** PNG (no transparency, no rounded corners)
- Location: Already in `/assets/icon.png` - ensure it meets specs

### iPhone Screenshots (REQUIRED)
Choose one device size to submit:
- **6.7" display** (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 px
- **6.5" display** (iPhone 11 Pro Max, XS Max): 1242 x 2688 px
- **5.5" display** (iPhone 8 Plus): 1242 x 2208 px

**Minimum**: 3 screenshots, **Maximum**: 10 screenshots
**Format**: PNG or JPG (no transparency)

### iPad Screenshots (if supported)
- **12.9" iPad Pro** (3rd/4th gen): 2048 x 2732 px
- **Minimum**: 3 screenshots, **Maximum**: 10 screenshots

### App Preview Video (Optional)
- **Duration**: 15-30 seconds
- **Formats**: .mov, .m4v, or .mp4
- **Orientation**: Portrait or Landscape
- Same size requirements as screenshots

### Suggested Screenshot Order
1. **Map View** - Hero shot showing the main map with event pins
2. **Event Details** - Show an open event with details and RSVP
3. **Create Event** - Simple event creation form
4. **Categories** - Category selection interface
5. **Notifications** - Example of push notification feature

## Google Play Store Requirements

### App Icon
- **512x512px** PNG (32-bit with alpha/transparency)
- Already exported via `adaptive-icon.png`

### Phone Screenshots (REQUIRED)
- **Minimum**: 2 screenshots, **Maximum**: 8 screenshots
- **Dimensions**: 16:9 or 9:16 aspect ratio
- **Recommended**: 1080 x 1920 px or 1080 x 2340 px
- **Format**: PNG or JPG

### Tablet Screenshots (Optional, but recommended)
- **7-inch**: 1024 x 600 px or 600 x 1024 px
- **10-inch**: 1920 x 1200 px or 1200 x 1920 px
- **Minimum**: 2 screenshots, **Maximum**: 8 screenshots

### Feature Graphic (REQUIRED)
- **1024 x 500px** PNG or JPG
- Showcases your app at the top of the Play Store listing
- Should include app branding and key visual elements

### Promotional Video (Optional)
- Upload to YouTube and provide link
- 30 seconds to 2 minutes recommended

## Asset Creation Tips

### Screenshots Best Practices
1. **Use actual app UI** - Take screenshots from a real device or simulator
2. **Add text overlays** - Highlight key features with text annotations
3. **Show variety** - Display different use cases and features
4. **Keep it clean** - Use realistic but appealing data
5. **Brand consistently** - Use consistent colors and styling across all screenshots

### Taking Screenshots

#### For iOS (using Simulator):
```bash
# Run your app in simulator at desired device size
npx expo start --ios

# Take screenshots with: Cmd + S
# Screenshots save to: ~/Desktop
```

#### For Android (using Emulator):
```bash
# Run your app in emulator
npx expo start --android

# Take screenshots with emulator controls
# Or use: adb shell screencap -p /sdcard/screenshot.png
```

### Design Tools for Polish
- **Figma/Sketch** - Add text overlays and annotations
- **Shotbot** - https://app.shotbot.io/ (free screenshot frames)
- **Screenshots.pro** - https://screenshots.pro/ (device frames)
- **Apple Design Resources** - Device mockup templates

## Checklist for Submission

### iOS App Store
- [ ] App icon (1024x1024px) ready
- [ ] Minimum 3 iPhone screenshots prepared
- [ ] iPad screenshots (if supporting tablets)
- [ ] App preview video (optional)
- [ ] Privacy Policy URL live and accessible
- [ ] Support URL ready
- [ ] All copy from APP_STORE_COPY.md ready to paste

### Google Play Store
- [ ] App icon (512x512px) ready
- [ ] Minimum 2 phone screenshots prepared
- [ ] Tablet screenshots (optional but recommended)
- [ ] Feature graphic (1024x500px) created
- [ ] Promotional video YouTube link (optional)
- [ ] Privacy Policy URL live and accessible
- [ ] All copy from APP_STORE_COPY.md ready to paste

## Testing Before Submission

1. **Test on Real Devices**: Always test on actual devices before taking final screenshots
2. **Verify Permissions**: Ensure all permission dialogs appear correctly
3. **Check Data**: Use realistic sample data in screenshots
4. **Review Guidelines**: 
   - iOS: https://developer.apple.com/app-store/review/guidelines/
   - Android: https://play.google.com/about/developer-content-policy/

## Notes
- Screenshots should NOT contain device frames when uploading to stores
- The stores automatically add device frames in their interface
- Always use the highest resolution available for your target device
- Keep source files (PSD, Figma, etc.) for future updates

