import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: 1000,
            trim: true,
        },
        category: {
            type: String,
            enum: [
                "HACKATHON",
                "WORKSHOP",
                "FEST",
                "MEETUP",
                "SEMINAR",
                "WEBINAR",
                "GENERAL"
            ],
            default: "GENERAL",
        },
        locationType: {
            type: String,
            enum: [
                "ONLINE",
                "OFFLINE",
                "HYBRID",
            ],
            required: true,
        },
        locationDetails: {
            type: String,
            trim: true,
        },
        joinLink: {
            type: String,
            trim: true
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        state: {
            type: String,
            enum: [
                "DRAFT", 
                "REG_OPEN", 
                "LIVE", 
                "COMPLETED"
            ],
            default: "DRAFT",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Event", eventSchema);