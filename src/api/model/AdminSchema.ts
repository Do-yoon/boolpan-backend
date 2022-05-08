import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    email: String,
    name: String,
    password: String,
    date: {type: Date, default: Date.now}
});

export const Admin = mongoose.model('Admin', adminSchema);
