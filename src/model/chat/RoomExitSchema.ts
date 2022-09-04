import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomExitSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    user_id: String,
    room_id: String,
    date: {type: Date, default: Date.now},
    success: Boolean
});

export const RoomExit = mongoose.model('RoomExit', roomExitSchema);
