-- Create migration_logs table
create table if not exists public.migration_logs (
  id serial primary key,
  migration_name varchar(255) not null,
  detail text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add comment to table
comment on table public.migration_logs is 'A log of data migrations and other significant schema changes.'; 