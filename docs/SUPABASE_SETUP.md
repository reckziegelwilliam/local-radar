# Supabase Setup Guide

Complete guide for setting up Supabase for the Buzzy application.

## Overview

Buzzy uses Supabase for:
- PostgreSQL database with PostGIS extension
- User authentication (magic link)
- Row Level Security (RLS) for data protection
- Storage for event photos
- Edge Functions for server-side logic
- Cron jobs for automatic cleanup

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Enter project details:
   - **Name**: `buzzy-production` (or your preferred name)
   - **Database Password**: Use a strong password (save it securely!)
   - **Region**: Choose closest to your target users
4. Wait for project creation (~2 minutes)

### 2. Enable PostGIS Extension

PostGIS is required for geospatial queries (finding nearby events).

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Run this command:

```sql
create extension if not exists postgis;
```

4. Click **RUN** to execute

### 3. Run Database Migrations

Execute the SQL files in this order. For each file:
1. Copy the entire file contents
2. Paste into SQL Editor
3. Click **RUN**

#### 3.1. Schema (Creates Tables)

```bash
File: supabase/schema.sql
```

This creates:
- `profiles` table (user profiles)
- `events` table (with PostGIS location)
- `event_rsvps` table (attendance tracking)
- `event_reports` table (content moderation)
- Indexes for performance

#### 3.2. RLS Policies (Security)

```bash
File: supabase/rls.sql
```

This enables Row Level Security and creates policies for:
- Who can read/write profiles
- Who can create/update/delete events
- Who can RSVP to events
- Who can report events

#### 3.3. Functions (Database Logic)

```bash
File: supabase/functions.sql
```

This creates database functions for:
- `events_nearby()` - Find events within radius
- `create_event()` - Create events with validation and rate limiting
- `toggle_event_rsvp()` - Handle RSVPs
- `report_event()` - Report inappropriate content
- `get_event_with_location()` - Get event details

#### 3.4. Notifications (Optional)

```bash
File: supabase/notifications.sql
```

Creates tables/triggers for push notifications (if implemented).

### 4. Set Up Storage Bucket

Storage is used for event photos uploaded by users.

#### Option A: Using SQL Script (Recommended)

1. Open SQL Editor
2. Copy and paste contents from:

```bash
File: supabase/storage-policies.sql
```

3. Click **RUN**

This creates:
- `event-photos` bucket (5 MB file limit)
- Public read access
- Authenticated write access
- Allowed types: JPEG, PNG, WebP

#### Option B: Using Dashboard (Manual)

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Configure:
   - **Name**: `event-photos`
   - **Public**: ✓ (checked)
   - **File size limit**: 5242880 (5 MB)
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`
4. Click **Create bucket**
5. Go to **Policies** tab and add:
   - Insert policy for authenticated users
   - Select policy for public access

### 5. Deploy Edge Functions

Edge Functions handle server-side validation and background tasks.

#### 5.1. Install Supabase CLI

```bash
npm install -g supabase
```

#### 5.2. Login and Link Project

```bash
# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Find YOUR_PROJECT_REF in:
# Supabase Dashboard → Settings → General → Reference ID
```

#### 5.3. Deploy Functions

```bash
# Deploy all functions
supabase functions deploy create-event
supabase functions deploy cleanup-expired-events
supabase functions deploy send-nearby-notification
```

#### 5.4. Set Function Secrets

```bash
# Set environment variables for functions
supabase secrets set SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 6. Configure Authentication

#### 6.1. Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable **Email Confirmations** (we use magic links)
4. Ensure **Sign up enabled** is checked

#### 6.2. Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Select **Magic Link** template
3. Customize if desired (optional)
4. Ensure redirect URL includes: `localradar://`

#### 6.3. Set Up Email Service (Recommended for Production)

Supabase free tier: 4 emails/hour  
For production, integrate a custom SMTP provider:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Add your SMTP credentials (e.g., SendGrid, Mailgun, AWS SES)
4. Test with a magic link sign-in

**SendGrid Setup Example:**
- SMTP Host: `smtp.sendgrid.net`
- Port: `587`
- Username: `apikey`
- Password: `YOUR_SENDGRID_API_KEY`
- Sender Email: `noreply@yourdomain.com`

### 7. Set Up Cron Jobs (Optional - Requires Pro Plan)

Cron jobs automatically clean up expired events every hour.

**Requirements:**
- Supabase Pro plan ($25/month)
- OR external cron service (free alternatives below)

#### Option A: Supabase Cron (Requires Pro)

1. Enable `pg_cron` extension:

```sql
create extension if not exists pg_cron;
```

