# Production Monitoring Guide

Guide for monitoring Buzzy in production.

## Overview

Once Buzzy is live, continuous monitoring ensures reliability, performance, and user satisfaction. This guide covers what to monitor and how to respond to issues.

## Key Metrics to Monitor

### Application Health

**Crash-Free Rate**
- Target: >99.5%
- Check: Error tracking dashboard (Sentry)
- Alert if: <99% for more than 1 hour

**API Error Rate**
- Target: <1% of requests
- Check: Supabase logs, Error tracking
- Alert if: >2% for more than 5 minutes

**Response Time**
- Target: <500ms (p95)
- Check: Supabase performance dashboard
- Alert if: >1000ms for more than 5 minutes

### User Engagement

**Daily Active Users (DAU)**
- Track: Analytics dashboard
- Monitor trends and sudden drops

**Events Created**
- Track: Database queries or analytics
- Monitor: Daily/weekly trends

**RSVPs per Event**
- Track: Database analytics
- Healthy range: 2-10 RSVPs per event

**Retention**
- Day 1: Target >40%
- Day 7: Target >20%
- Day 30: Target >10%

### Infrastructure

**Database**
- CPU usage: Target <70%
- Memory: Target <80%
- Disk space: Target <80%
- Connection count: Monitor for spikes

**Storage**
- Total usage: Monitor monthly growth
- Upload rate: Track images per day
- Download bandwidth: Monitor costs

**Edge Functions**
- Invocation count: Track usage
- Error rate: Target <1%
- Execution time: Target <1s

## Monitoring Tools

### Supabase Dashboard

**Database Performance**
Location: Dashboard → Database → Query Performance

Monitor:
- Slow queries (>100ms)
- Connection count
- CPU/memory usage
- Disk usage

**Auth Activity**
Location: Dashboard → Authentication

Monitor:
- Sign-up rate
- Sign-in success rate
- Failed attempts (potential attacks)

**Storage Usage**
Location: Dashboard → Storage

Monitor:
- Total size
- Upload errors
- Bandwidth usage

**Edge Functions**
Location: Dashboard → Edge Functions → Logs

Monitor:
- Invocation count
- Error logs
- Execution time

### Error Tracking (Sentry/Bugsnag)

**Setup Alerts**
```typescript
// Configure in error tracking dashboard
- Critical errors: Immediate notification
- Error rate >1%: Alert after 5 minutes
- New error type: Daily digest
```

**Key Reports**
- Most common errors
- Errors by OS version
- Errors by device
- Errors by user session

### Analytics (Amplitude/Firebase)

**User Flow**
- Track: Sign up → Create Event → RSVP
- Monitor: Drop-off points
- Optimize: Screens with high abandonment

**Feature Usage**
- Most used features
- Least used features
- Time spent in app

**User Segmentation**
- New vs returning users
- Power users (>10 events created)
- At-risk users (no activity in 7 days)

## Automated Alerts

### Critical Alerts (Immediate Response)

**Crash Rate Spike**
```yaml
Condition: Crash rate >1% for 5 minutes
Action: Check error logs immediately
```

**Database Down**
```yaml
Condition: Database connection fails
Action: Check Supabase status page
```

**Storage Full**
```yaml
Condition: Storage >95% capacity
Action: Clean up old files or upgrade plan
```

### Warning Alerts (Review within 1 hour)

**High Error Rate**
```yaml
Condition: API errors >2% for 10 minutes
Action: Review logs, may need hotfix
```

**Slow Queries**
```yaml
Condition: Query time >1s for 5 minutes
Action: Check database performance, add indexes
```

**Low Sign-up Rate**
```yaml
Condition: <10 sign-ups in 24 hours (after launch)
Action: Check app store visibility, marketing
```

### Info Alerts (Daily Digest)

- New user feedback
- App store reviews
- Usage statistics summary
- Cost summary

## Daily Checks (5 minutes)

1. **Error Dashboard**
   - Any new critical errors?
   - Error rate within normal range?

2. **App Store**
   - New reviews?
   - Rating changed?
   - Any support requests?

3. **Database**
   - Query performance ok?
   - Storage usage ok?

4. **User Activity**
   - DAU within expected range?
   - Any unusual patterns?

