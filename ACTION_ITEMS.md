# Pre-Submission Checklist - Action Items

**Created**: December 2, 2025  
**Status**: Ready for review

---

## 🔴 CRITICAL - Must Complete Before App Store Submission

### 1. Host Privacy Policy & Terms of Service

The legal documents are ready in the `legal/` folder but need to be hosted online:

**Current Status:**
- ✅ `legal/privacy-policy.md` - Complete
- ✅ `legal/terms-of-service.md` - Complete
- ❌ NOT YET HOSTED ONLINE

**Actions Required:**
1. Choose a hosting option:
   - **Option A (Recommended)**: Use GitHub Pages
     ```bash
     # Create a docs site from the legal folder
     # Enable GitHub Pages in repo settings
     ```
   - **Option B**: Upload to your domain (e.g., buzzy.app/privacy-policy)
   - **Option C**: Use a free service like Google Sites or Notion

2. Update `app.json` with real URLs (lines 117-118):
   ```json
   "privacyPolicyUrl": "https://YOUR-ACTUAL-DOMAIN.com/privacy-policy",
   "supportUrl": "mailto:YOUR-SUPPORT-EMAIL@buzzyapp.com"
   ```

**Example URLs to Replace:**
- Current: `https://yourdomain.com/privacy-policy`
- Replace with: Your actual hosted URL

---

### 2. Update EAS Build Credentials

The `eas.json` file has placeholder Apple Developer credentials:

**File**: `eas.json` (lines 27-30)

**Current (Placeholder):**
```json
"appleId": "your-apple-id@example.com",
"ascAppId": "your-app-store-connect-app-id",
"appleTeamId": "YOUR_TEAM_ID"
```

**Actions Required:**
1. Get your Apple Developer credentials:
   - **Apple ID**: Your Apple Developer account email
   - **App Store Connect App ID**: Create app in App Store Connect, get the ID
   - **Apple Team ID**: Found in Apple Developer Account → Membership

2. For Android:
   - Create a Google Play service account
   - Download the JSON key file
   - Save as: `google-play-service-account.json` (in project root, gitignored)

**When to do this**: Before running `eas build --platform ios --profile production`

---

### 3. Update Supabase URL in Cron Jobs (Optional)

If you're using Supabase Pro plan with cron jobs:

**File**: `supabase/cron-jobs.sql` (line ~15)

**Current (Hardcoded):**
```sql
'https://immjhwxgisuoxzwkxvnz.supabase.co/functions/v1/cleanup-expired-events'
```

**Actions Required:**
1. Replace with your actual Supabase project URL
2. Run the SQL file in Supabase dashboard

**Alternative**: Use the GitHub Actions workflow in `.github/workflows/cleanup-cron.yml` (free, no Supabase Pro needed)

---

### 4. Create App Store Screenshots

**Status**: Directories created, guides written, screenshots NOT taken yet

**Locations:**
- iOS: `app-store/ios/screenshots/` (EMPTY)
- Android: `app-store/android/screenshots/` (EMPTY)

**Actions Required:**
1. Run your app on simulators/emulators
2. Take screenshots following `app-store/SCREENSHOT_GUIDE.md`
3. Minimum required:
   - iOS: 3 screenshots (1290 x 2796 px)
   - Android: 2 screenshots (1080 x 1920 px)

**Recommended scenes to capture:**
1. Map view with events (main screen)
2. Event detail screen with RSVP
3. Create event screen

---

### 5. Create Android Feature Graphic

**File**: `app-store/android/feature-graphic/` (EMPTY)

**Actions Required:**
1. Create a 1024 x 500 px graphic
2. Follow guide: `app-store/android/feature-graphic/FEATURE_GRAPHIC_GUIDE.md`
3. Use Canva, Figma, or Photoshop

---

### 6. Verify Notification Icon

**File**: `/assets/notification-icon.png`

