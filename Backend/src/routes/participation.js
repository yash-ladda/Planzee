import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { joinEvent, leaveEvent } from "../controllers/participationController.js";

const router = express.Router();

router.post("/events/:id/join", protect, joinEvent);
router.post("/events/:id/leave", protect, leaveEvent);

export default router;