import express from "express";
import {User} from "../model/UserSchema";
import asyncWrapper from "./Wrapper";
import {Room} from "../model/RoomSchema";
import {Message} from "../model/MessageSchema";
import mongoose, {Schema} from "mongoose";
import {ErrorType, RoomType} from "./type";

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
            .then(({new_room, flag}) => {
                if(flag) {
                    throw new Error(ErrorType.ALREADY_EXIST)
                }
                return new_room
            })
            .then(
                (new_room) => {
                    new_room.save()
                    return new_room
                },
                (reject) => throw new Error(ErrorType.INTERNAL_ERROR)
            )
            .then((new_room) => {
                    const res_body = {
                        current: new_room._id,
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

chatRouter.post('/enterRoom/:id', asyncWrapper(
    async (req: any, res: any) => {
        const data = req.body;

        // 채팅방 id 받아 검색
        const room = await Room.findOne({_id: data.room_id}).exec()

        // 해당 방 데이터베이스에 입장한 유저 id 등록
        await

        // 반환값: Success/Not Success

        data.room_date
    }
));

chatRouter.post('/sendMessage/:id', (req: any, res: any) => {
    const room = req.params.room;
    const user = req.query.user;

    const msg = req.body;
    console.log(msg);

    // no problem
    res.send({status: 0});
});

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
