import mongoose from "mongoose"

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    pw: {type: String, default : null},
    limit: Number,
    init_date: {type: Date, default: Date.now},
    location: String,
    user_list: {type: {user_id: String, enter_time: Date}, default : null}
});

export const Room = mongoose.model('Room', roomSchema);
