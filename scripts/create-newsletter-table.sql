-- Newsletter Subscribers Table for AAI TSA
-- Run this in Supabase SQL Editor

create table if not exists public.newsletter_subscribers (
    id uuid default gen_random_uuid() primary key,
    email text not null unique,
    name text,
    status text not null default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
    source text default 'website',
    subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unsubscribed_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    confirmation_token text,
    metadata jsonb default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.newsletter_subscribers enable row level security;

-- Policy: Only admins/officers/teachers can view all subscribers
create policy "Admins can view all subscribers"
    on public.newsletter_subscribers for select
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role in ('admin', 'officer', 'teacher')
        )
    );

-- Policy: Anyone can subscribe (insert)
create policy "Anyone can subscribe to newsletter"
    on public.newsletter_subscribers for insert
    with check (true);

-- Policy: Users can unsubscribe themselves (update own record)
create policy "Users can unsubscribe themselves"
    on public.newsletter_subscribers for update
    using (email = (select email from auth.users where id = auth.uid()))
    with check (status = 'unsubscribed');

-- Policy: Admins can update any subscriber
create policy "Admins can update subscribers"
    on public.newsletter_subscribers for update
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role in ('admin', 'officer', 'teacher')
        )
    );

-- Policy: Admins can delete subscribers
create policy "Admins can delete subscribers"
    on public.newsletter_subscribers for delete
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role in ('admin', 'officer', 'teacher')
        )
    );

-- Indexes for performance
create index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers(email);
create index if not exists newsletter_subscribers_status_idx on public.newsletter_subscribers(status);
create index if not exists newsletter_subscribers_created_at_idx on public.newsletter_subscribers(created_at desc);
create index if not exists newsletter_subscribers_source_idx on public.newsletter_subscribers(source);

-- Trigger to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end $$;

drop trigger if exists newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_updated_at
    before update on public.newsletter_subscribers
    for each row execute function public.handle_updated_at();

-- Function to get active subscriber count (for admin dashboard stats)
create or replace function public.get_active_subscriber_count()
returns bigint language sql stable as $$
    select count(*) from public.newsletter_subscribers where status = 'active';
$$;

-- Function to get recent subscribers (last 30 days)
create or replace function public.get_recent_subscribers(days int default 30)
returns setof public.newsletter_subscribers language sql stable as $$
    select * from public.newsletter_subscribers
    where status = 'active'
    and created_at >= timezone('utc'::text, now()) - interval '1 day' * days
    order by created_at desc;
$$;