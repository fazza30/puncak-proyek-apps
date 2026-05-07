import type { Genre } from "../genre/genre.type";
import type { Theater } from "../theater/theater.type";

export interface Movie {
	_id: string;
	title: string;
	genre: Pick<Genre, "_id" | "name">;
	theaters: Pick<Theater, "_id" | "name">[];
	description: string;
	thumbnail: string;
	price: number;
	available: boolean;
	bonus: string;
	thumbnailUrl: string;
	id: string;
}
