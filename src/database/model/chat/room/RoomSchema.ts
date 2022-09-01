import mongoose from "mongoose"

const Schema = mongoose.Schema;

interface IRoom {
    _id: mongoose.Types.ObjectId,
    name: string,
    category: string,
    current: number,
    password: string | null,
    limit: number,
    explode_time: number,
}

const roomSchema = new Schema<IRoom>({
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
