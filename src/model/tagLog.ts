import mongoose from "mongoose";

export default mongoose.model('TagLog', new mongoose.Schema(
    {
        email: String,
        tags: [{
            number: Number,
            tagName: String,
        }], 
        topTag: String,
    },
    {
        timestamps: true
    }
), 'tag_log');
