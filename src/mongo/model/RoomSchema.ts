import mongoose from "mongoose"

const Schema = mongoose.Schema;

interface IRoom {
    _id: mongoose.Types.ObjectId,
    name: string,
    category: string,
    password?: string,
    limit: number,
    createdAt: number,
}

const roomSchema = new Schema<IRoom>({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    password: String,
    limit: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Number,
        default: Date.now()
    }
});

export const Room = mongoose.model('Room', roomSchema);
