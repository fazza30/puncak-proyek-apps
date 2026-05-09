/**
 * ==================================================
 * controllers/globalController.ts
 * FINAL PRODUCTION VERSION
 * ==================================================
 */

import type {
	Request,
	Response,
} from "express";

import Movie from "../models/Movie";
import Genre from "../models/Genre";
import Theater from "../models/Theater";
import Transaction from "../models/Transaction";

/**
 * ==================================================
 * SHOWTIME MAPPING
 * ==================================================
 */

const GENRE_SHOWTIME_MAP: Record<
	string,
	string[]
> = {
	"Grade 1": ["07:00"],
	"Grade 2": ["08:00"],
	"Grade 3": ["09:00"],
	"Grade 4": ["10:00"],
	"Grade 5": ["11:00"],
};

/**
 * ==================================================
 * GENERATE SEATS
 * ==================================================
 */

const generateSeats = () => {
	const seats = [];

	const rows = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
	];

	for (const row of rows) {
		/**
		 * =========================================
		 * ROW B & H
		 * SINGLE SIDE SEAT
		 * =========================================
		 */

		if (
			row === "B" ||
			row === "H"
		) {
			/**
			 * LEFT SINGLE
			 */

			seats.push({
				seat: `${row}1`,
				isBooked: false,
				type: "single",
			});

			/**
			 * COUPLE
			 */

			for (
				let i = 2;
				i <= 28;
				i += 2
			) {
				seats.push({
					seat: `${row}${i}-${row}${i + 1}`,
					isBooked: false,
					type: "couple",
				});
			}

			/**
			 * RIGHT SINGLE
			 */

			seats.push({
				seat: `${row}30`,
				isBooked: false,
				type: "single",
			});

			continue;
		}

		/**
		 * =========================================
		 * ROW C & I
		 * 3 - 4 - 4 - 3
		 * =========================================
		 */

		if (
			row === "C" ||
			row === "I"
		) {
			for (
				let i = 1;
				i <= 27;
				i += 2
			) {
				seats.push({
					seat: `${row}${i}-${row}${i + 1}`,
					isBooked: false,
					type: "couple",
				});
			}

			continue;
		}

		/**
		 * =========================================
		 * NORMAL ROW
		 * 4 - 4 - 4 - 4
		 * =========================================
		 */

		for (
			let i = 1;
			i <= 31;
			i += 2
		) {
			seats.push({
				seat: `${row}${i}-${row}${i + 1}`,
				isBooked: false,
				type: "couple",
			});
		}
	}

	return seats;
};

/**
 * ==================================================
 * GET MOVIES
 * ==================================================
 */

export const getMovies =
	async (
		req: any,
		res: Response,
	) => {
		try {
			/**
			 * ==================================================
			 * DOMAIN GENRE MAP
			 * ==================================================
			 */

			const DOMAIN_GENRE_MAP: Record<
				string,
				string
			> = {
				"grade1.com":
					"Grade 1",

				"grade2.com":
					"Grade 2",

				"grade3.com":
					"Grade 3",

				"grade4.com":
					"Grade 4",

				"grade5.com":
					"Grade 5",
			};

			/**
			 * ==================================================
			 * GET USER DOMAIN
			 * ==================================================
			 */

			const email =
				req.user?.email ?? "";

			const domain =
				email.split(
					"@",
				)[1];

			const allowedGenre =
				DOMAIN_GENRE_MAP[
					domain
				];

			/**
			 * ==================================================
			 * FILTER
			 * ==================================================
			 */

			let filter: any =
				{};

			if (
				allowedGenre
			) {
				const genre =
					await Genre.findOne(
						{
							name:
								allowedGenre,
						},
					);

				if (genre) {
					filter.genre =
						genre._id;
				}
			}

			/**
			 * ==================================================
			 * GET MOVIES
			 * ==================================================
			 */

			const movies =
				await Movie.find(
					filter,
				)
					.select(
						"title thumbnail genre available",
					)
					.populate({
						path: "genre",

						select:
							"name",
					});

			return res.json({
				status:
					"success",

				message:
					"Success get movies",

				data: movies,
			});
		} catch (error) {
			console.log(
				error,
			);

			return res
				.status(
					500,
				)
				.json({
					status:
						"failed",

					message:
						"Failed to get movies",

					data: null,
				});
		}
	};
/**
 * ==================================================
 * GET GENRES
 * ==================================================
 */

export const getGenre =
	async (
		req: Request,
		res: Response,
	) => {
		try {
			const genres =
				await Genre.find()
					.select(
						"name",
					)
					.sort({
						name: 1,
					});

			return res.json({
				status:
					"success",

				message:
					"Success get genres",

				data: genres,
			});
		} catch (error) {
			console.log(
				error,
			);

			return res
				.status(
					500,
				)
				.json({
					status:
						"failed",

					message:
						"Failed to get genres",

					data: null,
				});
		}
	};

/**
 * ==================================================
 * GET MOVIE DETAIL
 * ==================================================
 */

