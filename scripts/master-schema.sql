-- ============================================================
-- MASTER SCHEMA - Run this ONE FILE in Supabase SQL Editor
-- Drops everything clean, then creates all tables + policies
-- ============================================================

-- ============================================================
-- STEP 1: DROP ALL EXISTING POLICIES & TRIGGERS (safe if missing)
-- ============================================================

-- Profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;

-- Submissions
DROP POLICY IF EXISTS "submissions_select_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_select_admin" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update_admin" ON public.submissions;

-- Whitelist
DROP POLICY IF EXISTS "whitelist_manage_admin" ON public.whitelist_emails;
DROP POLICY IF EXISTS "whitelist_select_authenticated" ON public.whitelist_emails;

-- Gallery
DROP POLICY IF EXISTS "Public gallery images are viewable by everyone" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON public.gallery_images;

-- Newsletter
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can unsubscribe themselves" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.newsletter_subscribers;

-- Resources
DROP POLICY IF EXISTS "Public resources are viewable by everyone" ON public.resources;
DROP POLICY IF EXISTS "Authenticated users can view all resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can insert resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can update resources" ON public.resources;
DROP POLICY IF EXISTS "Admins can delete resources" ON public.resources;

-- Documents (legacy)
DROP POLICY IF EXISTS "Users can submit documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can update documents" ON public.documents;

-- Submission comments
DROP POLICY IF EXISTS "submission_comments_select_own_submission" ON public.submission_comments;
DROP POLICY IF EXISTS "submission_comments_insert_own_submission" ON public.submission_comments;
DROP POLICY IF EXISTS "submission_comments_update_own" ON public.submission_comments;
DROP POLICY IF EXISTS "submission_comments_delete_own" ON public.submission_comments;

-- About page
DROP POLICY IF EXISTS "about_page_content_select_public" ON public.about_page_content;
DROP POLICY IF EXISTS "about_page_content_all_admin" ON public.about_page_content;

-- Triggers
DROP TRIGGER IF EXISTS newsletter_subscribers_updated_at ON public.newsletter_subscribers;
DROP TRIGGER IF EXISTS resources_updated_at ON public.resources;
DROP TRIGGER IF EXISTS gallery_images_updated_at ON public.gallery_images;
DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON public.gallery_images;
DROP TRIGGER IF EXISTS resources_updated_at ON public.resources;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================================
-- STEP 2: DROP TABLES (in dependency order - children first)
-- ============================================================

DROP TABLE IF EXISTS public.submission_comments CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.gallery_images CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS public.whitelist_emails CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.about_page_content CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================
-- STEP 3: CREATE TABLES (in dependency order - parents first)
-- ============================================================

-- ---- PROFILES ----
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'officer', 'admin')),
    school_year TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ---- WHITELIST_EMAILS ----
CREATE TABLE public.whitelist_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    added_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.whitelist_emails ENABLE ROW LEVEL SECURITY;

-- ---- SUBMISSIONS ----
CREATE TABLE public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    file_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    feedback TEXT,
    submission_group TEXT,
    check_in_date DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- ---- GALLERY_IMAGES ----
CREATE TABLE public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    image_url TEXT NOT NULL,
    image_filename TEXT NOT NULL,
    image_size BIGINT NOT NULL,
    image_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- ---- RESOURCES ----
CREATE TABLE public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_name TEXT,
    event_date DATE,
    is_public BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- ---- NEWSLETTER_SUBSCRIBERS ----
CREATE TABLE public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'website',
    subscribed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    unsubscribed_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    confirmation_token TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ---- DOCUMENTS (legacy) ----
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    submitted_by UUID REFERENCES auth.users(id),
    submitted_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending',
    category VARCHAR(100) DEFAULT 'general'
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- ---- ABOUT_PAGE_CONTENT ----
CREATE TABLE public.about_page_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_page_content ENABLE ROW LEVEL SECURITY;

