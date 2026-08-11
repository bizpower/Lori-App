import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Camera } from "lucide-react";
import { toast } from "sonner";

function getInitials(nome: string): string {
  return nome
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Generate a consistent color from name
function nameToColor(nome: string): string {
  const colors = [
    "hsl(210, 70%, 50%)", "hsl(340, 65%, 50%)", "hsl(160, 60%, 40%)",
    "hsl(45, 80%, 45%)", "hsl(270, 55%, 50%)", "hsl(15, 70%, 50%)",
    "hsl(190, 65%, 45%)", "hsl(300, 50%, 45%)",
  ];
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface OperatoreAvatarProps {
  nome: string;
  imageUrl?: string | null;
  operatoreId?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onImageUpdated?: (url: string) => void;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export default function OperatoreAvatar({
  nome,
  imageUrl,
  operatoreId,
  size = "md",
  editable = false,
  onImageUpdated,
}: OperatoreAvatarProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !operatoreId) return;

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${operatoreId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("operatori-avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Errore nel caricamento dell'immagine");
      return;
    }

    const { data } = supabase.storage.from("operatori-avatars").getPublicUrl(path);
    const publicUrl = data.publicUrl + `?t=${Date.now()}`;

    await supabase
      .from("operatori")
      .update({ image_url: publicUrl })
      .eq("id", operatoreId);

    onImageUpdated?.(publicUrl);
    toast.success("Immagine aggiornata");
  };

  const cls = sizeClasses[size];

  return (
    <div className="relative group">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={nome}
          className={`${cls} rounded-full object-cover border border-border`}
        />
      ) : (
        <div
          className={`${cls} rounded-full flex items-center justify-center font-semibold text-white select-none`}
          style={{ backgroundColor: nameToColor(nome) }}
        >
          {getInitials(nome)}
        </div>
      )}

      {editable && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Camera className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </>
      )}
    </div>
  );
}
