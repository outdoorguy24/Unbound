-- Add columns to user_profiles to store onboarding responses
alter table public.user_profiles
  add column if not exists onboarding_traps jsonb,
  add column if not exists onboarding_scroll_times jsonb,
  add column if not exists onboarding_concerns jsonb;

-- Add comments to the new columns for clarity
comment on column public.user_profiles.onboarding_traps is 'Stores user responses from Screen 6 of onboarding (e.g., ["social", "porn"]).';
comment on column public.user_profiles.onboarding_scroll_times is 'Stores user responses from Screen 7 of onboarding (e.g., ["morning", "evening"]).';
comment on column public.user_profiles.onboarding_concerns is 'Stores user responses from Screen 8 of onboarding (e.g., ["Brain feels fried...", "Wasting my life"]).'; 