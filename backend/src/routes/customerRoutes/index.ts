// src/routes/customer/index.ts

import express from "express";

import globalRoutes from "./globalRoutes";
import walletRoutes from "./walletRoutes";

import { getTheaters } from "../../controllers/theaterController";

import {
	authMiddleware,
	roleMiddleware,
} from "../../middlewares/authMiddleware";

/**
 * ==================================================
 * ROUTER
 * ==================================================
 */
const customerRoutes =
	express.Router();

/**
 * ==================================================
 * GLOBAL PROTECTION
 * Semua route /customer/*
 * wajib login + role customer
 * ==================================================
 */
customerRoutes.use(
	authMiddleware
);

customerRoutes.use(
	roleMiddleware(
		"customer"
	)
);

/**
 * ==================================================
 * MODULE ROUTES
 * ==================================================
 */
customerRoutes.use(
	globalRoutes
);

customerRoutes.use(
	walletRoutes
);

/**
 * ==================================================
 * EXTRA ROUTES
 * ==================================================
 */
customerRoutes.get(
	"/theaters",
	getTheaters
);

/**
 * ==================================================
 * EXPORT
 * ==================================================
 */
export default customerRoutes;