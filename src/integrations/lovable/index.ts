// OAuth helper.
//
// Nel progetto Lovable questo modulo usava "@lovable.dev/cloud-auth-js" per
// gestire il login social. Fuori da Lovable usiamo direttamente l'OAuth nativo
// di Supabase, mantenendo la stessa identica API pubblica (`lovable.auth.signInWithOAuth`)
// per non modificare i chiamanti.
import { supabase } from "../supabase/client";

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: "google" | "apple", opts?: SignInOptions) => {
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
    },
  },
};
