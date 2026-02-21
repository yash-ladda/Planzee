import express from "express";
import { protect, attachUser } from "../middlewares/authMiddleware.js";
import {createEvent, editEvent, getEvent, getSingleEvent} from "../controllers/eventController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createEventValidator, editEventValidator, eventParamsValidator, getEventQueryValidator } from "../validators/event.validators.js";


const router  = express.Router();

router.post("/", protect, validate(createEventValidator, "body"), createEvent);
router.put("/:id", protect, validate(eventParamsValidator, "params"), validate(editEventValidator, "body"), editEvent);
router.get("/", getEvent);
router.get("/:id", validate(eventParamsValidator, "params"), attachUser, getSingleEvent);

export default router;