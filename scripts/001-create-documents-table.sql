-- Create documents table for file submissions
CREATE TABLE IF NOT EXISTS documents (
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

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own documents
CREATE POLICY "Users can submit documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- Policy: Users can view their own documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = submitted_by);

-- Policy: Admins can view all documents
CREATE POLICY "Admins can view all documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%@admin.%' OR auth.users.email = 'admin@allianceacademy.org')
    )
  );

-- Policy: Admins can update document status
CREATE POLICY "Admins can update documents" ON documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%@admin.%' OR auth.users.email = 'admin@allianceacademy.org')
    )
  );
