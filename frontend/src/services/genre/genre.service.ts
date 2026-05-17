import type { BaseResponse } from "@/types/response";
import type { Genre } from "./genre.type";
import { privateInstance } from "@/lib/axios";
import { z } from "zod";

export const genreSchema = z.object({
	name: z.string().min(5),
});

export type GenreValues = z.infer<typeof genreSchema>;

export const getGenres = (): Promise<BaseResponse<Genre[]>> =>
	privateInstance.get("/admin/genres").then((res) => res.data);

export const createGenre = (data: GenreValues) =>
	privateInstance.post("/admin/genres", data).then((res) => res.data);

export const getDetailGenre = (id: string): Promise<BaseResponse<Genre>> =>
	privateInstance.get(`/admin/genres/${id}`).then((res) => res.data);

export const updateGenre = (data: GenreValues, id: string) =>
	privateInstance.put(`/admin/genres/${id}`, data).then((res) => res.data);

export const deleteGenre = (id: string) =>
	privateInstance.delete(`/admin/genres/${id}`).then((res) => res.data);
