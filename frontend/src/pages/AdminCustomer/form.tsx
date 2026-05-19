import TitleHeading from "@/components/TitleHeading";

import { Button } from "@/components/ui/button";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
	type RegisterValues,
	signUp,
	signUpSchema,
} from "@/services/auth/auth.service";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import {
	ImagePlus,
	Save,
} from "lucide-react";

import { useMemo } from "react";

import { useForm } from "react-hook-form";

import {
	useNavigate,
} from "react-router-dom";

import { toast } from "sonner";

/**
 * ==================================================
 * COMPONENT
 * ==================================================
 */

export default function AdminCustomerForm() {
	/**
	 * ==================================================
	 * FORM
	 * ==================================================
	 */

	const form =
		useForm<RegisterValues>(
			{
				resolver:
					zodResolver(
						signUpSchema,
					),

				defaultValues:
					{
						name: "",

						email: "",

						password: "",
					},
			},
		);

	/**
	 * ==================================================
	 * WATCH PHOTO
	 * ==================================================
	 */

	const photo =
		form.watch(
			"photo",
		);

	/**
	 * ==================================================
	 * PHOTO PREVIEW
	 * ==================================================
	 */

	const previewImage =
		useMemo(() => {
			if (
				photo instanceof
				File
			) {
				return URL.createObjectURL(
					photo,
				);
			}

			return "";
		}, [photo]);

	/**
	 * ==================================================
	 * MUTATION
	 * ==================================================
	 */

	const {
		isPending,
		mutateAsync,
	} = useMutation({
		mutationFn: signUp,
	});

	/**
	 * ==================================================
	 * NAVIGATION
	 * ==================================================
	 */

	const navigate =
		useNavigate();

	/**
	 * ==================================================
	 * SUBMIT
	 * ==================================================
	 */

	const onSubmit =
		async (
			val: RegisterValues,
		) => {
			try {
				const formData =
					new FormData();

				formData.append(
					"name",
					val.name,
				);

				formData.append(
					"email",
					val.email,
				);

				formData.append(
					"password",
					val.password,
				);

				formData.append(
					"photo",
					val.photo,
				);

				await mutateAsync(
					formData,
				);

				navigate(
					"/admin/customers",
				);

				toast.success(
					"Customer successfully created",
				);

				form.reset();
			} catch (
				error
			) {
				console.log(
					error,
				);

				toast.error(
					"Something went wrong",
				);
			}
		};

	return (
		<>
			<TitleHeading title="Create customer" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						onSubmit,
					)}
					className="w-1/2 space-y-6"
				>
					{/* ================================================== */}
					{/* PHOTO */}
					{/* ================================================== */}

					<FormField
						control={
							form.control
						}
						name="photo"
						render={({
							field:
								{
									onChange,
								},
						}) => (
							<FormItem>
								<FormLabel>
									Photo
								</FormLabel>

								<FormControl>
									<div className="space-y-4">
										<div className="flex items-center gap-4">
											<div className="h-24 w-24 overflow-hidden rounded-full border">
												{previewImage ? (
													<img
														src={
															previewImage
														}
														alt="preview"
														className="h-full w-full object-cover"
													/>
												) : (
													<div className="flex h-full w-full items-center justify-center bg-muted">
														<ImagePlus className="h-6 w-6 text-muted-foreground" />
													</div>
												)}
											</div>

											<Input
												type="file"
												accept="image/*"
												onChange={(
													e,
												) => {
													onChange(
														e
															.target
															.files?.[0],
													);
												}}
											/>
										</div>
									</div>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					{/* ================================================== */}
					{/* NAME */}
					{/* ================================================== */}

					<FormField
						control={
							form.control
						}
						name="name"
						render={({
							field,
						}) => (
							<FormItem>
								<FormLabel>
									Name
								</FormLabel>

								<FormControl>
									<Input
										placeholder="Enter customer name..."
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					{/* ================================================== */}
					{/* EMAIL */}
					{/* ================================================== */}

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
										placeholder="Enter email..."
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					{/* ================================================== */}
					{/* PASSWORD */}
					{/* ================================================== */}

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
										placeholder="Enter password..."
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					{/* ================================================== */}
					{/* SUBMIT */}
					{/* ================================================== */}

					<Button
						type="submit"
						isLoading={
							isPending
						}
					>
						<Save className="mr-2 h-4 w-4" />
						Submit
					</Button>
				</form>
			</Form>
		</>
	);
}