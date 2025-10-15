import * as Notifications from 'expo-notifications';
import { supabase } from './supabaseClient';

export interface SetupCompletion {
  setLocation: boolean;
  turnNotificationsOn: boolean;
  startFirstFocus: boolean;
  shareFirstMilestone: boolean;
}

/**
 * Check if user has completed all setup tasks
 */
export async function getSetupCompletion(userId: string): Promise<SetupCompletion> {
  try {
    // Check if this is a mock user (from AsyncStorage) or real Supabase user
    const isMockUser = userId && userId.length > 10; // Mock UUIDs are longer
    
    if (isMockUser) {
      // For mock users, return mock completion status
      return {
        setLocation: true, // Always true since they completed profile setup
        turnNotificationsOn: false, // Mock users typically don't have real permissions
        startFirstFocus: false, // Mock users haven't completed real blocking sessions
        shareFirstMilestone: false, // Mock users haven't submitted real responses
      };
    }

    // For real Supabase users, check actual completion status
    const [
      locationCompleted,
      notificationsEnabled,
      firstFocusCompleted,
      milestoneShared
    ] = await Promise.all([
      checkLocationSet(userId),
      checkNotificationPermissions(),
      checkFirstFocusCompleted(userId),
      checkMilestoneShared(userId)
    ]);

    return {
      setLocation: locationCompleted,
      turnNotificationsOn: notificationsEnabled,
      startFirstFocus: firstFocusCompleted,
      shareFirstMilestone: milestoneShared,
    };

  } catch (error) {
    console.error('Error checking setup completion:', error);
    // Return default values on error
    return {
      setLocation: true, // Default to true since profile setup is required
      turnNotificationsOn: false,
      startFirstFocus: false,
      shareFirstMilestone: false,
    };
  }
}

/**
 * Check if user has set their location (city) in profile setup
 */
async function checkLocationSet(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('city')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking location:', error);
      return false;
    }

    // Location is set if city is not null/empty
    return !!(data?.city && data.city.trim().length > 0);

  } catch (error) {
    console.error('Error in checkLocationSet:', error);
    return false;
  }
}

/**
 * Check if user has granted notification permissions
 */
async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
}

/**
 * Check if user has completed at least one blocking session
 */
async function checkFirstFocusCompleted(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('blocked_sessions')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      console.error('Error checking first focus:', error);
      return false;
    }

    // First focus is completed if there's at least one blocking session
    return !!(data && data.length > 0);

  } catch (error) {
    console.error('Error in checkFirstFocusCompleted:', error);
    return false;
  }
}

/**
 * Check if user has shared their first milestone (submitted at least one response)
 */
async function checkMilestoneShared(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_responses')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      console.error('Error checking milestone shared:', error);
      return false;
    }

    // Milestone is shared if there's at least one user response
    return !!(data && data.length > 0);

  } catch (error) {
    console.error('Error in checkMilestoneShared:', error);
    return false;
  }
}

/**
 * Get setup completion percentage (0-100)
 */
export function getSetupCompletionPercentage(completion: SetupCompletion): number {
  const tasks = Object.values(completion);
  const completedTasks = tasks.filter(task => task === true).length;
  return Math.round((completedTasks / tasks.length) * 100);
}

/**
 * Get remaining setup tasks
 */
export function getRemainingSetupTasks(completion: SetupCompletion): string[] {
  const remaining: string[] = [];
  
  if (!completion.turnNotificationsOn) {
    remaining.push('Turn notifications on');
  }
  if (!completion.startFirstFocus) {
    remaining.push('Start your first focus');
  }
  if (!completion.shareFirstMilestone) {
    remaining.push('Share your first milestone');
  }
  
  return remaining;
}
