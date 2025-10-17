-- Add baseline_screen_time_minutes column to phone_usage_tracking table
alter table public.phone_usage_tracking
  add column if not exists baseline_screen_time_minutes integer;

-- Add comment to the new column
comment on column public.phone_usage_tracking.baseline_screen_time_minutes is 'Stores the baseline screen time minutes for comparison purposes';
