import mongoose from "mongoose"

const Schema = mongoose.Schema;

const joinRoomSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    room_id: String,
    user_id: String
    // location: String,
});

export const JoinRoom = mongoose.model('Room', joinRoomSchema);
