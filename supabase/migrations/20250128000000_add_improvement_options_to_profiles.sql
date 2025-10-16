-- Add improvement_options column to user_profiles to store Screen 7 selections
alter table public.user_profiles
  add column if not exists improvement_options jsonb;

-- Add comment to the new column for clarity
comment on column public.user_profiles.improvement_options is 'Stores user improvement options from Screen 7 of onboarding (e.g., ["fitness", "learn", "outdoor"]).';
