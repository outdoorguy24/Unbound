-- Create phone_usage_tracking table
create table if not exists public.phone_usage_tracking (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  tracking_date date not null,
  total_screen_time_minutes integer not null,
  social_media_minutes integer default 0,
  entertainment_minutes integer default 0,
  productivity_minutes integer default 0,
  other_minutes integer default 0,
  is_baseline boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, tracking_date)
);

-- Set up Row Level Security (RLS)
alter table public.phone_usage_tracking enable row level security;

-- Create policies
create policy "Users can view their own phone usage data"
  on public.phone_usage_tracking for select
  using (auth.uid() = user_id);

create policy "Users can insert their own phone usage data"
  on public.phone_usage_tracking for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own phone usage data"
  on public.phone_usage_tracking for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create index for better performance
create index if not exists idx_phone_usage_tracking_user_date 
  on public.phone_usage_tracking(user_id, tracking_date);

create index if not exists idx_phone_usage_tracking_baseline 
  on public.phone_usage_tracking(user_id, is_baseline);

-- Create function to get baseline phone usage
create or replace function public.get_baseline_phone_usage(user_id uuid)
returns integer as $$
begin
  return (
    select total_screen_time_minutes
    from public.phone_usage_tracking
    where phone_usage_tracking.user_id = get_baseline_phone_usage.user_id
      and is_baseline = true
    limit 1
  );
end;
$$ language plpgsql;

-- Create function to get latest phone usage
create or replace function public.get_latest_phone_usage(user_id uuid)
returns integer as $$
begin
  return (
    select total_screen_time_minutes
    from public.phone_usage_tracking
    where phone_usage_tracking.user_id = get_latest_phone_usage.user_id
      and is_baseline = false
    order by tracking_date desc
    limit 1
  );
end;
$$ language plpgsql;

-- Create function to calculate phone usage reduction percentage
create or replace function public.get_phone_usage_reduction_percentage(user_id uuid)
returns numeric as $$
declare
  baseline_minutes integer;
  latest_minutes integer;
  reduction_percentage numeric;
begin
  -- Get baseline usage
  select get_baseline_phone_usage(user_id) into baseline_minutes;
  
  -- Get latest usage
  select get_latest_phone_usage(user_id) into latest_minutes;
  
  -- If no baseline or latest data, return 0
  if baseline_minutes is null or latest_minutes is null then
    return 0;
  end if;
  
  -- Calculate reduction percentage
  reduction_percentage := ((baseline_minutes - latest_minutes)::numeric / baseline_minutes::numeric) * 100;
  
  -- Return 0 if there's no reduction (negative percentage)
  return greatest(reduction_percentage, 0);
end;
$$ language plpgsql;
