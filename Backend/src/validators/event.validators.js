import { z } from "zod";
import { editEvent } from "../controllers/eventController";

export const createEventValidator = z.object({
    title: z.string().min(3, "Title should include at least 3 characters"),
    description: z.string().max(1000, "Description cannot exceeds 1000 characters").optional(),
    category: z.enum([
        "HACKATHON",
        "WORKSHOP",
        "FEST",
        "MEETUP",
        "SEMINAR",
        "WEBINAR",
        "GENERAL"
    ]).optional(),
    locationType: z.enum([
        "ONLINE",
        "OFFLINE",
        "HYBRID",
    ]),
    locationDetails: z.string().max(200, "Address cannot exceed 200 characters"),
    joinLink: z.string().url(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    capacity: z.number().int().min(1),
}).refine(data => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"]
});

export const editEventValidator = z.object({
    title: z.string().min(3, "Title should include at least 3 characters").optional(),
    description: z.string().max(1000, "Description cannot exceeds 1000 characters").optional(),
    category: z.enum([
        "HACKATHON",
        "WORKSHOP",
        "FEST",
        "MEETUP",
        "SEMINAR",
        "WEBINAR",
        "GENERAL"
    ]).optional(),
    locationType: z.enum([
        "ONLINE",
        "OFFLINE",
        "HYBRID",
    ]).optional(),
    locationDetails: z.string().max(200, "Address cannot exceed 200 characters").optional(),
    joinLink: z.string().url().optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    capacity: z.number().int().min(1).optional(),
}).refine(
    data => {
        if (!data.startTime || !data.endTime) return true;
        return data.endTime > data.startTime;
    },
    {
        message: "End time must be after start time",
        path: ["endTime"]
    }
);

export const getEventQueryValidator = z.object({
    category: z.enum([
        "HACKATHON",
        "WORKSHOP",
        "FEST",
        "MEETUP",
        "SEMINAR",
        "WEBINAR",
        "GENERAL"
    ]).optional(),

    type: z.enum([
        "live",
        "upcoming",
        "registration",
        "past",
        "draft"
    ]).optional()
});

export const eventParamsValidator = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid event id")
});
