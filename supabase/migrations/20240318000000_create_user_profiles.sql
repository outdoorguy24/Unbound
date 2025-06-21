-- Create user_profiles table
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  city text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add comment to table
comment on table public.user_profiles is 'Stores public-facing profile information for users.';

-- Set up Row Level Security (RLS)
alter table public.user_profiles enable row level security;

-- Create policies for user_profiles
create policy "Users can view all profiles"
  on public.user_profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create function to handle updated_at
create or replace function public.handle_user_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute procedure public.handle_user_profiles_updated_at(); 