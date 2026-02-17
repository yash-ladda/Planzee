import { z } from "zod";

export const registerValidator = z.object({
    name: z.string().min(2, { message: "Name is too short" }),
    username: z.string().min(3, { message: "Username is too short" }),
    password: z.string().min(8, { message: "Password must be at least 8 chars" }),
    email: z.string().email({ message: "Invalid email format" }),
});


export const loginValidator = z.object({
    email: z.string().lowercase(),
    password: z.string().min(8, { message: "Password should be at least 8 characters" })
});