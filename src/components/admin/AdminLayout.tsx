import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  HeadphonesIcon,
  ArrowLeft,
  Shield,
} from "lucide-react";

const adminNav = [
  { label: "Panoramica", href: "/admin", icon: LayoutDashboard },
  { label: "Utenti", href: "/admin/users", icon: Users },
  { label: "Messaggi", href: "/admin/messages", icon: MessageSquare },
  { label: "Ticket", href: "/admin/tickets", icon: HeadphonesIcon },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { email } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdminEmail(email)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-white">
        <p>Accesso negato</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-49px)] bg-[#0a0e1a]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[220px] flex-col border-r border-white/10 bg-[#0d1222]">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
          <Shield className="h-5 w-5 text-slate-300" />
          <span className="text-sm font-semibold text-white tracking-wide">ADMIN PANEL</span>
        </div>

        <nav className="flex-1 py-3">
          {adminNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-slate-200 border-r-2 border-slate-300"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors w-full px-2 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna al CRM
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between border-b border-white/10 bg-[#0d1222] px-3 py-2">
          <button onClick={() => navigate("/")} className="text-white/50 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-semibold text-white">ADMIN</span>
          </div>
          <div className="w-5" />
        </div>

        {/* Mobile nav tabs */}
        <div className="md:hidden flex overflow-x-auto border-b border-white/10 bg-[#0d1222]">
          {adminNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-slate-300 text-slate-200"
                    : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Page header */}
        <div className="border-b border-white/10 bg-[#0d1222]/50 px-4 md:px-6 py-4">
          <h1 className="text-lg md:text-xl font-bold text-white">{title}</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
