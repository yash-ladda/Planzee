import Participation from "../models/Participation.js";
import Event from "../models/Event.js";

export const joinEvent = async (req, res) => {
    try {

        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.state !== "REG_OPEN") {
            return res.status(400).json({ message: "Event is not open for registration" });
        }

        const userId = req.user._id;

        // check if already joined
        const isAlreadyJoined = await Participation.findOne({
            userId,
            eventId: id
        });

        if (isAlreadyJoined) {
            return res.status(400).json({ message: "You are already joined for this event" });
        }

        // count active attendees
        const activeCount = await Participation.countDocuments({
            eventId: id,
            role: "ATTENDEE",
            status: "ACTIVE"
        });

        // decide status
        let status = "ACTIVE";

        if (activeCount >= event.capacity) {
            status = "WAITLISTED";
        }

        const participation = await Participation.create({
            userId,
            eventId: id,
            role: "ATTENDEE",
            status
        });

        return res.status(201).json({ participation });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const leaveEvent = async (req, res) => {
    try {

        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const userId = req.user._id;

        // find current participation (only ACTIVE or WAITLISTED)
        const participation = await Participation.findOne({
            userId,
            eventId: id,
            status: { $in: ["ACTIVE", "WAITLISTED"] }
        });

        if (!participation) {
            return res.status(400).json({ message: "You are not joined for this event" });
        }

        const wasActiveAttendee =
            participation.status === "ACTIVE" &&
            participation.role === "ATTENDEE";

        // mark current user as LEFT
        await Participation.findByIdAndUpdate(
            participation._id,
            {
                $set: {
                    status: "LEFT",
                    leftAt: new Date()
                }
            },
            { runValidators: true }
        );

        let promotedUser = null;

        // promote only if an ACTIVE attendee left
        if (wasActiveAttendee) {
            promotedUser = await Participation.findOneAndUpdate(
                {
                    eventId: id,
                    status: "WAITLISTED",
                    role: "ATTENDEE"
                },
                {
                    $set: { status: "ACTIVE" }
                },
                {
                    sort: { joinedAt: 1 },
                    new: true
                }
            );
        }

        return res.status(200).json({
            left: true,
            promotedUser
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const joinAsVolunteer = async (req, res) => {

    try {

        const {id} = req.params;

        if(!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const event = await Event.findById(id);

        if(!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const userId = req.user._id;

        const isAlreadyJoined = await Participation.findOne({
            userId,
            eventId: id
        });

        if(isAlreadyJoined) {
            return res.status(400).json({ message: "You are already joined for this event"});
        }

        const participation = await Participation.create({
            userId,
            eventId: id,
            role: "VOLUNTEER",
            status: "ACTIVE"
        });

        return res.status(201).json({ participation });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getEventParticipants = async (req, res) => {

    try {

        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const userId = req.user._id;

        //check if this user exists as organizer in participation model, for the given event
        const participation = await Participation.findOne({
            userId,
            eventId: id,
            role: "ORGANIZER",
            status: "ACTIVE"
        });

        if(!participation) {
            return res.status(403).json({ message: "You are not allowed to see the participants"});
        }

        const attendees = await Participation.find({
            eventId: id,
            role: "ATTENDEE",
            status: "ACTIVE"
        });

        const waitlisted = await Participation.find({
            eventId: id,
            role: "ATTENDEE",
            status: "WAITLISTED"
        });

        const volunteers = await Participation.find({
            eventId: id,
            role: "VOLUNTEER",
            status: "ACTIVE"
        });

        return res.status(200).json({
            "attendees": attendees,
            "waitlisted": waitlisted,
            "volunteers": volunteers   
        });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};