import mongoose, {
	Schema,
	model,
	models,
} from "mongoose";

import { getAssetUrl } from "../utils/helper";

/**
 * ==================================================
 * USER SCHEMA
 * ==================================================
 */

const userSchema =
	new Schema(
		{
			/**
			 * ==================================================
			 * BASIC INFO
			 * ==================================================
			 */

			name: {
				type: String,

				required: true,

				trim: true,
			},

			email: {
				type: String,

				required: true,

				unique: true,

				lowercase: true,

				trim: true,
			},

			password: {
				type: String,

				required: true,
			},

			photo: {
				type: String,

				required: true,
			},

			role: {
				type: String,

				enum: [
					"admin",
					"customer",
				],

				default:
					"customer",
			},

			/**
			 * ==================================================
			 * SESSION / AUTH
			 * ==================================================
			 */

			isLoggedIn: {
				type: Boolean,

				default: false,
			},

			activeToken: {
				type: String,

				default: null,
			},

			refreshToken: {
				type: String,

				default: null,
			},

			loginAt: {
				type: Date,

				default: null,
			},

			lastActiveAt: {
				type: Date,

				default: null,
			},

			tokenExpiredAt: {
				type: Date,

				default: null,
			},

			/**
			 * ==================================================
			 * SECURITY
			 * ==================================================
			 */

			loginAttempts: {
				type: Number,

				default: 0,
			},

			blockedUntil: {
				type: Date,

				default: null,
			},
		},
		{
			/**
			 * AUTO CREATED_AT & UPDATED_AT
			 */
			timestamps: true,

			/**
			 * RESPONSE TRANSFORM
			 */
			toJSON: {
				virtuals: true,

				transform: (
					_,
					ret: Record<
						string,
						any
					>,
				) => {
					delete ret.password;

					delete ret.__v;

					return ret;
				},
			},

			toObject: {
				virtuals: true,
			},
		},
	);

/**
 * ==================================================
 * VIRTUAL PHOTO URL
 * ==================================================
 */

userSchema
	.virtual(
		"photoUrl",
	)
	.get(function () {
		return `${getAssetUrl(
			"photos",
		)}/${this.photo}`;
	});

/**
 * ==================================================
 * INDEXES
 * ==================================================
 */

userSchema.index({
	isLoggedIn: 1,
});

userSchema.index({
	tokenExpiredAt: 1,
});

userSchema.index({
	role: 1,
});

/**
 * ==================================================
 * EXPORT
 * ==================================================
 */

const User =
	models.User ||
	model(
		"User",
		userSchema,
		"users",
	);

export default User;