## Weekly Reviews (30 minutes)

1. **Performance Trends**
   - Review week-over-week metrics
   - Identify degradation patterns
   - Plan optimizations

2. **User Feedback**
   - Categorize feedback themes
   - Prioritize feature requests
   - Plan bug fixes

3. **Infrastructure**
   - Review costs
   - Check for optimization opportunities
   - Plan capacity if growing

4. **Security**
   - Review failed auth attempts
   - Check for suspicious activity
   - Update dependencies if needed

## Monthly Reviews (2 hours)

1. **Business Metrics**
   - User growth rate
   - Retention cohorts
   - Feature adoption
   - Revenue (if applicable)

2. **Technical Health**
   - Code quality trends
   - Technical debt
   - Performance benchmarks
   - Security audit

3. **Roadmap**
   - Feature priorities based on usage
   - Infrastructure upgrades needed
   - Team capacity planning

## Incident Response

### Severity Levels

**Critical (P0)**: App completely broken
- Response: Immediate (< 15 minutes)
- Examples: Database down, auth broken, app crashes on launch

**High (P1)**: Major feature broken
- Response: < 1 hour
- Examples: Can't create events, images won't upload

**Medium (P2)**: Minor feature broken
- Response: < 4 hours
- Examples: Push notifications not working, slow loading

**Low (P3)**: Cosmetic issues
- Response: < 1 week
- Examples: UI glitches, minor typos

### Incident Response Process

1. **Detect**
   - Automated alert or user report
   - Verify issue is real

2. **Assess**
   - Determine severity
   - Estimate user impact
   - Check if workaround exists

3. **Communicate**
   - Update status page (if you have one)
   - Post in app (if possible)
   - Notify team

4. **Fix**
   - Implement fix
   - Test thoroughly
   - Deploy (hotfix if critical)

5. **Monitor**
   - Verify fix works
   - Check metrics improve
   - Watch for related issues

6. **Post-Mortem**
   - Document what happened
   - Identify root cause
   - Plan prevention measures

## Cost Monitoring

### Supabase Costs

**Free Tier Limits**
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 5 GB/month

**Monitor Usage**
```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('postgres'));

-- Storage size
SELECT SUM(pg_column_size(id)) FROM storage.objects;

-- Active connections
SELECT count(*) FROM pg_stat_activity;
```

**Cost Optimization**
- Clean up expired data regularly
- Compress images aggressively
- Use CDN for static assets (if high traffic)
- Archive old data to separate storage

### Expo/EAS Costs

**Build Minutes**
- Free tier: 30 builds/month
- Monitor: Dashboard → Build History

**OTA Updates**
- Free tier: Unlimited
- Use for hotfixes to avoid rebuild costs

## User Support Monitoring

### Support Channels

**Email**: support@yourdomain.com
- Response time target: < 24 hours
- Track common issues
- Create FAQ from patterns

**App Store Reviews**
- Respond to all reviews (especially negative)
- Thank users for feedback
- Address concerns publicly

**In-App Feedback** (if implemented)
- Prioritize by frequency
- Tag by category
- Track resolution time

### Common User Issues

Track frequency of:
- Can't sign in
- Events not showing
- Image upload fails
- Location permission denied
- App crashes

Use data to prioritize fixes and improve docs.

## Reporting

### Weekly Report Template

```
Week of [Date]

User Metrics:
- DAU: [number] ([+/-]% vs last week)
- New sign-ups: [number]
- Events created: [number]
- Retention (Day 7): [%]

Technical Health:
- Crash-free rate: [%]
- API error rate: [%]
- P95 response time: [ms]

Incidents:
- [List any incidents and resolution]

Top User Feedback:
- [Theme 1]: [count] mentions
- [Theme 2]: [count] mentions

Action Items:
- [Priority 1 task]
- [Priority 2 task]
```

## Resources

- Supabase Status: https://status.supabase.com
- Expo Status: https://status.expo.dev
- Apple Developer Status: https://developer.apple.com/system-status/
- Google Play Status: https://play.google.com/console/about/status/

## Emergency Contacts

- On-call Engineer: [phone]
- Supabase Support: support@supabase.io
- Expo Support: https://expo.dev/support

---

**Last Updated**: December 2, 2025

