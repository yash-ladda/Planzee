import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {createEvent, editEvent, getEvent, getSingleEvent, joinEvent} from "../controllers/eventController.js";

const router  = express.Router();

router.post("/", protect, createEvent);
router.put("/:id", protect, editEvent);
router.get("/", getEvent);
router.get("/:id", getSingleEvent);
router.post("/:id/join", protect, joinEvent)

export default router;