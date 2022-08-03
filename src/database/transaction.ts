import {ErrorType, RoomType} from "../api/controller/type";
import {Room} from "../api/model";
import mongoose from "mongoose";

export function createRoom(room: RoomType, callback: Function) {

    let res = {
        error: ''
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
                callback(new_room, res)
            }
        )
        .catch(error => {
            console.log(error)
            res.error = "방 생성에 실패했습니다."
            callback(res)
        })
}