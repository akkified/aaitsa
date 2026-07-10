-- Gallery Images Table for AAI TSA
-- Run this in Supabase SQL Editor

create table if not exists public.gallery_images (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    category text not null default 'General',
    image_url text not null,
    image_filename text not null,
    image_size bigint not null,
    image_type text not null,
    uploaded_by uuid references auth.users(id) not null,
    event_date date,
    display_order integer default 0,
    is_featured boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.gallery_images enable row level security;

-- Policy: Anyone can view gallery images (public gallery)
create policy "Public gallery images are viewable by everyone"
    on public.gallery_images for select
    using (true);

-- Policy: Only authenticated users can insert (will be restricted to admins in app logic)
create policy "Authenticated users can upload gallery images"
    on public.gallery_images for insert
    with check (auth.role() = 'authenticated');

-- Policy: Only admins/officers/teachers can update/delete
create policy "Admins can update gallery images"
    on public.gallery_images for update
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role in ('admin', 'officer', 'teacher')
        )
    );

create policy "Admins can delete gallery images"
    on public.gallery_images for delete
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role in ('admin', 'officer', 'teacher')
        )
    );

-- Indexes for performance
create index if not exists gallery_images_category_idx on public.gallery_images(category);
create index if not exists gallery_images_created_at_idx on public.gallery_images(created_at desc);
create index if not exists gallery_images_display_order_idx on public.gallery_images(display_order);
create index if not exists gallery_images_featured_idx on public.gallery_images(is_featured) where is_featured = true;

-- Trigger to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end $$;

drop trigger if exists gallery_images_updated_at on public.gallery_images;
create trigger gallery_images_updated_at
    before update on public.gallery_images
    for each row execute function public.handle_updated_at();