import {Server} from "socket.io";
import process from "process";
import {Room, User} from "./mongo/model";
import {ClientToServerEvents, InterServerEvents, Chat_ServerToClientEvents, SocketData} from "./ioType";
import mongoose from "mongoose";
import {getTimestampString} from "./util/getTimestampString";
import http from "http";


export function initIO(server: http.Server) {
    const PORT = process.env.PORT || 8081;
    console.log(`port: ${PORT}`)

    const io = new Server<ClientToServerEvents, Chat_ServerToClientEvents, InterServerEvents, SocketData>(server, {
        cors: {
            origin: ["http://localhost:3000/", "http://boolpan-frontend.s3-website.ap-northeast-2.amazonaws.com/:3000"],
            credentials: true
        }
    });

    /* key: objectId
       value: socketId
        */

    const rooms = io.of("/").adapter.rooms;
    const sids = io.of("/").adapter.sids;

    const room = io.of("/room")
    const chat = io.of("/chat")

    room.on("connection", (socket) => {
        socket.on("getChattingRoomList", (callback) => {
            Room.find().select('_id name limit password')
                .then(room_list => {
                    console.log(room_list)
                    if (room_list.length === 0) {
                        callback([]);
                        return;
                    }

                    const res = {
                        data: room_list.map((v) => ({
                            room_id: v._id.toString(),
                            name: v.name,
                            current: rooms.get(v._id.toString())?.size,
                            limit: v.limit,
                            isPassword: !!v.password,
                        }))
                    }
                    console.log(res.data)
                    callback(res.data)
                }).catch(e => console.log(e))
        })

        // 방 생성
        // client -> `${user} 님이 입장했습니다.`
        socket.on("createRoom", (data, {user_id}, callback) => {
            console.log(`createRoom: ${data.name}`);
            const explode_time = Date.now() / 1000 + data.keeping_time;
            let error = ""
            let room_object_id: string;

            Room.init()
                .then(() => {
                    return new Room(data);
                })
                .then((room) => {
                    room._id = new mongoose.Types.ObjectId();
                    return room.save()
                })
                .then((room) => {
                    room_object_id = room._id.toString();
                    return User.findById(user_id).exec();
                })
                .then((room_owner) => {
                    if (room_owner !== null) {
                        socket.in(room_object_id).emit('newUser', room_owner.name)
                        /*
                            explode_time: Date.now() / 1000 + data.keeping_time,
                            current: [user_id],
                         */
                    } else error = "방을 만들지 못했습니다."

                    callback(error, {
                        room_id: room_object_id,
                        name: data.name,
                        current: rooms.get(room_object_id)?.size,
                        limit: data.limit,
                        isPassword: !!data.password,
                    })

                    socket.join(room_object_id)
                    console.log(`explode_time: ${explode_time}`)
                    setTimeout(() => {
                        io.to(room_object_id).emit("deleteRoom", "펑! 방 유지시간이 끝났어요.")
                        io.socketsLeave(room_object_id);
                        Room.findByIdAndDelete(room_object_id).then(() => {
                        })
                        console.log(`room deleted: ${room_object_id}`)
                    }, data.keeping_time)
                });


        })

        // 입장
// client -> `${user} 님이 입장했습니다.`
        socket.on('joinRoom', ({room_id, password, user_id}, callback) => {
            let res = {}, count: number | undefined
            User.findById(user_id).exec()
                .then((user) => {
                    if (user) {
                        const room = rooms.get(room_id)
                        count = (room ? room.size : undefined)
                        return Room.findOne({_id: room_id}).exec()
                    }
                })
                .then(room => {
                    if (room) {
                        if (!room.password || (room.password === password)) {
                            if (count && room.limit >= count) {
                                res = Object.assign(res, {
                                    roominfo: {
                                        room_id,
                                        ...room
                                    }
                                })
                                socket.join(room_id)
                            } else if (!count) {
                                res = Object.assign(res, {error: "입장하지 못했습니다."})
                            } else {
                                res = Object.assign(res, {error: "정원 초과로 입장하지 못했습니다."})
                            }
                        } else {
                            res = Object.assign(res, {error: "비밀번호가 일치하지 않습니다."})
                        }
                    } else {
                        res = Object.assign(res, {error: "존재하지 않는 방입니다."})
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        })

        socket.on('leaveRoom', ({room_id, user_id}) => {
            socket.leave(room_id);
            User.findById(user_id).exec()
                .then((user) => {
                    (user ? socket.in(room_id).emit('leaveUser', user.name) : null);
                })
        });

    })

    chat.on("connection", (socket) => {
        const req = socket.request;
        const {headers: {referer}} = req;
        let room_id: string;
        if (referer !== undefined) {
            room_id = referer
                .split('/')[referer.split("/").length - 1]
                .replace(/\?.+/, '');
            socket.join(room_id)
        }

        socket.on('sendMessage', ({room_id, text, user_id}) => {
            User.findById(user_id).exec()
                .then((user) => {
                    if (rooms.get(room_id) !== undefined && user !== null) {
                        socket.to(room_id).emit('getMessage', {
                            message: {
                                sender: user.name,
                                text: text,
                                timestamp: getTimestampString()
                            }
                        })
                    } else socket.to(socket.id).emit('error', "메시지를 보내지 못했습니다.")
                })
        });

        socket.on("disconnect", () => {
            console.log("chat 네임스페이스 접속 해제")
            socket.leave(room_id)
        })

    })

    server.listen(PORT, () => {
        console.log("http://localhost:" + PORT);
        console.log("chat server");
    });

    return io;
}