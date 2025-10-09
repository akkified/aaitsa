-- Create about_page_content table for dynamic about page editing
CREATE TABLE IF NOT EXISTS public.about_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on about_page_content
ALTER TABLE public.about_page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for about_page_content
CREATE POLICY "about_page_content_select_public" ON public.about_page_content 
  FOR SELECT USING (is_active = true);

CREATE POLICY "about_page_content_all_admin" ON public.about_page_content 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

-- Insert default content
INSERT INTO public.about_page_content (section_key, title, content, order_index) VALUES
('hero', 'Welcome to Alliance Academy TSA', 'Empowering students through technology, innovation, and leadership in the Technology Student Association', 1),
('about', 'About Our Chapter', 'The Alliance Academy TSA chapter is dedicated to fostering innovation, creativity, and technical excellence among our students. We participate in competitive events, collaborate on projects, and develop skills that prepare us for future careers in STEM fields. Our chapter competes at regional, state, and national levels in various technology competitions, from coding and engineering to digital design and leadership challenges.', 2),
('leadership', 'Leadership Team', 'Meet our dedicated chapter leadership team who guide and support our students.', 3),
('advisor', 'Dr. Bryan Fagan', 'Chapter Advisor', 4),
('president', 'Sean Track', 'President', 5),
('vice_president', 'Shreyas Yeldandi', 'Vice President', 6),
('contact', 'Get in Touch', 'Have questions about joining TSA or participating in competitions? Contact our chapter advisors.', 7),
('contact_email', 'tsa@alliance.forsyth.k12.ga.us', 'tsa@alliance.forsyth.k12.ga.us', 8)
ON CONFLICT (section_key) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_about_page_content_order ON public.about_page_content(order_index);
CREATE INDEX IF NOT EXISTS idx_about_page_content_active ON public.about_page_content(is_active);
