import mongoose from "mongoose";

import TransactionSeat from "../models/TransactionSeat";

const migrateSeats = async () => {
	try {
		await mongoose.connect(
			process.env.MONGO_URI!,
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