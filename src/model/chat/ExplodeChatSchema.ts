import mongoose from "mongoose";

const Schema = mongoose.Schema;

const explodeChatSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    room_id: String,
});

export const ExplodeChat = mongoose.model('ExplodeChat', explodeChatSchema);
