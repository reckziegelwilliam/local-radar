# Beta Test Scenarios for Buzzy

Comprehensive test scenarios to ensure all features work correctly before public launch.

---

## Core User Flows

### 1. New User Onboarding

**Objective**: Verify first-time user experience

**Steps**:
1. Fresh install of app
2. Open app for first time
3. See beta welcome banner on sign-in screen
4. Complete authentication (magic link or password)
5. Grant location permission when prompted
6. Grant notification permission when prompted
7. See map load with current location
8. Observe onboarding tooltips (if implemented)

**Expected Results**:
- Smooth permission flow
- Clear explanations for each permission
- Map loads within 3 seconds
- User location marker appears
- Tooltips guide user through interface

**Test On**: iOS, Android

---

### 2. Event Creation - Happy Path

**Objective**: Verify basic event creation works

**Steps**:
1. Sign in to app
2. Tap + button (create event)
3. Enter title: "Community BBQ at Central Park"
4. Select category: 🍔 Food
5. Set start time: Today, 2 hours from now
6. Set end time: 3 hours after start
7. Add photo from gallery
8. Tap "Create Event"

**Expected Results**:
- Photo uploads successfully (shows progress)
- Event created within 5 seconds
- Success message appears
- Redirected back to map
- New event visible on map
- Other nearby users receive push notification

**Test On**: iOS, Android, slow network

---

### 3. Event Creation - Edge Cases

**Scenario A: No Photo**
- Create event without adding photo
- Expected: Works fine, placeholder image shown

**Scenario B: Large Photo**
- Select 10MB+ photo
- Expected: Compressed automatically, uploads successfully

**Scenario C: Invalid Title**
- Try title: "a" (too short)
- Expected: Validation error shown

**Scenario D: Profanity Filter**
- Try title: "Buy my MLM products now!!!"
- Expected: Rejected with clear message

**Scenario E: Rate Limiting**
- Create 6 events within 1 hour
- Expected: 6th event rejected with clear message about limit

**Scenario F: Past Event Time**
- Set start time to yesterday
- Expected: Validation error

**Test On**: iOS, Android

---

### 4. Event Discovery

**Objective**: Verify users can find and view events

**Steps**:
1. Open app with location enabled
2. Wait for map to load
3. Pan around map
4. Tap on event pin
5. View event preview
6. Tap event card to open details
7. View full event information

**Expected Results**:
- Events load within 2 seconds
- Pins accurately placed on map
- Tapping pin shows preview
- Event details fully populated
- Photos display correctly
- Distance shown accurately

**Test On**: iOS, Android

---

### 5. RSVP Flow

**Objective**: Verify RSVP system works correctly

**Steps**:
1. Find any event
2. Open event details
3. Tap "I'm interested" button
4. Observe RSVP count increase
5. Tap button again to remove RSVP
6. Observe RSVP count decrease
7. Close and reopen event
8. Verify RSVP status persists

**Expected Results**:
- Button state toggles immediately
- Count updates in real-time
- Changes persist across sessions
- Works offline (syncs when online)

**Test On**: iOS, Android, 2 devices simultaneously

---

### 6. Report System

**Objective**: Verify content moderation works

**Steps**:
1. Open any event details
2. Tap "Report" button
3. Select reason: "Spam"
4. Confirm report
5. Verify confirmation message
6. Try reporting same event again
7. Verify duplicate prevention

**Expected Results**:
- Report submitted successfully
- Confirmation message shown
- Duplicate reports prevented
- Event hidden after 3 reports (need 3 testers)

**Test On**: iOS, Android

---

## Network & Connectivity Tests

### 7. Offline Mode

**Objective**: Verify app handles no internet gracefully

**Steps**:
1. Open app while online
2. Let events load
3. Enable airplane mode
4. Observe offline banner appears
5. Try to create event
6. Try to RSVP
7. Try to view event details
8. Disable airplane mode
9. Observe banner disappears

**Expected Results**:
- Orange banner shows "No internet connection"
- Banner is dismissible
- Operations fail gracefully with user-friendly errors
- No crashes
- App reconnects automatically when online

**Test On**: iOS, Android

---

### 8. Slow Network

**Objective**: Verify app works on poor connections

