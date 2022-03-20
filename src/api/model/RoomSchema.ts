import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    limit: Number,
    current: Number,
    user_list: [Number],
    date: {type: Date, default: Date.now}

});

export const Room = mongoose.model('Room', roomSchema);
