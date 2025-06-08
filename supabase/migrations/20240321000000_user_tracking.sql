-- Create streaks table
create table if not exists public.streaks (
  id uuid references auth.users on delete cascade,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  total_time_saved_minutes integer default 0,
  last_milestone_reached integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create blocked_sessions table
create table if not exists public.blocked_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  duration_minutes integer,
  apps_blocked text[],
  sites_blocked text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references auth.users on delete cascade,
  receiver_id uuid references auth.users on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create milestones table
create table if not exists public.milestones (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  milestone_type text not null,
  milestone_value integer not null,
  achieved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create function to update streak
create or replace function public.update_streak()
returns trigger as $$
declare
  last_date date;
  current_date date := current_date;
begin
  -- Get the last activity date
  select last_activity_date into last_date
  from public.streaks
  where id = new.user_id;

  -- If no streak record exists, create one
  if last_date is null then
    insert into public.streaks (id, current_streak, longest_streak, last_activity_date)
    values (new.user_id, 1, 1, current_date);
    return new;
  end if;

  -- If last activity was yesterday, increment streak
  if last_date = current_date - interval '1 day' then
    update public.streaks
    set 
      current_streak = current_streak + 1,
      longest_streak = greatest(longest_streak, current_streak + 1),
      last_activity_date = current_date,
      updated_at = now()
    where id = new.user_id;
  -- If last activity was today, do nothing
  elsif last_date = current_date then
    return new;
  -- If last activity was before yesterday, reset streak
  else
    update public.streaks
    set 
      current_streak = 1,
      last_activity_date = current_date,
      updated_at = now()
    where id = new.user_id;
  end if;

  return new;
end;
$$ language plpgsql;

-- Create trigger for streak updates
create trigger update_streak_trigger
  after insert on public.trail_logs
  for each row
  execute function public.update_streak();

-- Create function to calculate total blocked time
create or replace function public.calculate_total_blocked_time(user_id uuid, start_date date, end_date date)
returns integer as $$
begin
  return (
    select coalesce(sum(duration_minutes), 0)
    from public.blocked_sessions
    where 
      blocked_sessions.user_id = calculate_total_blocked_time.user_id
      and date(start_time) >= start_date
      and date(start_time) <= end_date
  );
end;
$$ language plpgsql;

-- Create trigger for streak updates from blocked sessions
create trigger update_streak_from_session_trigger
  after insert on public.blocked_sessions
  for each row
  execute function public.update_streak();

-- Create function to update total time saved
create or replace function public.update_total_time_saved()
returns trigger as $$
begin
  update public.streaks
  set 
    total_time_saved_minutes = total_time_saved_minutes + new.duration_minutes,
    updated_at = now()
  where id = new.user_id;
  return new;
end;
$$ language plpgsql;

-- Create trigger for updating total time saved
create trigger update_total_time_saved_trigger
  after update of duration_minutes on public.blocked_sessions
  for each row
  when (new.duration_minutes is not null)
  execute function public.update_total_time_saved();

-- Set up Row Level Security (RLS)
alter table public.streaks enable row level security;
alter table public.blocked_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.milestones enable row level security;

-- Create policies
create policy "Users can view their own streaks"
  on public.streaks for select
  using (auth.uid() = id);

create policy "Users can view their own blocked sessions"
  on public.blocked_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own blocked sessions"
  on public.blocked_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can view messages they sent or received"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert messages they send"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can view their own milestones"
  on public.milestones for select
  using (auth.uid() = user_id);

create policy "Users can insert their own milestones"
  on public.milestones for insert
  with check (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_blocked_sessions_user_date 
  on public.blocked_sessions(user_id, start_time);

create index if not exists idx_messages_users 
  on public.messages(sender_id, receiver_id);

create index if not exists idx_messages_created 
  on public.messages(created_at);

create index if not exists idx_milestones_user_type 
  on public.milestones(user_id, milestone_type); 