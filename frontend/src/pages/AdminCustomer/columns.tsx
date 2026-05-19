import type { ColumnDef } from "@tanstack/react-table";

/**
 * ==================================================
 * TYPES
 * ==================================================
 */

type TransactionData = {
	user?: {
		name?: string;
		email?: string;
	};

	movie?: {
		title?: string;
	};

	theater?: {
		name?: string;
	};

	seats?: {
		seat?: string;
	}[];
};

/**
 * ==================================================
 * COLUMNS
 * ==================================================
 */

export const columns: ColumnDef<TransactionData>[] = [
	{
		accessorKey: "user.name",

		header: "Name",

		cell: ({ row }) => (
			<div className="font-medium">
				{row.original.user
					?.name ?? "-"}
			</div>
		),
	},

	{
		accessorKey:
			"user.email",

		header: "Email",

		cell: ({ row }) => (
			<div className="text-muted-foreground">
				{row.original.user
					?.email ?? "-"}
			</div>
		),
	},

	{
		accessorKey:
			"movie.title",

		header: "Movie",

		cell: ({ row }) => (
			<div>
				{row.original.movie
					?.title ?? "-"}
			</div>
		),
	},

	{
		accessorKey:
			"theater.name",

		header: "Theater",

		cell: ({ row }) => (
			<div>
				{row.original
					.theater
					?.name ?? "-"}
			</div>
		),
	},

	{
		id: "seats",

		header: "Seats",

		cell: ({ row }) => {
			const seats =
				row.original
					.seats;

			if (
				!seats ||
				seats.length ===
					0
			) {
				return "-";
			}

			return (
				<div className="flex flex-wrap gap-1">
					{seats.map(
						(
							seat,
							index,
						) => (
							<span
								key={
									index
								}
								className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
							>
								{
									seat.seat
								}
							</span>
						),
					)}
				</div>
			);
		},
	},
];