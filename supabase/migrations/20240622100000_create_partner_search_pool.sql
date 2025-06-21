-- Create partner_search_pool table
create table if not exists public.partner_search_pool (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add comment to table
comment on table public.partner_search_pool is 'Users actively searching for an accountability partner.';

-- Set up Row Level Security (RLS)
alter table public.partner_search_pool enable row level security;

-- Create policies for partner_search_pool
create policy "Users can see the pool"
  on public.partner_search_pool for select
  using (true);

create policy "Users can add themselves to the pool"
  on public.partner_search_pool for insert
  with check (auth.uid() = user_id);

create policy "Users can remove themselves from the pool"
  on public.partner_search_pool for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_partner_search_pool_user_id 
  on public.partner_search_pool(user_id);

create index if not exists idx_partner_search_pool_created_at
  on public.partner_search_pool(created_at); 