import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate a user based on JWT stored in cookies
 */
export const authenticateUser = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;
		next();
	} catch (err) {
		console.error("Error in authenticateUser middleware:", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Middleware to check if the authenticated user has one of the allowed roles
 */
export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
		}
		next();
	};
};