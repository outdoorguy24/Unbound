import { supabase } from './supabaseClient';

// Streak functions
export async function getStreak(userId: string) {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || { current_streak: 0, longest_streak: 0, last_activity_date: null };
}

// Blocked sessions functions
export async function startBlockedSession(userId: string, apps: string[], sites: string[]) {
  const { data, error } = await supabase
    .from('blocked_sessions')
    .insert({
      user_id: userId,
      start_time: new Date().toISOString(),
      apps_blocked: apps,
      sites_blocked: sites,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function endBlockedSession(sessionId: string) {
  const endTime = new Date();
  const { data: session, error: fetchError } = await supabase
    .from('blocked_sessions')
    .select('start_time')
    .eq('id', sessionId)
    .single();
  
  if (fetchError) throw fetchError;
  
  const startTime = new Date(session.start_time);
  const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  
  const { data, error } = await supabase
    .from('blocked_sessions')
    .update({
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes,
    })
    .eq('id', sessionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getTotalBlockedTime(userId: string, startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .rpc('calculate_total_blocked_time', {
      user_id: userId,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });
  
  if (error) throw error;
  return data;
}

// Partner messaging functions
export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getMessages(userId: string, partnerId: string, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function markMessagesAsRead(userId: string, partnerId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('receiver_id', userId)
    .eq('sender_id', partnerId)
    .eq('read', false);
  
  if (error) throw error;
}

// Real-time subscriptions
export function subscribeToPartnerMessages(userId: string, partnerId: string, callback: (payload: any) => void) {
  return supabase
    .channel('partner-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${partnerId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToPartnerActivity(partnerId: string, callback: (payload: any) => void) {
  return supabase
    .channel('partner-activity')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blocked_sessions',
        filter: `user_id=eq.${partnerId}`,
      },
      callback
    )
    .subscribe();
} 