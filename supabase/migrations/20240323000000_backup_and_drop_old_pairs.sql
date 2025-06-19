-- Create a backup table
create table if not exists public.accountability_pairs_backup (
  user_id uuid,
  partner_id uuid,
  backed_up_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Copy existing data to backup
insert into public.accountability_pairs_backup (user_id, partner_id)
select user_id, partner_id
from public.accountability_pairs;

-- Store the count for verification
do $$
declare
  pair_count integer;
begin
  select count(*) into pair_count from public.accountability_pairs;
  insert into public.migration_logs (migration_name, detail)
  values (
    '20240323000000_backup_and_drop_old_pairs',
    format('Backed up %s accountability pairs', pair_count)
  );
end $$;

-- Drop the existing table
drop table if exists public.accountability_pairs; 