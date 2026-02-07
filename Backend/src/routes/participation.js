import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getEventParticipants, getMyEvents, getMyOrganizedEventsDashboard, joinAsVolunteer, joinEvent, leaveEvent } from "../controllers/participationController.js";
import { validate } from "../middlewares/validate.js";
import { reqParamsValidator } from "../validators/req.params.validator.js";

const router = express.Router();

router.post("/events/:id/join", protect, validate(reqParamsValidator, "params"), joinEvent);
router.post("/events/:id/leave", protect, validate(reqParamsValidator, "params"), leaveEvent);
router.post("/events/:id/volunteer", protect, validate(reqParamsValidator, "params"), joinAsVolunteer);
router.get("/events/:id/participants", protect, validate(reqParamsValidator, "params"), getEventParticipants);
router.get("/me/events", protect, getMyEvents);
router.get("/organizer/events", protect, getMyOrganizedEventsDashboard);

export default router;