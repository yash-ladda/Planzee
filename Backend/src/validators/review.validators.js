import {z} from "zod";

export const createReviewValidator = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
    isAnonymous: z.boolean().optional()
});