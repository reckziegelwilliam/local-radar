# Beta Testing Guide for Buzzy

**Welcome Beta Testers!** 🎉

Thank you for helping us test Buzzy before the public launch. Your feedback is invaluable in making this app the best it can be.

## What is Buzzy?

Buzzy is a hyperlocal micro-events app that helps you discover and create spontaneous events happening within 5km (3 miles) of your current location. Think impromptu concerts, pickup basketball games, yard sales, food trucks, study groups, and more!

---

## What We Need You to Test

### 🎯 Primary Focus Areas

1. **Core User Flow**
   - Sign up / Sign in (magic link authentication)
   - View events on the map
   - Create an event with a photo
   - RSVP to an event
   - Report an inappropriate event

2. **Location Services**
   - Map accurately shows your current location
   - Events within 5km appear correctly
   - Location permissions work smoothly

3. **Photo Uploads**
   - Photos upload successfully
   - Upload works on slow networks
   - Image compression works (large photos reduced)

4. **Push Notifications**
   - You receive notifications for nearby events
   - Tapping notification opens the event
   - Notification permissions work

5. **Content Moderation**
   - Inappropriate content is blocked (test with mild profanity)
   - Report system works
   - Rate limiting prevents spam (5 events/hour)

### 📱 Edge Cases to Test

1. **Network Issues**
   - Use app with poor WiFi/cellular signal
   - Turn airplane mode ON/OFF while using app
   - Try creating events while offline

2. **Permissions**
   - Deny location permission and try to use app
   - Deny camera/photo permission and try to add photo
   - Deny notification permission

3. **Timing**
   - Create events with different start/end times
   - Verify events expire 6 hours after end time
   - Try creating event that starts in the past (should fail)

4. **Multiple Devices**
   - Create event on one device, see it on another
   - RSVP on one device, verify count updates on another

---

## How to Submit Feedback

### 🐛 Found a Bug?

**Option 1: Shake-to-Report** (Easiest!)
- Simply shake your device
- The feedback form will open automatically
- Select "Bug Report" and describe what happened

**Option 2: In-App Feedback**
- Tap the Settings tab (⚙️ icon)
- Tap "Report a Bug"
- Fill in the details

**Option 3: Settings Menu**
- Go to Settings → Send Feedback

### 💡 Have a Feature Suggestion?

- Use the same methods as above
- Select "Feature Request" as the type
- Tell us what you'd like to see!

### 📝 What Makes Good Feedback?

**For Bugs:**
- ✅ "When I tap Create Event, the photo button doesn't work on Android 13"
- ✅ "The map shows my location 2 blocks away from where I actually am"
- ❌ "It's broken" (too vague)

**For Features:**
- ✅ "I'd love to be able to filter events by category"
- ✅ "Add ability to save favorite events"
- ❌ "Make it better" (not specific)

**Include if possible:**
- Steps to reproduce the issue
- What you expected to happen
- What actually happened
- Which device/OS you're using

---

## Known Issues

These are bugs we're already aware of:

