
CREATE TABLE public.billing_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'privato' CHECK (tipo IN ('privato', 'societa')),
  -- Privato fields
  nome text,
  cognome text,
  codice_fiscale text,
  -- Società fields
  ragione_sociale text,
  partita_iva text,
  codice_sdi text,
  pec text,
  -- Shared fields
  indirizzo text,
  cap text,
  citta text,
  provincia text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.billing_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing profile"
ON public.billing_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own billing profile"
ON public.billing_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing profile"
ON public.billing_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);
