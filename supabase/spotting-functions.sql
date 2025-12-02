-- Event Spotting Functions
-- Functions to support claiming events and updating spotter statistics

-- ============================================
-- Function: Claim an Event
-- ============================================

CREATE OR REPLACE FUNCTION public.claim_event(
  event_id_param uuid,
  role_param text,
  contact_param text DEFAULT null,
  note_param text DEFAULT null
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  spotter_user_id uuid;
  event_exists boolean;
  already_claimed boolean;
BEGIN
  -- Get current user
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Validate role
  IF role_param NOT IN ('organizer', 'performer', 'staff', 'venue', 'other') THEN
    RAISE EXCEPTION 'Invalid host role';
  END IF;

  -- Check if event exists and get spotter
  SELECT 
    spotter_id,
    (host_profile_id IS NOT NULL)
  INTO spotter_user_id, already_claimed
  FROM public.events 
  WHERE id = event_id_param
    AND source_type = 'flyer_spotted';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found or not claimable';
  END IF;

  IF already_claimed THEN
    RAISE EXCEPTION 'Event already claimed';
  END IF;

  -- Update event with host information
  UPDATE public.events 
  SET 
    host_profile_id = user_id,
    claimed_at = now(),
    host_role = role_param,
    host_contact = contact_param,
    claim_note = note_param
  WHERE id = event_id_param
    AND source_type = 'flyer_spotted'
    AND host_profile_id IS NULL;  -- Double-check not already claimed

  -- Award points to spotter (+5 for having event claimed)
  IF spotter_user_id IS NOT NULL THEN
    PERFORM public.update_spotter_stats(spotter_user_id, 'event_claimed', 5);
  END IF;

  -- Track that this user claimed an event (for their stats)
  INSERT INTO public.spotter_stats (user_id, spot_score)
  VALUES (user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN json_build_object(
    'success', true,
    'event_id', event_id_param,
    'host_id', user_id,
    'spotter_awarded', spotter_user_id IS NOT NULL
  );
END;
$$;

-- ============================================
-- Function: Update Spotter Statistics
-- ============================================

CREATE OR REPLACE FUNCTION public.update_spotter_stats(
  user_id_param uuid,
  action text,
  points int DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  old_score int;
  new_score int;
  new_badges jsonb;
BEGIN
  -- Initialize stats if doesn't exist
  INSERT INTO public.spotter_stats (user_id, spot_score)
  VALUES (user_id_param, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get current score
  SELECT spot_score INTO old_score
  FROM public.spotter_stats
  WHERE user_id = user_id_param;

  -- Update based on action
  CASE action
    WHEN 'event_spotted' THEN
      UPDATE public.spotter_stats 
      SET 
        events_spotted = events_spotted + 1,
        spot_score = spot_score + points
      WHERE user_id = user_id_param;

    WHEN 'event_claimed' THEN
      UPDATE public.spotter_stats 
      SET 
        events_claimed_by_organizers = events_claimed_by_organizers + 1,
        spot_score = spot_score + points
      WHERE user_id = user_id_param;

    WHEN 'rsvp_on_spotted' THEN
      UPDATE public.spotter_stats 
      SET 
        rsvps_on_spotted_events = rsvps_on_spotted_events + 1,
        spot_score = spot_score + points
      WHERE user_id = user_id_param;

    WHEN 'bonus_points' THEN
      UPDATE public.spotter_stats 
      SET spot_score = spot_score + points
      WHERE user_id = user_id_param;

    ELSE
      RAISE EXCEPTION 'Unknown action: %', action;
  END CASE;

  -- Check for new badges
  SELECT spot_score INTO new_score
  FROM public.spotter_stats
  WHERE user_id = user_id_param;

  -- Auto-award badges based on milestones
  SELECT badges INTO new_badges
  FROM public.spotter_stats
  WHERE user_id = user_id_param;

  -- First spot badge
  IF old_score = 0 AND new_score >= 10 THEN
    new_badges := new_badges || '["first_spot"]'::jsonb;
  END IF;

  -- Block messenger badge (10+ events)
  IF NOT new_badges ? 'block_messenger' THEN
    IF (SELECT events_spotted FROM public.spotter_stats WHERE user_id = user_id_param) >= 10 THEN
      new_badges := new_badges || '["block_messenger"]'::jsonb;
    END IF;
  END IF;

  -- Curator badge (5+ claimed)
  IF NOT new_badges ? 'curator' THEN
    IF (SELECT events_claimed_by_organizers FROM public.spotter_stats WHERE user_id = user_id_param) >= 5 THEN
      new_badges := new_badges || '["curator"]'::jsonb;
    END IF;
  END IF;

  -- Legend badge (100+ score)
  IF NOT new_badges ? 'legend' THEN
    IF new_score >= 100 THEN
      new_badges := new_badges || '["legend"]'::jsonb;
    END IF;
  END IF;

  -- Update badges if changed
  UPDATE public.spotter_stats
  SET badges = new_badges
  WHERE user_id = user_id_param;
END;
$$;

-- ============================================
-- Function: Get Leaderboard
-- ============================================

CREATE OR REPLACE FUNCTION public.get_spotter_leaderboard(
  limit_param int DEFAULT 10
)
RETURNS TABLE (
  user_id uuid,
  handle text,
  events_spotted int,
  events_claimed_by_organizers int,
  spot_score int,
  badges jsonb,
  rank bigint
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    s.user_id,
    p.handle,
    s.events_spotted,
    s.events_claimed_by_organizers,
    s.spot_score,
    s.badges,
    ROW_NUMBER() OVER (ORDER BY s.spot_score DESC) as rank
  FROM public.spotter_stats s
  JOIN public.profiles p ON s.user_id = p.id
  ORDER BY s.spot_score DESC
  LIMIT limit_param;
$$;

-- ============================================
-- Function: Get User's Spotter Stats
-- ============================================

CREATE OR REPLACE FUNCTION public.get_my_spotter_stats()
RETURNS TABLE (
  user_id uuid,
  events_spotted int,
  events_claimed_by_organizers int,
  rsvps_on_spotted_events int,
  spot_score int,
  badges jsonb,
  rank bigint
)
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT 
    s.user_id,
    s.events_spotted,
    s.events_claimed_by_organizers,
    s.rsvps_on_spotted_events,
    s.spot_score,
    s.badges,
    (
      SELECT COUNT(*) + 1
      FROM public.spotter_stats ss
      WHERE ss.spot_score > s.spot_score
    ) as rank
  FROM public.spotter_stats s
  WHERE s.user_id = current_user_id;
END;
$$;

-- ============================================
-- Trigger: Award Points on RSVP to Spotted Event
-- ============================================

CREATE OR REPLACE FUNCTION public.award_rsvp_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_spotter_id uuid;
BEGIN
  -- Get the spotter of the event being RSVP'd
  SELECT spotter_id INTO event_spotter_id
  FROM public.events
  WHERE id = NEW.event_id
    AND source_type = 'flyer_spotted';

  -- Award points to spotter if event was spotted
  IF event_spotter_id IS NOT NULL THEN
    PERFORM public.update_spotter_stats(event_spotter_id, 'rsvp_on_spotted', 2);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_rsvp_award_spotter_points
  AFTER INSERT ON public.event_rsvps
  FOR EACH ROW
  EXECUTE PROCEDURE public.award_rsvp_points();

-- ============================================
-- Function: Create Spotted Event
-- ============================================

CREATE OR REPLACE FUNCTION public.create_spotted_event(
  title_param text,
  category_param text,
  starts_at_param timestamptz,
  ends_at_param timestamptz,
  lat_param float8,
  lng_param float8,
  flyer_photo_url_param text,
  confidence_level_param text DEFAULT 'high',
  needs_confirmation_param jsonb DEFAULT '[]'::jsonb,
  location_name_param text DEFAULT null,
  address_param text DEFAULT null,
  ai_parsed_param boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  event_id uuid;
  recent_spotted_count int;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Rate limiting: max 3 spotted events per hour per user
  SELECT count(*) INTO recent_spotted_count
  FROM public.events
  WHERE spotter_id = user_id 
    AND source_type = 'flyer_spotted'
    AND created_at > now() - interval '1 hour';

  IF recent_spotted_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 3 spotted events per hour.';
  END IF;

  -- Create event
  INSERT INTO public.events (
    creator, 
    spotter_id,
    title, 
    category, 
    starts_at, 
    ends_at, 
    location, 
    source_type,
    flyer_photo_url,
    confidence_level,
    needs_confirmation,
    location_name,
    address,
    ai_parsed
  ) VALUES (
    NULL,  -- No creator for spotted events
    user_id,  -- Spotter is current user
    title_param,
    category_param,
    starts_at_param,
    ends_at_param,
    ST_SetSRID(ST_MakePoint(lng_param, lat_param), 4326)::geography,
    'flyer_spotted',
    flyer_photo_url_param,
    confidence_level_param,
    needs_confirmation_param,
    location_name_param,
    address_param,
    ai_parsed_param
  ) RETURNING id INTO event_id;

  -- Award points to spotter (+10 for spotting)
  PERFORM public.update_spotter_stats(user_id, 'event_spotted', 10);

  RETURN event_id;
END;
$$;

-- ============================================
-- Grant necessary permissions
-- ============================================

GRANT EXECUTE ON FUNCTION public.claim_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_spotter_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_spotter_leaderboard TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_spotter_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_spotted_event TO authenticated;

