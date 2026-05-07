import { Badge } from "@/components/ui/badge";
import { rupiahFormat } from "@/lib/utils";
import type { Movie } from "@/services/movie/movie.type";
import type { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "./ActionColumn";

export const columns: ColumnDef<Movie>[] = [
	{
		accessorKey: "title",
		header: "Movie Detail",
		cell: ({ row }) => {
			const movie = row.original;

			return (
				<div className="inline-flex items-center gap-4">
					<img
						src={movie.thumbnailUrl}
						alt={movie.thumbnailUrl}
						className="w-[50px]"
					/>

					<div className="space-y-3">
						<div>
							<h4>{movie.title}</h4>
							<p>{movie.description}</p>
						</div>
						<p>Bonus: {movie.bonus}</p>

						<Badge variant={movie.available ? "default" : "destructive"}>
							{movie.available ? "Live Now" : "Coming Soon"}
						</Badge>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => rupiahFormat(row.original.price),
	},
	{
		accessorKey: "genre",
		header: "Genre",
		cell: ({ row }) => (
			<Badge variant="secondary">{row.original.genre.name}</Badge>
		),
	},
	{
		accessorKey: "theaters",
		header: "Theaters",
		cell: ({ row }) => {
			const movie = row.original;

			return (
				<div className="flex flex-col items-center gap-4">
					{movie.theaters.map((item) => (
						<Badge variant="outline" key={item._id}>
							{item.name}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const movie = row.original;

			return <ActionColumn id={movie._id} />;
		},
	},
];
