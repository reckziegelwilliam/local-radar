-- Buzzy Database Schema
-- Enable PostGIS extension for geospatial queries
create extension if not exists postgis;

-- Users/Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text generated always as (
    'user_' || substr(id::text, 1, 8)
  ) stored,
  push_token text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events table with PostGIS location support
create table public.events (
  id uuid primary key default gen_random_uuid(),
  creator uuid references public.profiles(id) on delete set null,
  title text not null check (length(title) between 3 and 80),
  category text not null check (category in ('music','cafe','yard','food','wellness','art','sports','other')),
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  -- PostGIS geography point (WGS84)
  location geography(point, 4326) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  photo_url text,
  rsvp_count int default 0,
  reported_count int default 0,
  is_hidden boolean default false
);

-- RSVPs table for event attendance tracking
create table public.event_rsvps (
  event_id uuid references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (event_id, profile_id)
);

-- Reports table for content moderation
create table public.event_reports (
  id bigserial primary key,
  event_id uuid references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  reason text check (reason in ('spam', 'inappropriate', 'fake', 'other')),
  details text,
  created_at timestamptz default now()
);

-- Indexes for performance
create index on public.events using gist (location);
create index on public.events (ends_at);
create index on public.events (created_at);
create index on public.events (category);
create index on public.event_rsvps (event_id);
create index on public.event_rsvps (profile_id);
create index on public.event_reports (event_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_events_updated
  before update on public.events
  for each row execute procedure public.handle_updated_at();
