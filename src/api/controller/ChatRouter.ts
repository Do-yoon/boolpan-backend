import express from "express";
import asyncWrapper from "./Wrapper";
import {Request, Response} from "express";
import EventEmitter from "events";
import {Room} from "../../database/model";

const chatRouter = express.Router();

const eventEmitter = new EventEmitter();

interface GetResponseBody {
    data: {
        room_id: string
        name: string
        limit: number
        current?: number
        isPassword: boolean
    }[]
}

chatRouter.get('/', (req: Request, res: Response<GetResponseBody, {}>) => {
    Room.find({}).select('_id name limit password')
        .then(room_list => {
            if (room_list.length === 0) {
                res.send({data: []});
                return;
            }

            eventEmitter.emit("getCurrentHeadCounts", (rooms: Map<string, Set<string>>) => {
                const resBody: GetResponseBody = {
                    data: room_list.map((v) => ({
                            room_id: v._id.toString(),
                            name: v.name,
                            current: rooms.get(v._id.toString())?.size,
                            limit: v.limit,
                            isPassword: !!v.password,
                        }))
                    }
                res.send(resBody)
            })
        })
})

chatRouter.get('/:id', asyncWrapper(
    async (req: Request, res: Response) => {
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

export default chatRouter;