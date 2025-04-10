import mongoose from "mongoose";

export default mongoose.model('UserInfo', new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
    }, 
    {
        timestamps: true
    }
    ), 'user_info')
