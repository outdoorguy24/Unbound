import { supabase } from './supabaseClient';

export interface CommunityStats {
  totalUsers: number;
  totalTimeSaved: number;
  weeklyHours: number;
  completedBlocks: number;
  goalHitRate: number;
}

export async function getCommunityStats(): Promise<CommunityStats> {
  try {
    // Get current week date range
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Fetch all community data in parallel
    const [
      { count: totalUsers, error: usersError },
      { data: allSessions, error: allSessionsError },
      { data: weeklySessions, error: weeklySessionsError },
      { count: completedBlocks, error: blocksError }
    ] = await Promise.all([
      // Total users count
      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true }),
      
      // All blocked sessions for total time saved
      supabase
        .from('blocked_sessions')
        .select('duration_minutes'),
      
      // Weekly blocked sessions
      supabase
        .from('blocked_sessions')
        .select('duration_minutes')
        .gte('created_at', startOfWeek.toISOString())
        .lt('created_at', endOfWeek.toISOString()),
      
      // Completed blocks count
      supabase
        .from('blocked_sessions')
        .select('*', { count: 'exact', head: true })
    ]);

    // Handle errors
    if (usersError) console.error('Error fetching total users:', usersError);
    if (allSessionsError) console.error('Error fetching all sessions:', allSessionsError);
    if (weeklySessionsError) console.error('Error fetching weekly sessions:', weeklySessionsError);
    if (blocksError) console.error('Error fetching completed blocks:', blocksError);

    // Calculate stats
    const totalUsersCount = totalUsers || 0;
    const totalTimeSaved = allSessions?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) / 60 || 0;
    const weeklyHours = weeklySessions?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) / 60 || 0;
    const completedBlocksCount = completedBlocks || 0;

    // Calculate goal hit rate (placeholder - would need user_goals table)
    const goalHitRate = calculateGoalHitRate();

    return {
      totalUsers: totalUsersCount,
      totalTimeSaved: Math.round(totalTimeSaved),
      weeklyHours: Math.round(weeklyHours),
      completedBlocks: completedBlocksCount,
      goalHitRate
    };

  } catch (error) {
    console.error('Error in getCommunityStats:', error);
    // Return default values on error
    return {
      totalUsers: 0,
      totalTimeSaved: 0,
      weeklyHours: 0,
      completedBlocks: 0,
      goalHitRate: 0
    };
  }
}

function calculateGoalHitRate(): number {
  // TODO: Implement real goal hit rate calculation when user_goals table is available
  // For now, return a placeholder value
  // This would require:
  // 1. user_goals table with daily goals
  // 2. Comparison with actual daily blocking sessions
  // 3. Percentage calculation of users who hit their goals
  
  return 80; // Placeholder - 80% goal hit rate
}
