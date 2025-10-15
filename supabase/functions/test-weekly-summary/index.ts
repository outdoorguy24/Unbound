import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get all users who have opted in to weekly summaries and have push tokens
    const { data: users, error: usersError } = await supabaseClient
      .from('user_profiles')
      .select('user_id, push_token, first_name')
      .not('push_token', 'is', null)
      .eq('notification_preferences->weekly_summary', true)

    if (usersError) {
      throw usersError
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No users to notify' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Send push notifications to each user
    const notificationPromises = users.map(async (user) => {
      const message = {
        to: user.push_token,
        sound: 'default',
        title: 'Weekly Summary',
        body: 'Your weekly stats and quote are ready for you on Unbound.',
        data: { 
          screen: 'weekly-summary',
          type: 'weekly_summary'
        },
      }

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })

      return response.ok
    })

    const results = await Promise.allSettled(notificationPromises)
    const successful = results.filter(result => result.status === 'fulfilled' && result.value).length
    const failed = results.length - successful

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Test notifications sent to ${successful} users`,
        details: {
          total: users.length,
          successful,
          failed
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
}) 