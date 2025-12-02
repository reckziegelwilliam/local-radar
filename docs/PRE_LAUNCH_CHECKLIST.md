# Pre-Launch Checklist

**Final checklist before submitting Buzzy to app stores**

## Phase 1: Core Functionality ✅

### Authentication
- [ ] Magic link authentication works
- [ ] Password auth works (development)
- [ ] Deep linking opens app correctly
- [ ] Session persists across app restarts
- [ ] Sign out works properly

### Event Creation
- [ ] Can create events with all required fields
- [ ] Photo upload works
- [ ] Category selection works
- [ ] Time picker functions correctly
- [ ] Location is captured accurately
- [ ] Rate limiting enforced (5 events/hour)
- [ ] Validation prevents bad data

### Event Viewing
- [ ] Map loads and shows user location
- [ ] Events display as pins on map
- [ ] Nearby events load (within 5km)
- [ ] Event details screen opens
- [ ] Photos display correctly
- [ ] RSVP functionality works
- [ ] RSVP count updates in real-time

### Event Management
- [ ] Auto-expiry works (6 hours after end time)
- [ ] Users can delete own events
- [ ] Report system functions
- [ ] Events hide after 3+ reports

## Phase 2: Backend & Infrastructure ✅

### Supabase Setup
- [ ] PostGIS extension enabled
- [ ] All database tables created
- [ ] RLS policies active on all tables
- [ ] Storage bucket created (`event-photos`)
- [ ] Storage policies configured
- [ ] Edge functions deployed:
  - [ ] `create-event`
  - [ ] `cleanup-expired-events`
  - [ ] `send-nearby-notification`
- [ ] Cron jobs configured (or alternative set up)
- [ ] Database indexes created

### Environment Variables
- [ ] `.env` file configured with Supabase credentials
- [ ] All required environment variables set:
  - [ ] `EXPO_PUBLIC_SUPABASE_URL`
  - [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Optional services configured (if using):
  - [ ] `EXPO_PUBLIC_SENTRY_DSN`
  - [ ] `EXPO_PUBLIC_AMPLITUDE_API_KEY`

## Phase 3: Legal & Compliance ✅

### Documents
- [ ] Privacy policy written and hosted
- [ ] Terms of service written and hosted
- [ ] URLs added to `app.json`:
  - [ ] `privacyPolicyUrl`
  - [ ] `supportUrl`

### App Store Connect (iOS)
- [ ] Apple Developer account active
- [ ] App created in App Store Connect
- [ ] Bundle ID matches: `com.localradar.app`
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] Age rating completed (expect 4+)

### Google Play Console (Android)
- [ ] Google Play Developer account active
- [ ] App created in Play Console
- [ ] Privacy policy URL added
- [ ] Content rating completed
- [ ] Target API level meets requirements

## Phase 4: Build & Deployment ✅

### EAS Configuration
- [ ] `eas.json` configured with real credentials:
  - [ ] Apple ID
  - [ ] App Store Connect App ID
  - [ ] Apple Team ID
  - [ ] Google Play service account JSON

### Test Builds
- [ ] iOS build successful
- [ ] Android build successful
- [ ] TestFlight build uploaded and tested
- [ ] Internal testing track used for Android

### Production Builds
- [ ] iOS production build created
- [ ] Android production build created (APK/AAB)
- [ ] Builds signed correctly
- [ ] No development/debug code in builds

## Phase 5: Testing & QA ✅

### Device Testing
- [ ] Tested on iPhone (physical device)
- [ ] Tested on Android phone (physical device)
- [ ] Tested on iPad (if supporting)
- [ ] Tested on Android tablet (if supporting)

### Functionality Tests
- [ ] All permissions work:
  - [ ] Location permission
  - [ ] Camera permission
  - [ ] Photo library permission
  - [ ] Notification permission
- [ ] Create event end-to-end
- [ ] View events on map
- [ ] RSVP to event
- [ ] Report event
- [ ] Delete own event
- [ ] Deep link from email

### Performance Tests
- [ ] App loads quickly (< 3 seconds)
- [ ] Map renders smoothly
- [ ] Image upload works on slow network
- [ ] App handles offline gracefully
- [ ] No memory leaks or crashes

### Edge Cases
- [ ] Works with location services disabled (shows error)
- [ ] Works with no internet (shows error)
- [ ] Handles expired magic links
- [ ] Handles rate limit (5 events/hour)
- [ ] Validates all user input

## Phase 6: Monitoring & Analytics 🔧

### Error Tracking
- [ ] Error tracking service configured (or placeholder ready)
- [ ] Test errors are captured
- [ ] Error tracking integrated in ErrorBoundary

