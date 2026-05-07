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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LOCATION_OPTIONS } from "@/lib/utils";
import {
	createTheater,
	theaterSchema,
	updateTheater,
	type TheaterValues,
} from "@/services/theater/theater.service";
import type { Theater } from "@/services/theater/theater.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Save } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminTheaterForm() {
	const detail = useLoaderData() as Theater | undefined;

	const form = useForm<TheaterValues>({
		resolver: zodResolver(theaterSchema),
		defaultValues: {
			name: detail?.name,
			city: detail?.city,
		},
	});

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (data: TheaterValues) =>
			detail === undefined
				? createTheater(data)
				: updateTheater(data, detail._id),
	});

	const navigate = useNavigate();

	const onSubmit = async (val: TheaterValues) => {
		try {
			await mutateAsync(val);

			navigate("/admin/theaters");

			toast.success(
				`Theater data successfully ${detail === undefined ? "created" : "updated"}`,
			);
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		}
	};

	return (
		<>
			<TitleHeading
				title={`${detail === undefined ? "Create" : "Update"} data theater`}
			/>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 w-1/2"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter name..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>City</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a theater city location" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{LOCATION_OPTIONS.map((val, i) => (
											<SelectItem key={`${val + i}`} value={val}>
												{val}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button isLoading={isPending}>
						<Save className="w-4 h-4 mr-2" />
						Submit
					</Button>
				</form>
			</Form>
		</>
	);
}
