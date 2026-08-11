import { ColumnDef } from "@tanstack/react-table";
import { Operatore, RUOLO_LABELS } from "@/hooks/useCrmData";
import { Badge } from "@/components/ui/badge";
import OperatoreAvatar from "@/components/OperatoreAvatar";
import { Button } from "@/components/ui/button";
import { Trash2, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

export function createClientiColumns(
  onReload?: () => void,
  onDelete?: (op: Operatore) => void,
): ColumnDef<Operatore>[] {
  return [
    {
      accessorKey: "image_url",
      header: "",
      cell: ({ row }) => (
        <OperatoreAvatar
          nome={row.original.nome}
          imageUrl={row.original.image_url}
          operatoreId={row.original.id}
          editable
          onImageUpdated={() => onReload?.()}
        />
      ),
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => <span className="font-medium">{row.original.nome}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "ruolo",
      header: "Ruolo",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {RUOLO_LABELS[row.original.ruolo] || row.original.ruolo}
        </Badge>
      ),
    },
    {
      id: "liste",
      header: "Liste",
      cell: ({ row }) => (
        <Link
          to={`/batch?operatore=${row.original.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-primary hover:underline text-xs flex items-center gap-1"
        >
          <ListChecks className="h-3.5 w-3.5" /> Vedi liste
        </Link>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => { e.stopPropagation(); onDelete?.(row.original); }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
