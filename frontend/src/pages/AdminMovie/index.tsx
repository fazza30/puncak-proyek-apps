import TitleHeading from "@/components/TitleHeading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";

import { Link, useLoaderData } from "react-router-dom";
import { columns } from "./columns";
import type { Movie } from "@/services/movie/movie.type";

export default function AdminMovie() {
	const movies = useLoaderData() as Movie[];

	return (
		<> 
			<TitleHeading title="List Movies" />
			<div>
				<Button asChild className="mb-3">
					<Link to="/admin/movies/create">
						<Plus className="w-4 h-4 mr-2" />
						Add Data
					</Link>
				</Button>
				<DataTable columns={columns} data={movies} />
			</div>
		</>
	); 
}
