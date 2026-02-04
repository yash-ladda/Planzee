import express from "express";
import { createReview } from "../controllers/reviewControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/events/:id/reviews", protect, createReview);

export default router;