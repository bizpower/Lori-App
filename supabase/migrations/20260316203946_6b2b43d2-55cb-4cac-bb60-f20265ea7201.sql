
CREATE TABLE public.subscription_extensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  extension_trial_used boolean NOT NULL DEFAULT false,
  extension_trial_start_date timestamp with time zone,
  extension_trial_end_date timestamp with time zone,
  payment_method_saved boolean NOT NULL DEFAULT false,
  auto_renew_enabled boolean NOT NULL DEFAULT false,
  next_plan_after_trial text DEFAULT 'go',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.subscription_extensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own extension" ON public.subscription_extensions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own extension" ON public.subscription_extensions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own extension" ON public.subscription_extensions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
