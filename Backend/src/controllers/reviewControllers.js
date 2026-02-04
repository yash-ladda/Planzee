import express from "express";
import Review from "../models/Review.js";
import Participation from "../models/Participation.js";
import Event from "../models/Event.js";

export const createReview = async (req, res) => {

    try {

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const userId = user._id;

        const {id: eventId} = req.params;
        const event = await Event.findById(eventId);
        if(!event) {
            return res.status(400).json({ message: "Event not found" });
        }
        if(event.state !== "COMPLETED") {
            return res.status(400).json({ message: "Event is not yet completed, please come when event is completed" });
        }

        const isParticipatedInEvent = await Participation.findOne({
            eventId,
            userId,
            status: { $in: ["ACTIVE", "LEFT"] }
        });
        if(!isParticipatedInEvent) {
            return res.status(400).json({ message: "You are not participated in event, cannot give review"});
        }

        const isAlreadyReviewed = await Review.findOne({
            userId,
            eventId
        });
        if(isAlreadyReviewed) {
            return res.status(400).json({ message: "You have already given review for this event" });
        }

        const {rating, comment, isAnonymous} = req.body;

        const review = await Review.create({
            userId,
            eventId,
            rating,
            comment,
            isAnonymous
        });

        res.status(201).json(review);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};