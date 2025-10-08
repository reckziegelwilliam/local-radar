# Feature Graphic Guide (Android Play Store)

The feature graphic is a **1024 x 500px** banner that appears at the top of your Google Play Store listing. It's one of the first things users see, so make it count!

## Specifications

- **Size**: 1024 x 500 pixels (exactly)
- **Format**: PNG or JPG
- **File size**: Max 1MB
- **Color space**: RGB
- **Important content**: Keep within center 924px (50px padding on each side)

## Design Layout Options

### Option 1: App Icon + Text (Recommended for LocalRadar)

```
┌────────────────────────────────────────────────────┐
│ [50px padding]                     [50px padding]  │
│                                                    │
│    [App Icon]    LocalRadar                        │
│      📍          What's happening near you         │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Layout**:
- Left side: Your app icon (200x200px)
- Right side: App name and tagline
- Background: Solid color or subtle gradient

### Option 2: Screenshot Showcase

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Phone 1]    [Phone 2]    [Phone 3]               │
│   Map View    Event Detail  Create                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Layout**:
- 3 phone screenshots side-by-side
- Slight 3D perspective or shadow
- Shows key features at a glance

### Option 3: Map Graphic (Conceptual for LocalRadar)

```
┌────────────────────────────────────────────────────┐
│                  LocalRadar                        │
│        [Stylized map with event pins]             │
│         Discover events near you                   │
└────────────────────────────────────────────────────┘
```

**Layout**:
- Center: Stylized map illustration with pins
- Top: App name
- Bottom: Tagline
- Shows app concept visually

## Content Recommendations for LocalRadar

### Text Content
- **Primary**: "LocalRadar"
- **Secondary**: "What's happening near you"
- **Optional tags**: "Hyperlocal Events" "Real-time Discovery"

### Visual Elements
- App icon/logo
- Map pin icons (🎵 ☕ 🍔 🛍️ 🏀)
- Map background (subtle)
- Event markers/pins
- Location indicator

### Color Scheme
Use colors from your app theme:
- Check `/assets/icon.png` for brand colors
- Likely dark background (based on splash config)
- High contrast for readability

## Design Tools & Templates

### Figma (Recommended - Free)
1. Go to: https://www.figma.com/
2. Create new file
3. Press 'F' for Frame tool
4. Create frame: 1024 x 500
5. Design your graphic
6. Export: File > Export > PNG

**Template**: Search Figma Community for "Play Store Feature Graphic Template"

### Canva (Easiest)
1. Go to: https://www.canva.com/
2. Search "Google Play Feature Graphic"
3. Use template or create custom size (1024 x 500)
4. Customize with your brand
5. Download as PNG

### Photoshop/GIMP
1. New document: 1024 x 500px, RGB, 72 DPI
2. Design your graphic
3. Export as PNG or JPG

## Design Best Practices

### ✅ Do
- Keep important content in center (924px safe zone)
- Use high contrast for text
- Keep text large and readable
- Include your app name
- Test on mobile (graphic gets cropped)
- Use brand colors consistently
- Export at exact size (don't resize)
- Keep file under 1MB

### ❌ Don't
- Don't use too much text (users see this small)
- Don't put important content near edges
- Don't use low-resolution images
- Don't violate Google Play policies
- Don't use copyrighted images/fonts without permission
- Don't make it too busy or cluttered
- Don't use all caps (except for short words)

## Mobile Cropping Preview

On mobile devices, the feature graphic appears cropped. Test your design:

**Visible area on mobile**: Approximately center 600-700px

Use this safe zone guide:
```
┌────────────────────────────────────────────────────┐
│ 50px │                                     │ 50px  │
│ pad  │    [Safe zone: 924px width]        │ pad   │
│      │    [Keep important content here]   │       │
│      │                                     │       │
└────────────────────────────────────────────────────┘
```

## Example Layouts for LocalRadar

### Layout 1: Minimalist
```
Background: Dark gradient (black to dark gray)
Left: Buzzy app icon (150x150px)
Center: "Buzzy" in large white text
         "What's happening near you" in smaller text
