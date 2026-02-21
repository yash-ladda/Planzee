import Participation from "../models/Participation.js";
import Event from "../models/Event.js";

export const joinEvent = async (req, res, next) => {
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

        if (isAlreadyJoined && isAlreadyJoined.status == "ACTIVE") {
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

        let participation = undefined;

        if(isAlreadyJoined) {
            participation = await Participation.findOneAndUpdate(
                { _id: isAlreadyJoined._id},
                {status: status},
                {new: true}
            );
        }
        else {
            participation = await Participation.create({
                userId,
                eventId: id,
                role: "ATTENDEE",
                status
            });
        }

        return res.status(201).json({ participation });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const leaveEvent = async (req, res, next) => {
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
        next(err);
    }
};

export const joinAsVolunteer = async (req, res, next) => {
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

        // find ANY participation (ignore status)
        let participation = await Participation.findOne({
            userId,
            eventId: id
        });

        if (participation) {

            if (participation.status !== "LEFT") {
                return res.status(400).json({
                    message: "You are already joined for this event"
                });
            }

            participation.status = "ACTIVE";
            participation.role = "VOLUNTEER";
            participation.leftAt = null;
            participation.joinedAt = new Date();

            await participation.save();

            return res.status(200).json({ participation });
        }

        participation = await Participation.create({
            userId,
            eventId: id,
            role: "VOLUNTEER",
            status: "ACTIVE"
        });

        return res.status(201).json({ participation });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const getEventParticipants = async (req, res, next) => {

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

        if (!participation) {
            return res.status(403).json({ message: "You are not allowed to see the participants" });
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
        next(err);
    }
};

export const getMyEvents = async (req, res, next) => {
    try {

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const userId = user._id;

        const organized = await Participation.find({
            userId,
            role: "ORGANIZER",
            status: "ACTIVE"
        }).populate("eventId");

        const volunteered = await Participation.find({
            userId,
            role: "VOLUNTEER",
            status: "ACTIVE"
        }).populate("eventId");

        const attended = await Participation.find({
            userId,
            role: "ATTENDEE",
            status: "ACTIVE"
        }).populate("eventId");

        const pastAttended = await Participation.find({
            userId,
            role: "ATTENDEE",
            status: "LEFT"
        }).populate("eventId");

        return res.status(200).json({
            organized,
            volunteered,
            attended,
            pastAttended
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const getMyOrganizedEventsDashboard = async (req, res, next) => {

    try {

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" })
        }

        const organizedEvents = await Participation.find({
            userId: req.user._id,
            role: "ORGANIZER",
            status: "ACTIVE"
        });

        // find() always returns array
        if (organizedEvents.length === 0) {
            return res.status(200).json({ myOrganizedEvents: [] });
        }

        let myOrganizedEvents = [];

        for (let p of organizedEvents) {
            const obj = {};
            obj.counts = {};

            const event = await Event.findById(p.eventId).select(
                "title startTime endTime state category"
            );

            if (!event) continue;
            obj.event = event;

            obj.counts.attendees = await Participation.countDocuments({
                eventId: p.eventId,
                role: "ATTENDEE",
                status: "ACTIVE"
            });

            obj.counts.waitlisted = await Participation.countDocuments({
                eventId: p.eventId,
                role: "ATTENDEE",
                status: "WAITLISTED"
            });

            obj.counts.volunteers = await Participation.countDocuments({
                eventId: p.eventId,
                role: "VOLUNTEER",
                status: "ACTIVE"
            });

            myOrganizedEvents.push(obj);
        }

        res.status(200).json({ myOrganizedEvents });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};