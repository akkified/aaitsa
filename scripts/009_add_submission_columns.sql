-- Add missing columns to submissions table
-- This adds check_in_date and submission_group columns if they don't exist

ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS submission_group TEXT;

ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS check_in_date DATE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_submission_group ON public.submissions(submission_group);
CREATE INDEX IF NOT EXISTS idx_submissions_check_in_date ON public.submissions(check_in_date);

-- Comment the columns for documentation
COMMENT ON COLUMN public.submissions.submission_group IS 'Optional group name for related submissions';
COMMENT ON COLUMN public.submissions.check_in_date IS 'Optional check-in date for submissions';

