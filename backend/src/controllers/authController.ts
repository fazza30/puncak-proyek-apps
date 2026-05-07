import type {
	Request,
	Response,
} from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Wallet from "../models/Wallet";

import { authSchema } from "../utils/zodSchema";

/**
 * ==================================================
 * CONFIG
 * ==================================================
 */

// maksimal customer login bersamaan
const MAX_ACTIVE_USERS = 10;

// token expired
const TOKEN_EXPIRED_MINUTES = 30;

// maksimal percobaan login
const MAX_LOGIN_ATTEMPTS = 5;

// durasi blokir login
const BLOCK_MINUTES = 15;

/**
 * ==================================================
 * LOGIN SCHEDULE
 * ==================================================
 */

const LOGIN_SCHEDULE: Record<
	string,
	string
> = {
	"gmail.com":
		"2026-05-07",
		
	"grade1.com":
		"2026-05-14",

	"grade2.com":
		"2026-05-15",

	"grade3.com":
		"2026-05-16",

	"grade4.com":
		"2026-05-17",

	"grade5.com":
		"2026-05-17",
};

/**
 * ==================================================
 * HELPERS
 * ==================================================
 */

const addMinutes = (
	date: Date,
	minutes: number,
) => {
	return new Date(
		date.getTime() +
			minutes *
				60 *
				1000,
	);
};

/**
 * WIB DATE
 */
const getTodayWIB =
	(): string => {
		const now =
			new Date();

		const wib =
			new Date(
				now.getTime() +
					7 *
						60 *
						60 *
						1000,
			);

		return wib
			.toISOString()
			.split("T")[0];
	};

/**
 * BUILD JWT TOKEN
 */
const buildToken = (
	user: any,
) => {
	const secretKey =
		process.env
			.SECRET_KEY ?? "";

	return jwt.sign(
		{
			data: {
				id: user._id,
				email:
					user.email,
				role: user.role,
			},
		},
		secretKey,
		{
			expiresIn:
				"30m",
		},
	);
};

/**
 * ==================================================
 * LOGIN
 * ==================================================
 */

