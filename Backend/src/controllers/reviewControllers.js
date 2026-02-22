import express from "express";
import Review from "../models/Review.js";
import Participation from "../models/Participation.js";
import Event from "../models/Event.js";

export const createReview = async (req, res, next) => {

    try {

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const userId = user._id;

        const { id: eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(400).json({ message: "Event not found" });
        }
        if (event.state !== "COMPLETED") {
            return res.status(400).json({ message: "Event is not yet completed, please come when event is completed" });
        }

        const isParticipatedInEvent = await Participation.findOne({
            eventId,
            userId,
            status: { $in: ["ACTIVE", "LEFT"] }
        });
        if (!isParticipatedInEvent) {
            return res.status(400).json({ message: "You are not participated in event, cannot give review" });
        }

        const isAlreadyReviewed = await Review.findOne({
            userId,
            eventId
        });
        if (isAlreadyReviewed) {
            return res.status(400).json({ message: "You have already given review for this event" });
        }

        const { rating, comment, isAnonymous } = req.body;

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
        next(err);
    }
};

export const getReviews = async (req, res, next) => {
    try {

        const { id: eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const reviews = await Review.find({ eventId }).populate("userId");

        const totalReviews = reviews.length;

        let avgRating = 0;

        if (totalReviews > 0) {
            let sum = 0;
            for (const review of reviews) {
                sum += review.rating;
            }
            avgRating = sum / totalReviews;
        }

        return res.status(200).json({
            reviews,
            totalReviews,
            avgRating
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const getPendingReviews = async (req, res, next) => {
    try {

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const participations = await Participation.find({
            userId: user._id,
            role: "ATTENDEE",
            status: { $in: ["ACTIVE", "LEFT"] }
        });

        let pendingReviews = [];

        for (const p of participations) {

            const event = await Event.findById(p.eventId);

            if (!event) continue;

            if (event.state !== "COMPLETED") continue;

            const isAlreadyReviewed = await Review.findOne({
                eventId: p.eventId,
                userId: user._id
            });

            if (!isAlreadyReviewed) {
                pendingReviews.push(event);
            }
        }

        return res.status(200).json({ pendingReviews });

    } catch (err) {
        console.log(err);
        next(err);
    }
};