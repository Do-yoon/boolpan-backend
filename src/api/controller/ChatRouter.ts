import express from "express";
import {User} from "../model/UserSchema";
import asyncWrapper from "./Wrapper";
import {Room} from "../model/RoomSchema";
import {Message} from "../model/MessageSchema";
import mongoose, {Schema} from "mongoose";

const chatRouter = express.Router();

chatRouter.get('/', asyncWrapper(
    async (req: any, res: any) => {
        const room_list = await Room.find().exec()
        if (room_list.length === 0) {
            res.send(null);
            return;
        }
    console.log('/v0/chat');

    res.send(room_list);
}));

chatRouter.get('/:id', asyncWrapper(
    async (req: any, res: any) => {
        const id = req.params.id;
        const room = await Room.findOne({_id: id}).exec()
        if (!room) {
            res.send(null);
            return;
        } else {

            res.send(room);
        }

        console.log('/v0/user/login');

}));

chatRouter.post('/createRoom', asyncWrapper(
    async (req: any, res: any) => {
        console.log('/createRoom')
        const room = {
            ...req.body.roominfo,
            current: 1
        }
        await Room.init();
        const new_room = await new Room(room);
        new_room._id = new mongoose.Types.ObjectId();
        if (await Room.exists({name: room.name})) {
            console.log(await User.exists({email: new_room.email}));
            console.log("exists");
            return false;
        }
        await new_room.save((err: any) => console.log(err));
        const res_body = {
            room_id: new_room._id,
            end_time: new_room.date
        }
        res.send(res_body)
        console.log(res_body)
    }));

chatRouter.post('/sendMessage/:id', (req: any, res: any) => {
    const msg = req.body;
    console.log(msg);

    // no problem
    res.send({status: 0});
});

type RoomType = {
    id: number
    name: string
    title: string
    limit: number
    current: number
}

interface ChatList {
    chat_list: RoomType[]
}

chatRouter.post('/sendMessage/:room', asyncWrapper(async (req: any, res: any) => {
        const data = {
            user: req.query.user,
            room: req.params.room,
            message: req.body.message
        }
        await Message.init();
        const new_message = await new Message(data);
        await new_message.save((err: any) => console.log(err));
        res.send(data)

    })
)


export default chatRouter;