1. **Jest tests** - Test suite needs configuration fixes (doesn't affect app)
2. **Node version warnings** - Node 20.19.3 vs 20.19.4 requirement (doesn't affect functionality)
3. **Privacy policy URL** - Placeholder until we host it publicly

---

## What's Working Well

Features we've thoroughly tested:

- ✅ Magic link authentication
- ✅ Event creation with photos
- ✅ Map view with nearby events
- ✅ RSVP system
- ✅ Content validation & profanity filtering
- ✅ Auto-expiration of old events
- ✅ Report system
- ✅ Rate limiting
- ✅ Offline detection banner

---

## Beta Testing Timeline

**Week 1-2: Core Features Testing**
- Focus on the main user flows
- Test on your primary device
- Submit feedback regularly

**Week 3: Edge Cases & Polish**
- Test unusual scenarios
- Try to break the app!
- Test on secondary devices if available

**Week 4: Final Verification**
- Re-test critical flows
- Verify previously reported bugs are fixed
- Prepare for public launch

---

## Important Notes

### Privacy & Data

- This is a real production database
- Don't post sensitive personal information
- Events you create are visible to other beta testers
- We may reset the database during beta testing

### Rate Limits

- Maximum 5 events per hour per user
- This prevents spam and helps us test the limit system

### Auto-Expiration

- Events automatically disappear 6 hours after their end time
- This is by design to keep content fresh

### Location Radius

- You'll only see events within 5km (3.1 miles)
- This is intentional for hyperlocal focus

---

## Test Scenarios to Try

### Scenario 1: Quick Event Creation (Happy Path)
1. Open app and sign in
2. Tap + button to create event
3. Enter title: "Free coffee at Main Street Cafe"
4. Select category: ☕ Café
5. Set time: Today, 3:00 PM - 4:00 PM
6. Add photo (optional)
7. Submit
8. Verify event appears on map

### Scenario 2: RSVP Flow
1. Find an event on the map
2. Tap the pin to see preview
3. Tap event card to open details
4. Tap "I'm interested"
5. Verify count increases
6. Tap again to remove RSVP
7. Verify count decreases

### Scenario 3: Content Moderation
1. Try creating event with title: "Buy my stuff cheap cheap cheap!!!"
2. Should be blocked by profanity filter
3. Try with normal title like "Community BBQ at the park"
4. Should work fine

### Scenario 4: Report System
1. Find any event
2. Open event details
3. Tap "Report"
4. Select a reason
5. Verify confirmation message

### Scenario 5: Offline Behavior
1. Turn on airplane mode
2. Open app
3. Verify orange "No internet" banner appears
4. Try to create event (should fail gracefully)
5. Turn airplane mode off
6. Verify banner disappears

---

## Contact & Support

### Questions or Issues?

- **Email**: support@yourdomain.com (update with real email)
- **In-App**: Use shake-to-report or Settings → Send Feedback

### Urgent Bugs?

For critical issues (app crashes, data loss, security concerns):
- Email immediately: support@yourdomain.com
- Subject line: "[URGENT BETA] Brief description"

---

## Rewards & Recognition

As a thank you for beta testing:

- 🏆 You'll be credited as a beta tester in app updates (if you'd like)
- 🎁 Potential early access to future features
- 💝 Our eternal gratitude for helping make Buzzy better!

---

## Beta Testing Best Practices

### Do:
- ✅ Test regularly (multiple times per week)
- ✅ Try different scenarios
- ✅ Report bugs even if they seem minor
- ✅ Suggest improvements
- ✅ Test on different networks (WiFi, LTE, 5G)
- ✅ Be specific in your feedback

### Don't:
- ❌ Share your beta access with others (it's unique to you)
- ❌ Post about unreleased features publicly
- ❌ Create fake/spam events
- ❌ Share other users' personal information
- ❌ Expect perfect stability (it's beta!)

---

## What Happens After Beta?

1. **We fix bugs** based on your feedback
2. **We polish features** that need improvement
3. **We prepare for launch** (app store submission)
4. **You get early access** to the public version
5. **We celebrate!** 🎉

---

## Version Information

**Current Beta**: v1.0.0-beta.1  
**Expected Launch**: Q1 2026  
**Platform**: iOS, Android (React Native)

---

## Frequently Asked Questions

### Q: How long is the beta period?
A: Approximately 4 weeks, but may be extended based on feedback.

### Q: Will my data be preserved after beta?
A: We aim to preserve data, but may need to reset the database if critical issues arise.

### Q: Can I invite friends to beta test?
A: Not yet - we're keeping this beta small initially. We'll expand soon!

### Q: What if I find a security issue?
A: Please email us immediately at support@yourdomain.com with "SECURITY" in the subject line.

### Q: The app crashed - what should I do?
A: Don't worry! Crashes are automatically reported to us via Sentry. You can also shake to report with additional context.

---

**Thank you again for being part of the Buzzy beta! Your testing makes all the difference.** 🙏

---

*Last Updated: December 2, 2025*  
*Beta Version: 1.0.0-beta.1*

