# Technical Debt & Known Issues

**Last Updated**: December 2, 2025  
**Priority Legend**: 🔴 Critical | 🟡 High | 🟢 Medium | ⚪ Low

---

## 🔴 CRITICAL (Fix Immediately)

### 1. Missing Service Implementations

**Location**: `src/services/AnalyticsService.ts`, `src/services/PerformanceService.ts`

**Issue**: Services have TODO placeholders instead of real implementations

**Code Examples**:
```typescript
// In AnalyticsService.ts (12 TODOs)
// TODO: Initialize your analytics service here
// TODO: Send to your analytics service

// In PerformanceService.ts (4 TODOs)
// TODO: Send to your performance monitoring service
```

**Impact**:
- No analytics data being collected
- No performance monitoring active
- Can't track user behavior
- Can't debug performance issues

**Fix**:
1. Choose analytics provider (Amplitude, Mixpanel, or Firebase)
2. Implement actual service calls
3. Remove TODO comments
4. Test that events are being sent

**Estimated Effort**: 4-6 hours

**Owner**: Engineering

**Target Date**: Before production launch

---

### 2. Hardcoded Supabase URL

**Location**: `supabase/cron-jobs.sql:15`

**Issue**: Production Supabase URL is hardcoded

**Code**:
```sql
'https://immjhwxgisuoxzwkxvnz.supabase.co/functions/v1/cleanup-expired-events'
```

**Impact**:
- Won't work if Supabase project changes
- Coupling to specific environment
- Maintenance nightmare

**Fix**:
1. Use environment variable in cron job
2. OR use GitHub Actions alternative (already configured in `.github/workflows/cleanup-cron.yml`)
3. Update deployment docs

**Estimated Effort**: 30 minutes

**Owner**: Engineering

**Target Date**: Before enabling cron jobs

---

### 3. Placeholder URLs in app.json

**Location**: `app.json:119-120`

**Issue**: Privacy policy and support URLs are placeholders

**Code**:
```json
"privacyPolicyUrl": "https://yourdomain.com/privacy-policy",
"supportUrl": "mailto:support@yourdomain.com"
```

**Impact**:
- App Store will reject submission
- Legal compliance issue
- Users can't access policies

**Fix**:
1. Host legal documents (GitHub Pages recommended)
2. Update URLs to real addresses
3. Verify links work

**Estimated Effort**: 1-2 hours

**Owner**: Product + Engineering

**Target Date**: Before App Store submission

---

## 🟡 HIGH PRIORITY (Fix Before Launch)

### 4. No Edge Function Tests

**Location**: `supabase/functions/`

**Issue**: Zero automated tests for edge functions

**Impact**:
- Can't verify function behavior
- Easy to break with changes
- No confidence in deployments

**Fix**:
1. Add Deno tests for each function
2. Mock Supabase client
3. Test error cases
4. Add to CI/CD pipeline

**Estimated Effort**: 8-10 hours

**Owner**: Engineering

**Target Date**: v1.1.0

---

### 5. Missing Error Boundaries

**Location**: Various screens

**Issue**: Not all screens have error boundaries

**Impact**:
- App crashes instead of showing friendly error
- Poor user experience
- Hard to debug issues

**Fix**:
1. Wrap all route components in ErrorBoundary
2. Add custom error screens
3. Log errors to Sentry

**Estimated Effort**: 2-3 hours

**Owner**: Engineering

**Target Date**: v1.1.0

---

### 6. Console.log Statements Remaining

**Location**: Throughout codebase (see `docs/CONSOLE_LOG_REPLACEMENT.md`)

**Issue**: Some console.log statements still exist

**Impact**:
- Performance impact in production
- Clutter in logs
- Unprofessional

**Fix**:
1. Replace with logger service
2. Add ESLint rule to prevent new ones
3. Clean up existing ones

**Estimated Effort**: 2-3 hours

**Owner**: Engineering

**Target Date**: v1.1.0

---

### 7. No E2E Tests

**Location**: N/A (missing)

**Issue**: No end-to-end automated tests

**Impact**:
- Manual testing required for every release
- Time-consuming
- Easy to miss regressions

**Fix**:
1. Set up Detox or Maestro
2. Write tests for critical flows
3. Add to CI/CD

**Estimated Effort**: 16-20 hours

**Owner**: Engineering

**Target Date**: v1.2.0

---

## 🟢 MEDIUM PRIORITY (Fix Soon)

### 8. Inconsistent Error Handling

**Issue**: Error messages are inconsistent across app

**Examples**:
- Some show user-friendly messages
- Some show technical errors
- Some don't show anything

**Fix**:
1. Create error message dictionary
2. Standardize error handling
3. Add consistent UI for errors

**Estimated Effort**: 4-6 hours

**Target Date**: v1.1.0

---

### 9. Missing Loading States

**Location**: Some components

**Issue**: Not all async operations show loading states

**Impact**:
- User doesn't know app is working
- Feels unresponsive
- Users click multiple times

**Fix**:
1. Audit all async operations
2. Add loading states
3. Use loading spinner component

