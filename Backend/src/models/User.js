import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        email: {
            type: String, 
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 200
        },
        profileImage: {
            type: String,
            default: "https://cdn-icons-png.freepik.com/256/6681/6681213.png?semt=ais_white_label",
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);