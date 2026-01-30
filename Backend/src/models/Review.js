import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 3,
        },
        comment: {
            type: String,
            maxlength: 300,
        },
        isAnonymous: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
);

reviewSchema.index({userId: 1, eventId: 1}, {unique: true});

export default mongoose.model("Review", reviewSchema);