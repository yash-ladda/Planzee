import mongoose from "mongoose";

const participationSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        role: {
            type: String,
            enum: [
                "ATTENDEE",
                "VOLUNTEER",
                "ORGANIZER",
            ],
            default: "ATTENDEE",
            required: true,
        },
        status: {
            type: String,
            enum: [
                "ACTIVE",
                "WAITLISTED",
                "LEFT",
            ],
            default: "WAITLISTED",
        },
        joinedAt: {
            type: Date,
            default: Date.now(),
            required: true,
        },
        leftAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

participationSchema.index({userId: 1, eventId: 1}, {unique: true});

export default mongoose.model("Participation", participationSchema);