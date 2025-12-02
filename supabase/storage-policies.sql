-- Supabase Storage Bucket Configuration for Buzzy
-- This script creates the event-photos storage bucket and sets up access policies

-- Create the event-photos bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-photos',
  'event-photos',
  true,  -- Public bucket (photos are visible to all users)
  5242880,  -- 5 MB limit (5 * 1024 * 1024 bytes)
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']  -- Allowed image types
)
on conflict (id) do nothing;

-- Policy: Allow authenticated users to upload photos
create policy "Authenticated users can upload event photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'event-photos' 
    and (storage.foldername(name))[1] = 'event-photos'
  );

-- Policy: Allow public read access to all photos
create policy "Public read access to event photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'event-photos');

-- Policy: Allow users to update their own photos (optional)
create policy "Users can update their own photos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'event-photos' and auth.uid()::text = owner);

-- Policy: Allow users to delete their own photos
create policy "Users can delete their own photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'event-photos' and auth.uid()::text = owner);

-- Verify bucket creation
select * from storage.buckets where id = 'event-photos';

