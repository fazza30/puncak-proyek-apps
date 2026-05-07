import type { Request, Response} from "express";
import Theater from "../models/Theater";
import { theaterSchema } from "../utils/zodSchema";
import { builtinModules } from "node:module";

export const getTheaters = async(req: Request, res: Response) => {
    try {
        const theaters = await Theater.find()

        return res.json({
            data: theaters,
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


export const getTheaterDetail = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const theater = await Theater.findById(id)

        return res.json({
            data: theater,
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

export const postTheater = async (req: Request, res: Response) => {
    try {
        const body = theaterSchema.parse(req.body)

        const theater = new Theater({
            name: body.name,
            city: body.city
        })

        const newData = await theater.save()

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

export const putTheater = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const body = theaterSchema.parse(req.body);

        await Theater.findByIdAndUpdate(id, {
            name: body.name,
            city: body.city
        })

        const updatedData = await Theater.findById(id)

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

export const deleteTheater = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedData = await Theater.findById(id)

        await Theater.findByIdAndDelete(id);

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