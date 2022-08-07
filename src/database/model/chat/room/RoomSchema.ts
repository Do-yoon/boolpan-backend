import mongoose from "mongoose"

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    category: String,
    current: Number,
    password: {type: String, default : null},
    limit: Number,
    explode_time: Number,
    // location: String,
});

export const Room = mongoose.model('Room', roomSchema);
