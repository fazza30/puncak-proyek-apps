import mongoose from "mongoose";

import { getAssetUrl } from "../utils/helper";

import Genre from "./Genre";
import Theater from "./Theater";

/**
 * ==================================================
 * MOVIE SCHEMA
 * ==================================================
 */

const movieSchema =
	new mongoose.Schema(
		{
			title: {
				type: String,
				required: true,
			},

			genre: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Genre",
			},

			theaters: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Theater",
				},
			],

			description: {
				type: String,
				required: true,
			},

			thumbnail: {
				type: String,
				required: true,
			},

			price: Number,

			available: Boolean,

			bonus: String,
		},
		{
			toJSON: {
				virtuals: true,
			},

			toObject: {
				virtuals: true,
			},
		},
	);

/**
 * ==================================================
 * VIRTUAL THUMBNAIL URL
 * ==================================================
 */

movieSchema
	.virtual(
		"thumbnailUrl",
	)
	.get(function () {
		return `${getAssetUrl(
			"thumbnails",
		)}${this.thumbnail}`;
	});

/**
 * ==================================================
 * AFTER SAVE
 * ==================================================
 */

movieSchema.post(
	"save",
	async function (
		doc,
	) {
		if (doc) {
			await Genre.findByIdAndUpdate(
				doc.genre,
				{
					$push: {
						movies:
							doc._id,
					},
				},
			);
		}

		for (const theater of doc.theaters) {
			await Theater.findByIdAndUpdate(
				theater,
				{
					$push: {
						movies:
							doc._id,
					},
				},
			);
		}
	},
);

/**
 * ==================================================
 * AFTER DELETE
 * ==================================================
 */

movieSchema.post(
	"deleteOne",
	async function (
		doc: any,
	) {
		if (doc) {
			await Genre.findByIdAndUpdate(
				doc.genre,
				{
					$pull: {
						movies:
							doc._id,
					},
				},
			);
		}

		for (const theater of doc.theaters) {
			await Theater.findByIdAndUpdate(
				theater,
				{
					$pull: {
						movies:
							doc._id,
					},
				},
			);
		}
	},
);

/**
 * ==================================================
 * EXPORT
 * ==================================================
 */

export default mongoose.model(
	"Movie",
	movieSchema,
	"movies",
);