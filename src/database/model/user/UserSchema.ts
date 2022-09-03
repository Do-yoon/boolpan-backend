import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IUser {
    _id: mongoose.Types.ObjectId,
    email: string,
    name: string,
    password: string,
    date: number
}

const userSchema = new Schema<IUser>({
    _id: mongoose.Types.ObjectId,
    email: {type: String, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Number, default: Date.now()}
});

export const User = mongoose.model('User', userSchema);
