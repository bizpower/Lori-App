
-- 1. etichette_tabelle UPDATE policy
CREATE POLICY "Update etichette_tabelle" ON public.etichette_tabelle
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.etichette WHERE etichette.id = etichette_tabelle.etichetta_id AND etichette.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.etichette WHERE etichette.id = etichette_tabelle.etichetta_id AND etichette.user_id = auth.uid()));

-- 2. profiles INSERT policy (prevent role escalation via insert). handle_new_user is SECURITY DEFINER so trigger still works.
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'user');

-- 3. subscription_extensions: remove user write access; only service_role writes via edge function
DROP POLICY IF EXISTS "Users can insert their own extension" ON public.subscription_extensions;
DROP POLICY IF EXISTS "Users can update their own extension" ON public.subscription_extensions;

-- 4. Storage: drop broad public SELECT on avatars bucket to prevent listing
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;

-- 5. Revoke EXECUTE on SECURITY DEFINER trigger function from anon/authenticated/public
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
