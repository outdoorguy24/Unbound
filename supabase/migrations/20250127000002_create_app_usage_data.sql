-- Create app_usage_data table
create table if not exists public.app_usage_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  bundle_identifier text not null,
  display_name text not null,
  weekly_usage_minutes integer not null,
  icon_name text,
  tracking_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, bundle_identifier, tracking_date)
);

-- Set up Row Level Security (RLS)
alter table public.app_usage_data enable row level security;

-- Policies for app_usage_data
create policy "Users can view their own app usage data"
  on public.app_usage_data for select
  using (auth.uid() = user_id);

create policy "Users can insert their own app usage data"
  on public.app_usage_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own app usage data"
  on public.app_usage_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create RPC function to get most used apps for a user
create or replace function public.get_most_used_apps(user_id uuid, limit_count integer default 5)
returns table (
  bundle_identifier text,
  display_name text,
  weekly_usage_minutes integer,
  icon_name text,
  tracking_date date
) as $$
begin
  return query
  select 
    aud.bundle_identifier,
    aud.display_name,
    aud.weekly_usage_minutes,
    aud.icon_name,
    aud.tracking_date
  from public.app_usage_data aud
  where aud.user_id = get_most_used_apps.user_id
    and aud.tracking_date = (
      select max(tracking_date) 
      from public.app_usage_data 
      where user_id = get_most_used_apps.user_id
    )
  order by aud.weekly_usage_minutes desc
  limit limit_count;
end;
$$ language plpgsql;

-- Create RPC function to store app usage data
create or replace function public.store_app_usage_data(
  user_id uuid,
  apps_data jsonb
)
returns void as $$
declare
  app_item jsonb;
begin
  -- Clear existing data for today
  delete from public.app_usage_data 
  where app_usage_data.user_id = store_app_usage_data.user_id 
    and tracking_date = current_date;
  
  -- Insert new data
  for app_item in select * from jsonb_array_elements(apps_data)
  loop
    insert into public.app_usage_data (
      user_id,
      bundle_identifier,
      display_name,
      weekly_usage_minutes,
      icon_name,
      tracking_date
    ) values (
      store_app_usage_data.user_id,
      app_item->>'bundleIdentifier',
      app_item->>'displayName',
      (app_item->>'weeklyUsageMinutes')::integer,
      app_item->>'iconName',
      current_date
    );
  end loop;
end;
$$ language plpgsql;
