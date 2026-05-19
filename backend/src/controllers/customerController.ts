import type { Request, Response } from "express";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import Transaction from "../models/Transaction";

export const getCustomers =
	async (
		req: Request,
		res: Response,
	) => {
		try {
			/**
			 * ==================================================
			 * GET ALL CUSTOMERS
			 * ==================================================
			 */

			const customers =
				await User.find({
					role:
						"customer",
				}).select(
					"name email",
				);

			/**
			 * ==================================================
			 * GET ALL TRANSACTIONS
			 * ==================================================
			 */

			const transactions =
				await Transaction.find()
					.populate({
						path:
							"movie",

						select:
							"title",
					})
					.populate({
						path:
							"theater",

						select:
							"name",
					})
					.populate({
						path:
							"seats",

						select:
							"seat",
					});

			/**
			 * ==================================================
			 * CREATE TRANSACTION MAP
			 * ==================================================
			 */

			const transactionMap =
				new Map();

			for (const transaction of transactions) {
				transactionMap.set(
					String(
						transaction.user,
					),
					transaction,
				);
			}

			/**
			 * ==================================================
			 * MERGE CUSTOMER + TRANSACTION
			 * ==================================================
			 */

			const formattedCustomers =
				customers.map(
					(customer) => {
						const transaction =
							transactionMap.get(
								String(
									customer._id,
								),
							);

						return {
							id:
								customer._id,

							name:
								customer.name,

							email:
								customer.email,

							movie:
								transaction
									?.movie ??
								null,

							theater:
								transaction
									?.theater ??
								null,

							seats:
								transaction
									?.seats ??
								[],
						};
					},
				);

			return res.json({
				data:
					formattedCustomers,

				message:
					"Success get customers",

				status:
					"success",
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
					message:
						"Failed to get customers",

					data: null,

					status:
						"failed",
				});
		}
	};

export const getWalletTransactions = async (req: Request, res: Response) => {
	try {
		const transactions = await WalletTransaction.find().populate({
			path: "wallet",
			select: "user -_id",
			populate: {
				path: "user",
				select: "name",
			},
		});

		return res.json({
			data: transactions,
			message: "Success get data",
			status: "Success",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Failed to get data",
			data: null,
			status: "failed",
		});
	}
};

export const getTransactions =
	async (
		req: Request,
		res: Response,
	) => {
		try {
			const transactions =
				await Transaction.find()
					.populate({
						path: "user",

						select:
							"name email -_id",
					})
					.populate({
						path: "movie",

						select:
							"title -_id",
					})
					.populate({
						path: "theater",

						select:
							"name -_id",
					})
					.populate({
						path: "seats",

						select:
							"seat -_id",
					});

			return res.json({
				data:
					transactions,

				message:
					"Success get data",

				status:
					"Success",
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
					message:
						"Failed to get data",

					data: null,

					status:
						"failed",
				});
		}
	};
