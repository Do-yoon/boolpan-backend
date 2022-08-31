import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface IUser {
    _id: mongoose.Types.ObjectId,
    email: string,
    name: string,
    password: string,
    date: Date
}

const userSchema = new Schema<IUser>({
    _id: mongoose.Types.ObjectId,
    email: String,
    name: String,
    password: String,
    date: {type: Date, default: Date.now}
});

export const User = mongoose.model('User', userSchema);
