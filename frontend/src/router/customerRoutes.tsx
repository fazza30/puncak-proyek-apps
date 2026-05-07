import {
	redirect,
	type RouteObject,
} from "react-router-dom";

import {
	getSession,
	clearSession,
	isAuthenticated,
	isTokenExpired,
} from "@/lib/utils";

/**
 * PAGES
 */

import CustomerBrowseGenre from "@/pages/CustomerBrowseGenre";
import CustomerHome from "@/pages/CustomerHome";
import CustomerMovieDetail from "@/pages/CustomerMovieDetail";
import CustomerOrderDetail from "@/pages/CustomerOrderDetail";
import CustomerOrders from "@/pages/CustomerOrders";
import CustomerSettings from "@/pages/CustomerSettings";
import CustomerSignIn from "@/pages/CustomerSignIn";
import CustomerSignUp from "@/pages/CustomerSignUp";
import CustomerTransaction from "@/pages/CustomerTransaction";
import CustomerTransactionSuccess from "@/pages/CustomerTransactionSuccess";
import CustomerWallet from "@/pages/CustomerWallet";
import CustomerWalletTopup from "@/pages/CustomerWalletTopup";
import CustomerWalletTopupSuccess from "@/pages/CustomerWalletTopupSuccess";

/**
 * SERVICES
 */

import {
	getDetailMovie,
	getGenres,
	getMovies,
} from "@/services/global/global.service";

import {
	getTheaters,
} from "@/services/theater/theater.service";

import {
	getOrderDetail,
	getOrders,
} from "@/services/transaction/transaction.service";

/**
 * AUTH GUARD
 */

const customerGuard = () => {
	if (isTokenExpired()) {
		clearSession();

		throw redirect("/sign-in");
	}

	if (!isAuthenticated()) {
		throw redirect("/sign-in");
	}

	const session =
		getSession();

	if (
		session?.role !==
		"customer"
	) {
		clearSession();

		throw redirect("/sign-in");
	}

	return session;
};

/**
 * ROUTES
 */

const customerRoutes: RouteObject[] =
	[
		/**
		 * AUTH
		 */

		{
			path: "/sign-up",
			element:
				<CustomerSignUp />,
		},

		{
			path: "/sign-in",
			element:
				<CustomerSignIn />,
		},

		/**
		 * HOME
		 */

		{
			path: "/",

			loader:
				async () => {
					customerGuard();

					try {
						const movies =
							await getMovies();

						const genres =
							await getGenres();

						return {
							movies:
								movies.data,

							genres:
								genres.data,
						};
					} catch (
						error
					) {
						console.log(
							error,
						);

						return null;
					}
				},

			element:
				<CustomerHome />,
		},

		/**
		 * BROWSE
		 */

		{
			path:
				"/browse/:genreId",

			loader:
				async ({
					params,
				}: any) => {
					customerGuard();

					try {
						if (
							!params.genreId
						) {
							throw redirect(
								"/",
							);
						}

						const genres =
							await getGenres();

						const theaters =
							await getTheaters(
								"customer",
							);

						return {
							genres:
								genres.data,

							theaters:
								theaters.data,
						};
					} catch (
						error
					) {
						console.log(
							error,
						);

						return null;
					}
				},

			element:
				<CustomerBrowseGenre />,
		},

		/**
		 * MOVIE DETAIL
		 */

		{
			path:
				"/movie/:movieId",

			loader:
				async ({
					params,
				}: any) => {
					customerGuard();

					try {
						if (
							!params.movieId
						) {
							throw redirect(
								"/",
							);
						}

						const movieDetail =
							await getDetailMovie(
								params.movieId,
							);

						return {
							detail:
								movieDetail
									.data
									.movie,
						};
					} catch (
						error
					) {
						console.log(
							error,
						);

						throw redirect(
							"/",
						);
					}
				},

			element:
				<CustomerMovieDetail />,
		},

		/**
		 * TRANSACTION
		 */

		{
			path:
				"/transaction-ticket",

			loader:
				async () => {
					customerGuard();

					return true;
				},

			element:
				<CustomerTransaction />,
		},

		{
			path:
				"/transaction-ticket/success",

			loader:
				async () => {
					customerGuard();

					return true;
				},

			element:
				<CustomerTransactionSuccess />,
		},

		/**
		 * WALLET
		 */

		{
			path: "/wallets",

			loader:
				async () => {
					customerGuard();

					return true;
				},

			element:
				<CustomerWallet />,
		},

		{
			path:
				"/wallets/topup",

			loader:
				async () => {
					customerGuard();

					return true;
				},

			element:
				<CustomerWalletTopup />,
		},

		{
			path:
				"/wallets/topup/success",

			loader:
				async () => {
					customerGuard();

					return true;
				},

			element:
				<CustomerWalletTopupSuccess />,
		},

		/**
		 * ORDERS
		 */

		{
			path: "/orders",

			loader:
				async () => {
					customerGuard();

					try {
						const transactions =
							await getOrders();

						return transactions.data;
					} catch (
						error
					) {
						console.log(
							error,
						);

						return [];
					}
				},

			element:
				<CustomerOrders />,
		},

		{
			path:
				"/orders/:orderId",

			loader:
				async ({
					params,
				}: any) => {
					customerGuard();

					try {
						if (
							!params.orderId
						) {
							throw redirect(
								"/orders",
							);
						}

						const transaction =
							await getOrderDetail(
								params.orderId,
							);

						return transaction.data;
					} catch (
						error
					) {
						console.log(
							error,
						);

						throw redirect(
							"/orders",
						);
					}
				},

			element:
				<CustomerOrderDetail />,
		},

		/**
		 * SETTINGS
		 */

		{
			path: "/settings",

			loader:
				async () => {
					customerGuard();

					return true;
				},

			element:
				<CustomerSettings />,
		},
	];

export default customerRoutes;