-- Migration: Add Event Spotting Feature
-- Adds support for Spotters (who discover flyers) and Hosts (who organize events)
-- Date: December 2, 2025

-- ============================================
-- PART 1: Extend Events Table
-- ============================================

-- Add source type (user created vs flyer spotted)
ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'user_created'
    CHECK (source_type IN ('user_created', 'flyer_spotted'));

-- Add spotter information (who discovered the flyer)
ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS spotter_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add host information (who claims/organizes the event)
ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS host_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz;

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS host_role text 
    CHECK (host_role IN ('organizer', 'performer', 'staff', 'venue', 'other'));

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS host_contact text;

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS claim_note text;

-- Add flyer-specific fields
ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS flyer_photo_url text;
  -- Stores the original flyer image (separate from organizer's photo)

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS confidence_level text DEFAULT 'high'
    CHECK (confidence_level IN ('high', 'medium', 'low'));

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS ai_parsed boolean DEFAULT false;

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS needs_confirmation jsonb DEFAULT '[]'::jsonb;
  -- Array of fields needing user confirmation: ["date", "time", "location"]

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS location_name text;
  -- Venue or place name (e.g., "Echo Park Lake")

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS address text;
  -- Street address if available

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_events_source_type ON public.events(source_type);
CREATE INDEX IF NOT EXISTS idx_events_spotter_id ON public.events(spotter_id);
CREATE INDEX IF NOT EXISTS idx_events_host_profile_id ON public.events(host_profile_id);
CREATE INDEX IF NOT EXISTS idx_events_claimed_at ON public.events(claimed_at);

-- ============================================
-- PART 2: Create Spotter Statistics Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.spotter_stats (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  events_spotted int DEFAULT 0,
  events_claimed_by_organizers int DEFAULT 0,
  rsvps_on_spotted_events int DEFAULT 0,
  spot_score int DEFAULT 0,
  badges jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_spotter_stats_score ON public.spotter_stats(spot_score DESC);
CREATE INDEX IF NOT EXISTS idx_spotter_stats_spotted ON public.spotter_stats(events_spotted DESC);
CREATE INDEX IF NOT EXISTS idx_spotter_stats_user_id ON public.spotter_stats(user_id);

-- Trigger for updated_at
CREATE TRIGGER on_spotter_stats_updated
  BEFORE UPDATE ON public.spotter_stats
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================
-- PART 3: Update RLS Policies
-- ============================================

-- Allow everyone to read spotter stats (for leaderboards)
CREATE POLICY "spotter_stats_select_all" ON public.spotter_stats
  FOR SELECT USING (true);

-- Users can only update their own stats (though usually done via functions)
CREATE POLICY "spotter_stats_update_own" ON public.spotter_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Update events policy: Hosts can edit claimed events
DROP POLICY IF EXISTS "events_update_own" ON public.events;

CREATE POLICY "events_update_by_creator_or_host" ON public.events
  FOR UPDATE USING (
    auth.uid() = creator 
    OR auth.uid() = host_profile_id
  );

-- ============================================
-- PART 4: Helper Views
-- ============================================

-- View to get events with spotter and host handles
CREATE OR REPLACE VIEW public.events_with_attribution AS
SELECT 
  e.*,
  s.handle as spotter_handle,
  h.handle as host_handle
FROM public.events e
LEFT JOIN public.profiles s ON e.spotter_id = s.id
LEFT JOIN public.profiles h ON e.host_profile_id = h.id;

-- ============================================
-- MIGRATION VERIFICATION
-- ============================================

-- Verify new columns exist
DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.columns 
          WHERE table_name = 'events' AND column_name = 'source_type') = 1,
         'source_type column not added';
  
  ASSERT (SELECT COUNT(*) FROM information_schema.tables 
          WHERE table_name = 'spotter_stats') = 1,
         'spotter_stats table not created';
         
  RAISE NOTICE 'Migration completed successfully!';
END $$;