**Actions Required:**
1. Verify file exists and meets Android specs:
   - Size: 96 x 96 px
   - Format: PNG with transparency
   - White icon on transparent background

---

## 🟡 RECOMMENDED - Before Launch

### 7. Set Up Third-Party Services (Optional)

The app has abstractions ready for:

**Error Tracking (Sentry)**
- Sign up: https://sentry.io
- Add `EXPO_PUBLIC_SENTRY_DSN` to `.env`
- Errors will be automatically tracked

**Analytics (Amplitude or Firebase)**
- Sign up for Amplitude: https://amplitude.com
- OR Firebase: https://firebase.google.com
- Add API keys to `.env`
- User behavior will be tracked

**Performance Monitoring**
- Included with Sentry or use Firebase Performance

---

### 8. Update Node.js Version

**Current**: v20.19.3  
**Required**: v20.19.4+

**Actions:**
```bash
# Update Node.js
nvm install 20.19.4
nvm use 20.19.4
# Or download from nodejs.org
```

---

### 9. Fix Security Vulnerabilities

**Found**: 4 vulnerabilities (2 moderate, 2 high)

**Actions:**
```bash
cd /Users/liamreckziegel/Desktop/local-radar
npm audit fix
# Or manually: npm audit for details
```

---

### 10. Test on Physical Devices

**Actions Required:**
1. Test on real iPhone (not just simulator)
2. Test on real Android phone (not just emulator)
3. Verify:
   - Location permissions work
   - Camera/photo permissions work
   - Push notifications work
   - Deep linking works (magic link auth)
   - Create event end-to-end
   - RSVP to event
   - Map performance

---

## 📋 Quick Reference

### Files That Need Your Attention:

1. `app.json` - lines 117-118 (privacy & support URLs)
2. `eas.json` - lines 27-30 (Apple credentials)
3. `supabase/cron-jobs.sql` - line ~15 (URL update, optional)
4. `app-store/ios/screenshots/` - Add 3+ screenshots
5. `app-store/android/screenshots/` - Add 2+ screenshots
6. `app-store/android/feature-graphic/` - Add 1024x500 graphic
7. `.env` - Verify Supabase credentials are set

### Commands to Run:

```bash
# Fix security issues
npm audit fix

# Update Node (if needed)
nvm use 20.19.4

# Build for production (when ready)
eas build --platform all --profile production

# Submit to stores (when builds complete)
eas submit --platform ios --latest
eas submit --platform android --latest
```

---

## ✅ Already Complete

- ✅ Database schema created and ready
- ✅ Edge functions written (need deployment)
- ✅ RLS policies defined
- ✅ Storage bucket policies defined
- ✅ App store copy written
- ✅ App icons generated (all sizes)
- ✅ Splash screens created
- ✅ Legal documents written
- ✅ Documentation comprehensive
- ✅ Code quality excellent
- ✅ Error tracking abstracted
- ✅ Analytics abstracted
- ✅ CI/CD pipelines configured
- ✅ `.env.example` created

---

## 🎯 Suggested Timeline

**Week 1: Content & Setup**
- Day 1: Host privacy policy & update URLs
- Day 2: Take screenshots (iOS & Android)
- Day 3: Create feature graphic
- Day 4: Update EAS credentials
- Day 5: Fix vulnerabilities & test locally

**Week 2: Building & Testing**
- Day 1-2: Create staging builds, test on devices
- Day 3-4: Create production builds
- Day 5: Final QA and prepare store listings

**Week 3: Submission**
- Day 1: Submit to iOS App Store
- Day 2: Submit to Google Play Store
- Day 3-7: Monitor review status, respond to reviewers

---

## 📞 Need Help?

- Check the comprehensive docs in `/docs/` folder
- Review pre-launch checklist: `docs/PRE_LAUNCH_CHECKLIST.md`
- Deployment guide: `docs/DEPLOYMENT.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`

---

**Next Immediate Action**: Host your privacy policy and update URLs in `app.json`


