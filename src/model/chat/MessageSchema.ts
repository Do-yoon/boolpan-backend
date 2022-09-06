import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: Number,
    room: Number,
    message: String
})

export const Message = mongoose.model('Message', messageSchema);

