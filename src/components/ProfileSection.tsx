import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ProfileSection = () => {
  const { email, user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle();
      setDisplayName(data?.display_name || user.user_metadata?.display_name || "");
      setLoading(false);
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!user || !displayName.trim()) {
      toast.error("Inserisci il tuo nome");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Errore nel salvataggio");
    } else {
      // Also update user metadata
      await supabase.auth.updateUser({ data: { display_name: displayName.trim() } });
      toast.success("Profilo aggiornato");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground">Nome e Cognome</label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Mario Rossi"
          className="mt-1 min-h-[44px]"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Email</label>
        <div className="flex items-center gap-2 mt-1">
          <Input value={email || ""} disabled className="min-h-[44px] flex-1" />
          <Badge variant="outline" className="shrink-0">
            <Mail className="h-3 w-3 mr-1" />
            Verificata
          </Badge>
        </div>
      </div>
      <Button className="min-h-[44px]" onClick={saveProfile} disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Salva modifiche
      </Button>
    </div>
  );
};

export default ProfileSection;
