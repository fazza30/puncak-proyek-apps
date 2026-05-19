import type { ColumnDef } from "@tanstack/react-table";

type TransactionData = {
	user: {
		name: string;
		email: string;
	};

	movie: {
		title: string;
	};

	theater: {
		name: string;
	};

	seats: {
		seat: string;
	}[];
};

export const columns: ColumnDef<TransactionData>[] = [
	{
		header: "Name",

		cell: ({ row }) =>
			row.original.user
				?.name ?? "-",
	},

	{
		header: "Email",

		cell: ({ row }) =>
			row.original.user
				?.email ?? "-",
	},

	{
		header: "Movie",

		cell: ({ row }) =>
			row.original.movie
				?.title ?? "-",
	},

	{
		header: "Theater",

		cell: ({ row }) =>
			row.original.theater
				?.name ?? "-",
	},

	{
		header: "Seat",

		cell: ({ row }) =>
			row.original.seats
				?.map(
					(
						seat,
					) =>
						seat.seat,
				)
				.join(", ") ??
			"-",
	},
];