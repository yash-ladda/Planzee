import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getEventParticipants, joinAsVolunteer, joinEvent, leaveEvent } from "../controllers/participationController.js";

const router = express.Router();

router.post("/events/:id/join", protect, joinEvent);
router.post("/events/:id/leave", protect, leaveEvent);
router.post("/events/:id/volunteer", protect, joinAsVolunteer);
router.get("/events/:id/participants", protect, getEventParticipants);

export default router;