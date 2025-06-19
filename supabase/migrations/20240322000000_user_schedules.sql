-- Create user_schedules table
create table if not exists public.user_schedules (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  days text[] not null,
  start_time text not null, -- format: "12:00 PM"
  end_time text not null, -- format: "6:00 PM"
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Set up Row Level Security (RLS)
alter table public.user_schedules enable row level security;

-- Create policies
create policy "Users can view their own schedules"
  on public.user_schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert their own schedules"
  on public.user_schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own schedules"
  on public.user_schedules for update
  using (auth.uid() = user_id);

-- Create function to handle updated_at
create or replace function public.handle_schedule_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_schedule_updated_at
  before update on public.user_schedules
  for each row
  execute procedure public.handle_schedule_updated_at();

-- Create indexes for better performance
create index if not exists idx_user_schedules_user_id 
  on public.user_schedules(user_id); 