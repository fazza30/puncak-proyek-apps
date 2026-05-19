import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import TransactionSeat from "../models/TransactionSeat";
import "../models/Transaction";

const migrateSeats = async () => {
	try {
		await mongoose.connect(
			process.env.DATABASE_URL!,
		);

		console.log(
			"Mongo connected",
		);

		const seats =
			await TransactionSeat.find()
				.populate(
					"transaction",
				);

		for (const seat of seats) {
			const trx: any =
				seat.transaction;

			if (!trx) continue;

			seat.movie =
				trx.movie;

			seat.theater =
				trx.theater;

			seat.date =
				trx.date;

			await seat.save();

			console.log(
				`Migrated ${seat.seat}`,
			);
		}

		console.log(
			"Migration success",
		);

		process.exit(0);
	} catch (error) {
		console.log(error);

		process.exit(1);
	}
};

migrateSeats();