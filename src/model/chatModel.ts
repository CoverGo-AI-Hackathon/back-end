import mongoose, { Model } from 'mongoose';

const chatSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    isBot: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export interface IChat {
    email: string;
    content: string;
    isBot?: boolean;
}



// ✅ Export with type
const ChatModel = mongoose.model<IChat>('Chat', chatSchema, 'chat');
export default ChatModel;
