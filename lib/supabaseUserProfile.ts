import { supabase } from './supabaseClient';

export async function saveUserProfile(
  userId: string,
  firstName: string,
  city: string,
  onboardingData: { traps: string[]; scrollTimes: string[]; concerns: string[] }
) {
  const { error } = await supabase.from('user_profiles').upsert({
    user_id: userId,
    first_name: firstName,
    city,
    onboarding_traps: onboardingData.traps,
    onboarding_scroll_times: onboardingData.scrollTimes,
    onboarding_concerns: onboardingData.concerns,
  });
  if (error) throw error;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('user_id, first_name, city, created_at')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
  return data || null;
} 