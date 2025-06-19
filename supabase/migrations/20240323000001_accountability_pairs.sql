-- Create accountability_pairs table
create table if not exists public.accountability_pairs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  partner_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, partner_id)
);

-- Set up Row Level Security (RLS)
alter table public.accountability_pairs enable row level security;

-- Create policies
create policy "Users can view their own accountability pairs"
  on public.accountability_pairs for select
  using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Users can insert their own accountability pairs"
  on public.accountability_pairs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own accountability pairs"
  on public.accountability_pairs for delete
  using (auth.uid() = user_id);

-- Create function to handle updated_at
create or replace function public.handle_accountability_pairs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_accountability_pairs_updated_at
  before update on public.accountability_pairs
  for each row
  execute procedure public.handle_accountability_pairs_updated_at();

-- Create indexes for better performance
create index if not exists idx_accountability_pairs_user_id 
  on public.accountability_pairs(user_id);

create index if not exists idx_accountability_pairs_partner_id 
  on public.accountability_pairs(partner_id);

-- Add comment to table
comment on table public.accountability_pairs is 'Stores accountability partner pairings between users'; 