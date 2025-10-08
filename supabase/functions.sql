-- RPC Functions for Buzzy

-- Function to get nearby events with geospatial query
create or replace function public.events_nearby(
  lat float8,
  lng float8,
  radius_m int default 5000,
  now_cutoff timestamptz default now()
)
returns table (
  id uuid,
  creator uuid,
  title text,
  category text,
  starts_at timestamptz,
  ends_at timestamptz,
  latitude float8,
  longitude float8,
  created_at timestamptz,
  updated_at timestamptz,
  photo_url text,
  rsvp_count int,
  reported_count int,
  distance_m float8
)
language sql stable
security definer
as $$
  select 
    e.id,
    e.creator,
    e.title,
    e.category,
    e.starts_at,
    e.ends_at,
    ST_Y(e.location::geometry) as latitude,
    ST_X(e.location::geometry) as longitude,
    e.created_at,
    e.updated_at,
    e.photo_url,
    e.rsvp_count,
    e.reported_count,
    ST_Distance(
      e.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance_m
  from public.events e
  where 
    -- Event is still active (ends within 6 hours ago to now + 24 hours)
    e.ends_at > now_cutoff - interval '6 hours'
    and e.starts_at < now_cutoff + interval '24 hours'
    -- Event is within radius
    and ST_DWithin(
      e.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_m
    )
    -- Event is not hidden (or user is creator)
    and (not e.is_hidden or e.creator = auth.uid())
  order by e.starts_at asc, distance_m asc
  limit 200;
$$;

-- Function to handle RSVP with count update
create or replace function public.toggle_event_rsvp(event_id_param uuid)
returns json
language plpgsql
security definer
as $$
declare
  user_id uuid;
  rsvp_exists boolean;
  new_count int;
begin
  -- Get current user
  user_id := auth.uid();
  if user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Check if RSVP already exists
  select exists(
    select 1 from public.event_rsvps 
    where event_id = event_id_param and profile_id = user_id
  ) into rsvp_exists;

  if rsvp_exists then
    -- Remove RSVP
    delete from public.event_rsvps 
    where event_id = event_id_param and profile_id = user_id;
  else
    -- Add RSVP
    insert into public.event_rsvps (event_id, profile_id) 
    values (event_id_param, user_id);
  end if;

  -- Update RSVP count
  update public.events 
  set rsvp_count = (
    select count(*) from public.event_rsvps 
    where event_id = event_id_param
  )
  where id = event_id_param;

  -- Get new count
  select rsvp_count into new_count 
  from public.events 
  where id = event_id_param;

  return json_build_object(
    'is_rsvped', not rsvp_exists,
    'rsvp_count', new_count
  );
end;
$$;

-- Function to report an event
create or replace function public.report_event(
  event_id_param uuid,
  reason_param text,
  details_param text default null
)
returns void
language plpgsql
security definer
as $$
declare
  user_id uuid;
  report_count int;
begin
  user_id := auth.uid();
  if user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Insert report (will fail if duplicate due to unique constraint we'll add)
  insert into public.event_reports (event_id, profile_id, reason, details)
  values (event_id_param, user_id, reason_param, details_param);

  -- Update report count and potentially hide event
  update public.events 
  set 
    reported_count = (
      select count(*) from public.event_reports 
      where event_id = event_id_param
    ),
    is_hidden = (
      select count(*) from public.event_reports 
      where event_id = event_id_param
    ) >= 3
  where id = event_id_param;
end;
$$;

-- Function to create event with validation
create or replace function public.create_event(
  title_param text,
  category_param text,
  starts_at_param timestamptz,
  ends_at_param timestamptz,
  lat_param float8,
  lng_param float8,
  photo_url_param text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  user_id uuid;
  event_id uuid;
  recent_event_count int;
begin
  user_id := auth.uid();
  if user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Rate limiting: max 5 events per hour per user
  select count(*) into recent_event_count
  from public.events
  where creator = user_id 
    and created_at > now() - interval '1 hour';

  if recent_event_count >= 5 then
    raise exception 'Rate limit exceeded. Please wait before creating another event.';
  end if;

  -- Create event
  insert into public.events (
    creator, title, category, starts_at, ends_at, location, photo_url
  ) values (
    user_id,
    title_param,
    category_param,
    starts_at_param,
    ends_at_param,
    ST_SetSRID(ST_MakePoint(lng_param, lat_param), 4326)::geography,
    photo_url_param
  ) returning id into event_id;

  return event_id;
end;
$$;

-- Function to get a single event with location coordinates
create or replace function public.get_event_with_location(
  event_id_param uuid
)
returns table (
  id uuid,
  creator uuid,
  title text,
  category text,
  starts_at timestamptz,
  ends_at timestamptz,
  latitude float8,
  longitude float8,
  created_at timestamptz,
  updated_at timestamptz,
  photo_url text,
  rsvp_count int,
  reported_count int,
  is_hidden boolean
)
language sql stable
security definer
as $$
  select 
    e.id,
    e.creator,
    e.title,
    e.category,
    e.starts_at,
    e.ends_at,
    ST_Y(e.location::geometry) as latitude,
    ST_X(e.location::geometry) as longitude,
    e.created_at,
    e.updated_at,
    e.photo_url,
    e.rsvp_count,
    e.reported_count,
    e.is_hidden
  from public.events e
  where e.id = event_id_param
    and (not e.is_hidden or e.creator = auth.uid());
$$;
