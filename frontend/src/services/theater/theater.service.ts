import type { BaseResponse } from "@/types/response";
import { privateInstance } from "@/lib/axios";
import { z } from "zod";
import type { Theater } from "./theater.type";

export const theaterSchema = z.object({
	name: z.string().min(3),
	city: z.string({ required_error: "Please select a theater city location" }),
});

export type TheaterValues = z.infer<typeof theaterSchema>;

export const getTheaters = (
	type: "admin" | "customer" = "admin",
): Promise<BaseResponse<Theater[]>> =>
	privateInstance.get(`/api/${type}/theaters`).then((res) => res.data);

export const createTheater = (data: TheaterValues) =>
	privateInstance.post("/api/admin/theaters", data).then((res) => res.data);

export const getDetailTheater = (id: string): Promise<BaseResponse<Theater>> =>
	privateInstance.get(`/api/admin/theaters/${id}`).then((res) => res.data);

export const updateTheater = (data: TheaterValues, id: string) =>
	privateInstance.put(`/api/admin/theaters/${id}`, data).then((res) => res.data);

export const deleteTheater = (id: string) =>
	privateInstance.delete(`/api/admin/theaters/${id}`).then((res) => res.data);
