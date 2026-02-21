import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get user from DB
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // attach user to request
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export const attachUser = async (req, res, next) => {
    try {
        let token;

        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        else {
            req.user = undefined;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        req.user = user;

        next();
    }
    catch(err) {
        return res.status(401).json({message: "User not found"})
    }
};