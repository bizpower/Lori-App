
-- Fix etichette_tabelle policies to check ownership through etichette
DROP POLICY "Insert etichette_tabelle" ON public.etichette_tabelle;
DROP POLICY "Delete etichette_tabelle" ON public.etichette_tabelle;
CREATE POLICY "Insert etichette_tabelle" ON public.etichette_tabelle FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.etichette WHERE id = etichetta_id AND user_id = auth.uid()));
CREATE POLICY "Delete etichette_tabelle" ON public.etichette_tabelle FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.etichette WHERE id = etichetta_id AND user_id = auth.uid()));
