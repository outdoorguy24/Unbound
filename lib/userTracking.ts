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

// Get partner data including profile and streak
export async function getPartnerData(userId: string) {
  try {
    // Get partner ID by checking both columns
    const { data: pairData, error: pairError } = await supabase
      .from('accountability_pairs')
      .select('user_id, partner_id')
      .or(`user_id.eq.${userId},partner_id.eq.${userId}`)
      .single();
    
    if (pairError || !pairData) {
      return null;
    }

    // Determine which ID is the partner's
    const partnerId = pairData.user_id === userId ? pairData.partner_id : pairData.user_id;

    // Get partner profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('first_name, city')
      .eq('user_id', partnerId)
      .single();

    if (profileError) {
      console.error('Error fetching partner profile:', profileError);
      return null;
    }

    // Get partner streak
    const { data: streakData, error: streakError } = await supabase
      .from('streaks')
      .select('current_streak')
      .eq('id', partnerId)
      .single();

    if (streakError && streakError.code !== 'PGRST116') {
      console.error('Error fetching partner streak:', streakError);
    }

    return {
      id: partnerId,
      name: profileData.first_name,
      city: profileData.city,
      streakDays: streakData?.current_streak || 0,
    };
  } catch (error) {
    console.error('Error getting partner data:', error);
    return null;
  }
}

// Get community statistics
export async function getCommunityStats() {
  try {
    // Get total users with profiles
    const { count: totalUsers, error: usersError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.error('Error fetching total users:', usersError);
      return { totalUsers: 1000, totalTimeSaved: 50000 };
    }

    // Get total time saved this week across all users
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const { data: timeData, error: timeError } = await supabase
      .from('blocked_sessions')
      .select('duration_minutes')
      .gte('start_time', startOfWeek.toISOString())
      .lte('start_time', now.toISOString())
      .not('duration_minutes', 'is', null);

    if (timeError) {
      console.error('Error fetching total time saved:', timeError);
      return { totalUsers: totalUsers || 1000, totalTimeSaved: 50000 };
    }

    const totalTimeSaved = timeData?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) || 0;

    return {
      totalUsers: totalUsers || 1000,
      totalTimeSaved,
    };
  } catch (error) {
    console.error('Error getting community stats:', error);
    return { totalUsers: 1000, totalTimeSaved: 50000 };
  }
}

// User schedule functions
export async function getUserSchedule(userId: string) {
  const { data, error } = await supabase
    .from('user_schedules')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function saveUserSchedule(userId: string, schedule: {
  days: string[];
  start_time: string;
  end_time: string;
}) {
  const { data, error } = await supabase
    .from('user_schedules')
    .upsert({
      user_id: userId,
      days: schedule.days,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      is_active: true,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserSchedule(userId: string, schedule: {
  days: string[];
  start_time: string;
  end_time: string;
}) {
  const { data, error } = await supabase
    .from('user_schedules')
    .update({
      days: schedule.days,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deactivateUserSchedule(userId: string) {
  const { error } = await supabase
    .from('user_schedules')
    .update({ is_active: false })
    .eq('user_id', userId);
  
  if (error) throw error;
} 