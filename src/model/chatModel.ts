import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Chat', chatSchema, 'chat');
