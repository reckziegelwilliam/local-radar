/// <reference types="../types.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Calculate cutoff time: 6 hours after event end time
    const cutoffTime = new Date()
    cutoffTime.setHours(cutoffTime.getHours() - 6)
    const cutoffISO = cutoffTime.toISOString()

    console.log(`Cleaning up events that ended before: ${cutoffISO}`)

    // First, delete associated RSVPs for expired events
    const { error: rsvpDeleteError } = await supabase
      .from('event_rsvps')
      .delete()
      .in(
        'event_id',
        supabase
          .from('events')
          .select('id')
          .lt('ends_at', cutoffISO)
      )

    if (rsvpDeleteError) {
      console.error('Error deleting RSVPs:', rsvpDeleteError)
    } else {
      console.log('Successfully deleted RSVPs for expired events')
    }

    // Delete associated reports for expired events
    const { error: reportsDeleteError } = await supabase
      .from('event_reports')
      .delete()
      .in(
        'event_id',
        supabase
          .from('events')
          .select('id')
          .lt('ends_at', cutoffISO)
      )

    if (reportsDeleteError) {
      console.error('Error deleting reports:', reportsDeleteError)
    } else {
      console.log('Successfully deleted reports for expired events')
    }

    // Finally, delete the expired events themselves
    const { data: deletedEvents, error: eventsDeleteError } = await supabase
      .from('events')
      .delete()
      .lt('ends_at', cutoffISO)
      .select('id, title')

    if (eventsDeleteError) {
      console.error('Error deleting expired events:', eventsDeleteError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete expired events',
          details: eventsDeleteError.message 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    const deletedCount = deletedEvents?.length || 0
    console.log(`Successfully deleted ${deletedCount} expired events`)

    // Optional: Clean up orphaned photos from storage
    // This would require additional logic to check which photos are no longer referenced

    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted_count: deletedCount,
        cutoff_time: cutoffISO,
        message: `Cleaned up ${deletedCount} expired events`
      }),
      { 
        headers: { 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in cleanup function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})
