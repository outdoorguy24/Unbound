drop table if exists public.messages cascade;

create table
  public.messages (
    id uuid not null default gen_random_uuid (),
    sender_id uuid not null,
    receiver_id uuid not null,
    message_text text not null,
    created_at timestamp with time zone not null default now(),
    constraint messages_pkey primary key (id),
    constraint messages_receiver_id_fkey foreign key (receiver_id) references auth.users (id) on update cascade on delete cascade,
    constraint messages_sender_id_fkey foreign key (sender_id) references auth.users (id) on update cascade on delete cascade
  );

alter table public.messages enable row level security;

create policy "Users can view their own messages" on public.messages for
select
  using (
    auth.uid () = sender_id
    or auth.uid () = receiver_id
  );

create policy "Users can insert their own messages" on public.messages for
insert
  with check (auth.uid () = sender_id);
