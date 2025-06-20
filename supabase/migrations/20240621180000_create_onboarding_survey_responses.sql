-- Create table for anonymous onboarding survey responses
create table if not exists public.onboarding_survey_responses (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  traps jsonb,
  scroll_times jsonb,
  concerns jsonb
);

-- No RLS is needed for this table if it's only written to from a Supabase Edge Function
-- using the service_role key. Public access should be disabled.
-- We will enable inserts for anon role as we'll use the anon key from the client.

-- Enable Row Level Security
alter table public.onboarding_survey_responses enable row level security;

-- Create policy to allow anonymous users to insert their own survey data
create policy "Allow anonymous inserts"
  on public.onboarding_survey_responses for insert
  to anon
  with check (true);

comment on table public.onboarding_survey_responses is 'Stores anonymous survey responses from the onboarding flow (screens 6, 7, 8).'; 