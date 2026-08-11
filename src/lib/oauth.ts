// Login social tramite OAuth nativo di Supabase.
import { supabase } from "@/integrations/supabase/client";

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export async function signInWithOAuth(
  provider: "google" | "apple",
  opts?: SignInOptions,
) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: opts?.redirect_uri ?? window.location.origin,
      queryParams: opts?.extraParams,
    },
  });

  if (error) {
    return { error };
  }

  // signInWithOAuth reindirizza il browser al provider: la sessione viene
  // impostata al ritorno sul redirect URL dal client Supabase.
  return { redirected: true, url: data?.url };
}
