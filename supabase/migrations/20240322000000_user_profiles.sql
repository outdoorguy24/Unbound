-- Create user_profiles table
create table if not exists public.user_profiles (
  user_id uuid references auth.users on delete cascade,
  first_name text not null,
  city text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id)
);

-- Create accountability_pairs table (referenced in partnerMatching.ts)
create table if not exists public.accountability_pairs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  partner_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, partner_id)
);

-- Create trail_logs table (referenced in the update_streak function)
create table if not exists public.trail_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  log_date date default current_date,
  activity_type text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.accountability_pairs enable row level security;
alter table public.trail_logs enable row level security;

-- Create policies for user_profiles
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);

-- Create policies for accountability_pairs
create policy "Users can view their own accountability pairs"
  on public.accountability_pairs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own accountability pairs"
  on public.accountability_pairs for insert
  with check (auth.uid() = user_id);

-- Create policies for trail_logs
create policy "Users can view their own trail logs"
  on public.trail_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trail logs"
  on public.trail_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trail logs"
  on public.trail_logs for update
  using (auth.uid() = user_id);

-- Create function to handle updated_at for user_profiles
create trigger handle_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute procedure public.handle_updated_at();

-- Create indexes for better performance
create index if not exists idx_user_profiles_user_id 
  on public.user_profiles(user_id);

create index if not exists idx_accountability_pairs_user_id 
  on public.accountability_pairs(user_id);

create index if not exists idx_accountability_pairs_partner_id 
  on public.accountability_pairs(partner_id);

create index if not exists idx_trail_logs_user_date 
  on public.trail_logs(user_id, log_date);
