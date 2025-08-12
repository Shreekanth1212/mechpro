import express from "express";
import { authenticateUser } from "../middleware/authHandler.js";
import { getUserProfile, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", authenticateUser, getUserProfile);
router.post("/update", authenticateUser, updateUser);

export default router;