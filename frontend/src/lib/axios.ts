/**
 * ==================================================
 * src/lib/axios.ts
 * FINAL PRODUCTION VERSION
 * ==================================================
 */

import axios from "axios";

import {
	getToken,
	getSession,
	clearSession,
	isTokenExpired,
} from "./utils";

/**
 * ==================================================
 * BASE URL
 * ==================================================
 */

const BASE_URL =
	import.meta.env
		.VITE_API_URL ??
	"http://localhost:5000/api";

/**
 * ==================================================
 * PUBLIC INSTANCE
 * login / register / public api
 * ==================================================
 */

export const globalInstance =
	axios.create({
		baseURL: BASE_URL,

		headers: {
			"Content-Type":
				"application/json",
		},
	});

/**
 * ==================================================
 * PRIVATE INSTANCE
 * protected api
 * ==================================================
 */

export const privateInstance =
	axios.create({
		baseURL: BASE_URL,

		headers: {
			"Content-Type":
				"application/json",
		},
	});

/**
 * ==================================================
 * REQUEST INTERCEPTOR
 * attach token
 * ==================================================
 */

privateInstance.interceptors.request.use(
	(config) => {
		try {
			/**
			 * CHECK TOKEN EXPIRED
			 */
			if (
				isTokenExpired()
			) {
				const session =
					getSession();

				clearSession();

				/**
				 * REDIRECT BASED ROLE
				 */
				if (
					session?.role ===
					"admin"
				) {
					window.location.href =
						"/admin/login";
				} else {
					window.location.href =
						"/sign-in";
				}

				return Promise.reject(
					new Error(
						"Session expired",
					),
				);
			}

			/**
			 * GET TOKEN
			 */
			const token =
				getToken();

			/**
			 * ATTACH TOKEN
			 */
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			return config;
		} catch (error) {
			return Promise.reject(
				error,
			);
		}
	},

	(error) =>
		Promise.reject(
			error,
		),
);

/**
 * ==================================================
 * RESPONSE INTERCEPTOR
 * auto logout on 401
 * ==================================================
 */

privateInstance.interceptors.response.use(
	(response) =>
		response,

	(error) => {
		try {
			/**
			 * UNAUTHORIZED
			 */
			if (
				error.response
					?.status ===
				401
			) {
				const session =
					getSession();

				clearSession();

				/**
				 * REDIRECT
				 */
				if (
					session?.role ===
					"admin"
				) {
					window.location.href =
						"/admin/login";
				} else {
					window.location.href =
						"/sign-in";
				}
			}

			/**
			 * FORBIDDEN
			 */
			if (
				error.response
					?.status ===
				403
			) {
				console.error(
					"Forbidden access",
				);
			}

			return Promise.reject(
				error,
			);
		} catch (
			interceptorError
		) {
			return Promise.reject(
				interceptorError,
			);
		}
	},
);

/**
 * ==================================================
 * EXPORT DEFAULT
 * ==================================================
 */

export default privateInstance;