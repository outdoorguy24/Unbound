import { supabase } from './supabaseClient';

export interface UserStats {
  savedToday: number;
  totalSaved: number;
  daysWithoutPorn: number;
  streakDays: number;
  monthlyHours: number;
  allTimeHours: number;
  phoneUsageReduction: number;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get current month date range
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Fetch all user data in parallel
    const [
      { data: todaySessions, error: todayError },
      { data: allSessions, error: allError },
      { data: monthlySessions, error: monthlyError },
      { data: pornSessions, error: pornError },
      { data: phoneUsage, error: phoneError }
    ] = await Promise.all([
      // Today's blocked sessions
      supabase
        .from('blocked_sessions')
        .select('duration_minutes')
        .eq('user_id', userId)
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString()),
      
      // All blocked sessions
      supabase
        .from('blocked_sessions')
        .select('duration_minutes, created_at')
        .eq('user_id', userId),
      
      // Monthly blocked sessions
      supabase
        .from('blocked_sessions')
        .select('duration_minutes')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .lt('created_at', endOfMonth.toISOString()),
      
      // Porn blocking sessions
      supabase
        .from('porn_blocking_sessions')
        .select('created_at')
        .eq('user_id', userId),
      
      // Phone usage data
      supabase
        .from('phone_usage_tracking')
        .select('total_screen_time_minutes, baseline_screen_time_minutes')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
    ]);

    // Handle errors
    if (todayError) console.error('Error fetching today sessions:', todayError);
    if (allError) console.error('Error fetching all sessions:', allError);
    if (monthlyError) console.error('Error fetching monthly sessions:', monthlyError);
    if (pornError) console.error('Error fetching porn sessions:', pornError);
    if (phoneError) console.error('Error fetching phone usage:', phoneError);

    // Calculate stats
    const savedToday = todaySessions?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) / 60 || 0;
    const totalSaved = allSessions?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) / 60 || 0;
    const monthlyHours = monthlySessions?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) / 60 || 0;
    const allTimeHours = totalSaved; // Same as total saved

    // Calculate days without porn (unique days with porn blocking enabled)
    const uniquePornDays = new Set(
      pornSessions?.map(session => 
        new Date(session.created_at).toDateString()
      ) || []
    ).size;

    // Calculate streak days (consecutive days with blocking sessions)
    const streakDays = calculateStreakDays(allSessions || []);

    // Calculate phone usage reduction
    const phoneUsageReduction = calculatePhoneUsageReduction(phoneUsage?.[0]);

    return {
      savedToday: Math.round(savedToday * 10) / 10, // Round to 1 decimal
      totalSaved: Math.round(totalSaved * 10) / 10,
      daysWithoutPorn: uniquePornDays,
      streakDays,
      monthlyHours: Math.round(monthlyHours * 10) / 10,
      allTimeHours: Math.round(allTimeHours * 10) / 10,
      phoneUsageReduction: Math.round(phoneUsageReduction)
    };

  } catch (error) {
    console.error('Error in getUserStats:', error);
    // Return default values on error
    return {
      savedToday: 0,
      totalSaved: 0,
      daysWithoutPorn: 0,
      streakDays: 0,
      monthlyHours: 0,
      allTimeHours: 0,
      phoneUsageReduction: 0
    };
  }
}

function calculateStreakDays(sessions: any[]): number {
  if (!sessions || sessions.length === 0) return 0;

  // Group sessions by date
  const sessionsByDate = new Map();
  sessions.forEach(session => {
    const date = new Date(session.created_at).toDateString();
    if (!sessionsByDate.has(date)) {
      sessionsByDate.set(date, []);
    }
    sessionsByDate.get(date).push(session);
  });

  // Sort dates in descending order
  const sortedDates = Array.from(sessionsByDate.keys()).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Calculate consecutive days from today backwards
  let streak = 0;
  const today = new Date().toDateString();
  
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (currentDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculatePhoneUsageReduction(phoneData: any): number {
  if (!phoneData || !phoneData.baseline_screen_time_minutes || !phoneData.total_screen_time_minutes) {
    return 0;
  }

  const baseline = phoneData.baseline_screen_time_minutes;
  const current = phoneData.total_screen_time_minutes;
  
  if (baseline === 0) return 0;
  
  const reduction = ((baseline - current) / baseline) * 100;
  return Math.max(0, reduction); // Don't show negative reduction
}
