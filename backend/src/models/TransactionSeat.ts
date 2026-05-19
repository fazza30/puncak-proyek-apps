import mongoose from "mongoose";

const transactionSeatSchema =
	new mongoose.Schema(
		{
			transaction: {
				type:
					mongoose.Schema.Types.ObjectId,

				ref: "Transaction",
			},

			seat: {
				type: String,

				required: true,
			},

			movie: {
				type:
					mongoose.Schema.Types.ObjectId,

				ref: "Movie",
			},

			theater: {
				type:
					mongoose.Schema.Types.ObjectId,

				ref: "Theater",
			},

			date: {
				type: String,
			},
		},
		{
			timestamps: true,
		},
	);

export default mongoose.model(
	"TransactionSeat",
	transactionSeatSchema,
	"transactionSeats",
);