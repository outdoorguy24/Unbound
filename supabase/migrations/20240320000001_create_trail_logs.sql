-- Create trail_logs table
create table if not exists public.trail_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  action varchar(255) not null,
  numeric_value integer,
  text_description text,
  app_or_site varchar(255),
  metadata jsonb,
  partner_visibility boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add comment to table
comment on table public.trail_logs is 'An audit trail of significant user actions.';

-- Set up Row Level Security (RLS)
alter table public.trail_logs enable row level security;

-- Create policies for trail_logs
create policy "Users can view their own trail logs"
  on public.trail_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trail logs"
  on public.trail_logs for insert
  with check (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_trail_logs_user_id 
  on public.trail_logs(user_id);

create index if not exists idx_trail_logs_action
  on public.trail_logs(action);

create index if not exists idx_trail_logs_created_at
  on public.trail_logs(created_at); 