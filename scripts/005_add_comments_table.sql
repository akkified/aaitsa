-- Create comments table for submission discussions
CREATE TABLE IF NOT EXISTS public.submission_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on submission_comments
ALTER TABLE public.submission_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for submission_comments
CREATE POLICY "submission_comments_select_own_submission" ON public.submission_comments 
  FOR SELECT USING (
    -- Users can see comments on their own submissions
    EXISTS (
      SELECT 1 FROM public.submissions 
      WHERE id = submission_id AND user_id = auth.uid()
    )
    OR
    -- Admins, officers, and teachers can see all comments
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
    )
  );

CREATE POLICY "submission_comments_insert_own_submission" ON public.submission_comments 
  FOR INSERT WITH CHECK (
    -- Users can comment on their own submissions
    EXISTS (
      SELECT 1 FROM public.submissions 
      WHERE id = submission_id AND user_id = auth.uid()
    )
    OR
    -- Admins, officers, and teachers can comment on any submission
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'officer', 'teacher')
    )
  );

CREATE POLICY "submission_comments_update_own" ON public.submission_comments 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "submission_comments_delete_own" ON public.submission_comments 
  FOR DELETE USING (auth.uid() = user_id);

-- Add submission group/check-in tracking
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS submission_group TEXT,
ADD COLUMN IF NOT EXISTS check_in_date DATE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_submission_comments_submission_id ON public.submission_comments(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_comments_created_at ON public.submission_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_submission_group ON public.submissions(submission_group);
