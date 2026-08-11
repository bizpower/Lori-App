import { Operatore, Lista, RUOLO_LABELS } from "@/hooks/useCrmData";
import { LeadWithOperatore, EtichettaOption } from "@/components/columns/leadColumns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ExternalLink, ChevronRight, Trash2, Pencil, MoreHorizontal, ListChecks } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import OperatoreAvatar from "@/components/OperatoreAvatar";
import ExpandableMessage from "@/components/ExpandableMessage";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LeadCardProps {
  lead: LeadWithOperatore;
  etichette?: EtichettaOption[];
  onEdit?: (lead: LeadWithOperatore) => void;
  onDelete?: (lead: LeadWithOperatore) => void;
  onUpdateField?: (leadId: string, field: string, value: string) => void;
}

export const LeadCard = ({ lead, etichette, onEdit, onDelete, onUpdateField }: LeadCardProps) => (
  <div className="rounded-lg border border-border bg-card p-3.5 space-y-2.5">
    {/* Header: nome + azienda + etichetta + actions */}
    <div className="flex items-start justify-between gap-2">
      <div
        className="flex-1 min-w-0 cursor-pointer active:opacity-70 transition-opacity"
        onClick={() => onEdit?.(lead)}
      >
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-foreground truncate">{lead.nome}</span>
          {lead.link_profilo && (
            <a
              href={lead.link_profilo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary shrink-0 p-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{lead.azienda}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {etichette && etichette.length > 0 && onUpdateField ? (
          <Select
            value={lead.etichetta_id || ""}
            onValueChange={(val) => onUpdateField(lead.id, "etichetta_id", val)}
          >
            <SelectTrigger className="h-7 w-auto max-w-[130px] text-xs border-0 bg-transparent px-1 focus:ring-0 [&>svg]:ml-0.5">
              <SelectValue>
                <Badge variant="outline" className="text-[11px] whitespace-nowrap"
                  style={{ borderColor: lead.etichettaColore, color: lead.etichettaColore, backgroundColor: `${lead.etichettaColore}15` }}>
                  {lead.etichettaNome || "—"}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" align="end" sideOffset={4}>
              {etichette.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: e.colore }} />
                    {e.nome}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline" className="text-[11px]"
            style={{ borderColor: lead.etichettaColore, color: lead.etichettaColore, backgroundColor: `${lead.etichettaColore}15` }}>
            {lead.etichettaNome || "—"}
          </Badge>
        )}

        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(lead)} className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifica
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(lead)} className="cursor-pointer text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Elimina
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>

    {/* Inline editable fields */}
    {onUpdateField && (
      <div className="space-y-1.5 pt-1 border-t border-border/50">
        <div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Messaggio</span>
          <ExpandableMessage
            value={lead.messaggio_contatto}
            onChange={(val) => onUpdateField(lead.id, "messaggio_contatto", val)}
            placeholder="Scrivi messaggio..."
            leadName={lead.nome}
            leadAzienda={lead.azienda}
            leadLink={lead.link_profilo}
            showAI
          />
        </div>
        <div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Note</span>
          <ExpandableMessage
            value={lead.note_contatto}
            onChange={(val) => onUpdateField(lead.id, "note_contatto", val)}
            placeholder="Aggiungi nota..."
          />
        </div>
      </div>
    )}

    <div className="flex items-center justify-between pt-0.5">
      <span className="text-[11px] text-muted-foreground">
        {format(new Date(lead.edit_timestamp), "dd MMM yyyy", { locale: it })}
      </span>
    </div>
  </div>
);

export const ListaCard = ({ lista, onRename, onDelete }: { lista: Lista; onRename?: (l: Lista) => void; onDelete?: (l: Lista) => void }) => (
  <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 min-h-[56px]">
    <Link to={`/batch/${lista.id}`} className="flex-1 min-w-0 active:opacity-70 transition-opacity">
      <span className="font-semibold text-sm text-primary">{lista.nome}</span>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-muted-foreground">{lista.operatoreNome || "—"}</span>
      </div>
    </Link>
    {(onRename || onDelete) && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onRename && (
            <DropdownMenuItem onClick={() => onRename(lista)}>
              <Pencil className="mr-2 h-4 w-4" /> Rinomina
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(lista)}>
              <Trash2 className="mr-2 h-4 w-4" /> Elimina
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  </div>
);

export const OperatoreCard = ({ operatore, onDelete }: { operatore: Operatore; onDelete?: (op: Operatore) => void }) => (
  <div className="rounded-lg border border-border bg-card p-4 space-y-3 active:bg-accent/30 transition-colors">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <OperatoreAvatar nome={operatore.nome} imageUrl={operatore.image_url} size="md" />
        <div className="min-w-0">
          <span className="font-semibold text-sm text-foreground">{operatore.nome}</span>
          <p className="text-xs text-muted-foreground mt-0.5">{operatore.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <Badge variant="secondary" className="text-[11px]">
          {RUOLO_LABELS[operatore.ruolo] || operatore.ruolo}
        </Badge>
        <Link
          to={`/batch?operatore=${operatore.id}`}
          className="text-primary p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <ListChecks className="h-4 w-4" />
        </Link>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(operatore); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  </div>
);
