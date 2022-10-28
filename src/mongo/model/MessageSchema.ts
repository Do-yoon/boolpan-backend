import mongoose from "mongoose"

const Schema = mongoose.Schema;

interface IMessage {
    _id: mongoose.Types.ObjectId,
    room: string,
    user: string,
    message: string,
    img?: string,
    imgUrl?: string
    createdAt: number,
}

const messageSchema = new Schema<IMessage>({
    room: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    img: String,
    imgUrl: String,
    createdAt: {
        type: Number,
        default: Date.now()
    }
});

export const Message = mongoose.model('Message', messageSchema);
