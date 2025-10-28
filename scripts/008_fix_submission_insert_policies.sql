-- Fix submission INSERT policies to prevent admin override issues
-- This ensures users can insert their own submissions properly

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "submissions_insert_own" ON public.submissions;

-- Recreate the insert policy using SECURITY DEFINER function to avoid recursion
CREATE POLICY "submissions_insert_own" ON public.submissions 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id
  );

-- Also ensure admins can insert on behalf of others (if needed in the future)
-- For now, we keep it simple - users can only insert their own submissions
-- and admins can still insert via the admin panel if needed through their own user_id

COMMENT ON POLICY "submissions_insert_own" ON public.submissions IS 'Users can insert their own submissions by matching auth.uid() with user_id';

