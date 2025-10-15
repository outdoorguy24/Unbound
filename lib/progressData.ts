import { supabase } from './supabaseClient';

export interface ProgressDataPoint {
  value: number;
  label: string;
}

export async function getWeeklyProgress(userId: string): Promise<ProgressDataPoint[]> {
  try {
    const today = new Date();
    const currentWeek = getWeekNumber(today);
    const currentYear = today.getFullYear();

    // Get the start and end of the current month
    const startOfMonth = new Date(currentYear, today.getMonth(), 1);
    const endOfMonth = new Date(currentYear, today.getMonth() + 1, 1);

    // Fetch all sessions for the current month
    const { data: sessions, error } = await supabase
      .from('blocked_sessions')
      .select('duration_minutes, created_at')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', endOfMonth.toISOString());

    if (error) {
      console.error('Error fetching weekly progress:', error);
      return getDefaultWeeklyProgress();
    }

    // Group sessions by week
    const weeklyData = new Map<number, number>();
    
    sessions?.forEach(session => {
      const sessionDate = new Date(session.created_at);
      const weekNumber = getWeekNumber(sessionDate);
      const weekInMonth = Math.ceil(sessionDate.getDate() / 7);
      
      if (!weeklyData.has(weekInMonth)) {
        weeklyData.set(weekInMonth, 0);
      }
      weeklyData.set(weekInMonth, weeklyData.get(weekInMonth)! + (session.duration_minutes || 0));
    });

    // Convert to hours and create progress data
    const progressData: ProgressDataPoint[] = [];
    for (let week = 1; week <= 4; week++) {
      const minutes = weeklyData.get(week) || 0;
      const hours = Math.round((minutes / 60) * 10) / 10; // Round to 1 decimal
      
      progressData.push({
        value: hours,
        label: `Week ${week}`
      });
    }

    return progressData;

  } catch (error) {
    console.error('Error in getWeeklyProgress:', error);
    return getDefaultWeeklyProgress();
  }
}

export async function getMonthlyProgress(userId: string): Promise<ProgressDataPoint[]> {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Get the last 4 months
    const months = [];
    for (let i = 3; i >= 0; i--) {
      const monthDate = new Date(currentYear, today.getMonth() - i, 1);
      months.push(monthDate);
    }

    // Fetch sessions for the last 4 months
    const startDate = months[0];
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const { data: sessions, error } = await supabase
      .from('blocked_sessions')
      .select('duration_minutes, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString());

    if (error) {
      console.error('Error fetching monthly progress:', error);
      return getDefaultMonthlyProgress();
    }

    // Group sessions by month
    const monthlyData = new Map<number, number>();
    
    sessions?.forEach(session => {
      const sessionDate = new Date(session.created_at);
      const monthKey = sessionDate.getMonth();
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, 0);
      }
      monthlyData.set(monthKey, monthlyData.get(monthKey)! + (session.duration_minutes || 0));
    });

    // Convert to hours and create progress data
    const progressData: ProgressDataPoint[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach(month => {
      const minutes = monthlyData.get(month.getMonth()) || 0;
      const hours = Math.round((minutes / 60) * 10) / 10; // Round to 1 decimal
      
      progressData.push({
        value: hours,
        label: `${monthNames[month.getMonth()]} ${month.getFullYear().toString().slice(-2)}`
      });
    });

    return progressData;

  } catch (error) {
    console.error('Error in getMonthlyProgress:', error);
    return getDefaultMonthlyProgress();
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getDefaultWeeklyProgress(): ProgressDataPoint[] {
  return [
    { value: 0, label: "Week 1" },
    { value: 0, label: "Week 2" },
    { value: 0, label: "Week 3" },
    { value: 0, label: "Week 4" }
  ];
}

function getDefaultMonthlyProgress(): ProgressDataPoint[] {
  const today = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return [
    { value: 0, label: `${monthNames[today.getMonth() - 3]} ${(today.getFullYear() - 1).toString().slice(-2)}` },
    { value: 0, label: `${monthNames[today.getMonth() - 2]} ${(today.getFullYear() - 1).toString().slice(-2)}` },
    { value: 0, label: `${monthNames[today.getMonth() - 1]} ${(today.getFullYear() - 1).toString().slice(-2)}` },
    { value: 0, label: `${monthNames[today.getMonth()]} ${today.getFullYear().toString().slice(-2)}` }
  ];
}
