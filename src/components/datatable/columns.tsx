"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { languages, entryStatusIcons } from "@/lib/types";
import { Entry } from "@/lib/types";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Entry>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "language",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Language" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("language")}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "entry",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Entry" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("entry")}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "senses",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Senses" />,
    cell: ({ row }) => {
      //const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex gap-2">
          {/*label && <Badge variant="outline">{label.label}</Badge>*/}
          <span className="max-w-[500px] truncate font-medium">{row.getValue("senses")}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = entryStatusIcons.find((status) => status.value === row.getValue("status"));

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center gap-2">
          {status.icon && <status.icon className="text-muted-foreground size-4" />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];