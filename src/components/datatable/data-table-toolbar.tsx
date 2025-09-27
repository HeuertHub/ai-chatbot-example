"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { languages, entryStatusIcons, favoriteOptions } from "@/lib/types";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { NewEntry } from "../dictionary/NewEntry";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onRefresh: ()=>void;
}

export function DataTableToolbar<TData>({ table, onRefresh }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter entries..."
          value={(table.getColumn("value")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("value")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("favorite") && (
          <DataTableFacetedFilter
            column={table.getColumn("favorite")}
            title="Favorite"
            options={favoriteOptions}
          />
        )}
        {table.getColumn("language") && (
          <DataTableFacetedFilter
            column={table.getColumn("language")}
            title="Language"
            options={languages}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={entryStatusIcons}
          />
        )}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <NewEntry onRefresh={onRefresh}/>
      </div>
    </div>
  );
}