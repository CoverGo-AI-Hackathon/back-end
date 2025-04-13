import mongoose from "mongoose";

export default mongoose.model('UserInfo', new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        aboutMe: {
            default: "",
            type: String
        },
        phone: {
            type: String,
            default: ""
        },
        dob: {
            type: String,
            default: null
        },
        gender: {
            type: String,
            enum: ["male", "female", "unknown"],
            default: "unknown"
        }
    }, 
    {
        timestamps: true
    }
    ), 'user_info')
