import mongoose, { IfUnknown } from "mongoose";
import { IUserDoc } from "src/interface/user.interface";


export const UserModel = mongoose.model<IUserDoc>('User', new mongoose.Schema<IUserDoc>({
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
