-- Create migration_logs table if it doesn't exist
create table if not exists public.migration_logs (
  id uuid default uuid_generate_v4() primary key,
  migration_name text not null,
  detail text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add comment
comment on table public.migration_logs is 'Tracks details about migration operations'; 