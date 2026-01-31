import Event from "../models/Event.js";

export const createEvent = async (req, res) => {

    try {   
            //read fields to add in event
        const {title, description, category, locationType, locationDetails, joinLink, startTime, endTime, capacity} = req.body;

        //check if required field is missing
        if(!title || !category || !locationType || !startTime || !endTime || capacity < 1) {
            return res.status(400).json({message: "Check if any imp field is missing"});
        }

        //check if user exists or not
        const user = req.user;
        if(!user) {
            return res.status(401).json({ message: "User not authenticated"});
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

        //send response of created event
        res.status(201).json({
            event
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"});
    }
};

export const editEvent = async (req, res) => {
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
        res.status(500).json({ message: "Server error" });
    }
};