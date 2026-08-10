
-- Add image_url column to operatori
ALTER TABLE public.operatori ADD COLUMN image_url text DEFAULT NULL;

-- Create storage bucket for operator avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('operatori-avatars', 'operatori-avatars', true);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users upload own avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'operatori-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own files
CREATE POLICY "Users update own avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'operatori-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users delete own avatars"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'operatori-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'operatori-avatars');
