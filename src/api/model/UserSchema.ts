import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    name: String,
    password: String,
    date: {type: Date, default: Date.now}
});

export const User = mongoose.model('User', userSchema);
