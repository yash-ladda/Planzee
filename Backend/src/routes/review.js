import express from "express";
import { createReview, getReviews } from "../controllers/reviewControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/events/:id/reviews", protect, createReview);
router.get("/events/:id/reviews", getReviews);

export default router;