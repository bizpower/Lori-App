-- Fix 1: Prevent users from changing their own role via profile update
-- Revoke UPDATE on the role column from authenticated users
REVOKE UPDATE (role) ON public.profiles FROM authenticated;

-- Fix 2: Restrict etichette_tabelle SELECT to only rows belonging to the user's own etichette
DROP POLICY IF EXISTS "Read etichette_tabelle" ON public.etichette_tabelle;
CREATE POLICY "Read own etichette_tabelle" ON public.etichette_tabelle
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.etichette
    WHERE etichette.id = etichette_tabelle.etichetta_id
      AND (etichette.user_id = auth.uid() OR etichette.is_default = true)
  )
);
