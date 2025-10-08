# Screenshot Creation Guide for Buzzy

This guide will help you create compelling app store screenshots for Buzzy.

## Quick Start: Taking Screenshots

### iOS Screenshots

1. **Start the iOS Simulator**
   ```bash
   npx expo start
   # Press 'i' for iOS
   ```

2. **Select the right device**
   - Go to: Hardware > Device > iOS [version] 
   - Choose: **iPhone 15 Pro Max** (6.7" display - best for App Store)

3. **Take screenshots**
   - Navigate to each screen you want to capture
   - Press `Cmd + S` to save screenshot
   - Screenshots save to your Desktop by default

4. **Required screenshots** (minimum 3):
   - Map view with multiple event pins
   - Event detail view with RSVP
   - Create event screen
   - Category selection (optional)
   - Notification example (optional)

### Android Screenshots

1. **Start the Android Emulator**
   ```bash
   npx expo start
   # Press 'a' for Android
   ```

2. **Select the right device**
   - Create/use: **Pixel 7 Pro** or **Pixel 6 Pro** emulator
   - Resolution: 1440 x 3120 (good for Play Store)

3. **Take screenshots**
   - Navigate to each screen
   - Click the camera icon in emulator toolbar
   - Or use: `Cmd + Shift + 5` on Mac

4. **Required screenshots** (minimum 2):
   - Same screens as iOS for consistency

## Screenshot Content Recommendations

### 1. Map View (Hero Screenshot)
**This should be your first screenshot - it's the most important!**

- Show 5-8 event pins on the map
- Use different colored pins (representing different categories)
- Center on a recognizable area (or generic city view)
- Make sure location permission is granted
- Include your current location indicator

**Sample Events to Display:**
- 🎵 "Acoustic Guitar @ Central Park" (Music)
- ☕ "Coding Meetup @ Starbucks" (Meetup)
- 🍔 "Taco Truck on Main St" (Food)
- 🛍️ "Yard Sale - Everything Must Go!" (Sale)
- 🏀 "Pickup Basketball Game" (Sports)

### 2. Event Detail View
- Open event with clear title and description
- Show image if available
- Display RSVP count (e.g., "5 people going")
- Show time remaining (e.g., "Ends in 2 hours")
- Include category emoji and icon
- Show "Report Event" option at bottom

**Sample Event:**
```
🎵 Pop-up Music
Acoustic Guitar @ Central Park

Join us for an impromptu acoustic session! Bring your own instrument or just enjoy the music.

Location: Central Park, Meadow Area
Today, 4:00 PM - 6:00 PM
Ends in 2 hours

👤 5 people going

[RSVP Button]
```

### 3. Create Event Screen
- Show the form partially filled out
- Display category selection
- Include image picker
- Show date/time picker

**Sample Data:**
```
Title: Coffee & Code Meetup
Category: ☕ Meetup
Description: Casual coding session at local cafe
Date: Today
Time: 3:00 PM - 5:00 PM
Photo: [Coffee shop image]
```

### 4. Category Selection (Optional)
- Show all 8 categories with emojis
- Clean, organized grid layout
- Maybe highlight one being selected

Categories to show:
- 🎵 Music
- ☕ Meetup
- 🍔 Food
- 🛍️ Sale
- 🏀 Sports
- 🧘 Wellness
- 🎨 Art
- 📍 Other

### 5. Notifications (Optional)
- Show iOS/Android notification banner
- Use example: "🎵 New event nearby: Jazz Band @ Corner Cafe"
- Include app icon in notification

## Adding Text Overlays (Recommended)

Text overlays help users understand features at a glance. Add them using Figma, Photoshop, or online tools.

### Suggested Overlay Text:

1. **Map View**: 
   - "Discover events near you"
   - "Real-time hyperlocal event map"

2. **Event Details**:
   - "RSVP and get directions"
   - "See what's happening"

3. **Create Event**:
   - "Post in under 20 seconds"
   - "Share what's happening"

4. **Categories**:
   - "8 smart categories"
   - "Find exactly what you want"

### Text Overlay Best Practices:
- Use your brand colors (check app theme)
- Keep text short and punchy
- Use sans-serif fonts (Helvetica, SF Pro, Roboto)
- Ensure high contrast for readability
- Position text in safe areas (not over critical UI)

## Styling Tips

### Device Frames
**Don't add device frames yourself!** The App Store and Play Store automatically add them.

### Background Status Bar
- Make sure status bar looks clean
- Set time to something like "9:41 AM" (iOS standard)
- Full battery and signal
- Consider using: `npx expo-status-bar-override` package

### Sample Data Quality
- Use realistic but appealing data
- Avoid lorem ipsum or placeholder text
- Use diverse emoji and categories
- Include reasonable RSVP counts (3-15 people)
- Show varied event times and durations

### Consistency
- Use the same style across all screenshots
- If you add device frames (for website), use same model
- If you add text overlays, use same font and colors
- Show similar zoom level on map views

## Tools & Resources

### Free Screenshot Enhancement Tools
- **Figma** (figma.com) - Best for adding text overlays
- **Canva** (canva.com) - Templates for app screenshots
- **Shotbot** (shotbot.io) - Add device frames
- **AppMockUp** (app-mockup.com) - Screenshot mockups

### iOS Device Specifications
| Device | Resolution | Aspect Ratio |
|--------|------------|--------------|
| iPhone 15 Pro Max | 1290 x 2796 | 19.5:9 |
| iPhone 15 Pro | 1179 x 2556 | 19.5:9 |
| iPhone 14 Pro Max | 1290 x 2796 | 19.5:9 |
| iPad Pro 12.9" | 2048 x 2732 | 4:3 |

### Android Device Specifications
| Device | Resolution | Aspect Ratio |
|--------|------------|--------------|
| Pixel 7 Pro | 1440 x 3120 | 19.5:9 |
| Pixel 6 Pro | 1440 x 3120 | 19.5:9 |
| Samsung Galaxy S23 Ultra | 1440 x 3088 | 19.3:9 |

## Feature Graphic (Android Only)

The feature graphic is a **1024 x 500px** banner that appears at the top of your Play Store listing.

### Content Ideas:
1. **Hero Layout**: App icon on left, "Buzzy" text, tagline "What's happening near you"
2. **Screenshot Collage**: Multiple phone screenshots side by side
3. **Conceptual**: Map with event pins and key features listed

### Design Tips:
- Keep important content in the center (safe zone)
- Use high contrast colors
- Include your app name and tagline
- Test how it looks on mobile (it gets cropped)
- Keep text large and readable

### Tools:
- Figma template: Search "Play Store Feature Graphic Template"
- Canva template: Search "Google Play Feature Graphic"

## Quality Checklist

Before uploading screenshots:

- [ ] Screenshots are the correct dimensions
- [ ] No personal/sensitive information visible
- [ ] Sample data looks realistic and professional
- [ ] UI is fully loaded (no loading states)
- [ ] Text is readable and not cut off
- [ ] Colors match your brand
- [ ] Status bar looks clean
- [ ] No device frames added
- [ ] File names are descriptive and organized
- [ ] All required screenshots prepared (3 for iOS, 2 for Android minimum)

## Advanced: Preview Video

If you want to create an app preview video (optional but impressive):

### Requirements:
- **Duration**: 15-30 seconds
- **Format**: .mov, .m4v, or .mp4
- **Content**: Show key user flow (open app → see events → tap event → RSVP)

### Tools:
- iOS Simulator screen recording: `Cmd + R`
- Android Emulator screen recording: Built-in recorder
- Editing: iMovie, DaVinci Resolve (free), or CapCut

### Script Ideas:
1. Open app (map loads with events)
2. Zoom in on area with events (2-3 seconds)
3. Tap event pin (detail view opens)
4. Show RSVP action
5. Show create event button tap
6. Quick glance at create form
7. Show event appearing on map

Keep it fast-paced and engaging!

## Next Steps

1. Build and run your app on simulator/emulator
2. Create sample events (use multiple categories)
3. Take screenshots following this guide
4. Enhance screenshots with text overlays (optional)
5. Create feature graphic for Android
6. Organize files in the appropriate folders
7. Review before submission

Questions? Check `README.md` in this directory or refer to official guidelines:
- iOS: https://developer.apple.com/app-store/product-page/
- Android: https://support.google.com/googleplay/android-developer/answer/9866151

