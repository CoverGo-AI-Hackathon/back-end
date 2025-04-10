import mongoose from "mongoose";

export default mongoose.model('Test', new mongoose.Schema({
    note: String
}), 'test')