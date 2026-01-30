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
        email: {
            type: String, 
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        profileImage: {
            type: String,
            default: "https://cdn-icons-png.freepik.com/256/6681/6681213.png?semt=ais_white_label",
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 200
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);