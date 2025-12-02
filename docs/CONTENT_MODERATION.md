# Content Moderation Policy

## Overview

Buzzy maintains a safe and welcoming environment through a combination of automated filtering, user reporting, and content moderation practices.

## Automated Content Filtering

### Client-Side Validation

All event titles are checked against our profanity filter before submission:

- **Banned Words**: Spam, scams, inappropriate content, hate speech
- **Pattern Detection**: URLs, phone numbers, excessive caps, spam patterns
- **Suspicious Content**: Excessive punctuation, repeated characters

### Server-Side Validation

Edge functions provide an additional layer of validation:

- Rate limiting (5 events per hour per user)
- Title length validation (3-80 characters)
- Duplicate content detection
- Category validation

## User Reporting System

### How It Works

1. **User Reports**: Any user can report inappropriate events
2. **Auto-Hide**: Events with 3+ reports are automatically hidden
3. **Review**: Hidden events can be reviewed by moderators
4. **Permanent Removal**: Expired events are auto-deleted after 6 hours

### Report Categories

- **Spam**: Promotional content, advertising, MLM schemes
- **Inappropriate**: Adult content, explicit language, offensive material
- **Fake**: False information, non-existent events
- **Other**: Any other policy violations

## Content Guidelines

### Allowed Content

✅ **Good Examples:**
- "Free jazz concert in the park - 7pm"
- "Community BBQ and potluck at Main Street"
- "Pickup basketball game at Lincoln gym"
- "Garage sale - furniture and books"
- "Study group for Spanish learners"

### Prohibited Content

❌ **Not Allowed:**
- Commercial advertising or MLM schemes
- Adult content or escort services
- Illegal activities (drug sales, weapons)
- Spam or repeated identical events
- Personal attacks or hate speech
- Events with no actual gathering
- Phone numbers or personal contact information

## Enforcement Actions

### First Violation
- Event hidden from public view
- User warned (if pattern detected)

### Repeat Violations
- Temporary account suspension (24-48 hours)
- Events require manual approval

### Serious Violations
- Immediate account termination
- All events removed
- IP address may be blocked

## False Positives

### What To Do

If your legitimate event was flagged incorrectly:

1. **Review Content**: Ensure it follows guidelines
2. **Edit and Resubmit**: Remove any triggering words
3. **Contact Support**: Report false positive

### Common False Positive Triggers

- URLs (even legitimate ones)
- ALL CAPS titles
- Excessive emojis or punctuation
- Words that match banned patterns

## Moderation Best Practices

### For Users

1. **Be Descriptive**: Clear, concise event titles
2. **Be Honest**: Accurately represent your event
3. **Be Respectful**: Consider your community
4. **Report Abuse**: Help keep the platform safe

### For Moderators (Future)

1. **Review Context**: Consider intent, not just words
2. **Be Consistent**: Apply policies fairly
3. **Document Decisions**: Keep records of actions
4. **Respond Quickly**: Address reports within 24 hours

## Appeals Process

### How to Appeal

1. **Email Support**: support@yourdomain.com
2. **Provide Details**:
   - Event ID or title
   - Reason for appeal
   - Any clarifying information
3. **Wait for Review**: 1-2 business days
4. **Decision**: Final decision communicated via email

## Privacy & Data

### What We Track

- Reported events and reporters (anonymized)
- Moderation actions and timestamps
- Repeat offender patterns

### What We Don't Track

- Content of private messages (we don't have DMs)
- Location history beyond real-time queries
- Personal information unless voluntarily provided

## Technical Implementation

### Profanity Filter

Location: `src/utils/profanity.ts` and `src/utils/profanity-wordlist.ts`

Features:
- **Wordlist**: Banned words and phrases
- **Pattern Matching**: Regular expressions for spam patterns
- **Context Awareness**: Allows legitimate uses of flagged words
- **Sanitization**: Automatically cleans suspicious content

### Report System

Database: `event_reports` table

Workflow:
1. User submits report → Insert into `event_reports`
2. Update `reported_count` on event
3. If `reported_count >= 3` → Set `is_hidden = true`
4. Hidden events not returned in nearby queries

### Rate Limiting

Implementation: `create_event` function

Limits:
- 5 events per hour per user
- Checked before event creation
- Returns error if limit exceeded

## Updating Content Policies

### Adding Banned Words

Edit `src/utils/profanity-wordlist.ts`:

```typescript
export const bannedWords = [
  ...existingWords,
  'new-banned-word',
];
```

### Adding Patterns

Edit `src/utils/profanity-wordlist.ts`:

```typescript
export const suspiciousPatterns = [
  ...existingPatterns,
  /new-pattern-here/i,
];
```

### Deploying Updates

1. Update the wordlist
2. Test locally with example content
3. Deploy to production
4. Monitor for false positives

## Monitoring & Metrics

### Key Metrics to Track

- **Report Rate**: Reports per 1000 events
- **False Positive Rate**: Incorrectly flagged events
- **Moderation Response Time**: Time to review reports
- **Repeat Offenders**: Users with multiple violations

### Tools

- **Supabase Dashboard**: View reports table
- **Analytics**: Track moderation events
- **Error Tracking**: Monitor filter failures

## Legal Compliance

### DMCA Takedowns

For copyright violations:
1. Send notice to legal@yourdomain.com
2. Include event ID and proof of ownership
3. Takedown within 24 hours

### Law Enforcement Requests

We comply with valid legal requests:
- Require valid subpoena or warrant
- Provide only requested user data
- Notify users when legally permitted

## Resources

- **Community Guidelines**: [Link to full guidelines]
- **Privacy Policy**: [Link to privacy policy]
- **Terms of Service**: [Link to terms]
- **Support**: support@yourdomain.com

---

**Last Updated**: December 2, 2025  
**Version**: 1.0.0

