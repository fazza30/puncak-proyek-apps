// src/routes/admin/index.ts

import express from "express";

import genreRoutes from "./genreRoutes";
import theaterRoutes from "./theaterRoutes";
import movieRoutes from "./movieRoutes";
import customerRoutes from "./customerRoutes";

import {authMiddleware, roleMiddleware } from "../../middlewares/authMiddleware";

/**
 * ==================================================
 * ROUTER
 * ==================================================
 */
const adminRoutes =
	express.Router();

/**
 * ==================================================
 * GLOBAL PROTECTION
 * Semua route /admin/*
 * wajib login + admin
 * ==================================================
 */
adminRoutes.use(
	authMiddleware
);

adminRoutes.use(
	roleMiddleware(
		"admin"
	)
);

/**
 * ==================================================
 * MODULE ROUTES
 * ==================================================
 */
adminRoutes.use(
	genreRoutes
);

adminRoutes.use(
	theaterRoutes
);

adminRoutes.use(
	movieRoutes
);

adminRoutes.use(
	customerRoutes
);

/**
 * ==================================================
 * EXPORT
 * ==================================================
 */
export default adminRoutes;