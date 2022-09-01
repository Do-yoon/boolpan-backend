import express from "express";
import asyncWrapper from "./Wrapper";
import {Room} from "../../database/model/chat/room/RoomSchema";
import {Message} from "../../database/model/chat/MessageSchema";
import mongoose, {Schema} from "mongoose";
import {ErrorType, RoomType} from "./type";
import { Request, Response } from "express";

const chatRouter = express.Router();

chatRouter.get('/', asyncWrapper(
    async (req: Request, res: Response) => {
        const room_list = await Room.find({}).select('_id name limit keeping_time')
        console.log(room_list[0])
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

/**
 * request body
 {
     user_id: string,
     room_name: string,
     category: string,
     pw: string,
     live_time: Date
 }

 * response body
 {
     success: boolean,
     error?: number
 }
 */


chatRouter.post('/createRoom', (req: any, res: any) => {
        console.log('/createRoom')
        const room = {
            ...req.body.roominfo,
            current: 1
        }

        Room.init()
            .then(() => new Room(room) )
            .then(new_room => {
                new_room._id = new mongoose.Types.ObjectId();
                return {new_room: new_room, flag: Room.exists({name: room.name})}
            })
            .then(({new_room, flag}: {new_room: any, flag: any}) => {
                if(flag) {
                    throw new Error(ErrorType.ALREADY_EXIST)
                }
                return new_room
            })
            .then(
                (new_room) => {
                    return new_room.save()
                },
                (reject) => {throw new Error(ErrorType.INTERNAL_ERROR)}
            )
            .then((new_room) => {
                    const res_body = {
                        current: new_room.name,
                        end_time: new_room.date
                    }
                    res.send(res_body)
                }
            )
            .catch(error => {
                console.log(error)
                res.send({
                    error: error
                })
            })

    }
);

/**
 * request body
 {
     user_id: string,
     room_id: string,
 }

 * response body
 {
    success: boolean,
    current?: number,
    end_time?: Date,
    error?: string
 }

 */
chatRouter.post('/sendMessage/:id', (req: any, res: any) => {
    const room = req.params.room;
    const user = req.query.user;

    const msg = req.body;
    console.log(msg);

    // no problem
    res.send({status: 0});
});

/**
 * request body
 {
     user_id: string,
     room_id: string,
 }

 * response body
 {
    user_id:
    room_id:
    message:
 }
 */
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
