import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		profileImg: {
			type: String,
			default: "",
		},
		role: {
			type: String,
			enum: ["member", "admin"],
			default: "member",
		},
		status: {
			type: String,
			enum: ["active", "suspended"],
			default: "active",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