**Steps**:
1. Connect to slow WiFi or use throttled connection
2. Open app
3. Create event with 5MB photo
4. Observe upload progress
5. Navigate while photo uploading

**Expected Results**:
- Progress bar shows upload status
- Doesn't block UI
- Completes eventually or shows retry option
- Timeout after reasonable period

**Test On**: iOS, Android

---

### 9. Network Interruption

**Objective**: Verify app handles connection drops

**Steps**:
1. Start creating event
2. Begin photo upload
3. Turn off WiFi mid-upload
4. Observe behavior
5. Turn WiFi back on
6. Retry upload

**Expected Results**:
- Upload fails gracefully
- Clear error message
- Retry option offered
- No data loss (form fields preserved)

**Test On**: iOS, Android

---

## Permission Scenarios

### 10. Location Permission Denied

**Objective**: Verify app handles denied location

**Steps**:
1. Fresh install
2. Deny location permission when prompted
3. Observe app behavior
4. Try to create event
5. Try to view map

**Expected Results**:
- Clear message explaining why location is needed
- Option to open settings
- Map shows default location (if applicable)
- Can still browse (limited functionality)

**Test On**: iOS, Android

---

### 11. Camera/Photo Permission Denied

**Objective**: Verify app handles denied photo access

**Steps**:
1. Try to create event
2. Tap "Add Photo"
3. Deny photo library permission
4. Observe message
5. Continue creating event without photo

**Expected Results**:
- Clear message explaining permission need
- Event creation continues without photo
- No crashes

**Test On**: iOS, Android

---

### 12. Notification Permission Denied

**Objective**: Verify app works without notifications

**Steps**:
1. Deny notification permission
2. Use app normally
3. Verify no crashes or errors

**Expected Results**:
- App works perfectly
- No repeated permission prompts
- User can still browse and create events

**Test On**: iOS, Android

---

## Beta-Specific Features

### 13. Feedback Submission

**Objective**: Test beta feedback system

**Steps**:
1. Navigate to Settings
2. Tap "Send Feedback"
3. Select type: "General Feedback"
4. Write: "Testing the feedback system - this looks great!"
5. Submit
6. Verify success message

**Expected Results**:
- Form submits successfully
- Success message appears
- Feedback stored in database
- Can submit multiple times

**Test On**: iOS, Android

---

### 14. Shake-to-Report

**Objective**: Test shake detection feature

**Steps**:
1. While on any screen, shake device vigorously
2. Observe feedback form opens
3. Note that "Bug Report" is pre-selected
4. Submit feedback or cancel

**Expected Results**:
- Shake detected reliably
- Feedback form opens immediately
- Bug report pre-selected
- Works from any screen

**Test On**: iOS physical device, Android physical device
**Note**: Won't work in simulators/emulators!

---

### 15. Settings Screen

**Objective**: Verify all settings functions

**Steps**:
1. Navigate to Settings tab
2. Verify user info displayed (email, handle)
3. Verify app version shown
4. Tap "Test Notifications"
5. Verify test notification received
6. Tap "About Buzzy"
7. Read about information
8. Tap "Sign Out"
9. Confirm sign out

**Expected Results**:
- All info displays correctly
- Test notification works
- Sign out returns to sign-in screen
- Version shows "1.0.0-beta.1"

**Test On**: iOS, Android

---

## Performance Tests

### 16. Map Performance

**Objective**: Verify smooth map interactions

**Steps**:
1. Load map with 10+ events visible
2. Pan map in all directions
3. Zoom in and out
4. Tap multiple pins rapidly
5. Scroll event preview cards

**Expected Results**:
- No lag or stuttering
- Animations smooth (60 FPS)
- Pins render quickly
- No memory leaks (can use for extended period)

**Test On**: iOS, Android, lower-end devices

---

### 17. Photo Upload Performance

**Objective**: Test photo handling efficiency

**Steps**:
1. Take 10MB+ photo with camera
2. Create event with this photo
3. Observe compression
4. Observe upload time
5. Verify photo quality on event

**Expected Results**:
- Photo compressed to < 2MB
- Upload completes in < 30 seconds on good connection
- Quality remains acceptable
- Progress shown throughout

**Test On**: iOS, Android

---

## Stress Tests

### 18. Rapid Navigation

