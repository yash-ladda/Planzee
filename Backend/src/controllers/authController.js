import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
    try {
        const { name, username, password, email } = req.body;

        //check if username or email already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: "This email is already registered" });
        }

        //create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            username,
            password: hashedPassword,
            email,
        });

        //create jwt token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        //sending response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //check if email or password is missing
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are important" });
        }

        //find user by its email
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(409).json({ message: "User not found" });
        }

        //check if given password matches with original password
        const isMatch = await bcrypt.compare(password, user.password);
        let token = "";

        if (!isMatch) {
            return res.status(409).json({ message: "Wrong password" });
        }
        else {
            token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
        }

        //send the token and user info
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};