-- ---- SUBMISSION_COMMENTS ----
CREATE TABLE public.submission_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.submission_comments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 4: INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_featured ON public.gallery_images(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_is_public ON public.resources(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON public.newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_submission_comments_submission_id ON public.submission_comments(submission_id);

-- ============================================================
-- STEP 5: RLS POLICIES
-- ============================================================

-- ---- PROFILES ----
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

-- ---- WHITELIST_EMAILS ----
CREATE POLICY "whitelist_manage_admin" ON public.whitelist_emails
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer')
        )
    );

CREATE POLICY "whitelist_select_authenticated" ON public.whitelist_emails
    FOR SELECT USING (auth.role() = 'authenticated');

-- ---- SUBMISSIONS ----
CREATE POLICY "submissions_select_own" ON public.submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "submissions_insert_own" ON public.submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "submissions_update_own" ON public.submissions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "submissions_select_admin" ON public.submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "submissions_update_admin" ON public.submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

-- ---- GALLERY_IMAGES ----
CREATE POLICY "gallery_public_read" ON public.gallery_images
    FOR SELECT USING (TRUE);

CREATE POLICY "gallery_insert_admin" ON public.gallery_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "gallery_update_admin" ON public.gallery_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "gallery_delete_admin" ON public.gallery_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

-- ---- RESOURCES ----
CREATE POLICY "resources_public_read" ON public.resources
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY "resources_auth_read" ON public.resources
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "resources_insert_admin" ON public.resources
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "resources_update_admin" ON public.resources
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "resources_delete_admin" ON public.resources
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

-- ---- NEWSLETTER_SUBSCRIBERS ----
CREATE POLICY "newsletter_admin_read" ON public.newsletter_subscribers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "newsletter_public_subscribe" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "newsletter_user_unsubscribe" ON public.newsletter_subscribers
    FOR UPDATE USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    WITH CHECK (status = 'unsubscribed');

CREATE POLICY "newsletter_admin_update" ON public.newsletter_subscribers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "newsletter_admin_delete" ON public.newsletter_subscribers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

-- ---- DOCUMENTS (legacy) ----
CREATE POLICY "documents_user_submit" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "documents_user_view" ON public.documents
    FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "documents_admin_view" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "documents_admin_update" ON public.documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

-- ---- ABOUT_PAGE_CONTENT ----
CREATE POLICY "about_content_public_read" ON public.about_page_content
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "about_content_admin_all" ON public.about_page_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer')
        )
    );

-- ---- SUBMISSION_COMMENTS ----
CREATE POLICY "comments_select_own" ON public.submission_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.submissions
            WHERE id = submission_id AND user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "comments_insert_own" ON public.submission_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.submissions
            WHERE id = submission_id AND user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
        )
    );

CREATE POLICY "comments_update_own" ON public.submission_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_own" ON public.submission_comments
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STEP 6: TRIGGERS (auto-update updated_at)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS submissions_updated_at ON public.submissions;
CREATE TRIGGER submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS gallery_images_updated_at ON public.gallery_images;
CREATE TRIGGER gallery_images_updated_at
    BEFORE UPDATE ON public.gallery_images
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS resources_updated_at ON public.resources;
CREATE TRIGGER resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS newsletter_subscribers_updated_at ON public.newsletter_subscribers;
CREATE TRIGGER newsletter_subscribers_updated_at
    BEFORE UPDATE ON public.newsletter_subscribers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS documents_updated_at ON public.documents;
CREATE TRIGGER documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS about_page_content_updated_at ON public.about_page_content;
CREATE TRIGGER about_page_content_updated_at
    BEFORE UPDATE ON public.about_page_content
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- STEP 7: AUTH TRIGGER (auto-create profile on signup)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    admin_emails TEXT[] := ARRAY[
        'advisor@aaitsa.org', 'president@aaitsa.org', 'vp@aaitsa.org',
        'secondvp@aaitsa.org', 'secretary@aaitsa.org', 'treasurer@aaitsa.org',
        'sergeant@aaitsa.org', 'reporter@aaitsa.org', 'mechvp@aaitsa.org', 'csvp@aaitsa.org'
    ];
BEGIN
    INSERT INTO public.profiles (id, email, full_name, school_year, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'school_year', ''),
        CASE WHEN NEW.email = ANY(admin_emails) THEN 'admin' ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'student') END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- DONE - All tables, policies, triggers created
-- ============================================================