
-- Add user_id and created_at to tabelle
ALTER TABLE public.tabelle
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- Drop existing RLS policy
DROP POLICY IF EXISTS "Anyone can read tabelle" ON public.tabelle;

-- Enable full CRUD RLS for authenticated users on their own fogli
CREATE POLICY "Users manage own fogli" ON public.tabelle
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow reading default fogli (user_id IS NULL) for backward compat
CREATE POLICY "Users read default fogli" ON public.tabelle
  FOR SELECT TO authenticated
  USING (user_id IS NULL);
