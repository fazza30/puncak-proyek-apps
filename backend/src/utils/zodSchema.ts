/**
 * ==================================================
 * utils/zodSchema.ts
 * FINAL PRODUCTION VERSION
 * ==================================================
 */

import { z } from "zod";

/**
 * ==================================================
 * FILE TYPES
 * ==================================================
 */

export const allowedFileTypes = [
	"image/png",
	"image/jpeg",
	"image/jpg",
];

/**
 * ==================================================
 * GENRE SCHEMA
 * ==================================================
 */

export const genreSchema =
	z
		.object({
			name: z
				.string()
				.min(
					5,
					"Genre minimal 5 karakter",
				),
		})
		.strict();

/**
 * ==================================================
 * THEATER SCHEMA
 * ==================================================
 */

export const theaterSchema =
	z
		.object({
			name: z
				.string()
				.min(
					5,
					"Nama theater minimal 5 karakter",
				),

			city: z
				.string()
				.min(
					5,
					"Nama kota minimal 5 karakter",
				),
		})
		.strict();

/**
 * ==================================================
 * MOVIE SCHEMA
 * ==================================================
 */

export const movieSchema =
	z
		.object({
			title: z
				.string()
				.min(
					5,
					"Judul film minimal 5 karakter",
				),

			genre: z
				.string()
				.min(
					5,
					"Genre wajib dipilih",
				),

			theaters: z
				.array(
					z.string().min(5),
				)
				.min(
					1,
					"Minimal pilih 1 theater",
				),

			available:
				z.boolean(),

			description:
				z
					.string()
					.min(
						5,
						"Deskripsi minimal 5 karakter",
					)
					.optional(),

			price:
				z.number({
					message:
						"Harga wajib diisi",
				}),

			bonus:
				z.string().optional(),
		})
		.strict();

/**
 * ==================================================
 * AUTH SCHEMA
 * ==================================================
 */

export const authSchema =
	z.object({
		name: z
			.string()
			.min(
				5,
				"Nama minimal 5 karakter",
			),

		email: z
			.string()
			.email(
				"Format email tidak valid",
			),

		password: z
			.string()
			.min(
				5,
				"Password minimal 5 karakter",
			),

		role: z.enum([
			"admin",
			"customer",
		]),
	});

/**
 * ==================================================
 * WALLET TOPUP SCHEMA
 * ==================================================
 */

export const topupSchema =
	z.object({
		balance:
			z
				.number()
				.min(
					1000,
					"Minimal top up Rp 1.000",
				),
	});

/**
 * ==================================================
 * TRANSACTION SCHEMA
 * COUPLE SEAT VERSION
 * ==================================================
 */

export const transactionSchema =
	z.object({
		subtotal:
			z.number(),

		total:
			z.number(),

		bookingFee:
			z.number(),

		tax:
			z.number(),

		movieId:
			z.string(),

		theaterId:
			z.string(),

		/**
		 * couple seat
		 */
		seats:
			z
				.array(
					z.string(),
				)
				.min(1)
				.max(1),

		date:
			z.string(),
	})
	.strict();