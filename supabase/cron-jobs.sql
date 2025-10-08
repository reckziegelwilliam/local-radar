-- Supabase Cron Job Configuration for Buzzy
-- This sets up automatic cleanup of expired events

-- Create the cron job to run cleanup every hour
-- Note: This requires Supabase Pro plan or higher for cron functionality

select cron.schedule(
  'cleanup-expired-events',
  '0 * * * *', -- Run every hour at minute 0
  $$
  select
    net.http_post(
      url:='https://immjhwxgisuoxzwkxvnz.supabase.co/functions/v1/cleanup-expired-events',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Alternative: You can also run the cleanup directly in SQL without Edge Functions
-- This approach runs the cleanup logic directly in the database

select cron.schedule(
  'cleanup-expired-events-sql',
  '0 * * * *', -- Run every hour
  $$
  -- Delete RSVPs for expired events
  delete from public.event_rsvps 
  where event_id in (
    select id from public.events 
    where ends_at < now() - interval '6 hours'
  );

  -- Delete reports for expired events  
  delete from public.event_reports 
  where event_id in (
    select id from public.events 
    where ends_at < now() - interval '6 hours'
  );

  -- Delete expired events
  delete from public.events 
  where ends_at < now() - interval '6 hours';
  $$
);

-- Query to check scheduled jobs
-- select * from cron.job;

-- To unschedule a job (if needed):
-- select cron.unschedule('cleanup-expired-events');
-- select cron.unschedule('cleanup-expired-events-sql');
