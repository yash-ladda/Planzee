import {z} from "zod";

export const registerValidator = z.object({
    name: z.string().min(2, "Name should be atleast 2 characters long"),
    username: z.string().min(3, "Username cannot be less than 3 characters"),
    password: z.string().min(8, "Password should be at least 8 characters"),
    email: z.string().toLowerCase()
});

export const loginValidator = z.object({
    email: z.string().lowercase(),
    password: z.string().min(8, "Password should be at least 8 characters")
});