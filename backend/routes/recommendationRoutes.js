import express from "express";
import {
  generateRecommendations,
  getUserHistory,
  getRecommendationById,
} from "../controllers/recommendationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// History routes
router.get("/history", protect, getUserHistory);

// Single recommendation detail
router.get("/:id", protect, getRecommendationById);

// Generate new recommendation
router.post("/", protect, generateRecommendations);

export default router;
