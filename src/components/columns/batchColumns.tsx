import { ColumnDef } from "@tanstack/react-table";
import { Lista } from "@/hooks/useCrmData";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const batchColumns = (
  onRename: (lista: Lista) => void,
  onDelete: (lista: Lista) => void,
): ColumnDef<Lista>[] => [
  {
    accessorKey: "nome",
    header: "Lista",
    cell: ({ row }) => (
      <span className="font-medium text-primary">{row.original.nome}</span>
    ),
  },
  {
    accessorKey: "operatoreNome",
    header: "Operatore",
  },
  {
    accessorKey: "leadsCount",
    header: "Lead registrati",
    cell: ({ row }) => <span>{row.original.leadsCount || 0}</span>,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onRename(row.original)}>
              <Pencil className="mr-2 h-4 w-4" /> Rinomina
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Elimina
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