**Objective**: Test for race conditions

**Steps**:
1. Rapidly tap between tabs
2. Open and close event details quickly
3. Start creating event, go back, repeat
4. Rapid RSVP toggle on multiple events

**Expected Results**:
- No crashes
- No UI glitches
- State remains consistent
- No duplicate actions

**Test On**: iOS, Android

---

### 19. Long Session

**Objective**: Test memory management

**Steps**:
1. Use app continuously for 30 minutes
2. Create events, browse, RSVP, navigate
3. Keep app in background for 10 minutes
4. Return to app
5. Continue using

**Expected Results**:
- App remains responsive
- No memory warnings
- Session persists
- Background refresh works

**Test On**: iOS, Android

---

## Critical Security Tests

### 20. Authentication Security

**Objective**: Verify auth is secure

**Steps**:
1. Sign out
2. Try accessing protected routes
3. Verify redirected to sign-in
4. Sign in with invalid email
5. Verify appropriate error

**Expected Results**:
- Protected routes require auth
- Invalid credentials rejected
- Sessions expire appropriately
- No unauthorized access

**Test On**: iOS, Android

---

### 21. Content Validation

**Objective**: Verify malicious content blocked

**Test Cases**:
- Phone number in title: "Call me at 555-1234"
- URL in title: "Check out mysite.com"
- Excessive caps: "FREE FREE FREE SALE!!!"
- Spam patterns: "Make money fast!!!"
- Empty/whitespace only title

**Expected Results**:
- All blocked with appropriate messages
- User guided to fix issues
- No malicious content stored

**Test On**: iOS, Android

---

## Crash & Error Tests

### 22. Deliberate Errors

**Objective**: Verify error handling and Sentry reporting

**Test Actions**:
- Create event without location permission
- Try uploading corrupted image
- Create event with end time before start time
- Access event with invalid ID
- Submit empty feedback form

**Expected Results**:
- Graceful error messages
- No uncaught exceptions
- Errors logged to Sentry
- User can recover and continue

**Test On**: iOS, Android

---

## Platform-Specific Tests

### 23. iOS Specific

- Test on iPhone (different sizes)
- Test on iPad (if supported)
- Verify status bar color
- Test haptic feedback
- Test 3D Touch (if applicable)
- Test dark mode switching

### 24. Android Specific

- Test on different Android versions (11, 12, 13, 14)
- Test edge-to-edge display
- Test back button behavior
- Test adaptive icons
- Test notification channels
- Test dark mode switching

---

## Accessibility Tests

### 25. Basic Accessibility

**Steps**:
1. Enable VoiceOver (iOS) or TalkBack (Android)
2. Navigate through app
3. Create event using screen reader
4. Verify all buttons labeled

**Expected Results**:
- All interactive elements accessible
- Meaningful labels provided
- Logical navigation order

**Test On**: iOS with VoiceOver, Android with TalkBack

---

## Test Checklist Summary

Use this as a quick reference:

- [ ] New user sign up
- [ ] Existing user sign in
- [ ] View events on map
- [ ] Create event with photo
- [ ] Create event without photo
- [ ] RSVP to event
- [ ] Remove RSVP
- [ ] Report event
- [ ] Submit feedback (in-app)
- [ ] Shake-to-report (physical device)
- [ ] Test notifications
- [ ] Sign out
- [ ] Offline mode
- [ ] Slow network
- [ ] Network interruption
- [ ] Location permission denied
- [ ] Photo permission denied
- [ ] Rate limit (5 events/hour)
- [ ] Profanity filter
- [ ] Map performance
- [ ] Photo upload performance
- [ ] Long session test
- [ ] Rapid navigation test
- [ ] Error scenarios
- [ ] iOS specific features
- [ ] Android specific features
- [ ] Basic accessibility

---

## Reporting Template

When reporting issues, use this template:

```
**Bug Type**: [Crash / UI Issue / Feature Not Working / Other]

**Device**: [iPhone 14 Pro / Samsung Galaxy S23 / etc.]
**OS Version**: [iOS 17.1 / Android 13 / etc.]
**App Version**: 1.0.0-beta.1

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Screenshots**: [If applicable]

**Additional Notes**:
[Any other relevant information]
```

---

**Happy Testing!** 🧪🎉


