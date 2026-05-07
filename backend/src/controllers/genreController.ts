import type { Request, Response} from "express";
import Genre from "../models/Genre";
import { genreSchema } from "../utils/zodSchema";
import { builtinModules } from "node:module";

export const getGenres = async(req: Request, res: Response) => {
    try {
        const genres = await Genre.find()

        return res.json({
            data: genres,
            message: "Success get data",
            status: "Success",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: null,
            message: "Failed to get data",
            status: "Failed",
        })
    }
}

export const getGenreDetail = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const genre = await Genre.findById(id)

        return res.json({
            data: genre,
            message: "Success get data",
            status: "Success",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: null,
            message: "Failed to get data",
            status: "Failed",
        })
    }
}

export const postGenre = async (req: Request, res: Response) => {
    try {
        const body = genreSchema.parse(req.body)

        const genre = new Genre({
            name: body.name
        })

        const newData = await genre.save()

        return res.json({
            data: newData,
            message: "Success create data",
            status: "Success",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: null,
            message: "Failed to create data",
            status: "Failed",
        })
    }
}

export const putGenre = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const body = genreSchema.parse(req.body);

        await Genre.findByIdAndUpdate(id, {
            name: body.name
        })

        const updatedData = await Genre.findById(id)

        return res.json({
            data: updatedData,
            message: "Success update data",
            status: "Success",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: null,
            message: "Failed to update data",
            status: "Failed",
        })
    }
}

export const deleteGenre = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedData = await Genre.findById(id)

        await Genre.findByIdAndDelete(id);

        return res.json({
            data: deletedData,
            message: "Success deleted data",
            status: "Success",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: null,
            message: "Failed to deleted data",
            status: "Failed",
        })
    }
}