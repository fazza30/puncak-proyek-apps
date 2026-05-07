import { Badge } from "@/components/ui/badge";
import type { Theater } from "@/services/theater/theater.type";
import type { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "./ActionColumn";
// import ActionColumn from "./ActionColumn";

export const columns: ColumnDef<Theater>[] = [
	{
		accessorKey: "name",
		header: "Genre",
	},
	{
		accessorKey: "city",
		header: "City",
		cell: ({ row }) => <Badge>{row.original.city}</Badge>,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const theater = row.original;

			return <ActionColumn id={theater._id} />;
		},
	},
];
