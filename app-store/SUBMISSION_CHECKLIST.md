# App Store Submission Checklist

Use this checklist to ensure you have everything ready before submitting Buzzy to app stores.

## Pre-Submission Requirements

### ✅ Code & Build

- [ ] App builds successfully for iOS (Xcode)
- [ ] App builds successfully for Android (Android Studio)
- [ ] All core features working on real devices
- [ ] No critical bugs or crashes
- [ ] App tested on multiple device sizes
- [ ] Location permissions working correctly
- [ ] Push notifications tested and working
- [ ] Image upload/camera features working
- [ ] Magic link authentication working
- [ ] RSVP system functional
- [ ] Event creation working
- [ ] Event expiration working as expected
- [ ] Report system functional

### ✅ App Configuration

- [ ] `app.json` has correct bundle identifiers
  - iOS: `com.localradar.app`
  - Android: `com.localradar.app`
- [ ] App version set to `1.0.0`
- [ ] App name is correct: "Buzzy"
- [ ] App icon (1024x1024) is in place
- [ ] Splash screen configured
- [ ] All required permissions declared
- [ ] Privacy permission descriptions clear and accurate
- [ ] Deep linking configured (localradar://)

### ✅ Backend & Services

- [ ] Supabase project deployed and live
- [ ] Database tables created (events, users, etc.)
- [ ] RLS (Row Level Security) policies active
- [ ] Edge functions deployed:
  - [ ] cleanup-expired-events
  - [ ] create-event
  - [ ] send-nearby-notification
- [ ] Cron jobs configured for cleanup
- [ ] Storage buckets created for event images
- [ ] Storage policies configured (public read, authenticated write)
- [ ] Environment variables set correctly in production
- [ ] API keys secured (not exposed in client code)

### ✅ Legal & Privacy

- [ ] Privacy Policy written and hosted
  - URL: ________________________________
- [ ] Terms of Service written (if applicable)
- [ ] Content moderation policy documented
- [ ] Age rating determined: **4+ / Everyone**
- [ ] All third-party services/SDKs reviewed for compliance
- [ ] COPPA compliance checked (if targeting under 13)
- [ ] GDPR considerations addressed (if targeting EU)
- [ ] Support email/contact set up: ________________________________

### ✅ App Store Assets (iOS)

- [ ] App icon (1024x1024px, PNG, no transparency)
- [ ] iPhone screenshots (minimum 3, maximum 10)
  - Device: ________________________________
  - Resolution: ________________________________
  - [ ] Screenshot 1: Map View
  - [ ] Screenshot 2: Event Details
  - [ ] Screenshot 3: Create Event
  - [ ] Screenshot 4: (optional)
  - [ ] Screenshot 5: (optional)
- [ ] iPad screenshots (if supporting tablets)
  - [ ] Screenshot 1:
  - [ ] Screenshot 2:
  - [ ] Screenshot 3:
- [ ] App preview video (optional)

### ✅ Play Store Assets (Android)

- [ ] App icon (512x512px, PNG, 32-bit with alpha)
- [ ] Phone screenshots (minimum 2, maximum 8)
  - [ ] Screenshot 1: Map View
  - [ ] Screenshot 2: Event Details
  - [ ] Screenshot 3: (optional)
- [ ] Tablet screenshots (optional)
- [ ] Feature graphic (1024x500px, PNG/JPG)
- [ ] Promotional video YouTube link (optional): ________________________________

### ✅ App Store Connect (iOS)

- [ ] Apple Developer account active ($99/year)
- [ ] App created in App Store Connect
- [ ] Bundle ID registered
- [ ] App Name: "LocalRadar"
- [ ] Subtitle: "What's happening near you"
- [ ] Primary Category: Social Networking
- [ ] Secondary Category: Lifestyle (optional)
- [ ] Content Rights: "Does not contain third-party content"
- [ ] Age Rating questionnaire completed (expect 4+)
- [ ] Export Compliance information completed
- [ ] App description pasted (from APP_STORE_COPY.md)
- [ ] Keywords added (100 character limit)
- [ ] Support URL added
- [ ] Privacy Policy URL added
- [ ] Marketing URL (optional)
- [ ] Screenshots uploaded
- [ ] Promotional text added (optional)
- [ ] What's New text added

### ✅ Google Play Console (Android)

- [ ] Google Play Developer account active ($25 one-time)
- [ ] App created in Play Console
- [ ] App details filled:
  - [ ] App name: "LocalRadar"
  - [ ] Short description (80 chars)
  - [ ] Full description (4000 chars)
- [ ] Category: Social
- [ ] Tags added (optional)
- [ ] Contact details:
  - [ ] Email: ________________________________
  - [ ] Phone: ________________________________ (optional)
  - [ ] Website: ________________________________ (optional)
- [ ] Privacy Policy URL added
- [ ] App access (all features available? any restrictions?)
- [ ] Ads declaration (app contains ads? No)
- [ ] Content rating questionnaire completed
- [ ] Target audience selected
- [ ] Store listing:
  - [ ] Screenshots uploaded
  - [ ] Feature graphic uploaded
  - [ ] App icon confirmed
- [ ] Countries/regions selected for distribution

### ✅ Build & Upload

#### iOS
- [ ] Archive created in Xcode
- [ ] Build uploaded to App Store Connect
- [ ] Build processed successfully
- [ ] Build selected for submission
- [ ] TestFlight testing completed (optional but recommended)
- [ ] App submitted for review

#### Android
- [ ] App bundle (.aab) generated
  ```bash
  eas build --platform android --profile production
  ```
- [ ] Bundle uploaded to Play Console
- [ ] Internal testing track configured (optional)
- [ ] Production release created
- [ ] Release notes added
- [ ] App submitted for review

### ✅ Testing Before Submission

- [ ] Test on iOS physical device
- [ ] Test on Android physical device
- [ ] Location permissions prompt correctly
- [ ] Camera permissions prompt correctly
- [ ] Photo library permissions prompt correctly
- [ ] Notification permissions prompt correctly
- [ ] Create event with image
- [ ] View events on map
- [ ] RSVP to event
- [ ] Report event
- [ ] Events auto-expire correctly
- [ ] Magic link login works
- [ ] Deep links work (if implemented)
- [ ] App doesn't crash on various device sizes
- [ ] App works on slow/poor network connection
- [ ] App handles no internet gracefully

### ✅ App Review Preparation

#### Demo Account (Optional but Helpful)
- [ ] Demo account created
  - Email: demo@localradar.app
  - Access: Magic link authentication
- [ ] Demo instructions provided in submission notes

#### Review Notes
```
This app facilitates discovery of local, community-driven micro-events. 
All events are user-generated and automatically expire after their end time.

Location services are required to:
- Show nearby events within 5km radius
- Enable users to create events at their current location

Location data is not stored permanently and is used only for real-time 
proximity queries.

For demo: Allow location permissions when prompted, and view the main map. 
Tap the "+" button to create a test event. Tap any event pin to view 
details and RSVP.
```

### ✅ Post-Submission

- [ ] Submission confirmation received
- [ ] Review status checked regularly
- [ ] Any reviewer questions answered promptly
- [ ] App approved? 🎉
- [ ] App published and live
- [ ] App Store link saved: ________________________________
- [ ] Play Store link saved: ________________________________

## Rejection Prevention

Common reasons for rejection and how to avoid them:

### iOS
- **Privacy**: Ensure all permission descriptions are clear and accurate ✅
- **Incomplete app**: Make sure all features work, no placeholder content ✅
- **Crashes**: Test thoroughly on multiple devices ✅
- **Spam**: Ensure app provides real value and is not a duplicate ✅
- **User-generated content**: Have moderation in place (reporting system) ✅

### Android
- **Privacy policy**: Must be accessible and comprehensive ✅
- **Permissions**: Only request necessary permissions ✅
- **Target API level**: Meet minimum requirements ✅
- **Broken functionality**: Test all features ✅

## Timeline Expectations

- **iOS App Store**: 1-3 days review time (average)
- **Google Play Store**: 1-7 days review time (average)
- **First submission**: May take longer
- **Updates**: Usually faster than first submission

## If Rejected

1. **Don't panic** - Rejections are common, especially for first submissions
2. **Read feedback carefully** - Apple/Google usually provide specific reasons
3. **Fix issues** - Address all concerns mentioned
4. **Respond if needed** - Use Resolution Center to ask questions
5. **Resubmit** - Upload new build if code changes needed, or appeal if it's a misunderstanding

## Launch Checklist

Once approved:

- [ ] Test app in production (download from store)
- [ ] Monitor crash reports
- [ ] Check user reviews
- [ ] Respond to user feedback
- [ ] Share app store links on social media
- [ ] Update documentation with live links
- [ ] Set up analytics (if not already done)
- [ ] Monitor server/database usage
- [ ] Celebrate! 🎉

## Resources

- **iOS Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policies**: https://play.google.com/about/developer-content-policy/
- **App Store Connect Help**: https://developer.apple.com/help/app-store-connect/
- **Play Console Help**: https://support.google.com/googleplay/android-developer/

---

**Last Updated**: October 2025
**App Version**: 1.0.0

