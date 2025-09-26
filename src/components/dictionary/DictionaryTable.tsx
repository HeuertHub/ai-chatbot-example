import { DataTable } from "../datatable/data-table";

export function DictionaryTable() {

    return (
        <div className="h-full flex-1 flex-col gap-8 p-8 md:flex">
            <DataTable data={tasks} columns={columns} />
        </div>
    );
}