Right: 3 category emoji icons (🎵 ☕ 🍔) vertically stacked
```

### Layout 2: App Showcase
```
Background: Light map texture (subtle)
Left: Screenshot of map view with pins
Right: "Buzzy" text
       "Discover hyperlocal events"
       "Create in 20 seconds"
       "Real-time updates"
```

### Layout 3: Icon Grid
```
Background: Solid color from brand
Top: "Buzzy - What's happening near you"
Bottom: Grid of category icons with labels
       🎵 Music  ☕ Meetup  🍔 Food  🛍️ Sale
       🏀 Sports  🧘 Wellness  🎨 Art  📍 Other
```

## Sample Text Sizes (at 1024x500)

- **App Name**: 60-80px font size
- **Tagline**: 30-40px font size
- **Feature bullets**: 24-28px font size

## Fonts to Consider

- **Sans-serif** (modern, clean): 
  - SF Pro (Apple-style)
  - Roboto (Android native)
  - Inter, Poppins, Montserrat
- **Bold/Semibold** for app name
- **Regular/Medium** for tagline

## Step-by-Step: Quick Feature Graphic

### Using Canva (15 minutes)

1. **Setup**
   - Go to Canva.com
   - Click "Custom Size" → 1024 x 500 px
   - Choose "Create new design"

2. **Background**
   - Click "Background color"
   - Choose dark color (black or brand color)
   - Or: Use subtle gradient

3. **Add App Icon**
   - Click "Uploads"
   - Upload your app icon from `/assets/icon.png`
   - Drag to left side
   - Resize to ~200x200px

4. **Add Text**
   - Click "Text" → "Add a heading"
   - Type "Buzzy"
   - Set font size: 70px
   - Set color: White
   - Position next to icon
   
5. **Add Tagline**
   - Add another text box
   - Type "What's happening near you"
   - Set font size: 35px
   - Set color: Light gray
   - Position below app name

6. **Polish**
   - Add emoji or icons if desired
   - Adjust spacing
   - Ensure nothing is within 50px of edges

7. **Export**
   - Click "Share" → "Download"
   - Choose "PNG"
   - Download
   - Save as `feature-graphic.png`

8. **Verify**
   - Check file is 1024 x 500px
   - Check file size < 1MB
   - View at small size (does text read?)

9. **Save**
   - Place in `/app-store/android/feature-graphic/`

## Quality Checklist

Before uploading:

- [ ] Dimensions are exactly 1024 x 500 pixels
- [ ] File size is under 1MB
- [ ] Format is PNG or JPG
- [ ] Important content is in center safe zone
- [ ] Text is large and readable
- [ ] Brand colors match your app
- [ ] No copyrighted images used
- [ ] Viewed at small size (mobile preview)
- [ ] No spelling errors
- [ ] High resolution (not pixelated)

## Testing

1. **Desktop Preview**
   - View at 100% size
   - View at 50% size (simulates mobile)
   - Check readability

2. **Mobile Preview**
   - Upload to Play Console (test track)
   - View on mobile device
   - Check how it looks cropped

3. **Accessibility**
   - High contrast between text and background?
   - Text large enough to read?
   - Colorblind-friendly colors?

## Resources

- **Canva Templates**: https://www.canva.com/ (search "play store feature")
- **Figma Community**: https://www.figma.com/community (search "feature graphic")
- **Color Picker**: https://coolors.co/ (generate palettes)
- **Font Pairing**: https://fontpair.co/ (find complementary fonts)
- **Icon Resources**: https://fontawesome.com/ (if needed)

## Examples from Popular Apps

Look at these for inspiration (search on Play Store):
- **Maps**: Google Maps, Waze, Citymapper
- **Social**: Nextdoor, Meetup, Eventbrite
- **Local**: Yelp, Foursquare, TripAdvisor

Notice how they:
- Keep it simple
- Use clear branding
- Show app screenshots or concepts
- Have readable text even when small

## Need Help?

- Play Store Help: https://support.google.com/googleplay/android-developer/answer/9866151
- Design inspiration: https://www.apppicker.com/apps/best-app-screenshots
- Graphic design basics: https://www.canva.com/learn/graphic-design-for-beginners/

---

**Pro Tip**: Your feature graphic should instantly communicate what your app does. For LocalRadar, think: Maps + Events + Local = clear visual message.

Good luck! 🎨

