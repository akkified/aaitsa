-- Create whitelist_emails table
CREATE TABLE IF NOT EXISTS public.whitelist_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.whitelist_emails ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage whitelist
CREATE POLICY "whitelist_manage_admin" ON public.whitelist_emails 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

-- Allow public (or at least authenticated) to check if an email is whitelisted? 
-- Actually, for signup, we might need a service role or a specific function.
-- But for a simple check in a server component/action, we can just query it.
-- Let's allow select for authenticated users if we want to check on the client, 
-- but better to keep it restricted and use a server-side check.

CREATE POLICY "whitelist_select_admin" ON public.whitelist_emails 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );
