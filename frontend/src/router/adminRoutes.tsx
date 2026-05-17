/**
 * ==================================================
 * src/router/adminRoutes.tsx
 * FINAL PRODUCTION VERSION
 * ==================================================
 */

import {
	redirect,
	type RouteObject,
} from "react-router-dom";

import {
	isAuthenticated,
	getSession,
	clearSession,
	isTokenExpired,
} from "@/lib/utils";

/**
 * ==================================================
 * PAGES
 * ==================================================
 */

import AdminLayout from "@/components/AdminLayout";

import AdminLoginPage from "@/pages/AdminLoginPage";

import AdminOverview from "@/pages/AdminOverview";

import AdminGenre from "@/pages/AdminGenre";
import AdminGenreForm from "@/pages/AdminGenre/form";

import AdminTheater from "@/pages/AdminTheater";
import AdminTheaterForm from "@/pages/AdminTheater/form";

import AdminMovie from "@/pages/AdminMovie";
import AdminMovieForm from "@/pages/AdminMovie/form";

import AdminCustomer from "@/pages/AdminCustomer";

import AdminTransactions from "@/pages/AdminTransaction";

import AdminWalletTransactions from "@/pages/AdminWalletTransaction";

/**
 * ==================================================
 * SERVICES
 * ==================================================
 */

import {
	getGenres,
	getDetailGenre,
} from "@/services/genre/genre.service";

import {
	getTheaters,
	getDetailTheater,
} from "@/services/theater/theater.service";

import {
	getMovies,
	getDetailMovie,
} from "@/services/movie/movie.service";

import {
	getCustomers,
	getTransactions,
	getWalletTransactions,
} from "@/services/customer/customer.service";

/**
 * ==================================================
 * AUTH GUARD
 * ==================================================
 */

const adminGuard = () => {
	/**
	 * token expired
	 */
	if (
		isTokenExpired()
	) {
		clearSession();

		throw redirect(
			"/admin/login",
		);
	}

	/**
	 * no session
	 */
	if (
		!isAuthenticated()
	) {
		throw redirect(
			"/admin/login",
		);
	}

	const session =
		getSession();

	/**
	 * wrong role
	 */
	if (
		session?.role !==
		"admin"
	) {
		clearSession();

		throw redirect(
			"/admin/login",
		);
	}

	return session;
};

/**
 * ==================================================
 * ROUTES
 * ==================================================
 */

const adminRoutes: RouteObject[] =
	[
		/**
		 * LOGIN
		 */
		{
			path: "/admin/login",
			element:
				<AdminLoginPage />,
		},

		/**
		 * PRIVATE ADMIN
		 */
		{
			path: "/admin",

			element:
				<AdminLayout />,

			loader: () =>
				adminGuard(),

			children: [
				/**
				 * DASHBOARD
				 */
				{
					index: true,
					element:
						<AdminOverview />,
				},

				/**
				 * GENRES
				 */
				{
					path: "/admin/genres",

					loader:
						async () => {
							adminGuard();

							const genres =
								await getGenres();

							return genres.data;
						},

					element:
						<AdminGenre />,
				},

				{
					path: "/admin/genres/create",

					loader: () =>
						adminGuard(),

					element:
						<AdminGenreForm />,
				},

				{
					path: "/admin/genres/edit/:id",

					loader:
						async ({
							params,
						}) => {
							adminGuard();

							if (
								!params.id
							) {
								throw redirect(
									"/admin/genres",
								);
							}

							const detail =
								await getDetailGenre(
									params.id,
								);

							return detail.data;
						},

					element:
						<AdminGenreForm />,
				},

				/**
				 * THEATERS
				 */
				{
					path: "/admin/theaters",

					loader:
						async () => {
							adminGuard();

							const theaters =
								await getTheaters();

							return theaters.data;
						},

					element:
						<AdminTheater />,
				},

				{
					path: "/admin/theaters/create",

					loader: () =>
						adminGuard(),

					element:
						<AdminTheaterForm />,
				},

				{
					path: "/admin/theaters/edit/:id",

					loader:
						async ({
							params,
						}) => {
							adminGuard();

							if (
								!params.id
							) {
								throw redirect(
									"/admin/theaters",
								);
							}

							const detail =
								await getDetailTheater(
									params.id,
								);

							return detail.data;
						},

					element:
						<AdminTheaterForm />,
				},

				/**
				 * MOVIES
				 */
				{
					path: "/admin/movies",

					loader:
						async () => {
							adminGuard();

							const movies =
								await getMovies();

							return movies.data;
						},

					element:
						<AdminMovie />,
				},

				{
					path: "/admin/movies/create",

					loader:
						async () => {
							adminGuard();

							const genres =
								await getGenres();

							const theaters =
								await getTheaters();

							return {
								genres:
									genres.data,

								theaters:
									theaters.data,

								detail:
									null,
							};
						},

					element:
						<AdminMovieForm />,
				},

				{
					path: "/admin/movies/edit/:id",

					loader:
						async ({
							params,
						}) => {
							adminGuard();

							if (
								!params.id
							) {
								throw redirect(
									"/admin/movies",
								);
							}

							const genres =
								await getGenres();

							const theaters =
								await getTheaters();

							const detail =
								await getDetailMovie(
									params.id,
								);

							return {
								genres:
									genres.data,

								theaters:
									theaters.data,

								detail:
									detail.data,
							};
						},

					element:
						<AdminMovieForm />,
				},

				/**
				 * CUSTOMERS
				 */
				{
					path: "/admin/customers",

					loader:
						async () => {
							adminGuard();

							const customers =
								await getCustomers();

							return customers.data;
						},

					element:
						<AdminCustomer />,
				}, 

				/**
				 * CUSTOMERS 
				 */
				{
					path: "/admin/customers/create",

					loader:
						async () => {
							adminGuard();

							const customers =
								await getCustomers();

							return customers.data;
						},

					element:
						<AdminCustomer />,
				},

				/**
				 * TRANSACTIONS
				 */
				{
					path: "/admin/transactions",

					loader:
						async () => {
							adminGuard();

							const transactions =
								await getTransactions();

							return transactions.data;
						},

					element:
						<AdminTransactions />,
				},

				/**
				 * WALLET
				 */
				{
					path: "/admin/wallet-transactions",

					loader:
						async () => {
							adminGuard();

							const transactions =
								await getWalletTransactions();

							return transactions.data;
						},

					element:
						<AdminWalletTransactions />,
				},
			],
		},
	];

/**
 * ==================================================
 * EXPORT
 * ==================================================
 */

export default adminRoutes;