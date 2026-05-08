import mongoose from "mongoose";

export default async function connectDB() {
	try {
		const DATABASE_URL =
			process.env.DATABASE_URL ?? "";

		await mongoose.connect(
			DATABASE_URL,
			{
				serverSelectionTimeoutMS: 30000,
				family: 4,
			},
		);

		console.log(
			`Database connected: ${mongoose.connection.name}`,
		);
	} catch (error) {
		console.log(
			"MongoDB connection error:",
			error,
		);

		process.exit(1);
	}
}