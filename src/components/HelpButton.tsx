import { useState } from "react";
import { HelpCircle, ExternalLink, TicketPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import TicketModal from "@/components/TicketModal";

export interface HelpBlock {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Optional interactive preview rendered below the description */
  preview?: React.ReactNode;
}

interface HelpButtonProps {
  pageTitle: string;
  blocks: HelpBlock[];
}

const HelpButton = ({ pageTitle, blocks }: HelpButtonProps) => {
  const [open, setOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-1.5 min-h-[44px] md:min-h-0 shrink-0"
          >
            <HelpCircle className="h-4 w-4" />
            {!isMobile && <span className="text-xs">Assistenza</span>}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 shrink-0">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Guida rapida</DialogTitle>
                <p className="text-sm text-muted-foreground">{pageTitle}</p>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto max-h-[60vh]">
            <div className="px-6 py-5 space-y-5">
              {blocks.map((block, i) => (
                <div key={i} className="rounded-lg border border-border overflow-hidden">
                  {/* Header */}
                  <div className="flex gap-3 p-4 bg-muted/30">
                    <div className="shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary">
                      {block.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{block.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{block.description}</p>
                    </div>
                  </div>
                  {/* Interactive preview */}
                  {block.preview && (
                    <div className="p-4 border-t border-border bg-background">
                      {block.preview}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row gap-2 px-6 py-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1 min-h-[44px] gap-2"
              onClick={() => {
                setOpen(false);
                setTicketOpen(true);
              }}
            >
              <TicketPlus className="h-4 w-4" />
              Apri ticket assistenza
            </Button>
            <Button
              variant="ghost"
              className="flex-1 min-h-[44px] gap-2 text-muted-foreground"
              asChild
            >
              <a href="https://lori-phi.vercel.app" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Guida completa
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TicketModal open={ticketOpen} onOpenChange={setTicketOpen} />
    </>
  );
};

export default HelpButton;
