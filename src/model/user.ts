import mongoose from "mongoose";

export default mongoose.model('User', new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: null
    },
    role: {
        type: [String],
        default: [
            'guest'
        ]
    }
    }, 
    {
        timestamps: true
    }
    ), 'user')