**Estimated Effort**: 3-4 hours

**Target Date**: v1.1.0

---

### 10. No Offline Queue

**Issue**: Can't create events while offline

**Impact**:
- Poor experience with bad network
- Users lose work
- Frustration

**Fix**:
1. Implement offline queue with AsyncStorage
2. Retry when connection restored
3. Show queue status to user

**Estimated Effort**: 8-10 hours

**Target Date**: v1.2.0

---

### 11. Missing TypeScript Types

**Location**: Various utility functions

**Issue**: Some functions use `any` or lack types

**Impact**:
- Type safety compromised
- IntelliSense doesn't work
- Runtime errors possible

**Fix**:
1. Enable TypeScript strict mode
2. Add types to all functions
3. Remove all `any` types

**Estimated Effort**: 6-8 hours

**Target Date**: v1.2.0

---

### 12. No Database Indexes Verification

**Location**: Database

**Issue**: Haven't verified all necessary indexes exist

**Impact**:
- Slow queries possible
- Poor performance at scale
- High database costs

**Fix**:
1. Run EXPLAIN ANALYZE on all queries
2. Add missing indexes
3. Document index strategy

**Estimated Effort**: 4 hours

**Target Date**: v1.1.0

---

## ⚪ LOW PRIORITY (Nice to Have)

### 13. Missing JSDoc Comments

**Issue**: Many functions lack documentation

**Impact**:
- Harder for new developers
- IntelliSense less helpful
- Maintenance harder

**Fix**:
1. Add JSDoc to all public functions
2. Document complex logic
3. Add examples

**Estimated Effort**: 10-12 hours

**Target Date**: v2.0.0

---

### 14. No Component Library Documentation

**Issue**: Components lack usage examples

**Impact**:
- Hard to reuse components
- Inconsistent usage
- Duplicate components created

**Fix**:
1. Set up Storybook
2. Document all components
3. Add usage examples

**Estimated Effort**: 16-20 hours

**Target Date**: v2.0.0

---

### 15. Inconsistent Code Style

**Issue**: Some files use different patterns

**Impact**:
- Harder to read codebase
- Merge conflicts
- Onboarding friction

**Fix**:
1. Set up Prettier
2. Create style guide
3. Run formatter on all files

**Estimated Effort**: 2-3 hours

**Target Date**: v1.2.0

---

### 16. No Performance Budgets

**Issue**: No defined performance targets

**Impact**:
- App could get slower over time
- No early warning signs
- Poor user experience

**Fix**:
1. Define performance budgets
2. Add to CI/CD
3. Monitor in production

**Estimated Effort**: 4-6 hours

**Target Date**: v1.3.0

---

## 📊 Technical Debt Summary

| Priority | Count | Total Effort | Target |
|----------|-------|--------------|--------|
| 🔴 Critical | 3 | 6-9 hours | Pre-launch |
| 🟡 High | 4 | 28-38 hours | v1.1.0 |
| 🟢 Medium | 5 | 25-32 hours | v1.2.0 |
| ⚪ Low | 4 | 32-41 hours | v2.0.0 |
| **TOTAL** | **16** | **91-120 hours** | **~3-4 sprints** |

---

## 🎯 Action Plan

### Sprint 1 (Current) - Critical Items
- [ ] Implement analytics service
- [ ] Implement performance service
- [ ] Fix hardcoded URLs
- [ ] Host legal documents

**Estimated**: 12-15 hours

### Sprint 2 - High Priority
- [ ] Add error boundaries everywhere
- [ ] Write edge function tests
- [ ] Replace console.log statements
- [ ] Set up E2E testing framework

**Estimated**: 28-38 hours

### Sprint 3 - Medium Priority
- [ ] Standardize error handling
- [ ] Add missing loading states
- [ ] Implement offline queue
- [ ] Add missing types

**Estimated**: 25-32 hours

### Sprint 4+ - Low Priority
- JSDoc comments
- Storybook setup
- Code style consistency
- Performance budgets

**Estimated**: 32-41 hours

---

## 📝 How to Add Items

Found technical debt? Add it here:

1. **Categorize** by priority (Critical/High/Medium/Low)
2. **Describe** the issue clearly
3. **Explain** the impact
4. **Propose** a fix
5. **Estimate** effort
6. **Assign** owner and target date

---

## 🔄 Review Schedule

- **Weekly** during active development
- **Monthly** after launch
- **Quarterly** for low-priority items

**Last Review**: December 2, 2025  
**Next Review**: December 9, 2025

---

## 📈 Trend Analysis

### This Week
- **New Items**: 16 (initial documentation)
- **Resolved**: 0
- **In Progress**: 3 (critical items)

### Goals
- **End of Month**: Resolve all critical items
- **End of Q1 2026**: Resolve all high priority items
- **End of Q2 2026**: Resolve all medium priority items

---

**This is a living document.** Review and update weekly. Technical debt should be continuously addressed, not deferred indefinitely.

See also:
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Current project health
- [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md) - Feature planning
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) - How to contribute fixes

