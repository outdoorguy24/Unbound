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
    console.log('Delete account function called')
    
    // Create Supabase client with service role key for admin access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get the user from the JWT
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: userError } = await authClient.auth.getUser()
    if (userError || !user) {
      console.error('User error:', userError)
      throw new Error('Unauthorized')
    }

    console.log(`Starting account deletion for user: ${user.id}`)

    // Delete user data from all tables in the correct order
    // (child tables first, then parent tables)
    
    // 1. Delete from accountability_pairs (both as user and partner)
    const { error: pairsError } = await supabaseClient
      .from('accountability_pairs')
      .delete()
      .or(`user_id.eq.${user.id},partner_id.eq.${user.id}`)

    if (pairsError) {
      console.error('Error deleting accountability pairs:', pairsError)
      throw pairsError
    }

    // 2. Delete from partner_search_pool
    const { error: poolError } = await supabaseClient
      .from('partner_search_pool')
      .delete()
      .eq('user_id', user.id)

    if (poolError) {
      console.error('Error deleting from search pool:', poolError)
      throw poolError
    }

    // 3. Delete from user_responses
    const { error: responsesError } = await supabaseClient
      .from('user_responses')
      .delete()
      .eq('user_id', user.id)

    if (responsesError) {
      console.error('Error deleting user responses:', responsesError)
      throw responsesError
    }

    // 4. Delete from user_schedules
    const { error: schedulesError } = await supabaseClient
      .from('user_schedules')
      .delete()
      .eq('user_id', user.id)

    if (schedulesError) {
      console.error('Error deleting user schedules:', schedulesError)
      throw schedulesError
    }

    // 5. Delete from user_tracking
    const { error: trackingError } = await supabaseClient
      .from('user_tracking')
      .delete()
      .eq('user_id', user.id)

    if (trackingError) {
      console.error('Error deleting user tracking:', trackingError)
      throw trackingError
    }

    // 6. Delete from porn_blocking_sessions
    const { error: pornError } = await supabaseClient
      .from('porn_blocking_sessions')
      .delete()
      .eq('user_id', user.id)

    if (pornError) {
      console.error('Error deleting porn blocking sessions:', pornError)
      throw pornError
    }

    // 7. Delete from messages (both sent and received)
    const { error: messagesError } = await supabaseClient
      .from('messages')
      .delete()
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

    if (messagesError) {
      console.error('Error deleting messages:', messagesError)
      throw messagesError
    }

    // 8. Delete from subscriptions
    const { error: subscriptionsError } = await supabaseClient
      .from('subscriptions')
      .delete()
      .eq('id', user.id)

    if (subscriptionsError) {
      console.error('Error deleting subscriptions:', subscriptionsError)
      throw subscriptionsError
    }

    // 9. Delete from customers
    const { error: customersError } = await supabaseClient
      .from('customers')
      .delete()
      .eq('id', user.id)

    if (customersError) {
      console.error('Error deleting customers:', customersError)
      throw customersError
    }

    // 10. Delete from user_profiles
    const { error: profilesError } = await supabaseClient
      .from('user_profiles')
      .delete()
      .eq('user_id', user.id)

    if (profilesError) {
      console.error('Error deleting user profiles:', profilesError)
      throw profilesError
    }

    // 11. Finally, delete the auth user
    const { error: authError } = await supabaseClient.auth.admin.deleteUser(user.id)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      throw authError
    }

    console.log(`Successfully deleted account for user: ${user.id}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account successfully deleted' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Account deletion error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
