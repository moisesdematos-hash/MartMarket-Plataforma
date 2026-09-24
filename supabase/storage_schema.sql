-- ==========================================
-- MARTMARKET - SUPABASE STORAGE BUCKETS
-- ==========================================

-- 1. Create Public Bucket for Images (Covers, Banners, Avatars)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public_assets', 'public_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to 'public_assets'
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'public_assets');

-- Allow authenticated users to upload their own files to 'public_assets'
CREATE POLICY "Authenticated users can upload public assets" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'public_assets');

-- Allow users to update/delete their own assets
CREATE POLICY "Users can update own public assets" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'public_assets' AND auth.uid() = owner);

CREATE POLICY "Users can delete own public assets" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'public_assets' AND auth.uid() = owner);


-- 2. Create Private Bucket for Product Deliverables (Ebooks, Videos, Source Code)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product_files', 'product_files', false)
ON CONFLICT (id) DO NOTHING;

-- Creators can upload files to 'product_files'
CREATE POLICY "Creators can upload product files" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product_files');

-- Creators can manage their own product files
CREATE POLICY "Creators can update own product files" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product_files' AND auth.uid() = owner);

CREATE POLICY "Creators can delete own product files" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'product_files' AND auth.uid() = owner);

-- Buyers can read files (We allow anyone authenticated to read their authorized signed URLs)
-- Note: In Supabase, private buckets require Signed URLs to download. 
-- The backend (or Edge Function) will generate the Signed URL if the user has an Order.
CREATE POLICY "Users can read their signed product files" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'product_files');

