import { ColumnDef } from "@tanstack/react-table";
import { EtichettaDB, TabellaDB } from "@/hooks/useCrmData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function createEtichettaColumns(tabelle: TabellaDB[]): ColumnDef<EtichettaDB>[] {
  return [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.nome}</span>
          {row.original.is_default && <Badge variant="secondary" className="text-xs">Default</Badge>}
        </div>
      ),
    },
    {
      accessorKey: "colore",
      header: "Colore",
      cell: ({ row }) => (
        <Badge variant="outline" style={{ borderColor: row.original.colore, color: row.original.colore }}>
          {row.original.colore}
        </Badge>
      ),
    },
    {
      id: "pagine",
      header: "Pagine",
      cell: ({ row }) => {
        const nomi = row.original.tabelle
          .map((id) => tabelle.find((t) => t.id === id)?.nome)
          .filter(Boolean);
        return (
          <div className="flex flex-wrap gap-1">
            {nomi.map((nome) => <Badge key={nome} variant="secondary" className="text-xs">{nome}</Badge>)}
          </div>
        );
      },
    },
    {
      id: "elimina",
      cell: ({ row }) =>
        !row.original.is_default ? (
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null,
    },
  ];
}
