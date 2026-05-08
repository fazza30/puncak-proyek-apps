import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User";
import Wallet from "../models/Wallet";
import Transaction from "../models/Transaction";
import TransactionSeat from "../models/TransactionSeat";

dotenv.config();

async function clearUsers() {
	try {
		await mongoose.connect(
            process.env.DATABASE_URL ?? "",
            {
                serverSelectionTimeoutMS: 30000,
                family: 4,
            },
        );

		console.log(
			"MongoDB Connected",
		);

		await User.deleteMany({
			role: "customer",
		});

		await Wallet.deleteMany({});

		await Transaction.deleteMany({});

		await TransactionSeat.deleteMany({});

		console.log(
			"ALL CUSTOMER DATA DELETED",
		);

		process.exit(0);
	} catch (error) {
		console.log(error);

		process.exit(1);
	}
}

clearUsers();