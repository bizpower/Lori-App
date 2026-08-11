import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOperatori } from "@/hooks/useCrmData";
import { useAuth } from "@/lib/auth";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "tutorial_dismissed";

const hasDismissedTutorial = () => {
  try {
    return typeof window !== "undefined" && window.sessionStorage.getItem(DISMISS_KEY) === "true";
  } catch {
    return false;
  }
};

const dismissTutorial = () => {
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "true");
    }
  } catch {
    // ignore session storage issues
  }
};

const TutorialPopup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { operatori, loading } = useOperatori();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || loading) return;
    if (operatori.length === 0 && !hasDismissedTutorial()) {
      setOpen(true);
    }
  }, [user, operatori.length, loading]);

  const handleClose = () => {
    setOpen(false);
    dismissTutorial();
  };

  if (!user || loading) return null;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-lg">👋 Benvenuto su Lori!</DialogTitle>
          <DialogDescription>
            Sembra che tu non abbia ancora creato un operatore. Guarda il tutorial per iniziare.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-2">
          <video
            controls
            className="w-full rounded-lg border border-border"
            preload="metadata"
          >
            <source src="/videos/tutorial.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="flex gap-2 p-6 pt-2">
          <Button
            className="min-h-[44px] flex-1"
            onClick={() => {
              handleClose();
              navigate("/clienti");
            }}
          >
            Crea il tuo primo operatore
          </Button>
          <Button variant="outline" className="min-h-[44px]" onClick={handleClose}>
            Più tardi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialPopup;
