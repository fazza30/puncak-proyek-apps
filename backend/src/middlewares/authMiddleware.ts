// src/middlewares/authMiddleware.ts

import type {
	Request,
	Response,
	NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import User from "../models/User";

/**
 * ==================================================
 * EXTEND REQUEST
 * ==================================================
 */

export interface AuthRequest
	extends Request {
	user?: any;
}

/**
 * ==================================================
 * AUTH MIDDLEWARE
 * ==================================================
 */

export const authMiddleware =
	async (
		req: AuthRequest,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const authHeader =
				req.headers.authorization;

			/**
			 * Bearer token check
			 */
			if (
				!authHeader ||
				!authHeader.startsWith(
					"Bearer ",
				)
			) {
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
			 * Get token
			 */
			const token =
				authHeader.split(
					" ",
				)[1];

			/**
			 * Verify token
			 */
			const secretKey =
				process.env
					.SECRET_KEY ??
				"";

			const decoded =
				jwt.verify(
					token,
					secretKey,
				) as any;

			/**
			 * Find user
			 */
			const user =
				await User.findById(
					decoded.data.id,
				);

			if (!user) {
				return res
					.status(401)
					.json({
						status:
							"failed",
						message:
							"User not found",
						data: null,
					});
			}

			/**
			 * Token mismatch
			 * (single session)
			 */
			if (
				user.activeToken !==
				token
			) {
				return res
					.status(401)
					.json({
						status:
							"failed",
						message:
							"Session expired",
						data: null,
					});
			}

			/**
			 * Update activity
			 */
			user.lastActiveAt =
				new Date();

			await user.save();

			/**
			 * Attach user
			 */
			req.user = user;

			next();
		} catch (error) {
			return res
				.status(401)
				.json({
					status:
						"failed",
					message:
						"Invalid token",
					data: null,
				});
		}
	};

/**
 * ==================================================
 * ROLE MIDDLEWARE
 * ==================================================
 */

export const roleMiddleware =
	(
		role:
			| "admin"
			| "customer",
	) =>
	(
		req: AuthRequest,
		res: Response,
		next: NextFunction,
	) => {
		try {
			if (
				!req.user
			) {
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

			if (
				req.user.role !==
				role
			) {
				return res
					.status(403)
					.json({
						status:
							"failed",
						message:
							"Forbidden access",
						data: null,
					});
			}

			next();
		} catch (error) {
			return res
				.status(500)
				.json({
					status:
						"failed",
					message:
						"Middleware error",
					data: null,
				});
		}
	};