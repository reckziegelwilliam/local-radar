-- Row Level Security Policies for Buzzy

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.event_reports enable row level security;

-- Profiles policies
create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Events policies
create policy "events_select_visible" on public.events
  for select using (not is_hidden or creator = auth.uid());

create policy "events_insert_authenticated" on public.events
  for insert with check (auth.uid() = creator);

create policy "events_update_own" on public.events
  for update using (auth.uid() = creator);

create policy "events_delete_own" on public.events
  for delete using (auth.uid() = creator);

-- RSVPs policies
create policy "rsvps_select_all" on public.event_rsvps
  for select using (true);

create policy "rsvps_insert_own" on public.event_rsvps
  for insert with check (auth.uid() = profile_id);

create policy "rsvps_delete_own" on public.event_rsvps
  for delete using (auth.uid() = profile_id);

-- Reports policies (authenticated users can report any event)
create policy "reports_insert_authenticated" on public.event_reports
  for insert with check (auth.uid() is not null);

create policy "reports_select_own" on public.event_reports
  for select using (auth.uid() = profile_id);
