import mongoose from "mongoose";

const loginSessionSchema = new mongoose.Schema(
{
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	token: String,

	expiresAt: {
		type: Date,
		required: true,
	},
},
{
	timestamps: true,
}
);

loginSessionSchema.index(
{ expiresAt: 1 },
{ expireAfterSeconds: 0 }
);

export default mongoose.model(
	"LoginSession",
	loginSessionSchema
);