import mongoose from "mongoose";
import { timeStamp } from "node:console";

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie"
        }
    ]
}, {timestamps : true})

export default mongoose.model("Genre", genreSchema, "genres");
