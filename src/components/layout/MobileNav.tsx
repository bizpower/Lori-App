import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, UserCog, ListChecks, Contact, Tag, LogOut, LayoutDashboard, HeadphonesIcon, Crown, Settings, Play } from "lucide-react";
import loriLogo from "@/assets/lori_logo.svg";
import TicketModal from "@/components/TicketModal";

const mainNav = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Operatori", href: "/clienti", icon: UserCog },
  { label: "Liste", href: "/batch", icon: ListChecks },
  { label: "Lead", href: "/trattative", icon: Contact },
  { label: "Etichette", href: "/impostazioni", icon: Tag },
];

const accountNav = [
  { label: "Il mio account", href: "/account", icon: Settings },
  { label: "Piano abbonamento", href: "/pricing", icon: Crown },
  { label: "Tutorial", href: "/tutorial", icon: Play },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const { userType, email, logout } = useAuth();
  const location = useLocation();

  const items = mainNav;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
          <div className="flex items-center border-b border-border px-4 py-3">
            <img src={loriLogo} alt="LORI" className="h-8 w-auto" />
          </div>

          <nav className="flex-1 overflow-y-auto py-2">
            {items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors min-h-[48px] ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent/50"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}

            {/* Account section */}
            <div className="border-t border-border mt-2 pt-2">
              {accountNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors min-h-[48px] ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setOpen(false);
                  setTicketOpen(true);
                }}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors min-h-[48px] w-full text-left text-primary hover:bg-accent/50"
              >
                <HeadphonesIcon className="h-5 w-5 shrink-0" />
                Apri Ticket Assistenza
              </button>
            </div>
          </nav>

          <div className="border-t border-border p-4">
            {email && (
              <p className="text-xs text-muted-foreground mb-3 truncate">{email}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full min-h-[44px]"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Esci
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <TicketModal open={ticketOpen} onOpenChange={setTicketOpen} />
    </>
  );
};

export default MobileNav;
