import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, MoreHorizontal, Pencil, Trash2, FileEdit } from "lucide-react";
import ExpandableMessage from "@/components/ExpandableMessage";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface LeadWithOperatore {
  id: string;
  lista_id: string;
  nome: string;
  azienda: string;
  link_profilo: string;
  link_azienda: string;
  etichetta_id: string | null;
  etichettaNome?: string;
  etichettaColore?: string;
  edit_timestamp: string;
  note_contatto: string;
  note_retargeting: string;
  messaggio_contatto: string;
  messaggio_retargeting: string;
  operatoreNome?: string;
  listaNome?: string;
  [key: string]: any;
}

export interface EtichettaOption {
  id: string;
  nome: string;
  colore: string;
}

export function createLeadColumns(
  onUpdateLead: (id: string, field: string, value: string) => void,
  showOperatore = false,
  options?: {
    onEdit?: (lead: LeadWithOperatore) => void;
    onDelete?: (lead: LeadWithOperatore) => void;
    etichette?: EtichettaOption[];
  }
): ColumnDef<LeadWithOperatore>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Seleziona tutti" />
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Seleziona riga" />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{row.original.nome}</span>
          {row.original.link_profilo && (
            <a href={row.original.link_profilo} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors" title="Profilo LinkedIn" onClick={(e) => e.stopPropagation()}>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      ),
    },
    {
      accessorKey: "azienda",
      header: "Azienda",
      cell: ({ row }) => {
        if (row.original.link_azienda) {
          return <a href={row.original.link_azienda} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>{row.original.azienda}</a>;
        }
        return <span>{row.original.azienda}</span>;
      },
    },
    ...(showOperatore ? [
      {
        accessorKey: "operatoreNome" as const,
        header: "Operatore",
        cell: ({ row }: { row: any }) => <span className="text-sm text-foreground">{row.original.operatoreNome || "—"}</span>,
      },
      {
        accessorKey: "listaNome" as const,
        header: "Lista",
        cell: ({ row }: { row: any }) => <span className="text-xs text-muted-foreground">{row.original.listaNome || "—"}</span>,
      },
    ] : []),
    {
      accessorKey: "messaggio_contatto",
      header: () => (
        <div className="flex items-center gap-1">
          <FileEdit className="h-3.5 w-3.5" />
          Messaggio
        </div>
      ),
      cell: ({ row }) => (
        <ExpandableMessage
          value={row.original.messaggio_contatto}
          onChange={(val) => onUpdateLead(row.original.id, "messaggio_contatto", val)}
          placeholder="Scrivi messaggio..."
          leadName={row.original.nome}
          leadAzienda={row.original.azienda}
          leadLink={row.original.link_profilo}
          showAI
        />
      ),
    },
    {
      accessorKey: "etichetta_id",
      header: "Etichetta",
      cell: ({ row }) => {
        const etichette = options?.etichette;
        if (etichette && etichette.length > 0) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Select
                value={row.original.etichetta_id || ""}
                onValueChange={(val) => onUpdateLead(row.original.id, "etichetta_id", val)}
              >
                <SelectTrigger className="h-7 w-[130px] text-xs border-0 bg-transparent px-1 focus:ring-0">
                  <SelectValue>
                    <Badge variant="outline" style={{ borderColor: row.original.etichettaColore, color: row.original.etichettaColore }}>
                      {row.original.etichettaNome || "—"}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {etichette.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      <span style={{ color: e.colore }}>{e.nome}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        return (
          <Badge variant="outline" style={{ borderColor: row.original.etichettaColore, color: row.original.etichettaColore }}>
            {row.original.etichettaNome || "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "note_contatto",
      header: () => (
        <div className="flex items-center gap-1">
          <FileEdit className="h-3.5 w-3.5" />
          Note
        </div>
      ),
      cell: ({ row }) => (
        <ExpandableMessage
          value={row.original.note_contatto}
          onChange={(val) => onUpdateLead(row.original.id, "note_contatto", val)}
          placeholder="Aggiungi nota..."
        />
      ),
    },
    {
      accessorKey: "edit_timestamp",
      header: "Data",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {format(new Date(row.original.edit_timestamp), "dd MMM yyyy", { locale: it })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => options?.onEdit?.(row.original)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Modifica
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => options?.onDelete?.(row.original)} className="cursor-pointer text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
