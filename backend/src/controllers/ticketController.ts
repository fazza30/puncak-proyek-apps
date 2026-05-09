/**
 * ==================================================
 * controllers/ticketController.ts
 * FINAL COUPLE SEAT VERSION
 * ==================================================
 */

import type {
	Response,
} from "express";

import {
	transactionSchema,
} from "../utils/zodSchema";

import Transaction from "../models/Transaction";
import TransactionSeat from "../models/TransactionSeat";
import Wallet from "../models/Wallet";

import type {
	CustomRequest,
} from "../types/Request";

/**
 * ==================================================
 * TRANSACTION TICKET
 * ==================================================
 */

export const transactionTicket =
	async (
		req: CustomRequest,
		res: Response,
	) => {
		try {
			/**
			 * ==================================================
			 * VALIDATE BODY
			 * ==================================================
			 */

			const parse =
				transactionSchema.parse(
					req.body,
				);

			/**
			 * ==================================================
			 * USER ID
			 * ==================================================
			 */

			const userId =
				req.user?.id;

			if (!userId) {
				return res
					.status(401)
					.json({
						status:
							"failed",

						message:
							"Unauthorized",

						data: null,
					});
			}

			/**
			 * ==================================================
			 * CHECK WALLET
			 * ==================================================
			 */

			const wallet =
				await Wallet.findOne(
					{
						user: userId,
					},
				);

			if (
				!wallet
			) {
				return res
					.status(404)
					.json({
						status:
							"failed",

						message:
							"Wallet not found",

						data: null,
					});
			}

			if (
				wallet.balance <
				parse.total
			) {
				return res
					.status(400)
					.json({
						status:
							"failed",

						message:
							"Saldo tidak mencukupi",

						data: null,
					});
			}

			/**
			 * ==================================================
			 * CHECK USER ALREADY BOOKED
			 * ONLY NON GMAIL LIMITED
			 * ==================================================
			 */

			const existingTransaction =
				await Transaction.findOne(
					{
						user: userId,

						status: {
							$ne: "cancelled",
						},
					},
				);

			const userEmail =
				req.user?.email ??
				"";

			const domain =
				userEmail.split(
					"@",
				)[1];

			const isGmail =
				domain ===
				"gmail.com";

			/**
			 * NON GMAIL
			 * ONLY 1 TRANSACTION
			 */

			if (
				!isGmail &&
				existingTransaction
			) {
				return res
					.status(400)
					.json({
						status:
							"failed",
 
						message:
							"Anda hanya bisa memesan 1 couple seat",

						data: null,
					});
			}
			/**
			 * ==================================================
			 * CHECK SEAT ALREADY BOOKED
			 * ==================================================
			 */

			const bookedSeat =
				await TransactionSeat.findOne(
					{
						seat:
							parse
								.seats[0],
					},
				);

			if (
				bookedSeat
			) {
				return res
					.status(400)
					.json({
						status:
							"failed",

						message:
							"Couple seat sudah dipesan",

						data: null,
					});
			}

			/**
			 * ==================================================
			 * CREATE TRANSACTION
			 * ==================================================
			 */

			const transaction =
				new Transaction(
					{
						bookingFee:
							parse.bookingFee,

						total:
							parse.total,

						subtotal:
							parse.subtotal,

						theater:
							parse.theaterId,

						movie:
							parse.movieId,

						tax:
							parse.tax,

						user:
							userId,

						date:
							parse.date,
					},
				);

			/**
			 * ==================================================
			 * CREATE COUPLE SEAT
			 * ==================================================
			 */

			const seatDocuments: any[] =
				[];

			for (const seat of parse.seats) {
				const newSeat =
					new TransactionSeat(
						{
							transaction:
								transaction.id,

							seat:
								seat,
						},
					);

				await newSeat.save();

				seatDocuments.push(
					newSeat,
				);
			}

			/**
			 * ==================================================
			 * SAVE SEATS
			 * ==================================================
			 */

			transaction.seats =
				seatDocuments.map(
					(
						seat,
					) =>
						seat._id,
				);

			/**
			 * ==================================================
			 * REDUCE BALANCE
			 * ==================================================
			 */

			await Wallet.findByIdAndUpdate(
				wallet.id,
				{
					balance:
						wallet.balance -
						parse.total,
				},
			);

			/**
			 * ==================================================
			 * SAVE TRANSACTION
			 * ==================================================
			 */

			await transaction.save();

			/**
			 * ==================================================
			 * SUCCESS
			 * ==================================================
			 */

			return res.json({
				status:
					"success",

				message:
					"Success transaction ticket",

				data:
					transaction,
			});
		} catch (
			error: any
		) {
			console.log(
				"TRANSACTION ERROR:",
				error,
			);

			console.log(
				"ERROR MESSAGE:",
				error?.message,
			);

			return res
				.status(500)
				.json({
					status:
						"failed",

					message:
						error?.message ??
						"Failed to transaction ticket",

					data: null,
				});
		}
	};

/**
 * ==================================================
 * GET ORDERS
 * ==================================================
 */

export const getOrders =
	async (
		req: CustomRequest,
		res: Response,
	) => {
		try {
			const transactions =
				await Transaction.find(
					{
						user:
							req
								.user
								?.id,
					},
				)
					.select(
						"seats movie theater date status",
					)
					.populate({
						path: "movie",

						select:
							"thumbnail title genre -_id",

						populate:
							{
								path:
									"genre",

								select:
									"name -_id",
							},
					})
					.populate({
						path: "seats",

						select:
							"seat -_id",
					})
					.populate({
						path: "theater",

						select:
							"name city -_id",
					});

			return res.json({
				status:
					"success",

				message:
					"Success get orders",

				data:
					transactions,
			});
		} catch (
			error
		) {
			console.log(
				error,
			);

			return res
				.status(500)
				.json({
					status:
						"failed",

					message:
						"Failed to get orders",

					data: null,
				});
		}
	};

/**
 * ==================================================
 * GET ORDER DETAIL
 * ==================================================
 */

export const getOrderDetail =
	async (
		req: CustomRequest,
		res: Response,
	) => {
		try {
			const {
				id,
			} =
				req.params;

			const transaction =
				await Transaction.findById(
					id,
				)
					.populate({
						path: "movie",

						select:
							"thumbnail price bonus title genre -_id",

						populate:
							{
								path:
									"genre",

								select:
									"name -_id",
							},
					})
					.populate({
						path: "seats",

						select:
							"seat -_id",
					})
					.populate({
						path: "theater",

						select:
							"name city -_id",
					});

			if (
				!transaction
			) {
				return res
					.status(404)
					.json({
						status:
							"failed",

						message:
							"Transaction not found",

						data: null,
					});
			}

			return res.json({
				status:
					"success",

				message:
					"Success get order detail",

				data:
					transaction,
			});
		} catch (
			error
		) {
			console.log(
				error,
			);

			return res
				.status(500)
				.json({
					status:
						"failed",

					message:
						"Failed to get order detail",

					data: null,
				});
		}
	};