import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { isAdminEmail } from "@/lib/admin";
import type { User } from "@supabase/supabase-js";

export type UserType = "admin" | "cliente" | null;

interface AuthState {
  isLoggedIn: boolean;
  email: string | null;
  userType: UserType;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

function resolveUserType(email: string | null | undefined): UserType {
  if (!email) return null;
  return isAdminEmail(email) ? "admin" : "cliente";
}

let authInitialized = false;

export const useAuth = create<AuthState>((set) => ({
  isLoggedIn: false,
  email: null,
  userType: null,
  user: null,
  loading: true,
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    set({
      isLoggedIn: true,
      email: data.user?.email ?? null,
      userType: resolveUserType(data.user?.email),
      user: data.user,
    });
    return { success: true };
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ isLoggedIn: false, email: null, userType: null, user: null });
  },
  initialize: async () => {
    // Idempotente: viene invocata all'avvio dell'app, ma una seconda chiamata
    // non deve registrare un secondo listener.
    if (authInitialized) return;
    authInitialized = true;

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        isLoggedIn: !!session?.user,
        email: session?.user?.email ?? null,
        userType: resolveUserType(session?.user?.email),
        user: session?.user ?? null,
        loading: false,
      });
    });

    const { data: { session } } = await supabase.auth.getSession();
    set({
      isLoggedIn: !!session?.user,
      email: session?.user?.email ?? null,
      userType: resolveUserType(session?.user?.email),
      user: session?.user ?? null,
      loading: false,
    });
  },
}));
