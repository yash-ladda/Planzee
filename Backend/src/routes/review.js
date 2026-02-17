import express from "express";
import { createReview, getReviews } from "../controllers/reviewControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createReviewValidator } from "../validators/review.validators.js";
import { reqParamsValidator } from "../validators/req.params.validator.js";

const router = express.Router();

router.post("/events/:id/reviews", protect, validate(createReviewValidator, "body"), createReview);
router.get("/events/:id/reviews", validate(reqParamsValidator, "params"), getReviews);

export default router;