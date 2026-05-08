import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import * as XLSX from "xlsx";
import path from "node:path";

import User from "../models/User";
import Wallet from "../models/Wallet";

/**
 * ==================================================
 * CONFIG
 * ==================================================
 */

dotenv.config();

/**
 * ==================================================
 * IMPORT USERS
 * ==================================================
 */

async function importUsers() {
	try {
		/**
		 * ==================================================
		 * CONNECT DATABASE
		 * ==================================================
		 */

		await mongoose.connect(
			process.env.DATABASE_URL ?? "",
			{
				serverSelectionTimeoutMS: 30000,
				family: 4,
			},
		);

		console.log(process.env.DATABASE_URL);

		console.log(
			"MongoDB Connected",
		);

		/**
		 * ==================================================
		 * EXCEL FILE PATH
		 * ==================================================
		 */

		const filePath =
			path.join(
				process.cwd(),
				"src",
				"data",
				"users.xlsx",
			);

		console.log(
			"READ FILE:",
			filePath,
		);

		/**
		 * ==================================================
		 * READ EXCEL
		 * ==================================================
		 */

		const workbook =
			XLSX.readFile(
				filePath,
			);

		const sheetName =
			workbook.SheetNames[0];

		const worksheet =
			workbook.Sheets[
				sheetName
			];

		const users: any[] =
			XLSX.utils.sheet_to_json(
				worksheet,
			);

        console.log(users);

		console.log(
			`TOTAL USERS: ${users.length}`,
		);

		/**
		 * ==================================================
		 * LOOP USERS
		 * ==================================================
		 */

		for (const item of users) {
			try {
				/**
				 * ==================================================
				 * VALIDATE EMAIL
				 * ==================================================
				 */

				const email =
					String(
						item.email ??
							"",
					)
						.trim()
						.toLowerCase();

				if (!email) {
					console.log(
						"SKIP: email kosong",
					);

					continue;
				}

				/**
				 * ==================================================
				 * CHECK EXISTING USER
				 * ==================================================
				 */

				const existingUser =
					await User.findOne(
						{
							email,
						},
					);

				if (
					existingUser
				) {
					console.log(
						`${email} already exists`,
					);

					continue;
				}

				/**
				 * ==================================================
				 * VALIDATE PASSWORD
				 * ==================================================
				 */

				const rawPassword =
					String(
						item.password ??
							"",
					).trim();

				if (
					!rawPassword
				) {
					console.log(
						`INVALID PASSWORD: ${email}`,
					);

					continue;
				}

				/**
				 * ==================================================
				 * HASH PASSWORD
				 * ==================================================
				 */

				const hashedPassword =
					await bcrypt.hash(
						rawPassword,
						10,
					);

				/**
				 * ==================================================
				 * CREATE USER
				 * ==================================================
				 */

				const user =
					new User({
						name:
							String(
								item.name ??
									"User",
							).trim(),

						email,

						password:
							hashedPassword,

						role:
							item.role ??
							"customer",

						photo:
							"default.png",
					});

				await user.save();

				/**
				 * ==================================================
				 * CREATE WALLET
				 * ==================================================
				 */

				await Wallet.create(
					{
						user:
							user._id,

						balance:
							100000,
					},
				);

				console.log(
					`${email} created`,
				);
			} catch (error) {
				console.log(
					"USER IMPORT ERROR:",
					item?.email,
				);

				console.log(
					error,
				);
			}
		}

		/**
		 * ==================================================
		 * FINISH
		 * ==================================================
		 */

		console.log(
			"IMPORT SUCCESS",
		);

		process.exit(0);
	} catch (error) {
		console.log(
			"IMPORT ERROR:",
		);

		console.log(
			error,
		);

		process.exit(1);
	}
}

/**
 * ==================================================
 * RUN SCRIPT
 * ==================================================
 */

importUsers();