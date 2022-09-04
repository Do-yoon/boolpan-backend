import {server} from "./app";
import {Server} from "socket.io";
import process from "process";
import {Room, User} from "./model";
import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from "./ioType";
import mongoose from "mongoose";
import EventEmitter from "events";
import {getTimestampString} from "./util/getTimestampString";

const PORT = process.env.PORT || 8081;
console.log(`port: ${PORT}`)

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
        origin: ["http://localhost:3000/", "http://boolpan-frontend.s3-website.ap-northeast-2.amazonaws.com/:3000"],
        credentials: true
    }
});


// TODO: 에러 종류 세분화
// TODO: 방장 기능 만들기
// TODO: 메시지 유형 분류하기

/* key: room_id */
const roominfo = new Map<string, {
    name: string
    category: string
    // objectId
    current: string[]
    password: string
    limit: number
    explode_time: number
}>()

io.on('connection', (socket) => {

    // DB 조회 횟수를 줄이기 위해 런타임에서 채팅방, 유저 정보를 가지고 있음
    // 채팅방은 socket.io 상의 채팅방 이름과 room_id가 같음

    const rooms = io.of("/").adapter.rooms;
    const sids = io.of("/").adapter.sids;


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

    socket.on('sendMessage', ({room_id, text, user_id}) => {
        User.findById(user_id).exec()
            .then((user) => {
                if (roominfo.get(room_id) && user) {
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

// 방 생성
// client -> `${user} 님이 입장했습니다.`
    socket.on("createRoom", (data, {user_id}, callback) => {
        console.log(`createRoom: ${data.name}`);
        const explode_time = Date.now() + data.keeping_time;
        let error = ""
        let room_id: string;

        Room.init()
            .then(() => new Room(data))
            .then(new_room => {
                new_room._id = new mongoose.Types.ObjectId();
                return new_room.save()
            })
            .then(room => {
                room_id = room._id.toString();
                return User.findById(user_id).exec()
            })
            .then((owner) => {
                const room = roominfo.get(room_id)
                if (owner) {
                    socket.in(room_id).emit('newUser', owner.name)
                    roominfo.set(room_id, {
                        explode_time: Date.now() / 1000 + data.keeping_time,
                        current: [user_id],
                        ...data
                    })
                } else error = "방을 만들지 못했습니다."

                if (room)
                    callback(error, {
                        room_id,
                        name: room.name,
                        current: rooms.get(room_id)?.size,
                        limit: room.limit,
                        isPassword: !!room.password,
                    })

                socket.join(room_id)
                console.log(`explode_time: ${explode_time}`)
                setTimeout(() => {
                    io.to(room_id).emit("deleteRoom", "펑! 방 유지시간이 끝났어요.")
                    io.socketsLeave(room_id);
                    Room.findByIdAndDelete(room_id).then(() => {
                    })
                }, data.keeping_time)
            })
            .then((id: any) => console.log(`room deleted: ${id}`))
            .catch(error => {
                console.log(error)
                return error
            })
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

server.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
    console.log("chat server");
});

export default io;