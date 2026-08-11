import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const NotificationsDropdown = () => {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setNotifications(data as Notification[]);
  };

  useEffect(() => {
    if (isLoggedIn) load();
  }, [isLoggedIn]);

  useEffect(() => {
    if (open && isLoggedIn) {
      // Mark all as read
      const unread = notifications.filter((n) => !n.read).map((n) => n.id);
      if (unread.length > 0) {
        supabase
          .from("notifications")
          .update({ read: true } as any)
          .in("id", unread)
          .then(() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          });
      }
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isLoggedIn) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Messaggi da LORI</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-[300px]">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nessun messaggio</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`px-3 py-2.5 border-b border-border last:border-0 ${!n.read ? "bg-accent/50" : ""}`}
              >
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  {format(new Date(n.created_at), "dd MMM yyyy, HH:mm", { locale: it })}
                </p>
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
