import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/hooks/useAdminApi";
import { Users, HeadphonesIcon, TrendingUp, Gift, UserPlus, CalendarDays } from "lucide-react";

interface Stats {
  total_users: number;
  recent_signups_7d: number;
  monthly_signups_30d: number;
  open_tickets: number;
  total_tickets: number;
  custom_access_grants: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`rounded-xl border border-white/10 bg-[#111827] p-5 transition-all ${
      onClick ? "cursor-pointer hover:border-white/25 hover:bg-[#1a2332] active:scale-[0.98]" : ""
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-sm text-white/50">{label}</span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi("stats")
      .then((d) => setStats(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Panoramica">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[120px] rounded-xl border border-white/10 bg-[#111827] animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Utenti totali" value={stats.total_users} color="bg-blue-600" onClick={() => navigate("/admin/users")} />
          <StatCard icon={UserPlus} label="Registrazioni (7g)" value={stats.recent_signups_7d} color="bg-slate-500" onClick={() => navigate("/admin/users")} />
          <StatCard icon={CalendarDays} label="Registrazioni (30g)" value={stats.monthly_signups_30d} color="bg-violet-600" onClick={() => navigate("/admin/users")} />
          <StatCard icon={HeadphonesIcon} label="Ticket aperti" value={stats.open_tickets} color="bg-orange-600" onClick={() => navigate("/admin/tickets")} />
          <StatCard icon={TrendingUp} label="Ticket totali" value={stats.total_tickets} color="bg-cyan-600" onClick={() => navigate("/admin/tickets")} />
          <StatCard icon={Gift} label="Accessi regalati" value={stats.custom_access_grants} color="bg-pink-600" onClick={() => navigate("/admin/users")} />
        </div>
      ) : (
        <p className="text-white/50">Errore nel caricamento delle statistiche</p>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
