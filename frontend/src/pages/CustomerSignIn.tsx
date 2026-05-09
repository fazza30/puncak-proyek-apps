/**
 * ==================================================
 * src/pages/CustomerSignIn.tsx
 * FINAL PRODUCTION VERSION
 * ==================================================
 */

import { useEffect, useState } from "react";

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
	getActiveUsers,
} from "@/services/auth/auth.service";

import {
	saveSession,
	isAuthenticated,
	getSession,
	clearSession,
} from "@/lib/utils";

import { socket } from "@/lib/socket";

export default function CustomerSignIn() {
	/**
	 * ==================================================
	 * NAVIGATION
	 * ==================================================
	 */
	const navigate =
		useNavigate();

	const [
		activeUsers,
		setActiveUsers,
	] = useState(0);

	const [
		maxUsers,
		setMaxUsers,
	] = useState(10);

	/**
	 * ==================================================
	 * SOCKET REALTIME USERS
	 * ==================================================
	 */
	useEffect(() => {
		socket.on(
			"active-users",
			(data) => {
				setActiveUsers(
					data.activeUsers,
				);

				setMaxUsers(
					data.maxUsers,
				);
			},
		);

		return () => {
			socket.off(
				"active-users",
			);
		};
	}, []);

	/**
	 * ==================================================
	 * GET ACTIVE USERS
	 * ==================================================
	 */
	useEffect(() => {
		getActiveUsers()
			.then((res) => {
				setActiveUsers(
					res.data.activeUsers,
				);

				setMaxUsers(
					res.data.maxUsers,
				);
			})
			.catch(() => {
				console.log(
					"Failed get active users",
				);
			});
	}, []);

	/**
	 * ==================================================
	 * FORM
	 * ==================================================
	 */
	const {
		register,
		handleSubmit,
		formState: {
			errors,
		},
	} =
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
							"",
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
				 * save secure session
				 */
				saveSession(
					response.data,
				);

				toast.success(
					"Login berhasil",
				);

				navigate(
					"/",
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
		<div
			id="Content-Container"
			className="relative flex flex-col w-full min-h-screen bg-[linear-gradient(90deg,_#000000_40.82%,_#0E0E24_99.88%)] text-white overflow-x-hidden]"
		>
			{/* ==================================================
				BACKGROUND
			================================================== */}
			<div className="absolute top-0 w-full h-[480px]">
				<div className="absolute top-0 w-full h-full bg-[linear-gradient(359.16deg,_#000000_6.6%,_rgba(14,14,36,0)_99.33%)]" />

				<img
					src="/assets/images/backgrounds/signin.png"
					className="w-full h-full object-cover"
					alt="background"
				/>
			</div>

			{/* ==================================================
				LOGO
			================================================== */}
			<img
				src="/assets/images/logos/logo.png"
				className="relative mx-auto mt-[70px] w-[clamp(180px,80vw,500px)] object-contain"
				alt="logo"
			/>

			{/* ==================================================
				FORM
			================================================== */}
			<form
				onSubmit={handleSubmit(
					onSubmit,
				)}
				className="relative flex flex-col gap-[30px] px-5 py-[60px] my-auto"
			>
				<h1 className="font-bold text-[26px] leading-[39px]">
					Sign In
				</h1>
				<p
					className={`text-sm ${
						activeUsers >=
						maxUsers
							? "text-red-400"
							: "text-white/70"
					}`}
				>
					User online:
					{" "}
					{activeUsers}
					/
					{maxUsers}
				</p>

				<div className="flex flex-col gap-4">
					{/* EMAIL */}
					<label className="flex flex-col gap-2">
						<p>Email</p>

						<input
							type="email"
							placeholder="Masukkan email"
							autoComplete="email"
							disabled={
								isPending
							}
							{...register(
								"email",
							)}
							className="appearance-none outline-none rounded-full py-3 px-[18px] bg-[#FFFFFF33] backdrop-blur-sm font-semibold placeholder:font-normal placeholder:text-white focus:ring-1 focus:ring-white transition-all duration-300 disabled:opacity-60"
						/>

						{errors.email && (
							<p className="text-xs text-red-500">
								{
									errors
										.email
										.message
								}
							</p>
						)}
					</label>

					{/* PASSWORD */}
					<label className="flex flex-col gap-2">
						<p>Password</p>

						<input
							type="password"
							placeholder="Masukkan password"
							autoComplete="current-password"
							disabled={
								isPending
							}
							{...register(
								"password",
							)}
							className="appearance-none outline-none rounded-full py-3 px-[18px] bg-[#FFFFFF33] backdrop-blur-sm font-semibold placeholder:font-normal placeholder:text-white focus:ring-1 focus:ring-white transition-all duration-300 disabled:opacity-60"
						/>

						{errors.password && (
							<p className="text-xs text-red-500">
								{
									errors
										.password
										.message
								}
							</p>
						)}
					</label>
				</div>

				{/* BUTTON */}
				<button
					type="submit"
					disabled={
						isPending
					}
					className="w-full rounded-full py-3 px-[18px] bg-white text-center font-bold text-premiere-black transition-all duration-300 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{isPending
						? "Loading..."
						: "Login"}
				</button>
			</form>
		</div>
	);
}