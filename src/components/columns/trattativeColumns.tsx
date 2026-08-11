import { ColumnDef } from "@tanstack/react-table";
import { Lista } from "@/hooks/useCrmData";
import { Link } from "react-router-dom";

export const trattativeColumns: ColumnDef<Lista>[] = [
  {
    accessorKey: "nome",
    header: "Lista",
    cell: ({ row }) => (
      <Link
        to={`/batch/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.nome}
      </Link>
    ),
  },
  {
    accessorKey: "leadsCount",
    header: "Lead registrati",
    cell: ({ row }) => (
      <span>{row.original.leadsCount}</span>
    ),
  },
];
