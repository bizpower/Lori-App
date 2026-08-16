import { Component, useEffect, type ErrorInfo, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { RouteSeo } from "@/components/RouteSeo";
import { useAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import LegalFooter from "@/components/layout/LegalFooter";
import TutorialPopup from "@/components/TutorialPopup";
import CookieBanner from "@/components/CookieBanner";
import Index from "./pages/Index.tsx";
import Clienti from "./pages/Clienti.tsx";
import BatchPage from "./pages/BatchPage.tsx";
import BatchDetail from "./pages/BatchDetail.tsx";
import Trattative from "./pages/Trattative.tsx";
import Impostazioni from "./pages/Impostazioni.tsx";
import Pricing from "./pages/Pricing.tsx";
import Account from "./pages/Account.tsx";
import Tutorial from "./pages/Tutorial.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminMessages from "./pages/admin/AdminMessages.tsx";
import AdminTickets from "./pages/admin/AdminTickets.tsx";
import AdminUserDetail from "./pages/admin/AdminUserDetail.tsx";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy.tsx";
import CookiePolicy from "./pages/legal/CookiePolicy.tsx";
import TerminiServizio from "./pages/legal/TerminiServizio.tsx";
import DPA from "./pages/legal/DPA.tsx";

const queryClient = new QueryClient();

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App render crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-foreground">Si è verificato un problema</h1>
            <p className="text-sm text-muted-foreground">
              Ho attivato un ripristino di sicurezza per evitare la schermata bianca.
            </p>
            <Button className="min-h-[44px] w-full" onClick={() => window.location.reload()}>
              Ricarica la pagina
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // La sessione va caricata per qualunque rotta: prima veniva inizializzata
  // solo dalla home, quindi aprendo direttamente /admin (o ricaricando la
  // pagina) l'app restava in attesa delle credenziali all'infinito.
  const initialize = useAuth((s) => s.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="flex min-h-screen flex-col">
      <RouteSeo />
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clienti" element={<Clienti />} />
          <Route path="/batch" element={<BatchPage />} />
          <Route path="/batch/:id" element={<BatchDetail />} />
          <Route path="/trattative" element={<Trattative />} />
          <Route path="/impostazioni" element={<Impostazioni />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/account" element={<Account />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/termini-servizio" element={<TerminiServizio />} />
          <Route path="/dpa" element={<DPA />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isAdminRoute && <LegalFooter />}
      {!isAdminRoute && <TutorialPopup />}
      <CookieBanner />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppErrorBoundary>
          <AppContent />
        </AppErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
