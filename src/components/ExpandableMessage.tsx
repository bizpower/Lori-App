import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableMessageProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  leadName?: string;
  leadAzienda?: string;
  leadLink?: string;
  showAI?: boolean;
}

export default function ExpandableMessage({
  value,
  onChange,
  placeholder = "Scrivi un messaggio...",
  leadName,
  leadAzienda,
  leadLink,
  showAI = false,
}: ExpandableMessageProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [localValue, setLocalValue] = useState(value);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value when not typing
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (val: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange(val);
      }, 600);
    },
    [onChange]
  );

  const handleLocalChange = (val: string) => {
    setLocalValue(val);
    debouncedOnChange(val);
  };

  useEffect(() => {
    if (expanded && textRef.current) {
      textRef.current.focus();
    }
  }, [expanded]);

  const handleGenerateAI = async () => {
    setLoading(true);
    setSuggestions([]);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setSuggestions(["Devi essere autenticato per usare l'AI."]);
        return;
      }
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-outreach`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            nome: leadName,
            azienda: leadAzienda,
            link_profilo: leadLink,
          }),
        }
      );
      if (!resp.ok) throw new Error("Errore AI");
      const data = await resp.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions(["Errore nella generazione. Riprova."]);
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <div
        className="flex items-center gap-1 cursor-pointer group max-w-[220px]"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(true);
        }}
      >
        <span className="truncate text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {localValue || placeholder}
        </span>
        {showAI && (
          <Sparkles className="h-3 w-3 shrink-0 text-primary/60 group-hover:text-primary" />
        )}
        <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-foreground" />
      </div>
    );
  }

  return (
    <div className="w-[320px] space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ChevronUp className="h-3 w-3" /> Chiudi
        </button>
        {showAI && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs gap-1"
            onClick={handleGenerateAI}
            disabled={loading}
          >
            <Sparkles className="h-3 w-3" />
            {loading ? "Generando..." : "AI Script"}
          </Button>
        )}
      </div>
      <Textarea
        ref={textRef}
        value={localValue}
        onChange={(e) => handleLocalChange(e.target.value)}
        onBlur={() => {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          onChange(localValue);
        }}
        placeholder={placeholder}
        className="min-h-[80px] text-sm resize-none"
      />
      {suggestions.length > 0 && (
        <div className="space-y-2 rounded-md border border-border bg-muted/50 p-2">
          <span className="text-xs font-medium text-muted-foreground">Suggerimenti AI:</span>
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="cursor-pointer rounded-md border border-border bg-card p-2 text-xs text-foreground hover:bg-accent transition-colors"
              onClick={() => {
                setLocalValue(s);
                onChange(s);
                setSuggestions([]);
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
