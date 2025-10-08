-- Additional SQL functions for push notifications

-- Function to get nearby users with push tokens
create or replace function public.get_nearby_users_with_push_tokens(
  event_lat float8,
  event_lng float8,
  radius_m int default 3000
)
returns table (
  user_id uuid,
  push_token text,
  distance_m float8
)
language sql stable
security definer
as $$
  select 
    p.id as user_id,
    p.push_token,
    ST_Distance(
      ST_SetSRID(ST_MakePoint(event_lng, event_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)::geography -- Placeholder: would need user's last known location
    ) as distance_m
  from public.profiles p
  where 
    p.push_token is not null
    and p.push_token != ''
    and p.id != auth.uid() -- Don't notify the event creator
  limit 1000; -- Reasonable limit to prevent spam
$$;

-- Trigger function to send notifications when new events are created
create or replace function notify_nearby_users_on_event_creation()
returns trigger
language plpgsql
security definer
as $$
declare
  event_lat float8;
  event_lng float8;
begin
  -- Extract coordinates from PostGIS location
  event_lat := ST_Y(NEW.location::geometry);
  event_lng := ST_X(NEW.location::geometry);

  -- Call the Edge Function to send notifications
  -- Note: This requires the pg_net extension and appropriate permissions
  perform
    net.http_post(
      url := 'https://immjhwxgisuoxzwkxvnz.supabase.co/functions/v1/send-nearby-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
      body := json_build_object(
        'event_id', NEW.id,
        'event_title', NEW.title,
        'event_category', NEW.category,
        'event_lat', event_lat,
        'event_lng', event_lng
      )::jsonb
    );

  return NEW;
end;
$$;

-- Create trigger to automatically notify users when events are created
drop trigger if exists on_event_created_notify_users on public.events;
create trigger on_event_created_notify_users
  after insert on public.events
  for each row
  execute function notify_nearby_users_on_event_creation();

-- Function to update user's last known location (for better notifications)
create or replace function update_user_location(
  lat float8,
  lng float8
)
returns void
language plpgsql
security definer
as $$
begin
  -- Update user's profile with last known location
  -- This would require adding location fields to the profiles table
  update public.profiles
  set 
    last_lat = lat,
    last_lng = lng,
    last_location_updated = now()
  where id = auth.uid();
end;
$$;

-- Add location fields to profiles table (optional, for better notification targeting)
-- alter table public.profiles 
-- add column if not exists last_lat float8,
-- add column if not exists last_lng float8,
-- add column if not exists last_location_updated timestamptz;
