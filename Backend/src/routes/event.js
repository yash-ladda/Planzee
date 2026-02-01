import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {createEvent, editEvent, getEvent} from "../controllers/eventController.js";

const router  = express.Router();

router.post("/", protect, createEvent);
router.put("/:id", protect, editEvent);
router.get("/", getEvent);

export default router;