export const login =
	async (
		req: Request,
		res: Response,
	) => {
		try {
			/**
			 * VALIDATE BODY
			 */
			const parse =
				authSchema
					.omit({
						name: true,
					})
					.parse(
						req.body,
					);

			/**
			 * FIND USER
			 */
			const user =
				await User.findOne(
					{
						email:
							parse.email,
					},
				);

			if (!user) {
				return res
					.status(
						400,
					)
					.json({
						status:
							"failed",

						message:
							"Email not registered",

						data: null,
					});
			}

			/**
			 * ROLE VALIDATION
			 */
			if (
				parse.role !==
				user.role
			) {
				return res
					.status(
						403,
					)
					.json({
						status:
							"failed",

						message:
							"Unauthorized access",

						data: null,
					});
			}

			/**
			 * BLOCKED CHECK
			 */
			if (
				user.blockedUntil &&
				new Date() <
					user.blockedUntil
			) {
				return res
					.status(
						403,
					)
					.json({
						status:
							"failed",

						message:
							"Too many failed attempts. Try again later.",

						data: null,
					});
			}

			/**
			 * PASSWORD CHECK
			 */
			const validPassword =
				await bcrypt.compare(
					parse.password,
					user.password,
				);

			if (
				!validPassword
			) {
				user.loginAttempts += 1;

				/**
				 * AUTO BLOCK
				 */
				if (
					user.loginAttempts >=
					MAX_LOGIN_ATTEMPTS
				) {
					user.blockedUntil =
						addMinutes(
							new Date(),
							BLOCK_MINUTES,
						);

					user.loginAttempts = 0;
				}

				await user.save();

				return res
					.status(
						400,
					)
					.json({
						status:
							"failed",

						message:
							"Email / Password incorrect",

						data: null,
					});
			}

			/**
			 * ==================================================
			 * LOGIN SCHEDULE CHECK
			 * ADMIN BYPASS
			 * ==================================================
			 */

			const isAdmin =
				user.role ===
				"admin";

			if (
				!isAdmin
			) {
				const domain =
					user.email.split(
						"@",
					)[1];

				/**
				 * DOMAIN NOT REGISTERED
				 */
				if (
					!LOGIN_SCHEDULE[
						domain
					]
				) {
					return res
						.status(
							403,
						)
						.json({
							status:
								"failed",

							message:
								"Email tidak memiliki akses login",

							data: null,
						});
				}

				const today =
					getTodayWIB();

				const allowedDate =
					LOGIN_SCHEDULE[
						domain
					];

				/**
				 * LOGIN DATE INVALID
				 */
				if (
					today !==
					allowedDate
				) {
					return res
						.status(
							403,
						)
						.json({
							status:
								"failed",

							message: `Akun ini hanya bisa login pada ${allowedDate}`,

							data: null,
						});
				}
			}

			/**
			 * ==================================================
			 * MAX ACTIVE LOGIN
			 * ADMIN BYPASS
			 * ==================================================
			 */

			if (
				user.role ===
				"customer"
			) {
				const activeUsers =
					await User.countDocuments(
						{
							role: "customer",

							isLoggedIn: true,

							tokenExpiredAt:
								{
									$gt: new Date(),
								},
						},
					);

				/**
				 * SINGLE SESSION CHECK
				 */
				const alreadyLoggedIn =
					user.isLoggedIn &&
					user.tokenExpiredAt &&
					user.tokenExpiredAt >
						new Date();

				/**
				 * USER BARU
				 * baru dihitung quota
				 */
				if (
					!alreadyLoggedIn &&
					activeUsers >=
						MAX_ACTIVE_USERS
				) {
					return res
						.status(
							403,
						)
						.json({
							status:
								"failed",

							message:
								"Kuota login penuh. Silakan coba lagi.",

							data: null,
						});
				}
			}

			/**
			 * RESET SECURITY
			 */
			user.loginAttempts = 0;

			user.blockedUntil =
				null;

			/**
			 * TOKEN
			 */
			const token =
				buildToken(
					user,
				);

			const now =
				new Date();

			/**
			 * SAVE SESSION
			 */
			user.isLoggedIn =
				true;

			user.activeToken =
				token;

			user.loginAt =
				now;

			user.lastActiveAt =
				now;

			user.tokenExpiredAt =
				addMinutes(
					now,
					TOKEN_EXPIRED_MINUTES,
				);

			await user.save();

			return res.json({
				status:
					"success",

				message:
					"Success login",

				data: {
					name: user.name,

					email:
						user.email,

					role: user.role,

					photoUrl:
						(
							user.toJSON() as any
						).photoUrl,

					token,
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
						"Failed to login",

					data: null,
				});
		}
	};

/**
 * ==================================================
 * REGISTER
 * ==================================================
 */

export const register =
	async (
		req: Request,
		res: Response,
	) => {
		try {
			const parse =
				authSchema
					.omit({
						role: true,
					})
					.safeParse(
						req.body,
					);

			if (
				!parse.success
			) {
				return res
					.status(
						400,
					)
					.json({
						status:
							"failed",

						message:
							"Invalid request",

						data: parse.error.issues.map(
							(
								item,
							) =>
								item.message,
						),
					});
			}

			/**
			 * CHECK EMAIL
			 */
			const exists =
				await User.findOne(
					{
						email:
							parse.data
								.email,
					},
				);

			if (exists) {
				return res
					.status(
						400,
					)
					.json({
						status:
							"failed",

						message:
							"Email already exists",

						data: null,
					});
			}

			/**
			 * HASH PASSWORD
			 */
			const hashedPassword =
				await bcrypt.hash(
					parse.data
						.password,
					12,
				);

			/**
			 * CREATE USER
			 */
			const user =
				await User.create(
					{
						name: parse
							.data
							.name,

						email:
							parse
								.data
								.email,

						password:
							hashedPassword,

						role: "customer",

						photo:
							req.file
								?.filename ??
							"default.png",
					},
				);

			/**
			 * CREATE WALLET
			 */
			await Wallet.create(
				{
					user: user._id,

					balance: 0,
				},
			);

			return res.json({
				status:
					"success",

				message:
					"Success register",

				data: {
					name: user.name,

					email:
						user.email,
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
						"Failed to register",

					data: null,
				});
		}
	};

/**
 * ==================================================
 * LOGOUT
 * ==================================================
 */

export const logout =
	async (
		req: any,
		res: Response,
	) => {
		try {
			const userId =
				req.user?._id;

			if (
				!userId
			) {
				return res.json({
					status:
						"success",

					message:
						"Logout success",
				});
			}

			await User.findByIdAndUpdate(
				userId,
				{
					isLoggedIn:
						false,

					activeToken:
						null,

					tokenExpiredAt:
						null,
				},
			);

			return res.json({
				status:
					"success",

				message:
					"Logout success",
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
						"Logout failed",
				});
		}
	};

/**
 * ==================================================
 * GET CURRENT USER
 * ==================================================
 */

export const getMe =
	async (
		req: any,
		res: Response,
	) => {
		try {
			return res.json({
				status:
					"success",

				message:
					"Success get profile",

				data: {
					id:
						req.user
							._id,

					name:
						req.user
							.name,

					email:
						req.user
							.email,

					role:
						req.user
							.role,

					photoUrl:
						req.user
							.photoUrl,
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
						"Failed get profile",

					data: null,
				});
		}
	};