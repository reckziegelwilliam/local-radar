/// <reference types="../types.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateEventRequest {
  title: string;
  category: string;
  starts_at: string;
  ends_at: string;
  lat: number;
  lng: number;
  photo_url?: string;
}

// Simple profanity filter - in production, use a more comprehensive solution
const bannedWords = [
  'spam', 'scam', 'fake', 'fraud', 'hate', 'violent', 'illegal',
  // Add more words as needed
];

const suspiciousPatterns = [
  /\b(buy now|click here|urgent|limited time)\b/i,
  /\b(money back|guaranteed|free money)\b/i,
  /\b(act now|don't miss|hurry)\b/i,
  /(.)\1{4,}/g, // Repeated characters
];

function checkProfanity(text: string): { isClean: boolean; reason?: string } {
  const lowerText = text.toLowerCase().trim();

  // Check banned words
  for (const word of bannedWords) {
    if (lowerText.includes(word)) {
      return { isClean: false, reason: 'Contains inappropriate content' };
    }
  }

  // Check suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      return { isClean: false, reason: 'Content appears to be spam' };
    }
  }

  return { isClean: true };
}

function validateEventData(data: CreateEventRequest): { isValid: boolean; error?: string } {
  // Title validation
  if (!data.title || data.title.trim().length < 3 || data.title.trim().length > 80) {
    return { isValid: false, error: 'Title must be between 3 and 80 characters' };
  }

  // Profanity check
  const profanityCheck = checkProfanity(data.title);
  if (!profanityCheck.isClean) {
    return { isValid: false, error: profanityCheck.reason || 'Content not allowed' };
  }

  // Category validation
  const validCategories = ['music', 'cafe', 'yard', 'food', 'wellness', 'art', 'sports', 'other'];
  if (!validCategories.includes(data.category)) {
    return { isValid: false, error: 'Invalid category' };
  }

  // Time validation
  const startTime = new Date(data.starts_at);
  const endTime = new Date(data.ends_at);
  const now = new Date();

  if (startTime < new Date(now.getTime() - 5 * 60 * 1000)) { // 5 minutes grace period
    return { isValid: false, error: 'Event must start in the future' };
  }

  if (endTime <= startTime) {
    return { isValid: false, error: 'Event must end after it starts' };
  }

  if (endTime.getTime() - startTime.getTime() > 24 * 60 * 60 * 1000) { // Max 24 hours
    return { isValid: false, error: 'Event duration cannot exceed 24 hours' };
  }

  // Location validation
  if (data.lat < -90 || data.lat > 90 || data.lng < -180 || data.lng > 180) {
    return { isValid: false, error: 'Invalid location coordinates' };
  }

  return { isValid: true };
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const requestData: CreateEventRequest = await req.json()

    // Validate input
    const validation = validateEventData(requestData)
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting: Check user's recent events
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { data: recentEvents, error: recentEventsError } = await supabase
      .from('events')
      .select('id')
      .eq('creator', user.id)
      .gte('created_at', oneHourAgo)

    if (recentEventsError) {
      console.error('Error checking recent events:', recentEventsError)
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (recentEvents && recentEvents.length >= 5) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Maximum 5 events per hour.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create event using the RPC function
    const { data: eventId, error: createError } = await supabase.rpc('create_event', {
      title_param: requestData.title.trim(),
      category_param: requestData.category,
      starts_at_param: requestData.starts_at,
      ends_at_param: requestData.ends_at,
      lat_param: requestData.lat,
      lng_param: requestData.lng,
      photo_url_param: requestData.photo_url || null,
    })

    if (createError) {
      console.error('Error creating event:', createError)
      return new Response(
        JSON.stringify({ error: 'Failed to create event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ event_id: eventId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
