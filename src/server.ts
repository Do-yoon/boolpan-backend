import {server} from "./app";
import process from "process";
import io from "./io";
import {createRoom, joinRoom} from "./database/transaction";
import {type} from "os";
import {
    CreateRoomParams,
    JoinRoomParams, LeaveRoomParams,
    SendMessageParams
} from "./api/controller/type/RequestDataTypes";
import {RoomInfoType, UserInfo} from "./api/controller/type";
import {JoinRoomResponseData} from "./api/controller/type/ResponseDataTypes";
import user from "./api";
import {Room, User} from "./database/model";
import {JoinRoom} from "./database/model/chat/room/JoinRoom";

const PORT = process.env.PORT || 8081;
console.log(`port: ${PORT}`)

// TODO: 에러 종류 세분화
// TODO: 방장 기능 만들기
io.on('connection', (socket: any) => {

    const rooms = io.of("/").adapter.rooms;
    const sids = io.of("/").adapter.sids;
    const user = new Map<string, string>()

    socket.on("init", (email: string) => {
        User.findOne({email: email})
            .then(doc => {
                user.set(socket.id, doc._id)
            })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        user.delete(socket.id);
    });

    socket.on('sendMessage', (params: SendMessageParams) => {
        const room_info = rooms.get(params.room_id)
        const user_id = user.get(socket.id)

        if (!!room_info && !!user_id) {
            User.findOne({_id: user_id})
                .then(doc => {
                    socket.to(`${params.room_id}`).emit('getMessage', {
                        sender: doc.user.name,
                        msg: params.msg,
                        timestamp: Date.now()
                    });
                })
        } else {
            socket.to(socket.id).emit('error', {msg: "메시지를 보내지 못했습니다."})
        }
    });

    // 방 생성
    // client -> `${user} 님이 입장했습니다.`
    socket.on("create-room", (params: CreateRoomParams) => {
        console.log(`create-room: ${params.name}`);
        const explode_time = Date.now() + params.keeping_time;
        const new_room_info: RoomInfoType = {
            explode_time: explode_time,
            anonymous_user_number: new Map<string, number>(),
        }

        createRoom({
            ...params,
            explode_time: explode_time,
            current: 1
        }).then((room: any) =>
            new Promise((resolve, reject) => {
                console.log(room)
                const res = {
                    error: ''
                }
                const user_id = user.get(socket.id)
                if (user_id) {
                    User.findOne({_id: user_id})
                        .then(doc => {
                            //로그
                            socket.in(room._id).emit('new_user', {user: doc.name})
                        })
                } else {
                    res.error = "방을 만들지 못했습니다."
                }
                if (typeof params.callback !== "function") {
                    console.log(`callback is not a function: ${params.callback}`)
                    res.error = `callback is not a function: ${params.callback}`
                }
                params.callback(res)

                socket.join(room._id)
                console.log(`explode_time: ${explode_time}`)
                setTimeout(() => {
                    io.to(room._id).emit("delete-room", {msg: "펑! 방 유지시간이 끝났어요."})
                    io.socketsLeave(room._id);
                    //로그
                    resolve(room._id)
                }, params.keeping_time);
            })
        ).then((id: any) => {
            console.log(`room deleted: ${id}`)
        })
    });


    // 입장
    // client -> `${user} 님이 입장했습니다.`
    socket.on('join-room', (params: JoinRoomParams) => {
        socket.join(params.room_id)
        console.log(`join:${params.room_id}`)

        let res: JoinRoomResponseData = {
            roominfo: {
                name: '',
                current: 0,
                limit: 0,
                explode_time: 0
            },
            error: ''
        }

        joinRoom(params.room_id, socket.id, params.password)
            .then((room: any) => {
                if (len && room.limit >= len) {
                    user_map.anonymous_user_number.set(socket.id, room.current + 1);
                    socket.in(params.room_id).emit('new_user', {user: user_map.anonymous_user_number.get(socket.id)});
                } else if (!len) {
                    res.error = "입장하지 못했습니다.";
                } else {
                    res.error = "정원 초과로 입장하지 못했습니다."
                }
            })

        if (typeof params.callback === "function")
            params.callback(res)
        else {
            console.log(`callback is not a function: ${params.callback}`)
            res.error = `callback is not a function: ${params.callback}`
        }

    })


    socket.on('leave-room', (params: LeaveRoomParams) => {
        socket.leave(params.room_id)
        const room_info = room_info_map.get(params.room_id)
        if (room_info) {
            room_info.anonymous_user_number.delete(socket.id)
        }
    });

})
;

server.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
    console.log("chat server");
});