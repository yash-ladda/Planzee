import Event from "../models/Event.js";
import Participation from "../models/Participation.js";

export const createEvent = async (req, res, next) => {

    try {
        //read fields to add in event
        const { title, description, category, locationType, locationDetails, joinLink, startTime, endTime, capacity } = req.body;

        //check if required field is missing
        if (!title || !category || !locationType || !startTime || !endTime || capacity < 1) {
            return res.status(400).json({ message: "Check if any imp field is missing" });
        }

        //check if user exists or not
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        //extract user from req (coz we attached user to req in the authMiddleware)
        const createdBy = user._id;

        //add event in Event schema
        const event = await Event.create({
            title,
            description,
            category,
            locationType,
            locationDetails,
            joinLink,
            startTime,
            endTime,
            capacity,
            createdBy
        });

        //create participation to store the role of organizer in participation
        await Participation.create({
            userId: user._id,
            eventId: event._id,
            role: "ORGANIZER",
            status: "ACTIVE",
        });

        //send response of created event
        res.status(201).json({
            event
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};

export const editEvent = async (req, res, next) => {
    try {

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { id } = req.params;

        // check if event exists
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // check if event is live or completed
        if (event.state === "LIVE" || event.state === "COMPLETED") {
            return res.status(400).json({
                message: "Event is live or completed, cannot edit"
            });
        }

        // check ownership
        if (!user._id.equals(event.createdBy)) {
            return res.status(403).json({
                message: "You are not allowed to edit this event"
            });
        }

        // allow only selected fields to be updated
        const allowedFields = [
            "title",
            "description",
            "category",
            "startTime",
            "endTime",
            "capacity",
            "locationType",
            "locationDetails",
            "joinLink"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedEvent);

    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const getEvent = async (req, res, next) => {
    try {
        const { category, type } = req.query;

        const query = {};
        const now = new Date();

        // category filter
        if (category) {
            query.category = category;
        }

        // type filters
        if (type === "live") {
            query.state = "LIVE";
        }

        if (type === "upcoming") {
            query.state = { $in: ["DRAFT", "REG_OPEN"] };
            query.startTime = { $gt: now };
        }

        if (type === "registration") {
            query.state = "REG_OPEN";
            query.startTime = { $gt: now };
        }

        if (type === "past") {
            query.state = "COMPLETED";
        }

        if (type === "draft") {
            query.state = "DRAFT";
        }

        const events = await Event.find(query).sort({ startTime: 1 });

        return res.status(200).json({ events });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const getSingleEvent = async (req, res, next) => {

    try {

        //extract id from req.params
        const { id } = req.params;

        //find the event by id
        const event = await Event.findById(id);

        //if event not found the send this response
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        //else return the event
        res.status(200).json({ event });
    }
    catch (err) {
        // invalid ObjectId case
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid event id" });
        }

        console.log(err);
        next(err);
    }
};