-- Create porn_blocking_sessions table
create table if not exists public.porn_blocking_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  session_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, session_date)
);

-- Set up Row Level Security (RLS)
alter table public.porn_blocking_sessions enable row level security;

-- Create policies
create policy "Users can view their own porn blocking sessions"
  on public.porn_blocking_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own porn blocking sessions"
  on public.porn_blocking_sessions for insert
  with check (auth.uid() = user_id);

-- Create index for better performance
create index if not exists idx_porn_blocking_sessions_user_date 
  on public.porn_blocking_sessions(user_id, session_date);

-- Create function to get total days without porn
create or replace function public.get_days_without_porn(user_id uuid)
returns integer as $$
begin
  return (
    select count(distinct session_date)
    from public.porn_blocking_sessions
    where porn_blocking_sessions.user_id = get_days_without_porn.user_id
  );
end;
$$ language plpgsql;
