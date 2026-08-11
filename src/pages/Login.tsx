import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, LogIn, UserPlus, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { signInWithOAuth } from "@/lib/oauth";
import loriLogo from "@/assets/lori_logo.svg";

const loginSchema = z.object({
  email: z.string().trim().email("L'email inserita non è valida"),
  password: z.string().min(1, "Inserisci una password"),
});

const registerSchema = z.object({
  email: z.string().trim().email("L'email inserita non è valida"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
  confirmPassword: z.string().min(1, "Conferma la password"),
  nome: z.string().trim().min(1, "Inserisci il tuo nome").max(50),
  cognome: z.string().trim().min(1, "Inserisci il tuo cognome").max(50),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

const Login = () => {
  const [sending, setSending] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", nome: "", cognome: "" },
  });

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setSending(true);
    const result = await login(values.email, values.password);
    if (result.success) {
      toast.success("Accesso effettuato con successo");
      navigate("/");
    } else {
      toast.error(result.error || "Credenziali non valide");
    }
    setSending(false);
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    setSending(true);
    const displayName = `${values.nome} ${values.cognome}`.trim();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registrazione completata! Accesso in corso...");
      // Auto-confirm is enabled, so we can log in immediately
      const loginResult = await login(values.email, values.password);
      if (loginResult.success) {
        navigate("/");
      }
    }
    setSending(false);
  }

  async function handleGoogleSignIn() {
    setSending(true);
    const { error } = await signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error("Errore durante l'accesso con Google");
      console.error(error);
    }
    setSending(false);
  }

  return (
    <div className={`flex min-h-[calc(100vh-57px)] flex-col items-center justify-center ${isMobile ? "px-4" : ""}`}>
      <img src={loriLogo} alt="LORI" className={`mb-4 w-auto mix-blend-multiply ${isMobile ? "h-12" : "h-16"}`} />
      <h1 className={`mb-1 font-bold uppercase tracking-wide ${isMobile ? "text-xl" : "text-2xl"}`} style={{ color: "#0a2e5c" }}>
        {isRegister ? "Registrati a LORI" : "Benvenuto in LORI"}
      </h1>
      <h2 className="mb-6 text-sm uppercase tracking-wide" style={{ color: "#0a2e5c99" }}>
        {isRegister ? "Crea il tuo account gratuito" : "Accedi per visualizzare i dati"}
      </h2>

      <Card className={`w-full p-6 ${isMobile ? "max-w-sm" : "max-w-md"}`}>
        {/* Google Sign-in */}
        <Button
          variant="outline"
          className="w-full min-h-[44px] gap-2 mb-4"
          onClick={handleGoogleSignIn}
          disabled={sending}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isRegister ? "Registrati con Google" : "Accedi con Google"}
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">oppure</span>
          <Separator className="flex-1" />
        </div>

        {!isRegister ? (
          /* Login Form */
          <Form {...loginForm} key="login-form">
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="La tua email" autoComplete="email" {...field} className="min-h-[44px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" autoComplete="current-password" {...field} className="min-h-[44px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full min-h-[44px]" disabled={sending}>
                {sending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Accesso in corso</>
                ) : (
                  <><LogIn className="mr-2 h-4 w-4" />Accedi</>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          /* Register Form */
          <Form {...registerForm} key="register-form">
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={registerForm.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Mario" {...field} className="min-h-[44px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="cognome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cognome</FormLabel>
                      <FormControl>
                        <Input placeholder="Rossi" {...field} className="min-h-[44px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="La tua email" {...field} className="min-h-[44px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Minimo 6 caratteri" {...field} className="min-h-[44px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conferma Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Ripeti la password" {...field} className="min-h-[44px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full min-h-[44px]" disabled={sending}>
                {sending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrazione in corso</>
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4" />Registrati</>
                )}
              </Button>
            </form>
          </Form>
        )}

        {/* Toggle Login/Register */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              loginForm.reset();
              registerForm.reset();
            }}
            className="text-sm text-primary hover:underline transition-colors"
          >
            {isRegister
              ? "Hai già un account? Accedi"
              : "Non hai un account? Registrati gratis"}
          </button>
        </div>

        {/* Accesso all'area riservata. Visibile a tutti: l'autorizzazione vera
            e' lato server (ruolo admin in user_roles), non in questo link. */}
        <div className="mt-6 border-t border-border pt-4 text-center">
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Shield className="h-3.5 w-3.5" />
            Pannello Admin
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Login;
