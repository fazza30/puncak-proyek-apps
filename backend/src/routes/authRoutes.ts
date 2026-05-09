// src/routes/authRoutes.ts

/**
 * ==================================================
 * AUTH ROUTES
 * FINAL PRODUCTION VERSION
 * ==================================================
 */

import express from "express";

import multer from "multer";

/**
 * ==================================================
 * CONTROLLERS
 * ==================================================
 */

import {
	login,
	register,
	logout,
	getMe,
	getActiveUsers,
} from "../controllers/authController";

/**
 * ==================================================
 * MIDDLEWARES
 * ==================================================
 */

import {
	authMiddleware,
} from "../middlewares/authMiddleware";

import {
	validateRequest,
} from "../middlewares/validateRequest";

/**
 * ==================================================
 * VALIDATION SCHEMA
 * ==================================================
 */

import {
	authSchema,
} from "../utils/zodSchema";

/**
 * ==================================================
 * MULTER CONFIG
 * ==================================================
 */

import {
	imageFilter,
	thumbnailStorage,
} from "../utils/multer";

/**
 * ==================================================
 * ROUTER
 * ==================================================
 */

const authRoutes =
	express.Router();

/**
 * ==================================================
 * MULTER INSTANCE
 * ==================================================
 */

const upload =
	multer({
		storage:
			thumbnailStorage(
				"public/uploads/photos",
			),

		fileFilter:
			imageFilter,

		limits: {
			fileSize:
				5 *
				1024 *
				1024, // 5MB
		},
	});

/**
 * ==================================================
 * PUBLIC ROUTES
 * ==================================================
 */

/**
 * ==================================================
 * LOGIN
 * ==================================================
 */

authRoutes.post(
	"/auth/login",

	validateRequest(
		authSchema.omit({
			name: true,
			role: true,
		}),
	),

	login,
);

/**
 * ==================================================
 * REGISTER
 * ==================================================
 */

authRoutes.post(
	"/auth/register",

	upload.single(
		"photo",
	),

	register,
);

/**
 * ==================================================
 * PRIVATE ROUTES
 * ==================================================
 */

/**
 * ==================================================
 * LOGOUT
 * ==================================================
 */

authRoutes.post(
	"/auth/logout",

	authMiddleware,

	logout,
);

/**
 * ==================================================
 * GET CURRENT USER
 * ==================================================
 */

authRoutes.get(
	"/auth/me",

	authMiddleware,

	getMe,
);

/**
 * ==================================================
 * VERIFY TOKEN
 * ==================================================
 */

authRoutes.get(
	"/auth/verify",

	authMiddleware,

	(req, res) => {
		return res.json({
			status: "success",

			message:
				"Token valid",

			data: {
				user:
					(req as any)
						.user,
			},
		});
	},
);

/**
 * ==================================================
 * GET ACTIVE USERS
 * ==================================================
 */
authRoutes.get(
	"/auth/active-users",
	getActiveUsers,
);

/**
 * ==================================================
 * EXPORT
 * ==================================================
 */

export default authRoutes;