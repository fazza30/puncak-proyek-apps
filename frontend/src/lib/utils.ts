/**
 * ==================================================
 * src/lib/utils.ts
 * FINAL PRODUCTION VERSION
 * ==================================================
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import secureLocalStorage from "react-secure-storage";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";
import { jwtDecode } from "jwt-decode";

import type { LoginResponse } from "@/services/auth/auth.type";

/**
 * ==================================================
 * CONSTANTS
 * ==================================================
 */

export const SESSION_KEY =
	"SESSION_KEY";

export const LOCATION_OPTIONS =
	[
		"Karawang"
	];

/**
 * ==================================================
 * TAILWIND MERGE
 * ==================================================
 */

export function cn(
	...inputs: ClassValue[]
) {
	return twMerge(
		clsx(inputs),
	);
}

/**
 * ==================================================
 * TOKEN TYPE
 * ==================================================
 */

type JwtPayload = {
	exp: number;
	iat: number;
};

/**
 * ==================================================
 * GET SESSION
 * ==================================================
 */

export function getSession():
	| LoginResponse
	| null {
	const session =
		secureLocalStorage.getItem(
			SESSION_KEY,
		) as LoginResponse;

	if (!session)
		return null;

	return session;
}

/**
 * ==================================================
 * SAVE SESSION
 * ==================================================
 */

export function saveSession(
	data: LoginResponse,
) {
	secureLocalStorage.setItem(
		SESSION_KEY,
		data,
	);
}

/**
 * ==================================================
 * CLEAR SESSION
 * ==================================================
 */

export function clearSession() {
	secureLocalStorage.removeItem(
		SESSION_KEY,
	);
}

/**
 * ==================================================
 * GET TOKEN
 * ==================================================
 */

export function getToken():
	| string
	| null {
	const session =
		getSession();

	if (
		!session?.token
	)
		return null;

	return session.token;
}

/**
 * ==================================================
 * TOKEN EXPIRED CHECK
 * ==================================================
 */

export function isTokenExpired():
	boolean {
	try {
		const token =
			getToken();

		if (!token)
			return true;

		const decoded =
			jwtDecode<JwtPayload>(
				token,
			);

		const now =
			Date.now() /
			1000;

		return (
			decoded.exp <
			now
		);
	} catch {
		return true;
	}
}

/**
 * ==================================================
 * VALID SESSION CHECK
 * ==================================================
 */

export function isAuthenticated() {
	const session =
		getSession();

	if (!session)
		return false;

	if (
		isTokenExpired()
	) {
		clearSession();
		return false;
	}

	return true;
}

/**
 * ==================================================
 * ROLE CHECK
 * ==================================================
 */

export function isAdmin() {
	const session =
		getSession();

	return (
		isAuthenticated() &&
		session?.role ===
			"admin"
	);
}

export function isCustomer() {
	const session =
		getSession();

	return (
		isAuthenticated() &&
		session?.role ===
			"customer"
	);
}

/**
 * ==================================================
 * MONEY FORMAT
 * ==================================================
 */

export function rupiahFormat(
	val: number,
) {
	return new Intl.NumberFormat(
		"id-ID",
		{
			style:
				"currency",
			currency:
				"IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		},
	).format(val);
}

/**
 * ==================================================
 * DATE FORMAT
 * ==================================================
 */

dayjs.extend(
	customParseFormat,
);

export function dateFormat(
	val:
		| Date
		| string,
	format: string =
		"DD MMM YYYY HH:mm",
) {
	if (!val) {
		return "-";
	}

	const parsedDate =
		dayjs(
			val,
			[
				"DD MMM YYYY HH:mm",
				"DD MMMM YYYY HH:mm",
				"DD MMM YYYY",
				"DD MMMM YYYY",
				"YYYY-MM-DDTHH:mm:ss.SSSZ",
			],
			"id",
			true,
		);

	if (
		!parsedDate.isValid()
	) {
		return "-";
	}

	return parsedDate
		.locale("id")
		.format(
			format,
		);
}