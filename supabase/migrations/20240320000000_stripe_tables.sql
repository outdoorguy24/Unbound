-- Create customers table
create table if not exists public.customers (
  id uuid references auth.users on delete cascade,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid references auth.users on delete cascade,
  stripe_subscription_id text,
  status text,
  price_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;

-- Create policies
create policy "Users can view their own customer data"
  on public.customers for select
  using (auth.uid() = id);

create policy "Users can view their own subscription data"
  on public.subscriptions for select
  using (auth.uid() = id);

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at
  before update on public.customers
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.subscriptions
  for each row
  execute procedure public.handle_updated_at(); 