2. Update the URL in `supabase/cron-jobs.sql`:
   - Find: `https://immjhwxgisuoxzwkxvnz.supabase.co`
   - Replace: `https://YOUR-PROJECT-REF.supabase.co`

3. Run the updated `supabase/cron-jobs.sql` in SQL Editor

#### Option B: External Cron Service (Free)

Use a free service to call the cleanup function hourly:

**GitHub Actions:**
Create `.github/workflows/cleanup-cron.yml`:

```yaml
name: Cleanup Expired Events
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Call Cleanup Function
        run: |
          curl -X POST \
            '${{ secrets.SUPABASE_URL }}/functions/v1/cleanup-expired-events' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}' \
            -H 'Content-Type: application/json'
```

**Other Options:**
- [cron-job.org](https://cron-job.org) (free)
- [EasyCron](https://www.easycron.com) (free tier)
- Your own server with crontab

### 8. Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values to your `.env` file:

```bash
# Project URL
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co

# anon/public key (safe to expose in client)
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# service_role key (KEEP SECRET! Never expose in client code)
# Only needed for edge functions or server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 9. Verify Setup

Run these checks in SQL Editor to verify everything is set up:

```sql
-- Check PostGIS is enabled
SELECT * FROM pg_extension WHERE extname = 'postgis';

-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'event-photos';

-- Check functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
```

Expected results:
- PostGIS extension present
- 4 tables: `profiles`, `events`, `event_rsvps`, `event_reports`
- All tables have `rowsecurity = true`
- `event-photos` bucket exists
- Functions: `events_nearby`, `create_event`, `toggle_event_rsvp`, `report_event`, `get_event_with_location`

## Production Checklist

Before going live, verify:

- [ ] PostGIS extension enabled
- [ ] All database migrations run successfully
- [ ] RLS policies active on all tables
- [ ] Storage bucket created with correct policies
- [ ] Edge functions deployed and tested
- [ ] Authentication configured with custom SMTP (recommended)
- [ ] Cron jobs set up (or external alternative)
- [ ] API keys copied to `.env`
- [ ] Connection tested from app
- [ ] Test user can sign up/sign in
- [ ] Test event creation with photo upload
- [ ] Test RSVP and reporting

## Security Best Practices

1. **Never expose service_role key** in client code
2. **Use RLS policies** for all data access (already configured)
3. **Validate input** on both client and server (already implemented)
4. **Rate limit API calls** (already implemented - 5 events/hour)
5. **Monitor auth logs** for suspicious activity
6. **Rotate keys** if ever compromised
7. **Use HTTPS only** (Supabase enforces this)

## Troubleshooting

### "PostGIS not available"
- Ensure you ran: `create extension if not exists postgis;`
- Check extensions: `SELECT * FROM pg_extension;`

### "Permission denied" on insert/update
- Check RLS policies are created: `SELECT * FROM pg_policies;`
- Verify user is authenticated: Check `auth.users` table

### Storage upload fails
- Verify bucket exists and is public
- Check storage policies allow authenticated inserts
- Verify file size under 5 MB
- Check MIME type is allowed

### Edge functions not working
- Verify functions are deployed: `supabase functions list`
- Check function logs: Supabase Dashboard → Edge Functions → Logs
- Ensure secrets are set: `supabase secrets list`

### Cron jobs not running
- Requires Supabase Pro plan
- Check `pg_cron` extension is enabled
- Verify cron schedule: `SELECT * FROM cron.job;`
- Check logs for errors

## Monitoring

### Database Performance
- Dashboard → Database → Query Performance
- Watch for slow queries (> 100ms)
- Monitor connection count

### Auth Activity
- Dashboard → Authentication → Users
- Monitor sign-up rate
- Check for failed login attempts

### Storage Usage
- Dashboard → Storage → event-photos
- Monitor upload rate
- Check storage size

### Edge Functions
- Dashboard → Edge Functions → Logs
- Monitor invocation count
- Check error rates

## Cost Estimation

### Free Tier (Good for Development)
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 5 GB/month
- Edge Functions: 500,000 invocations/month
- ⚠️ No cron jobs

### Pro Plan ($25/month - Recommended for Production)
- Database: 8 GB
- Storage: 100 GB
- Bandwidth: 250 GB/month
- Edge Functions: 2 million invocations/month
- ✅ Cron jobs included
- ✅ Daily backups
- ✅ Priority support

### Pay-as-you-go
Additional usage billed separately:
- Database: $0.125/GB
- Storage: $0.021/GB
- Bandwidth: $0.09/GB

## Support Resources

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

---

**Next:** Update your `.env` file with API keys and test the connection from your app!