### Analytics
- [ ] Analytics service configured (or placeholder ready)
- [ ] Key events tracked (or ready to track):
  - [ ] Sign in/sign up
  - [ ] Event created
  - [ ] Event viewed
  - [ ] RSVP added/removed

### Performance Monitoring
- [ ] Performance monitoring configured (or placeholder ready)
- [ ] Screen render times tracked (or ready)

## Phase 7: App Store Assets ✅

### iOS App Store
- [ ] App icon (1024x1024, PNG, no transparency)
- [ ] Screenshots (minimum 3):
  - [ ] Map view with events
  - [ ] Event detail screen
  - [ ] Create event screen
- [ ] App description written (see `app-store/APP_STORE_COPY.md`)
- [ ] Keywords optimized (100 char limit)
- [ ] Promotional text (optional)
- [ ] What's New text

### Google Play Store
- [ ] App icon (512x512, PNG with alpha)
- [ ] Screenshots (minimum 2):
  - [ ] Map view
  - [ ] Event detail
- [ ] Feature graphic (1024x500)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Promotional video (optional)

## Phase 8: Pre-Submission ✅

### Final Code Review
- [ ] No console.log in production code (or using logger)
- [ ] No hardcoded API keys or secrets
- [ ] No TODO or FIXME comments for critical issues
- [ ] All placeholder text replaced
- [ ] Test accounts/data removed

### Documentation
- [ ] README.md up to date
- [ ] API documentation complete
- [ ] Setup instructions accurate
- [ ] Troubleshooting guide created

### Backups
- [ ] Database backup created
- [ ] Environment variables documented
- [ ] Build configuration backed up
- [ ] Git repository up to date

## Phase 9: Submission 🚀

### iOS Submission
```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios --latest
```

- [ ] Build uploaded successfully
- [ ] App submitted for review
- [ ] Submission confirmation received
- [ ] App status: "Waiting for Review"

### Android Submission
```bash
# Build for Google Play
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android --latest
```

- [ ] AAB uploaded successfully
- [ ] App submitted for review
- [ ] Submission confirmation received
- [ ] App status: "Under Review"

## Phase 10: Post-Submission 🎯

### Monitor Review Status
- [ ] Check App Store Connect daily
- [ ] Check Play Console daily
- [ ] Respond to reviewer questions within 24 hours

### Prepare for Launch
- [ ] Marketing materials ready
- [ ] Social media posts scheduled
- [ ] Support email monitored
- [ ] Press kit prepared (if applicable)

### First 24 Hours After Approval
- [ ] Download and test production app
- [ ] Monitor crash reports
- [ ] Check user reviews
- [ ] Monitor server load
- [ ] Check error tracking dashboard
- [ ] Verify database performance

### Week 1 Tasks
- [ ] Respond to all user reviews
- [ ] Fix any critical bugs immediately
- [ ] Monitor analytics for user behavior
- [ ] Check retention metrics
- [ ] Gather user feedback
- [ ] Plan first update

## Emergency Contacts

**Critical Issues:**
- Supabase Support: support@supabase.io
- Expo Support: https://expo.dev/support
- Apple Developer: https://developer.apple.com/contact/
- Google Play: https://support.google.com/googleplay/android-developer/

**Internal Team:**
- Lead Developer: [your-email]
- Backend: [email]
- DevOps: [email]

## Rollback Plan

If critical issues are discovered:

1. **Immediate**: Disable new sign-ups in Supabase (if needed)
2. **Short-term**: Push hotfix via OTA update (Expo Updates)
3. **Medium-term**: Submit expedited review with fix
4. **Long-term**: Roll back to previous version in stores

## Success Metrics

Track these KPIs for first month:

- [ ] Downloads: ___ (target)
- [ ] Daily Active Users: ___ (target)
- [ ] Events Created: ___ (target)
- [ ] Retention (Day 1): ___% (target: >40%)
- [ ] Retention (Day 7): ___% (target: >20%)
- [ ] Crash-free Rate: ___% (target: >99.5%)
- [ ] Average Rating: ___ (target: >4.0)

## Final Sign-Off

**I confirm that:**

- [ ] All critical functionality has been tested
- [ ] All legal documents are in place
- [ ] All app store requirements are met
- [ ] I have a rollback plan ready
- [ ] Support channels are monitored
- [ ] The app is ready for public release

**Signed:**

Name: ________________  
Date: ________________  
Role: ________________

---

**Notes:**

Use this checklist progressively. Check off items as you complete them. If you find issues, document them and fix before proceeding.

Good luck with your launch! 🚀

