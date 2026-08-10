-- Fix 1: Add WITH CHECK to profiles update to prevent role changes
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND role = 'user');

-- Fix 2: Replace support_tickets INSERT policy to enforce user_email
DROP POLICY IF EXISTS "Users can create tickets" ON public.support_tickets;
CREATE POLICY "Users can create tickets" ON public.support_tickets
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND (user_email IS NULL OR user_email = auth.email()));

-- Fix 3: Replace liste ALL policy to verify operatore_id ownership
DROP POLICY IF EXISTS "Users manage own liste" ON public.liste;
CREATE POLICY "Users manage own liste" ON public.liste
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.operatori
    WHERE operatori.id = liste.operatore_id
      AND operatori.user_id = auth.uid()
  )
);
