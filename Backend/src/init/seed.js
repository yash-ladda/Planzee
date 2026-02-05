import dotenv from "dotenv";
import connectDB from "../config/db.js";

import User from "../models/User.js";
import Event from "../models/Event.js";
import Participation from "../models/Participation.js";
import Review from "../models/Review.js";

import usersData from "./data/users.js";
import eventsData from "./data/events.js";
import participationsData from "./data/participations.js";
import reviewsData from "./data/reviews.js";

dotenv.config();

const seed = async () => {
    try {
        await connectDB();

        console.log("Clearing old data...");

        await Review.deleteMany();
        await Participation.deleteMany();
        await Event.deleteMany();
        await User.deleteMany();

        console.log("Inserting users...");

        const createdUsers = [];
        for (const user of usersData) {
            const createdUser = await User.create(user); // important: for password hook
            createdUsers.push(createdUser);
        }

        console.log("Inserting events...");

        const createdEvents = [];

        for (const event of eventsData) {
            const { createdByIndex, ...eventData } = event;

            const createdEvent = await Event.create({
                ...eventData,
                createdBy: createdUsers[createdByIndex]._id
            });

            createdEvents.push(createdEvent);
        }

        console.log("Inserting participations...");

        for (const p of participationsData) {
            await Participation.create({
                userId: createdUsers[p.userIndex]._id,
                eventId: createdEvents[p.eventIndex]._id,
                role: p.role,
                status: p.status
            });
        }

        console.log("Inserting reviews...");

        for (const r of reviewsData) {
            await Review.create({
                userId: createdUsers[r.userIndex]._id,
                eventId: createdEvents[r.eventIndex]._id,
                rating: r.rating,
                comment: r.comment,
                isAnonymous: r.isAnonymous
            });
        }

        console.log("Seeding completed successfully");
        process.exit();

    } catch (err) {
        console.error("Seeding failed");
        console.error(err);
        process.exit(1);
    }
};

seed();