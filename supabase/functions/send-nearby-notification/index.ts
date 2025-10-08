/// <reference types="../types.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface PushMessage {
  to: string;
  sound: string;
  title: string;
  body: string;
  data?: any;
}

interface SendNotificationRequest {
  event_id: string;
  event_title: string;
  event_category: string;
  event_lat: number;
  event_lng: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendPushNotifications(messages: PushMessage[]): Promise<void> {
  if (messages.length === 0) return;

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('Push notifications sent:', result);
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
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

    const { event_id, event_title, event_category, event_lat, event_lng }: SendNotificationRequest = await req.json()

    if (!event_id || !event_title || !event_lat || !event_lng) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find users within 3km of the event who have push tokens
    const { data: nearbyUsers, error: usersError } = await supabase
      .rpc('get_nearby_users_with_push_tokens', {
        event_lat,
        event_lng,
        radius_m: 3000, // 3km radius for notifications
      })

    if (usersError) {
      console.error('Error finding nearby users:', usersError)
      return new Response(
        JSON.stringify({ error: 'Failed to find nearby users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!nearbyUsers || nearbyUsers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No nearby users to notify', notified_count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create push messages
    const categoryEmojis: { [key: string]: string } = {
      music: '🎵',
      cafe: '☕',
      yard: '🛍️',
      food: '🍔',
      wellness: '🧘',
      art: '🎨',
      sports: '🏀',
      other: '📍',
    }

    const emoji = categoryEmojis[event_category] || '📍'
    const pushMessages: PushMessage[] = nearbyUsers
      .filter((user: any) => user.push_token) // Extra safety check
      .map((user: any) => ({
        to: user.push_token,
        sound: 'default',
        title: `${emoji} Something's happening nearby!`,
        body: event_title,
        data: {
          type: 'nearby_event',
          event_id,
          event_title,
          event_category,
        },
      }))

    // Send notifications in batches of 100 (Expo's limit)
    const batchSize = 100
    for (let i = 0; i < pushMessages.length; i += batchSize) {
      const batch = pushMessages.slice(i, i + batchSize)
      await sendPushNotifications(batch)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Notifications sent successfully',
        notified_count: pushMessages.length 
      }),
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
