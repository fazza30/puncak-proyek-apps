import type { ColumnDef } from "@tanstack/react-table";

/**
 * ==================================================
 * TYPES
 * ==================================================
 */

type TransactionData = {
	name?: string;

	email?: string;

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

export const columns: ColumnDef<TransactionData>[] =
	[
		{
			accessorKey:
				"name",

			header:
				"Name",
		},

		{
			accessorKey:
				"email",

			header:
				"Email",
		},

		{
			header:
				"Movie",

			cell: ({
				row,
			}) =>
				row.original
					.movie
					?.title ??
				"-",
		},

		{
			header:
				"Theater",

			cell: ({
				row,
			}) =>
				row.original
					.theater
					?.name ??
				"-",
		},

		{
			header:
				"Seats",

			cell: ({
				row,
			}) => {
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

				return seats
					.map(
						(
							seat,
						) =>
							seat.seat,
					)
					.join(
						", ",
					);
			},
		},
	];