export const getMovieDetail =
	async (
		req: Request,
		res: Response,
	) => {
		try {
			const { id } =
				req.params;

			/**
			 * GET MOVIE
			 */
			const movie =
				await Movie.findById(
					id,
				)
					.populate({
						path: "genre",
						select:
							"name",
					})
					.populate({
						path: "theaters",
						select:
							"name city",
					});

			/**
			 * MOVIE NOT FOUND
			 */
			if (!movie) {
				return res
					.status(
						404,
					)
					.json({
						status:
							"failed",

						message:
							"Movie not found",

						data: null,
					});
			}

			/**
			 * GENERATE SEATS
			 */
			const seats =
				generateSeats();

			/**
			 * GENRE NAME
			 */
			const genreName =
				(
					movie.genre as any
				)?.name ?? "";

			/**
			 * SHOWTIMES
			 */
			const times =
				GENRE_SHOWTIME_MAP[
					genreName
				] ?? [
					"13:00",
				];

			return res.json({
				status:
					"success",

				message:
					"Success get movie detail",

				data: {
					movie: {
						...movie.toJSON(),

						seats,

						times,
					},
				},
			});
		} catch (error) {
			console.log(
				error,
			);

			return res
				.status(
					500,
				)
				.json({
					status:
						"failed",

					message:
						"Failed to get movie detail",

					data: null,
				});
		}
	};

/**
 * ==================================================
 * GET AVAILABLE SEATS
 * ==================================================
 */

export const getAvailableSeats =
	async (
		req: Request,
		res: Response,
	) => {
		try {
			const {
				movieId,
			} = req.params;

			const {
				date,
			} = req.query;

			/**
			 * VALIDATION
			 */
			if (
				!movieId ||
				!date
			) {
				return res
					.status(
						400,
					)
					.json({
						status:
							"failed",

						message:
							"Movie ID and date are required",

						data: null,
					});
			}

			/**
			 * GET TRANSACTIONS
			 */
			const transactions =
				await Transaction.find(
					{
						movie:
							movieId,

						date:
							date
								.toString()
								.replace(
									"+",
									" ",
								),
					},
				)
					.select(
						"seats",
					)
					.populate({
						path: "seats",
						select:
							"seat",
					});

			/**
			 * BOOKED SEATS
			 */
			const bookedSeats: any[] =
				[];

			for (const trx of transactions) {
				bookedSeats.push(
					...trx.seats,
				);
			}

			return res.json({
				status:
					"success",

				message:
					"Success get available seats",

				data: bookedSeats,
			});
		} catch (error) {
			console.log(
				error,
			);

			return res
				.status(
					500,
				)
				.json({
					status:
						"failed",

					message:
						"Failed to get available seats",

					data: null,
				});
		}
	};

/**
 * ==================================================
 * GET MOVIES FILTER
 * ==================================================
 */

export const getMoviesFilter =
	async (
		req: Request,
		res: Response,
	) => {
		try {
			const {
				genreId,
			} = req.params;

			const {
				city,
				theaters,
				availbility,
			} = req.query;

			/**
			 * FILTER QUERY
			 */
			const filterQuery: any =
				{};

			/**
			 * FILTER BY GENRE
			 */
			if (genreId) {
				filterQuery.genre =
					genreId;
			}

			/**
			 * FILTER BY CITY
			 */
			if (
				city &&
				typeof city ===
					"string"
			) {
				const theaterList =
					await Theater.find(
						{
							city,
						},
					);

				const theaterIds =
					theaterList.map(
						(
							theater,
						) =>
							theater._id,
					);

				filterQuery.theaters =
					{
						$in: theaterIds,
					};
			}

			/**
			 * FILTER BY THEATER
			 */
			if (theaters) {
				const theaterIds =
					Array.isArray(
						theaters,
					)
						? theaters
						: [theaters];

				filterQuery.theaters =
					{
						$in: [
							...(filterQuery
								?.theaters
								?.$in ?? []),

							...theaterIds,
						],
					};
			}

			/**
			 * FILTER AVAILABLE
			 */
			if (
				availbility ===
				"true"
			) {
				filterQuery.available =
					true;
			}

			/**
			 * FILTERED MOVIES
			 */
			const filteredMovies =
				await Movie.find(
					filterQuery,
				)
					.select(
						"title thumbnail genre theaters available",
					)
					.populate({
						path: "genre",
						select:
							"name",
					})
					.populate({
						path: "theaters",
						select:
							"name city",
					});

			/**
			 * ALL MOVIES
			 */
			const allMovies =
				await Movie.find()
					.select(
						"title thumbnail genre theaters available",
					)
					.populate({
						path: "genre",
						select:
							"name",
					})
					.populate({
						path: "theaters",
						select:
							"name city",
					});

			return res.json({
				status:
					"success",

				message:
					"Success get filtered movies",

				data: {
					filteredMovies,

					allMovies,
				},
			});
		} catch (error) {
			console.log(
				error,
			);

			return res
				.status(
					500,
				)
				.json({
					status:
						"failed",

					message:
						"Failed to filter movies",

					data: null,
				});
		}
	};