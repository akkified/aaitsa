-- Resources Table for AAI TSA
-- Run this in Supabase SQL Editor

create table if not exists public.resources (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    category text not null,
    file_url text not null,
    file_filename text not null,
    file_size bigint not null,
    file_type text not null,
    uploaded_by uuid references auth.users(id) on delete set null,
    event_name text,
    event_date date,
    is_public boolean default true,
    download_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.resources enable row level security;

-- Policy: Public resources viewable by everyone
create policy "Public resources are viewable by everyone"
    on public.resources for select
    using (is_public = true);

-- Policy: Authenticated users can view all resources (for admin panel)
create policy "Authenticated users can view all resources"
    on public.resources for select
    using (auth.role() = 'authenticated');

-- Policy: Admins/officers/teachers can insert resources
create policy "Admins can insert resources"
    on public.resources for insert
    with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role in ('admin', 'officer', 'teacher')
        )
    );

-- Policy: Admins/officers/teachers can update resources
create policy "Admins can update resources"
    on public.resources for update
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role in ('admin', 'officer', 'teacher')
        )
    );

-- Policy: Admins/officers/teachers can delete resources
create policy "Admins can delete resources"
    on public.resources for delete
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role in ('admin', 'officer', 'teacher')
        )
    );

-- Indexes for performance
create index if not exists resources_category_idx on public.resources(category);
create index if not exists resources_created_at_idx on public.resources(created_at desc);
create index if not exists resources_is_public_idx on public.resources(is_public) where is_public = true;
create index if not exists resources_uploaded_by_idx on public.resources(uploaded_by);
create index if not exists resources_event_date_idx on public.resources(event_date);

-- Trigger to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end $$;

drop trigger if exists resources_updated_at on public.resources;
create trigger resources_updated_at
    before update on public.resources
    for each row execute function public.handle_updated_at();

-- Suggested categories:
-- 'competition-rules', 'competition-rubrics', 'project-templates', 'guides', 'forms', 'presentations', 'other'