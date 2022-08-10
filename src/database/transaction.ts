import {ErrorType, RoomType} from "../api/controller/type";
import {Room} from "./model";
import mongoose from "mongoose";
import {RoomEnter} from "./model/chat/RoomEnterSchema";
import * as Mongoose from "mongoose";
import {reject} from "lodash";
import {JoinRoom} from "./model/chat/room/JoinRoom";

export function createRoom(room: RoomType) {

    const exist = (new_room: any) => {
        return Room.exists({_id: new_room._id})
            .then(doc => !!doc)
    }

    return Room.init()
        .then(() => new Room(room))
        .then(new_room => {
            new_room._id = new mongoose.Types.ObjectId();
            return exist(new_room)
                .then((doc) => new Promise(function (resolve, reject) {
                        if (!doc) {
                            resolve(new_room)
                        } else {
                            throw new Error(ErrorType.ALREADY_EXIST)
                        }
                    })
                )
        })
        .then((new_room: any) =>
            new Promise((resolve, reject) => resolve(new_room.save()))
        )
        .catch(error => {
            console.log(error)
            return error
        })
}

export function joinRoom(room_id: string, user_id: string, password?: string) {

    return Room.findOne({_id: room_id}).exec()
        .then(
            // 채팅방 id, 해당 방에 입장한 유저 id를 도큐먼트로 등록
            room => {
                // 방이 존재 && (비밀번호 없으면 true, 비밀번호 있으면 문자열 비교 결과에 따라 달라짐)
                let success = !!room && (!room.password || (room.password === password));
                return new Promise((resolve, reject) => {
                    const join_room = new JoinRoom({
                        room_id: room_id,
                        user_id: user_id
                    })
                    resolve({
                        join_room: join_room
                    })
                })
            },
            reject => {
                throw new Error("no room")
            }
        )
        .then(
            ({join_room}: any) => {
                join_room.save();
                JoinRoom.count({room_id: room_id}, (err, count) => {

                })
                return
            })
        .catch(
            e => {
                console.log(e)
            }
        )
}