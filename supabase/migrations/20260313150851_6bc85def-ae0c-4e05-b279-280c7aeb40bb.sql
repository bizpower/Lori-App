
-- Operatori table
CREATE TABLE public.operatori (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  email text NOT NULL,
  ruolo text NOT NULL DEFAULT 'commerciale',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.operatori ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own operatori" ON public.operatori FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tabelle (static reference)
CREATE TABLE public.tabelle (
  id text PRIMARY KEY,
  nome text NOT NULL
);
ALTER TABLE public.tabelle ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tabelle" ON public.tabelle FOR SELECT TO authenticated USING (true);
INSERT INTO public.tabelle (id, nome) VALUES ('t1','Connessioni'),('t2','Retargeting'),('t3','Follow up'),('t4','Trattative');

-- Etichette table
CREATE TABLE public.etichette (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  colore text NOT NULL DEFAULT '#3b82f6',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.etichette ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own + default etichette" ON public.etichette FOR SELECT TO authenticated USING (is_default = true OR auth.uid() = user_id);
CREATE POLICY "Users insert own etichette" ON public.etichette FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own etichette" ON public.etichette FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own etichette" ON public.etichette FOR DELETE TO authenticated USING (auth.uid() = user_id AND is_default = false);

-- Etichette-Tabelle join
CREATE TABLE public.etichette_tabelle (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  etichetta_id uuid NOT NULL REFERENCES public.etichette(id) ON DELETE CASCADE,
  tabella_id text NOT NULL REFERENCES public.tabelle(id) ON DELETE CASCADE,
  UNIQUE(etichetta_id, tabella_id)
);
ALTER TABLE public.etichette_tabelle ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read etichette_tabelle" ON public.etichette_tabelle FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert etichette_tabelle" ON public.etichette_tabelle FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Delete etichette_tabelle" ON public.etichette_tabelle FOR DELETE TO authenticated USING (true);

-- Seed default etichette
DO $$
DECLARE
  eid1 uuid; eid2 uuid; eid3 uuid; eid4 uuid;
BEGIN
  INSERT INTO public.etichette (user_id, nome, colore, is_default) VALUES (NULL, 'Collegamento', '#3b82f6', true) RETURNING id INTO eid1;
  INSERT INTO public.etichette (user_id, nome, colore, is_default) VALUES (NULL, 'Nessun collegamento', '#ef4444', true) RETURNING id INTO eid2;
  INSERT INTO public.etichette (user_id, nome, colore, is_default) VALUES (NULL, 'Follow Up', '#8b5cf6', true) RETURNING id INTO eid3;
  INSERT INTO public.etichette (user_id, nome, colore, is_default) VALUES (NULL, 'Trattativa', '#10b981', true) RETURNING id INTO eid4;
  INSERT INTO public.etichette_tabelle (etichetta_id, tabella_id) VALUES (eid1,'t1'),(eid2,'t1'),(eid3,'t3'),(eid4,'t4');
END $$;

-- Liste table
CREATE TABLE public.liste (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  operatore_id uuid NOT NULL REFERENCES public.operatori(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.liste ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own liste" ON public.liste FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Leads table
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lista_id uuid NOT NULL REFERENCES public.liste(id) ON DELETE CASCADE,
  nome text NOT NULL,
  azienda text NOT NULL,
  link_profilo text DEFAULT '',
  link_azienda text DEFAULT '',
  etichetta_id uuid REFERENCES public.etichette(id) ON DELETE SET NULL,
  edit_timestamp timestamptz NOT NULL DEFAULT now(),
  note_contatto text DEFAULT '',
  note_retargeting text DEFAULT '',
  messaggio_contatto text DEFAULT '',
  messaggio_retargeting text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own leads" ON public.leads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
