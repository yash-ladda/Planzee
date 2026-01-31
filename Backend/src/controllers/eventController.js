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