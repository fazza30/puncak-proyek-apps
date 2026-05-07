import type { Movie } from "../movie/movie.type";
import type { Theater } from "../theater/theater.type";

export interface User {
	_id: string;
	name: string;
	email: string;
}

export interface Transaction {
	_id: string;
	subtotal: number;
	total: number;
	bookingFee: number;
	tax: number;
	user: Pick<User, "name">;
	movie: Pick<Movie, "title">;
	theater: Pick<Theater, "name">;
	createdAt: string;
	updatedAt: string;
}

export interface Wallet {
	user: Pick<User, "name">;
}

export interface WalletTransaction {
	_id: string;
	wallet: Wallet;
	price: number;
	status: string;
	createdAt: string;
	updatedAt: string;
}
