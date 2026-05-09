/**
 * ==================================================
 * src/pages/AdminLoginPage/index.tsx
 * FINAL PRODUCTION VERSION
 * ==================================================
 */

import { useEffect } from "react";

import {
	useNavigate,
} from "react-router-dom";

import {
	useMutation,
} from "@tanstack/react-query";

import {
	useForm,
} from "react-hook-form";

import {
	zodResolver,
} from "@hookform/resolvers/zod";

import {
	toast,
} from "sonner";

import {
	login,
	loginSchema,
	type LoginValues,
} from "@/services/auth/auth.service";

import {
	saveSession,
	isAuthenticated,
	getSession,
	clearSession,
} from "@/lib/utils";

import {
	Button,
} from "@/components/ui/button";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";

import {
	Input,
} from "@/components/ui/input";

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";

export default function AdminLoginPage() {
	/**
	 * ==================================================
	 * NAVIGATION
	 * ==================================================
	 */
	const navigate =
		useNavigate();

	/**
	 * ==================================================
	 * AUTO CHECK SESSION
	 * ==================================================
	 */
	useEffect(() => {
		try {
			/**
			 * clear expired session
			 */
			if (
				!isAuthenticated()
			) {
				clearSession();

				return;
			}

			const session =
				getSession();

			/**
			 * redirect admin
			 */
			if (
				session?.role ===
				"admin"
			) {
				navigate(
					"/admin",
					{
						replace: true,
					},
				);
			}
		} catch {
			clearSession();
		}
	}, [navigate]);

	/**
	 * ==================================================
	 * FORM
	 * ==================================================
	 */
	const form =
		useForm<LoginValues>(
			{
				resolver:
					zodResolver(
						loginSchema,
					),

				defaultValues:
					{
						email:
							"",
						password:
							""
					},
			},
		);

	/**
	 * ==================================================
	 * LOGIN MUTATION
	 * ==================================================
	 */
	const {
		mutateAsync,
		isPending,
	} =
		useMutation({
			mutationFn:
				login,
		});

	/**
	 * ==================================================
	 * SUBMIT
	 * ==================================================
	 */
	const onSubmit =
		async (
			values: LoginValues,
		) => {
			try {
				const response =
					await mutateAsync(
						values,
					);

				/**
				 * save session
				 */
				saveSession(
					response.data,
				);

				toast.success(
					"Login admin berhasil",
				);

				navigate(
					"/admin",
					{
						replace: true,
					},
				);
			} catch (
				error: any
			) {
				const message =
					error
						?.response
						?.data
						?.message ??
					"Login gagal";

				toast.error(
					message,
				);
			}
		};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						onSubmit,
					)}
					className="w-full max-w-md"
				>
					<Card className="shadow-xl border-0">
						<CardHeader className="space-y-2">
							<CardTitle className="text-2xl font-bold">
								Admin Login
							</CardTitle>

							<CardDescription>
								Login ke dashboard admin bioskop
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-5">
							{/* EMAIL */}
							<FormField
								control={
									form.control
								}
								name="email"
								render={({
									field,
								}) => (
									<FormItem>
										<FormLabel>
											Email
										</FormLabel>

										<FormControl>
											<Input
												type="email"
												placeholder="admin@email.com"
												autoComplete="email"
												disabled={
													isPending
												}
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							{/* PASSWORD */}
							<FormField
								control={
									form.control
								}
								name="password"
								render={({
									field,
								}) => (
									<FormItem>
										<FormLabel>
											Password
										</FormLabel>

										<FormControl>
											<Input
												type="password"
												placeholder="Masukkan password"
												autoComplete="current-password"
												disabled={
													isPending
												}
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-full"
								disabled={
									isPending
								}
							>
								{isPending
									? "Loading..."
									: "Login"}
							</Button>
						</CardContent>
					</Card>
				</form>
			</Form>
		</div>
	);
}