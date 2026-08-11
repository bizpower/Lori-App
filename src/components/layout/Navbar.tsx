import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { User2, LogOut, HeadphonesIcon, Settings, CreditCard, Crown, Shield, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "./MobileNav";
import loriLogo from "@/assets/lori_logo.svg";
import TicketModal from "@/components/TicketModal";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { useNavigate } from "react-router-dom";
import { isAdminEmail } from "@/lib/admin";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { Progress } from "@/components/ui/progress";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/clienti": "Operatori",
  "/batch": "Liste",
  "/trattative": "Lead",
  "/impostazioni": "Etichette",
  "/pricing": "Piani",
  "/account": "Account",
};

const FREE_TRIAL_DAYS = 30;

const NavbarSubscriptionBar = () => {
  const subStatus = useSubscriptionStatus();

  if (subStatus.loading || subStatus.days_left === null) return null;

  const maxDays = subStatus.extension_active ? 15 : FREE_TRIAL_DAYS;
  const pct = Math.max(0, Math.min(100, (subStatus.days_left / maxDays) * 100));

  const colorClass =
    subStatus.status_color === "blue"
      ? "[&>div]:bg-blue-500"
      : subStatus.status_color === "red"
      ? "[&>div]:bg-destructive"
      : subStatus.status_color === "yellow"
      ? "[&>div]:bg-amber-500"
      : "[&>div]:bg-primary";

  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <Progress value={pct} className={`h-2 w-24 ${colorClass}`} />
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {subStatus.days_left <= 0 ? "Scaduto" : `${subStatus.days_left}g`}
      </span>
    </div>
  );
};

const Navbar = () => {
  const { isLoggedIn, email, logout } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [ticketOpen, setTicketOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <nav className="flex items-center border-b border-border px-4 py-2">
        <Link to="/">
          <img src={loriLogo} alt="LORI" className="h-10 w-auto md:h-10 h-8" />
        </Link>
      </nav>
    );
  }

  if (isMobile) {
    const pageTitle = PAGE_TITLES[location.pathname] ||
      (location.pathname.startsWith("/batch/") ? "Dettaglio Lista" : "LORI");

    return (
      <nav className="flex flex-col border-b border-border">
        <div className="flex items-center justify-between px-2 py-1.5">
          <MobileNav />
          <span className="text-sm font-semibold text-foreground truncate mx-2">{pageTitle}</span>
          <Link to="/" className="shrink-0">
            <img src={loriLogo} alt="LORI" className="h-7 w-auto" />
          </Link>
        </div>
        <div className="px-3 pb-1.5">
          <NavbarSubscriptionBar />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="flex items-center justify-between border-b border-border px-4 py-2">
        <Link to="/">
          <img src={loriLogo} alt="LORI" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <NavbarSubscriptionBar />
          <div className="flex items-center gap-1">
          <NotificationsDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <User2 className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium text-foreground">Il mio account</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => navigate("/account")}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Impostazioni account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/pricing")}
              className="cursor-pointer"
            >
              <Crown className="mr-2 h-4 w-4" />
              Piano di abbonamento
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/tutorial")}
              className="cursor-pointer"
            >
              <Play className="mr-2 h-4 w-4" />
              Tutorial
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/account")}
              className="cursor-pointer"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Fatturazione
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setTicketOpen(true)}
              className="cursor-pointer"
            >
              <HeadphonesIcon className="mr-2 h-4 w-4" />
              Apri Ticket Assistenza
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {isAdminEmail(email) && (
              <>
                <DropdownMenuItem
                  onClick={() => navigate("/admin")}
                  className="cursor-pointer text-emerald-600"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Pannello Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Esci
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          </div>
        </div>
      </nav>

      <TicketModal open={ticketOpen} onOpenChange={setTicketOpen} />
    </>
  );
};

export default Navbar;
