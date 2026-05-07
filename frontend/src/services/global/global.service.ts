import type { BaseResponse } from "@/types/response";
import type {
	Balance,
	DataMovieDetail,
	Movie,
	MovieExplore,
	SelectedSeat,
} from "./global.type";
import { privateInstance } from "@/lib/axios";
import type { Genre } from "../genre/genre.type";
import type { FilterState } from "@/redux/features/filter/filterSlice";
import { z } from "zod";

export const filterSchema = z.object({
	genre: z.string().nullable(),
	city: z.string().nullable(),
	availbility: z.string().nullable(),
	theaters: z.array(z.string()).nullable(),
});

export const transactionSchema = z
	.object({
		subtotal: z.number(),
		total: z.number(),
		bookingFee: z.number(),
		tax: z.number(),
		movieId: z.string(),
		theaterId: z.string(),
		seats: z.array(z.string()),
		date: z.string(),
	})
	.strict();

export type TransactionValues = z.infer<typeof transactionSchema>;
export type FilterValues = z.infer<typeof filterSchema>;

export const getMovies = async (): Promise<BaseResponse<Movie[]>> =>
	privateInstance.get("/customer/movies").then((res) => res.data);

export const getGenres = async (): Promise<
	BaseResponse<Pick<Genre, "_id" | "name">>
> => privateInstance.get("/customer/genres").then((res) => res.data);

export const getMovieByGenre = async (
	genreId: string,
	params?: FilterState,
): Promise<BaseResponse<MovieExplore>> =>
	privateInstance
		.get(`/customer/browse-movies/${genreId}`, {
			params: params,
		})
		.then((res) => res.data);

export const getDetailMovie = async (
	movieId: string,
): Promise<BaseResponse<DataMovieDetail>> =>
	privateInstance.get(`/customer/movies/${movieId}`).then((res) => res.data);

export const checkSeats = async (
	movieId: string,
	date: string,
): Promise<BaseResponse<SelectedSeat[]>> =>
	privateInstance
		.get(`/customer/check-seats/${movieId}`, {
			params: {
				date,
			},
		})
		.then((res) => res.data);

export const getBalance = async (): Promise<BaseResponse<Balance>> =>
	privateInstance.get("/customer/check-balance").then((res) => res.data);

export const buyTicket = async (data: TransactionValues) =>
	privateInstance
		.post("/customer/transaction/buy", data)
		.then((res) => res.data);
