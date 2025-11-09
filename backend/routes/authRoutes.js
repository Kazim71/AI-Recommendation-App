import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { checkDBConnection } from "../middleware/dbCheck.js";

const router = express.Router();

router.post("/register", asyncHandler(checkDBConnection), asyncHandler(registerUser));
router.post("/login", asyncHandler(checkDBConnection), asyncHandler(loginUser));

export default router;