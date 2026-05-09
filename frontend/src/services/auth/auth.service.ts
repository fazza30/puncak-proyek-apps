import type { BaseResponse } from "@/types/response";
import { z } from "zod";
import type { LoginResponse } from "./auth.type";
import { globalInstance } from "@/lib/axios";

export const authSchema = z.object({
	name: z.string().min(5),
	email: z.string().email(),
	password: z.string().min(5),
	role: z.enum(["admin", "customer"]),
});

export const signUpSchema = authSchema.omit({ role: true }).extend({
	photo: z
		.any()
		.refine((file: File) => file?.name, { message: "Photo is required" }),
});

export const loginSchema =
	authSchema.omit({
		name: true,
		role: true,
	});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof signUpSchema>;

export const login = async (
	data: LoginValues,
): Promise<BaseResponse<LoginResponse>> =>
	globalInstance.post("/auth/login", data).then((res) => res.data);

export const signUp = async (data: FormData) =>
	globalInstance.post("/auth/register", data).then((res) => res.data);
