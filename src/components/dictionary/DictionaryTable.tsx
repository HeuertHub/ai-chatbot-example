import { DataTable } from "../datatable/data-table";
import { columns } from "../datatable/columns";
import { type Entry } from "@/lib/types";

export function DictionaryTable({entries}:{entries:Entry[]}) {

    return (
        <div className="h-full flex-1 flex-col gap-8 p-8 md:flex">
            <DataTable data={entries} columns={columns} />
        </div>
    );
}