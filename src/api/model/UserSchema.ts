import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const userSchema = new Schema({
    _id: ObjectId,
    email: String,
    name: String,
    password: String
});

export const User = mongoose.model('User', userSchema);
